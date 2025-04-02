import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Property } from '../properties/entities/property.entity';
import { PropertyFeature } from './property-feature.entity';

@Entity({ schema: 'aldilaijan', name: 'property_feature_mappings' })
export class PropertyFeatureMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Property)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @ManyToOne(() => PropertyFeature)
  @JoinColumn({ name: 'feature_id' })
  feature: PropertyFeature;
}
