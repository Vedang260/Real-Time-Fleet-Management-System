import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Vehicle } from "./vehicle.entity";
import { Routes } from "./routes.entity";

@Entity({ name: 'locations' })
export class Location {
  @PrimaryGeneratedColumn('uuid')
  locationId: string;

  @Column('uuid')
  vehicleId: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.locations, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'vehicleId'})
  vehicle: Vehicle;

  @Column('uuid')
  routesId: string;

  @ManyToOne(() => Routes, (route) => route.locations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routesId' })
  route: Routes;
  
  @Column({ type: 'double precision' })
  latitude: number;

  @Column({ type: 'double precision' })
  longitude: number;

  @CreateDateColumn({ type: 'timestamp' })
  recordedAt: Date;
}