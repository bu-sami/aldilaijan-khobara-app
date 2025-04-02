import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { PropertyType } from '../property-types/entities/property-type.entity';
import { Location } from '../../locations/entities/location.entity';
import { Property } from '../properties/entities/property.entity';

@Entity({ schema: 'aldilaijan', name: 'moj_transactions' })
export class MojTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'reference_number', length: 100, unique: true })
  reference_number: string;

  @ManyToOne(() => PropertyType)
  @JoinColumn({ name: 'property_type_id' })
  property_type: PropertyType;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @Column({ name: 'area_sqm', type: 'decimal', precision: 10, scale: 2, nullable: true })
  area_sqm: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  price: number;

  @Column({ name: 'transaction_date', type: 'date', nullable: true })
  transaction_date: Date;

  @Column({ name: 'imported_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  imported_at: Date;

  @Column({ default: false })
  processed: boolean;

  @ManyToOne(() => Property, { nullable: true })
  @JoinColumn({ name: 'matched_property_id' })
  matched_property: Property;
}
