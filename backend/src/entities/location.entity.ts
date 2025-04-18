import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Vehicle } from "./vehicle.entity";

@Entity({ name: 'locations' })
export class Location {
  @PrimaryGeneratedColumn('uuid')
  locationId: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.locations, { onDelete: 'CASCADE' })
  vehicle: Vehicle;

  @Column({ type: 'double precision' })
  latitude: number;

  @Column({ type: 'double precision' })
  longitude: number;

  @CreateDateColumn({ type: 'timestamp' })
  recordedAt: Date;
}