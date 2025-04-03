import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Property } from '../properties/entities/property.entity';
import { Client } from '../clients/entities/client.entity';
import { User } from '../../users/entities/user.entity';
import { TransactionType } from './transaction-type.entity';

@Entity({ schema: 'aldilaijan', name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Property)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @ManyToOne(() => TransactionType)
  @JoinColumn({ name: 'transaction_type_id' })
  transaction_type: TransactionType;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'agent_id' })
  agent: User;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  commission: number;

  @Column({ name: 'transaction_date', type: 'date' })
  transaction_date: Date;

  @Column({ name: 'moj_reference', length: 100, nullable: true })
  moj_reference: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ length: 50, nullable: true })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
