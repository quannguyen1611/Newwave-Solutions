import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Like, Repository } from 'typeorm';
import { User } from '../../../typeorm/entities/user.entity';
import { CreateUserProfileParams, UpdateUserParams } from '../../../utils/types';
import { Profile } from 'src/modules/typeorm/entities/profile.entity';
import * as bcrypt from 'bcrypt';
import { QueryUserDto, ResponseUserDto, ResponseUserPagingDto } from 'src/modules/users/dtos/OtherUser.dto';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { RoleEntity } from '../../../typeorm/entities/role.entity'

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>, 
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        @InjectRepository(RoleEntity) private roleRepository: Repository<RoleEntity>,
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
        if(roleIds.length >0){
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
        await this.userRepository.save(user);
        return this.transformData<ResponseUserDto>(user);
    }
    
    async updateUser(id: number, updateUserDetails: UpdateUserParams, loggedUser?){
        const user = await this.userRepository.findOneBy({id});
        if (!user) {
         throw new NotFoundException('User not found');
        }
        user.updatedByUser = loggedUser?.username;
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


    async deleteUserProfile(
        id: number,
    ){
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

    async findById(id: number = 0): Promise<ResponseUserDto> {//id is deafult to 0
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['roles'],
        });
        if (!user){
            throw new BadRequestException('User not found');
        }
        return this.transformData<ResponseUserDto>(User);
    }
}
