import { Controller, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SignUpService } from 'src/app/services/auth/sign-up.service';
import { SignUpRequestDTO } from './dtos';

@Controller()
export class AuthController {
  @Inject(SignUpService)
  private readonly signUpService: SignUpService;

  @MessagePattern({ cmd: 'sign_up' })
  async signUp(payload: SignUpRequestDTO) {
    try {
      const response = await this.signUpService.execute(payload);

      return {
        status: HttpStatus.CREATED,
        data: {
          token: response,
        },
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @MessagePattern({ cmd: 'test' })
  get() {
    return {
      test: 'ok',
    };
  }
}
