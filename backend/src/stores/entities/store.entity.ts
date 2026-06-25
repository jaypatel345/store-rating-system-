import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Rating } from '../../ratings/entities/rating.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column()
  email: string;

  @Column({ length: 400 })
  address: string;

  @ManyToOne(() => User, (user) => user.stores)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ name: 'ownerId' })
  ownerId: string;

  @OneToMany(() => Rating, (rating) => rating.store)
  ratings: Rating[];

  @CreateDateColumn()
  createdAt: Date;
}
