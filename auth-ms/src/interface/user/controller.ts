import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GetUserService } from 'src/app/services/user/get-user.service';
import { GetUserDTO } from './dtos';

@Controller()
export class UserController {
  @Inject(GetUserService)
  private readonly getUserService: GetUserService;

  @MessagePattern({ cmd: 'get_user' })
  async getUser(payload: GetUserDTO) {
    const response = await this.getUserService.execute(payload);

    return {
      status: HttpStatus.OK,
      data: response,
    };
  }
}
