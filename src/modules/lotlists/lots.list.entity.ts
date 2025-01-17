import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LotList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  listName: string;

  @Column()
  lotNumber: number;
  @Column()
  dateStart: Date;

  @Column()
  dateEnd: Date;

  @Column()
  inUse: boolean;
}
