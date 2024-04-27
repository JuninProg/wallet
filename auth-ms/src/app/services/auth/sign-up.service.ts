import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/domain/entities/user';
import { UserRepository } from 'src/infra/database/repositories/user-repository';
import { SignUpRequestDTO } from 'src/interfaces/http/auth/dtos';

@Injectable()
export class SignUpService {
  @Inject(UserRepository)
  private readonly repository: UserRepository;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(JwtService)
  private readonly jwt: JwtService;

  async execute(data: SignUpRequestDTO) {
    if (data.password !== data.confirmPassword)
      throw new Error('Password and confirmPassword must be equals');

    const userFound = await this.repository.findByEmail(data.email);

    if (userFound) throw new Error('User already exists');

    const salt = Number(this.configService.get('salt'));

    const passHash = await bcrypt.hash(data.password, salt);

    const userCreated = await this.repository.create(
      new User({
        name: data.name,
        email: data.email,
        password: passHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    const token = await this.jwt.signAsync({
      id: userCreated.id,
      name: userCreated.name,
      email: userCreated.email,
    });

    return token;
  }
}
