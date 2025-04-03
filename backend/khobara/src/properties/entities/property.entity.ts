import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PropertyType } from './property-type.entity';
import { Location } from '../../locations/entities/location.entity';
import { ValuationRequest } from '../valuation-requests/entities/valuation-request.entity';

@Entity({ schema: 'khobara', name: 'properties' })
export class KhobaraProperty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title_ar', length: 255 })
  title_ar: string;

  @Column({ name: 'title_en', length: 255, nullable: true })
  title_en: string;

  @ManyToOne(() => PropertyType)
  @JoinColumn({ name: 'property_type_id' })
  property_type: PropertyType;

  @Column({ name: 'area_sqm', type: 'decimal', precision: 10, scale: 2, nullable: true })
  area_sqm: number;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @Column({ name: 'address_ar', length: 255, nullable: true })
  address_ar: string;

  @Column({ name: 'address_en', length: 255, nullable: true })
  address_en: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ name: 'paci_number', length: 50, nullable: true, unique: true })
  paci_number: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
