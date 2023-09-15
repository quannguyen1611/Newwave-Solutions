import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Like, Repository } from 'typeorm';
import { User } from '../../../typeorm/entities/user.entity';
import { CreateUserParams, CreateUserProfileParams, UpdateUserParams } from '../../../utils/types';
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

    async createUser(createUserDto: CreateUserDto) : Promise<ResponseUserDto> {
        const { email, username, password, roleIds, status } = createUserDto;
        //detructure the CreateUserTodo object to extract user 
        const existedUser = await this.userRepository
        .createQueryBuilder ('users') //query to check if a user with the provided email or username already existed
        .where ('users.email = :email OR users.username = :username',{
            username,
            email,
        })
        .getOne()
        if (existedUser){
            throw new BadRequestException (
                'this username is alredy taken'
            );
        }
        //create new user
        const user = new User();
        user.username = username;
        user.status = status;
        user.roles = [];
        user.email = email;
        //check if there is a provided roleId to retrieve role objects
        if(roleIds.length >0){
            const roles = await this.roleRepository
            .createQueryBuilder('roles')
            .where('roles.id IN (:...ids)', {ids: roleIds})
            .getMany();

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

    
    
    updateUser(id: number, updateUserDetails: UpdateUserParams){
        return this.userRepository.update({id}, {...updateUserDetails});
    }

    deleteUser(id: number){
        return this.userRepository.delete({id});
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
        return this.userRepository.save(user);
    }


    deleteUserProfile(
        id: number,
    ){
        return this.profileRepository.delete({id});
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

      
    findUsers() {
        return this.userRepository.find({relations: ['profile']});
    }

    async findOne(usernameOrEmail: string): Promise<ResponseUserDto> {
        const user = await this.userRepository.findOne({
          where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });
        if (!user) {
          throw new BadRequestException(`The user\'s not found`);
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
            throw new BadRequestException('The user\'s not found');
        }
        return this.transformData<ResponseUserDto>(User);
    }



    // createUser(userDetails: CreateUserParams) {
    //     const newUser = this.userRepository.create({
    //         ...userDetails, 
    //         createdAt: new Date(),
    //     });
    //     return this.userRepository.save(newUser);
    // }

    // async loginUser (
    //     id: number,
    //     username: string, 
    //     password: string
    // ){
    //     const user = await this.userRepository.findOneBy({id});
    //     if (!user){
    //         throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    //     }
    //     if (user.password !== password || user.username !== username) {
    //         throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    //     }
    //     return user;
    // }

    
}
