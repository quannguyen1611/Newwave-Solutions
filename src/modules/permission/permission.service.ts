import { Injectable } from '@nestjs/common';
import * as path from 'path';

const permissions = require(path.join(
  __dirname,
  '../../shared/permission.json',
));

@Injectable()
export class PermissionService {
  find() {
    return permissions;
  }
}
