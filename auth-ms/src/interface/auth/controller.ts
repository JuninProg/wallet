import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SignUpService } from 'src/app/services/auth/sign-up.service';
import { SignInDTO, SignUpDTO, VerifyTokenDTO } from './dtos';
import { SignInService } from 'src/app/services/auth/sign-in.service';
import { VerifyTokenService } from 'src/app/services/auth/verify-token.service';

@Controller()
export class AuthController {
  @Inject(SignUpService)
  private readonly signUpService: SignUpService;

  @Inject(SignInService)
  private readonly signInService: SignInService;

  @Inject(VerifyTokenService)
  private readonly verifyTokenService: VerifyTokenService;

  @MessagePattern({ cmd: 'sign_up' })
  async signUp(payload: SignUpDTO) {
    const response = await this.signUpService.execute(payload);

    return {
      status: HttpStatus.CREATED,
      data: {
        token: response,
      },
    };
  }

  @MessagePattern({ cmd: 'sign_in' })
  async signIn(payload: SignInDTO) {
    const response = await this.signInService.execute(payload);

    return {
      status: HttpStatus.OK,
      data: {
        token: response,
      },
    };
  }

  @MessagePattern({ cmd: 'verify_token' })
  async verifyToken(payload: VerifyTokenDTO) {
    const response = await this.verifyTokenService.execute(payload);

    return {
      status: HttpStatus.OK,
      data: response,
    };
  }
}
