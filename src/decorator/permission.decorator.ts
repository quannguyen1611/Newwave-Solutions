import { SetMetadata } from '@nestjs/common';
import { EPermissions } from '../shared/permission.enum';

export const PERMISSIONS_KEY = 'permissions'; //exports a constant variable named PERMISSIONS_KEY, 
// which is set to the string 'permissions'. will be used as the key for the metadata that holds permission information.
export const Permissions = (...permissions: EPermissions[]) => //exports the function Permissions, which is a custom decorator.
SetMetadata(PERMISSIONS_KEY, permissions);

