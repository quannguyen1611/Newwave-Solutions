import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ResponseUserDto } from './OtherUser.dto';

export class SignInDto {
  @ApiProperty({
    description: 'The username of account.',
    required: true,
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The password of account.',
    required: true,
  })
  @IsNotEmpty()
  password: string;
}

export class ResponseAuthDto {
  @ApiProperty({
    description: 'The accessToken of account.',
  })
  accessToken?: string;

  @ApiProperty({
    description: 'The refreshToken of account.',
  })
  refreshToken?: string;
}

export class ResponseProfileDto extends ResponseUserDto {}

export type JwtPayload = {
  username: string;
  sub: number;
  email: string;
};
