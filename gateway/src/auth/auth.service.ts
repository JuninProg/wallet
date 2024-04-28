import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_MS') private client: ClientProxy) {}

  public async verifyToken(token: string) {
    return firstValueFrom(this.client.send({ cmd: 'verify_token' }, { token }));
  }
}
