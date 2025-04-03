import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const location = this.locationsRepository.create(createLocationDto);
    return this.locationsRepository.save(location);
  }

  async findAll(): Promise<Location[]> {
    return this.locationsRepository.find();
  }

  async findByType(type: string): Promise<Location[]> {
    return this.locationsRepository.find({
      where: { type },
    });
  }

  async findOne(id: number): Promise<Location> {
    return this.locationsRepository.findOneBy({ id });
  }

  async findChildren(parentId: number): Promise<Location[]> {
    return this.locationsRepository.find({
      where: { parent_id: parentId },
    });
  }

  async update(id: number, updateLocationDto: UpdateLocationDto): Promise<Location> {
    await this.locationsRepository.update(id, updateLocationDto);
    return this.locationsRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.locationsRepository.delete(id);
  }
}
