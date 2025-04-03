import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'khobara', name: 'valuation_request_types' })
export class ValuationRequestType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name_ar', length: 100 })
  name_ar: string;

  @Column({ name: 'name_en', length: 100, nullable: true })
  name_en: string;

  @Column({ name: 'description_ar', length: 255, nullable: true })
  description_ar: string;

  @Column({ name: 'description_en', length: 255, nullable: true })
  description_en: string;

  @Column({ name: 'base_fee', type: 'decimal', precision: 10, scale: 2, nullable: true })
  base_fee: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
