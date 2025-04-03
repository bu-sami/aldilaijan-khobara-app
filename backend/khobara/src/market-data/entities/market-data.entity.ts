import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Location } from '../../locations/entities/location.entity';
import { PropertyType } from '../properties/entities/property-type.entity';

@Entity({ schema: 'khobara', name: 'market_data' })
export class MarketData {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @ManyToOne(() => PropertyType)
  @JoinColumn({ name: 'property_type_id' })
  property_type: PropertyType;

  @Column({ name: 'transaction_date', type: 'date' })
  transaction_date: Date;

  @Column({ name: 'price_per_sqm', type: 'decimal', precision: 10, scale: 2 })
  price_per_sqm: number;

  @Column({ length: 100, nullable: true })
  source: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
