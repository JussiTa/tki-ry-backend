import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  address: string;

  @Column()
  postalCode: number;

  @Column()
  phoneNumber: string;

  @Column()
  lotListName: string;
  @Column({ unique: true })
  lotNumber: number;
}
