import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Vehicle } from "./vehicle.entity";

// Alerts entity
@Entity({ name: 'alerts' })
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  alertId: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.alerts, { onDelete: 'CASCADE' })
  vehicle: Vehicle;

  @Column({ length: 50 })
  alertType: string; // e.g., RouteDeviation, Inactivity, Maintenance

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ default: false })
  resolved: boolean;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;
}