import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
  @Column()
  lotNumber: number;

  //@OneToMany(() => Lot, (lot) => lot.user)
  //lots: Lot[];
}
