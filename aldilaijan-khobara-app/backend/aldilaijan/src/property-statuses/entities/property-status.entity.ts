import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'aldilaijan', name: 'property_statuses' })
export class PropertyStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name_ar', length: 50 })
  name_ar: string;

  @Column({ name: 'name_en', length: 50, nullable: true })
  name_en: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
