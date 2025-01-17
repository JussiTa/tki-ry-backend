import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const saltOrRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async findOneByEmail(username: string): Promise<User | undefined> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: username })
      .getOne();
  }

  async findOne(id: number): Promise<User> {
    const user = this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .getOne();

    return user;
  }

  async create({ password, ...rest }): Promise<User | undefined> {
    const user = this.userRepository.create({
      ...rest,
      password: await bcrypt.hash(password, saltOrRounds),
    });
    return this.userRepository.save(user);
  }
}
