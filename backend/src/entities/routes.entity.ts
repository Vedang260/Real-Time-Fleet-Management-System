import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Vehicle } from "./vehicle.entity";
import { RouteStatus } from "../enums/routeStatus.enums";
import { Location } from "./location.entity";
import { Alert } from "./alert.entity";

@Entity({ name: 'routes' })
export class Routes {
    @PrimaryGeneratedColumn('uuid')
    routesId: string;

    @Column('uuid')
    vehicleId: string;

    @ManyToOne(() => Vehicle, (vehicle) => vehicle.locations, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'vehicleId'})
    vehicle: Vehicle;

    @OneToMany(() => Location, (location) => location.route)
    locations: Location[];
    
    @OneToMany(() => Alert, (alert) => alert.vehicle)
    alerts: Alert[];

    @Column()
    startingPlaceName: string;
    
    @Column()
    destinationPlaceName: string;
    
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