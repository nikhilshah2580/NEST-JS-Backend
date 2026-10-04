import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './enums/user-role.enum';

@Injectable()
// Handles local application profiles; passwords remain exclusively in Supabase.
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Return newest user profiles first for administration screens.
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // Fetch one profile or return a standard 404 response.
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // Find the local profile linked to a verified Supabase user ID.
  async findBySupabaseUserId(supabaseUserId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        supabaseUserId,
      },
    });
  }

  // Used during signup to prevent a duplicate local profile.
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  // Called only after Supabase successfully creates the identity.
  async createFromSupabase(data: {
    supabaseUserId: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: UserRole;
  }): Promise<User> {
    const user = this.userRepository.create(data);

    return this.userRepository.save(user);
  }

  // Update a profile while preserving the unique email constraint.
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: {
          email: updateUserDto.email,
        },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    Object.assign(user, updateUserDto);

    return this.userRepository.save(user);
  }

  // Delete the local profile. Supabase identity deletion is a separate action.
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);

    await this.userRepository.remove(user);
  }
}
