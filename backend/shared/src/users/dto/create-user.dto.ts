import { IsNotEmpty, IsString, IsEmail, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'admin', description: 'Username' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'admin@example.com', description: 'Email address' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: 'محمد', description: 'First name in Arabic' })
  @IsOptional()
  @IsString()
  first_name_ar?: string;

  @ApiProperty({ example: 'الأحمد', description: 'Last name in Arabic' })
  @IsOptional()
  @IsString()
  last_name_ar?: string;

  @ApiProperty({ example: 'Mohammed', description: 'First name in English' })
  @IsOptional()
  @IsString()
  first_name_en?: string;

  @ApiProperty({ example: 'Al-Ahmad', description: 'Last name in English' })
  @IsOptional()
  @IsString()
  last_name_en?: string;

  @ApiProperty({ example: '+96599123456', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 1, description: 'Role ID' })
  @IsNotEmpty()
  @IsNumber()
  role_id: number;

  @ApiProperty({ example: true, description: 'Is user active' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
