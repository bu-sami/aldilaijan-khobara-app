import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Username' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'password', description: 'Password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
