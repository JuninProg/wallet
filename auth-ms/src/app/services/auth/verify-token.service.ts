import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { VerifyTokenDTO } from 'src/interface/auth/dtos';

@Injectable()
export class VerifyTokenService {
  @Inject(JwtService)
  private readonly jwt: JwtService;

  async execute(data: VerifyTokenDTO) {
    try {
      const payload = await this.jwt.verifyAsync(data.token);
      return payload;
    } catch (error) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
