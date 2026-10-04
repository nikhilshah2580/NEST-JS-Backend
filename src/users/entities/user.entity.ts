import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserRole } from '../enums/user-role.enum';

@Entity('users')
// Local profile record; authentication credentials are never stored here.
export class User {
  // Internal database primary key.
  @PrimaryGeneratedColumn()
  id: number;

  // Immutable identity ID supplied by Supabase Auth.
  @Column({ type: 'uuid', unique: true })
  supabaseUserId: string;

  // Email is unique in the local profile database.
  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  // Application authorization role, separate from Supabase claims.
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // Allows administrators to deny access without deleting the profile.
  @Column({ default: true })
  isActive: boolean;

  // Audit timestamps managed by TypeORM.
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
