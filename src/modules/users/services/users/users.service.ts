import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Like, Repository } from 'typeorm';
import { User } from '../../../typeorm/entities/user.entity';
import { ChangePasswordParams, CreateUserProfileParams, ForgotPasswordParams, UpdatePasswordParams, UpdateUserFileParams, UpdateUserParams } from '../../../utils/types';
import { Profile } from 'src/modules/typeorm/entities/profile.entity';
import * as bcrypt from 'bcrypt';
import { QueryUserDto, ResponseUserDto, ResponseUserPagingDto } from 'src/modules/users/dtos/OtherUser.dto';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { RoleEntity } from '../../../typeorm/entities/role.entity'
import * as jwt from 'jsonwebtoken';
import { PasswordAuthDto} from '../../dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { createObjectCsvWriter } from "csv-writer";
import { EUserStatus } from '../../users.enum';
import { Cron } from '@nestjs/schedule';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
    userService: any;
    save(user: any) {
        throw new Error('Method not implemented.');
    }
    private readonly logger = new Logger(UsersService.name);
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        @InjectRepository(RoleEntity) private roleRepository: Repository<RoleEntity>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @InjectQueue('mail') private readonly mailQueue: Queue,
    ){}
    
    async createUser(createUserDto: CreateUserDto, loggedUser?) : Promise<ResponseUserDto> {
        const { email, username, password, roleIds, status, type } = createUserDto;
        //detructure the CreateUserTodo object to extract user 
        const existedUser = await this.userRepository
        .createQueryBuilder ('users') //query to check if a user with the provided email or username already existed
        .where ('users.email = :email OR users.username = :username',{
            username,
            email,
        })
        .getOne() //Execute the query and get the first matching user
        if (existedUser){
            throw new BadRequestException (
                'this username is already taken'
            );
        }
        if (password.length <= 4 || !/[A-Z]/.test(password) || !/\d/.test(password)){
            throw new BadRequestException('Password must be at least 4 character long. Password must contain at least 1 capitalized character')
        }
        //create new user
        const user = new User();
        user.username = username;
        user.status = status;
        user.roles = [];
        user.email = email;
        user.roleIds = roleIds;
        user.type = type;
        user.createdByUser = loggedUser?.username;
        //check if there is a provided roleId to retrieve role objects
        if(roleIds.length > 0){
            const roles = await this.roleRepository
            .createQueryBuilder('roles')
            .where('roles.id IN (:...ids)', {ids: roleIds})
            .getMany(); //Execute the query and get an array of matching role objects

            if (roleIds.length != roles.length){
                throw new BadRequestException('Role not found.');
            }
            user.roles = roles;
        }
        user.password = await this.generateHash(password);
        user.createdAt = new Date();
        const token = Math.floor(1000 + Math.random() * 9000).toString();
        await this.mailQueue.add('sendMail', { user, token }, {delay: 10000}) //delay 10 seconds
        await this.cacheManager.set('user_${user.id}', user); 
        await this.userRepository.save(user);
        return this.transformData<ResponseUserDto>(user);
    }

    async updateUser(id?: number, updateUserDetails?: UpdateUserParams | UpdateUserFileParams, loggedUser?){
        const user = await this.userRepository.findOneBy({id});
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.updatedByUser = loggedUser?.username;
        await this.cacheManager.set('user_${user.id}', user);
        await this.userRepository.save(user);
        return this.userRepository.update({id}, {...updateUserDetails});
    }

    async deleteUser(id: number, loggedUser?) {
        const user = await this.userRepository.findOneBy({id});
        if (!user) {
         throw new NotFoundException('User not found');
        }
        user.deletedByUser = loggedUser?.username;
        await this.userRepository.save(user);
        await this.userRepository.softDelete(id);
    }

    async createUserProfile(
        id: number,
        createUserProfileDetails: CreateUserProfileParams,
    ){
        const user = await this.userRepository.findOneBy({id});
        if (!user)
        throw new HttpException (
           'User not found. cannot create profile',
           HttpStatus.BAD_REQUEST,
        );
        const newProfile = this.profileRepository.create(createUserProfileDetails);
        const savedProfile = await this.profileRepository.save(newProfile);
        user.profile = savedProfile;
    }

    async deleteUserProfile(id: number,){
        await this.profileRepository.softDelete({id});
    }

    //Generate hash for encypted password
    async generateHash(password: string): Promise<string> {
        const saltOrRounds = 10;
        return bcrypt.hash(password, saltOrRounds);
      }

    transformData<T>(data: any): T {
        if (Array.isArray(data)) {
          return data.map((item: T) => {
            const user = new ResponseUserDto(item);
            return user as T;
          }) as T;
        } else {
          const user = new ResponseUserDto(data);
          return user as T;
        }
      }

    async findOne(usernameOrEmail: string): Promise<ResponseUserDto> {
        const user = await this.userRepository.findOne({
          where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });
        if (!user) {
          throw new BadRequestException(`User not found`);
        }
        return this.transformData<ResponseUserDto>(user);
      }
    
    async findAll (queryUserDto: QueryUserDto): Promise<ResponseUserPagingDto>{
        const {page, perPage, q} = queryUserDto;
        //initialize the where object for filtering. QueryUserDto parameter contains filtering criteria for user search
        const where: any = {};//empty object where to build dynamic filters based on the provided criteria
        if (queryUserDto.q){//if a query search is provided, it adds a filter cond to find users whose 'username' contains the provided query
            where.username = Like('%' + q + '%');
        }
        if (queryUserDto.status){//if a status is provided, it adds...find users with specific status
            where.status = Equal(queryUserDto.status);
        }
        //Fetch users based on provided filters and pagination
        const[result, total] = await this.userRepository.findAndCount({
            where: where,
            order: { updated_at: 'DESC'}, //sort based on desc order
            take: perPage, //specifies the number of users to retrive per page
            skip: (page - 1) * perPage, //Calculate the  offset based on page number to implement pagination
            relations: ['roles'], //include related roles in the query
        });
        //transform the result data
        return {
            result: this.transformData<ResponseUserDto[]> (result),
            total,
            totalPages: Math.floor((total + perPage -1 ) / perPage), //cal total pages
        };
    }

    async findById(id: number = 0): Promise<ResponseUserDto> { //id is deafult to 0
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['roles'],
        });
        if (!user){
            throw new BadRequestException('User not found');
        }
        return user;
    }

    async changePassword (username: string, changePasswordDetails: ChangePasswordParams) {
        const { oldPassword, newPassword } = changePasswordDetails; //retrieve old and new password
        const user = await this.userRepository.findOne({where: {username}});//retrieve user by username
        if(!user){
            throw new BadRequestException('user not found');
        }
        if (newPassword.length <= 4 || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword)){
            throw new BadRequestException('Password must be at least 4 character long. Password must contain at least 1 capitalized character and a number')
        }
        if (newPassword === oldPassword){
            throw new BadRequestException('new passowrd cannot be the same as old password');
        }
        //check if new password is the same as one of the last 3 password
        if (user.numPassword > 3 && user.passwordHistory.slice(-3).some((hashedPassword) => bcrypt.compareSync(newPassword, hashedPassword))) {
            throw new BadRequestException('Password cannot be the same as any of the last 3 password');
        }        
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);//compare will hash oldPassword and compare with existing passwprd
        if (!isPasswordMatch){
            throw new BadRequestException('passwords do not match')
        }
        if (!user.passwordHistory) {
            user.passwordHistory = [];
          }
        user.passwordHistory.push(user.password); //push the current oldPassword to the old password array
        user.password = await this.generateHash(newPassword);
        user.last_password_changed_at = new Date();
        user.numPassword += 1;
        await this.mailQueue.add('sendPasswordMail', { user}, {delay: 10000}) //delay 10 seconds
        await this.userRepository.save(user);
    }


    async forgotPassword (forgotPasswordDetails: ForgotPasswordParams) : Promise<PasswordAuthDto>{
        const { email} = forgotPasswordDetails;
        const user = await this.userRepository.findOne({where: {email}});
        if (!user){
            throw new BadRequestException('user not found');
        }
        // Generate a reset token with an expiration time
        const resetToken = await this.jwtService.signAsync(
           { username: user.username },
           {
            secret: this.configService.get<string>('JWT_PASSWORD_SECRET'),
            expiresIn: this.configService.get<string>(
            'JWT_PASSWORD_SECRET_EXPIRES_IN',
          ),
           }
        );
        await this.mailQueue.add('sendForgotPassword', {user}, {delay: 10000}) //delay 10 seconds
        return {resetToken};
    }

    async updateNewPassword (updatePasswordDetails: UpdatePasswordParams){
        const { token, newPassword } = updatePasswordDetails;
        if (newPassword.length <= 4 || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword)){
            throw new BadRequestException('Password must be at least 4 character long. Password must contain at least 1 capitalized character')
        }
        try {
            const decodedToken = jwt.verify(token, 'quanguyen1611') as {username: string};//verify token
            const user = await this.userRepository.findOne({
                where: {
                  username: decodedToken.username,
                },
              });
            if(!user){
                throw new BadRequestException('User not found');
            }
            user.password = await this.generateHash(newPassword);
            user.last_password_changed_at = new Date();
            await this.userRepository.save(user);
        }catch (error){
            if (error instanceof jwt.TokenExpiredError) {
                throw new BadRequestException('Token has expired');
            }
            throw new BadRequestException ('Invalid token');
        }
    }

    async cacheUsers() {
        const users = await this.userRepository.find();
        if (users && users.length > 0) {
            // Store the user list in the cache
            await this.cacheManager.set('users', users, 0);
          } else {
            console.log('Query error');
            // Handle the error, e.g., return an error response
            throw new Error('Failed to fetch user data');
        }
        return users; // Return the list of users
    }

    async getCachedUsers() {
        const cachedUsers = await this.cacheManager.get('users');
        if (cachedUsers) {
          // Data was found in the cache
          return cachedUsers;
        } else {
          // Data was not found in the cache; fetch it from the database
          //const users = await this.userService.findAll();
          const users = await this.userRepository.find();
          await this.cacheManager.set('users', users, 0); // Cache for forever (time-to-live)
          return users;
        }
    }

    @Cron('0 9-17 * * * ',{ //export every hour from 9-5
        timeZone: 'Asia/Ho_Chi_Minh'
    })
    async generateCsv(): Promise<string> {
        console.time('my-task'); // Start the timer
        this.logger.debug('Called every 1 hour');
        const currentDate = new Date();
        const currentMinutes = currentDate.getMinutes();
        const currentSeconds = currentDate.getSeconds();
        const currentHour = currentDate.getHours();
        const filename = `user_${currentHour}_${currentMinutes}_${currentSeconds}_${currentDate.getFullYear()}${currentDate.getMonth() + 1}${currentDate.getDate()}.csv`;
        const users: any = await this.getCachedUsers(); //retrieve all users' data from cache
        const csvWriter = createObjectCsvWriter({
            path: filename,
            header: [
                { id: "id", title: 'ID'},
                { id: "username", title: 'Username'},
                { id: "email", title: 'Email'},
                { id: "type", title: 'User type'},
                { id: "roleIds", title: "Role Id"},
                { id: "createdAt", title: "Date Created"},
            ]
        });
        //write data to csv file 
        await csvWriter.writeRecords(users);
        console.timeEnd('my-task'); // Stop the timer and log the elapsed time
        return filename;
    }


    //Helper function to help validate email
    async validateEmail(email) : Promise<boolean>{
        const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
        if (emailRegex.test(email)){
            return true;
        }else{
            return false;
        }
    }

    async importFile (file: any, loggedUser?) : Promise<ResponseUserDto>{
        const fileContents = file.buffer.toString('utf8');
        const lines = fileContents.split('\n');
        const invalidObjs: { object: any; message: string }[] = [];
        const data = [];
        for (let i = 1; i < lines.length-1; i++) {
            const columns = lines[i].split(',');
            const obj = {
                id: columns[0],
                username: columns[1],
                email: columns[2],
                type: columns[3],
                roleIds: columns[4],
                dateCreated: columns[5],
            };
            const isIdValid = typeof parseInt(obj.id) === 'number';
            const isEmailValid = await this.validateEmail(obj.email);
            const isTypeValid = [1, 2, 3].includes(parseInt(obj.type));
            const isRoleIdsValid = [5, 6, 7].includes(parseInt(obj.roleIds));
            if (isIdValid && isEmailValid && isTypeValid && isRoleIdsValid ) {
                data.push(obj);
                const user = await this.userRepository.findOne({where: [{ username: obj.username }, { email: obj.email }]});
                if (!user){
                    const newUser = new User();
                    newUser.username = obj.username;
                    newUser.status = EUserStatus.Active;
                    newUser.roles = [];
                    newUser.email = obj.email;
                    newUser.roleIds = obj.roleIds;
                    newUser.type = obj.type;
                    newUser.createdAt = new Date();
                    newUser.createdByUser = loggedUser?.username;
                    newUser.password = await this.generateHash('Quan'+ Math.floor(Math.random() * 1000));
                    await this.userRepository.save(newUser);
                    await this.transformData<ResponseUserDto>(newUser);
                    await this.mailQueue.add('NewUserMail', {user: newUser}, {delay: 10000}) //delay 10 seconds
                }else{
                    user.username = obj.username
                    user.email = obj.email
                    user.type = obj.type
                    user.roleIds = obj.roleIds
                    user.updated_at = new Date()
                    await this.userRepository.save(user);
                }
            } else {
                const validationErrors: string[] = [];
                if (!isIdValid) {
                    validationErrors.push("Invalid 'id'");
                }
                if (!isEmailValid) {
                    validationErrors.push("Invalid 'email'");
                }
                if (!isTypeValid) {
                    validationErrors.push("Invalid 'type'");
                }
                if (!isRoleIdsValid) {
                    validationErrors.push("Invalid 'roleIds'");
                }
                invalidObjs.push({ object: obj, message: validationErrors.join(', ') });
            }
        }
        console.log(invalidObjs)
        return file
    }
}
