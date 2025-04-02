import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ValuationRequest } from '../valuation-requests/entities/valuation-request.entity';
import { ValuationApproach } from './valuation-approach.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ schema: 'khobara', name: 'valuation_reports' })
export class ValuationReport {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ValuationRequest)
  @JoinColumn({ name: 'valuation_request_id' })
  valuation_request: ValuationRequest;

  @Column({ name: 'report_number', length: 50, unique: true })
  report_number: string;

  @Column({ name: 'valuation_date', type: 'date' })
  valuation_date: Date;

  @Column({ name: 'market_value', type: 'decimal', precision: 12, scale: 2 })
  market_value: number;

  @ManyToOne(() => ValuationApproach)
  @JoinColumn({ name: 'valuation_approach_id' })
  valuation_approach: ValuationApproach;

  @Column({ name: 'report_file_path', length: 255, nullable: true })
  report_file_path: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approved_by' })
  approved_by: User;

  @Column({ name: 'approval_date', type: 'timestamp', nullable: true })
  approval_date: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
