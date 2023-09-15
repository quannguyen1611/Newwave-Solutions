import { Controller, Get } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Permission')
@Controller('permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get('')
  find() {
    return this.permissionService.find();
  }
}

