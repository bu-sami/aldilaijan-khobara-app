import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Client } from '../clients/entities/client.entity';
import { KhobaraProperty } from '../properties/entities/property.entity';
import { ValuationRequestType } from './entities/valuation-request-type.entity';
import { ValuationStatus } from './entities/valuation-status.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ schema: 'khobara', name: 'valuation_requests' })
export class ValuationRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => KhobaraProperty)
  @JoinColumn({ name: 'property_id' })
  property: KhobaraProperty;

  @ManyToOne(() => ValuationRequestType)
  @JoinColumn({ name: 'request_type_id' })
  request_type: ValuationRequestType;

  @ManyToOne(() => ValuationStatus)
  @JoinColumn({ name: 'status_id' })
  status: ValuationStatus;

  @Column({ name: 'purpose_ar', length: 255, nullable: true })
  purpose_ar: string;

  @Column({ name: 'purpose_en', length: 255, nullable: true })
  purpose_en: string;

  @Column({ name: 'requested_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  requested_date: Date;

  @Column({ name: 'inspection_date', type: 'timestamp', nullable: true })
  inspection_date: Date;

  @Column({ name: 'completion_date', type: 'timestamp', nullable: true })
  completion_date: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_appraiser_id' })
  assigned_appraiser: User;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fee: number;

  @Column({ name: 'payment_status', length: 50, nullable: true })
  payment_status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
