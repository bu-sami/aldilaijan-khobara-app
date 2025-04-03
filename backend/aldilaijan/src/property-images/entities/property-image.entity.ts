import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Property } from '../properties/entities/property.entity';

@Entity({ schema: 'aldilaijan', name: 'property_images' })
export class PropertyImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Property)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @Column({ name: 'image_path', length: 255 })
  image_path: string;

  @Column({ name: 'is_primary', default: false })
  is_primary: boolean;

  @Column({ name: 'display_order', nullable: true })
  display_order: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
