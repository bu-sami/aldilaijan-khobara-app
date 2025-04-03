import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'aldilaijan', name: 'clients' })
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name_ar', length: 100 })
  first_name_ar: string;

  @Column({ name: 'last_name_ar', length: 100 })
  last_name_ar: string;

  @Column({ name: 'first_name_en', length: 100, nullable: true })
  first_name_en: string;

  @Column({ name: 'last_name_en', length: 100, nullable: true })
  last_name_en: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ name: 'address_ar', length: 255, nullable: true })
  address_ar: string;

  @Column({ name: 'address_en', length: 255, nullable: true })
  address_en: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
