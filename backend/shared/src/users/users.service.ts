import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const role = await this.rolesRepository.findOneBy({ id: createUserDto.role_id });
    
    if (!role) {
      throw new Error('Role not found');
    }
    
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    
    const user = this.usersRepository.create({
      ...createUserDto,
      password_hash: hashedPassword,
      role: role,
    });
    
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['role'],
    });
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  async findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { username },
      relations: ['role'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // If password is provided, hash it
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password_hash = await bcrypt.hash(updateUserDto.password, salt);
      delete updateUserDto.password;
    }
    
    // If role_id is provided, fetch the role
    if (updateUserDto.role_id) {
      const role = await this.rolesRepository.findOneBy({ id: updateUserDto.role_id });
      if (role) {
        user.role = role;
      }
      delete updateUserDto.role_id;
    }
    
    // Update user properties
    Object.assign(user, updateUserDto);
    
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
