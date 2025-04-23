import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Vehicle } from "./vehicle.entity";

@Entity({ name: 'routes' })
export class Routes {
  @PrimaryGeneratedColumn('uuid')
  routesId: string;

  @Column('uuid')
  vehicleId: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.locations, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'vehicleId'})
  vehicle: Vehicle;

  @Column({
    type: 'enum',

  })
  status: 'pending' | 'active' | 'completed';

  @CreateDateColumn()
  createdAt: Date;
}