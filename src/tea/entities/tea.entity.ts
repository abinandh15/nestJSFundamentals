import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany } from "typeorm";
import { Flavor } from "./flavor.entity";

@Entity() 
export class Tea {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    brand: string;

    @Column({default:0})
    recommendations: number;

    @JoinTable()
    @ManyToMany(type => Flavor, (flavor)=> flavor.tea, { cascade: true })
    flavors: Flavor[];
}