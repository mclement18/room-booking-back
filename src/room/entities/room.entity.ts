import { Event } from 'src/event/entities/event.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 75,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 15,
    unique: true,
  })
  color: string;

  @OneToMany(() => Event, (event) => event.room, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  events: Event[];
}
