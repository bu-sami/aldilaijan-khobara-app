import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Location } from '../../locations/entities/location.entity';
import { PropertyType } from '../property-types/entities/property-type.entity';
import { PropertyStatus } from '../property-statuses/entities/property-status.entity';
import { Client } from '../clients/entities/client.entity';

@Entity({ schema: 'aldilaijan', name: 'properties' })
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title_ar', length: 255 })
  title_ar: string;

  @Column({ name: 'title_en', length: 255, nullable: true })
  title_en: string;

  @Column({ name: 'description_ar', length: 1000, nullable: true })
  description_ar: string;

  @Column({ name: 'description_en', length: 1000, nullable: true })
  description_en: string;

  @ManyToOne(() => PropertyType)
  @JoinColumn({ name: 'property_type_id' })
  property_type: PropertyType;

  @ManyToOne(() => PropertyStatus)
  @JoinColumn({ name: 'status_id' })
  status: PropertyStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  price: number;

  @Column({ name: 'area_sqm', type: 'decimal', precision: 10, scale: 2, nullable: true })
  area_sqm: number;

  @Column({ nullable: true })
  bedrooms: number;

  @Column({ nullable: true })
  bathrooms: number;

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

  @Column({ default: false })
  featured: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'agent_id' })
  agent: User;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'owner_id' })
  owner: Client;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
