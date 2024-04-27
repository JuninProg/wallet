import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/infra/database/repositories/user-repository';
import { GetUserDTO } from 'src/interface/user/dtos';

@Injectable()
export class GetUserService {
  @Inject(UserRepository)
  private readonly repository: UserRepository;

  async execute(data: GetUserDTO) {
    const userFound = await this.repository.findById(data.id);

    if (!userFound)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return userFound;
  }
}
