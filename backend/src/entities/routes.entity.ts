import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Vehicle } from "./vehicle.entity";
import { RouteStatus } from "../enums/routeStatus.enums";

@Entity({ name: 'routes' })
export class Routes {
    @PrimaryGeneratedColumn('uuid')
    routesId: string;

    @Column('uuid')
    vehicleId: string;

    @ManyToOne(() => Vehicle, (vehicle) => vehicle.locations, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'vehicleId'})
    vehicle: Vehicle;

    @Column('json')
    coordinates: { latitude: number; longitude: number }[];

    @Column({
      type: 'enum',
      enum: Object.values(RouteStatus),
      default: RouteStatus.PENDING,
    })
    status: RouteStatus;

    @CreateDateColumn()
    createdAt: Date;
}