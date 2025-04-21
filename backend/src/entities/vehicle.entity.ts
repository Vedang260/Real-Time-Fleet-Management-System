import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Location } from './location.entity';
import { Alert } from './alert.entity';
import { VehicleStatus } from '../enums/vehicleStatus.enums';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  vehicleId: string;

  @Column()
  model: string;

  @Column()
  licensePlate: string;

  @Column()
  type: string; // e.g., Truck, Car, Van

  @Column({
    type: 'enum',
    enum: Object.values(VehicleStatus),
    default: VehicleStatus.Active,
  })
  status: VehicleStatus;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'driverId' })
  driver: User;

  @Column({ nullable: true })
  driverId: string;

  @OneToMany(() => Location, (location) => location.vehicle)
  locations: Location[];

  @OneToMany(() => Alert, (alert) => alert.vehicle)
  alerts: Alert[];
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}