import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Vehicle } from "./vehicle.entity";

// Alerts entity
@Entity({ name: 'alerts' })
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  alertId: string;

  @Column('uuid')
  vehicleId: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.alerts, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'vehicleId'})
  vehicle: Vehicle;

  @Column({ length: 50 })
  alertType: string; // e.g., RouteDeviation, Inactivity, Maintenance

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

}