import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'khobara', name: 'valuation_report_templates' })
export class ValuationReportTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name_ar', length: 100 })
  name_ar: string;

  @Column({ name: 'name_en', length: 100, nullable: true })
  name_en: string;

  @Column({ name: 'template_content', type: 'text' })
  template_content: string;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
