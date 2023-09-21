import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EPermissions } from '../shared/permission.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../modules/typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import { PERMISSIONS_KEY } from '../decorator/permission.decorator';
import { Todo } from 'src/modules/typeorm/entities/todo.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride< //retrieve the required permissions for the current route or handler.
      EPermissions[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions) { //If no permission is requrired, the system returns ture and grant access
      return true;
    }

    const { user } = context.switchToHttp().getRequest(); //extracts the user object from the HTTP request's context
    const userData = await this.userRepository.findOne({ //fetches the user's data from a repository
      where: { id: user?.sub || 0 },
      relations: ['roles'],
    });

    let isAllPermission: boolean = false;
    //This fucntion processes the user's role to complie a list of permissions. It iterates through the user's role and 
    //extracts the permission associate with each role.
    const userPermissions = userData?.roles.reduce( //assign 'userPermissions' with the result of reduce. 'reduce' function is used to transform an array into a single value.
      (previousValues, currentValue) => {                     
        if (currentValue.isAllPermission && !isAllPermission) { //check to determine if the user has a role that grants them all permissions
          isAllPermission = true; //regardless, set allPermission is true
        }
        return previousValues.concat(currentValue.permissions);
      },
      [],
    );
    const setUserPermissions = new Set(userPermissions); //converts the user's permissions into a Set for efficient membership checking.
    //Finally check if the user has all or at least one of the required permission to access the route.
    return (
      isAllPermission ||
      requiredPermissions.some((permission) =>
        setUserPermissions.has(permission),
      )
    );
  }
}



