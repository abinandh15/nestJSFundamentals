import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Tea } from "./tea.entity";

@Entity()
export class Flavor {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @ManyToMany(type=> Tea, tea => tea.flavors)
    tea: Tea[];
}
