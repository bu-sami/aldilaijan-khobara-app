import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { KhobaraProperty } from '../properties/entities/property.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ schema: 'khobara', name: 'property_documents' })
export class PropertyDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => KhobaraProperty)
  @JoinColumn({ name: 'property_id' })
  property: KhobaraProperty;

  @Column({ name: 'document_type', length: 50 })
  document_type: string;

  @Column({ name: 'file_path', length: 255 })
  file_path: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by' })
  uploaded_by: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
