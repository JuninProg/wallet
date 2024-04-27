import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/infra/database/repositories/user-repository';
import { SignInDTO } from 'src/interface/auth/dtos';

@Injectable()
export class SignInService {
  @Inject(UserRepository)
  private readonly repository: UserRepository;

  @Inject(JwtService)
  private readonly jwt: JwtService;

  async execute(data: SignInDTO) {
    const userFound = await this.repository.findByEmail(data.email);

    const authorized = userFound
      ? await bcrypt.compare(data.password, userFound.password)
      : false;

    if (!authorized)
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );

    const token = await this.jwt.signAsync({
      id: userFound.id,
      name: userFound.name,
      email: userFound.email,
    });

    return token;
  }
}
