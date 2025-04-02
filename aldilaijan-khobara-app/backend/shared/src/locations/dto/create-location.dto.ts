import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({ example: 1, description: 'Parent location ID (null for top-level locations)' })
  @IsOptional()
  parent_id?: number;

  @ApiProperty({ example: 'الفروانية', description: 'Location name in Arabic' })
  @IsNotEmpty()
  @IsString()
  name_ar: string;

  @ApiProperty({ example: 'Farwaniya', description: 'Location name in English' })
  @IsOptional()
  @IsString()
  name_en?: string;

  @ApiProperty({ example: 'governorate', description: 'Location type (governorate, area, etc.)' })
  @IsNotEmpty()
  @IsString()
  type: string;
}
