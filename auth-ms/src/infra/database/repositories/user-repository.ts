import { Inject } from '@nestjs/common';
import { User } from 'src/domain/entities/user';
import { PrismaConnector } from '../prisma';

export class UserRepository {
  @Inject(PrismaConnector)
  private readonly db: PrismaConnector;

  async create(user: User): Promise<User> {
    const userCreated = await this.db.user.create({
      data: user,
    });

    return new User(userCreated);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.user.findFirst({ where: { email } });

    if (!user) return null;

    return new User(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.db.user.findFirst({ where: { id } });

    if (!user) return null;

    return new User(user);
  }
}
