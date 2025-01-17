import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Lot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lotNumber: number;

  @Column()
  listName: string;

  //@ManyToOne(() => User, (user) => user.lots)
  // user: User;
}
