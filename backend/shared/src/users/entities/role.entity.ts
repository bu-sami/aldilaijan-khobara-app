import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'shared', name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name_ar', length: 50 })
  name_ar: string;

  @Column({ name: 'name_en', length: 50 })
  name_en: string;

  @Column({ name: 'description_ar', length: 255, nullable: true })
  description_ar: string;

  @Column({ name: 'description_en', length: 255, nullable: true })
  description_en: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
