import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'khobara', name: 'property_types' })
export class PropertyType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name_ar', length: 100 })
  name_ar: string;

  @Column({ name: 'name_en', length: 100, nullable: true })
  name_en: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
