import { Test, TestingModule } from '@nestjs/testing';
import { GetUserService } from './get-user.service';
import { HttpException } from '@nestjs/common';
import { User } from 'src/domain/entities/user';
import { UserRepository } from 'src/infra/database/repositories/user-repository';
import { GetUserDTO } from 'src/interface/user/dtos';

describe('GetUserService', () => {
  let getUserService: GetUserService, findById: jest.Func;

  const USER: User = new User({
    id: 'someid',
    email: 'some@mail.com',
    password: 'somehash',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(async () => {
    findById = jest.fn((id) => (id === USER.id ? USER : null));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserService,
        {
          provide: UserRepository,
          useValue: {
            findById,
          },
        },
      ],
    }).compile();

    getUserService = module.get<GetUserService>(GetUserService);
  });

  it('Should pass a valid id and return User', async () => {
    const data: GetUserDTO = {
      id: 'someid',
    };

    const response = await getUserService.execute(data);

    expect(response).toEqual(USER);
    expect(findById).toHaveBeenCalledWith(data.id);
  });

  it('Should pass an invalid id and throw exception', async () => {
    const data: GetUserDTO = {
      id: 'otherid',
    };

    try {
      await getUserService.execute(data);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }

    expect(findById).toHaveBeenCalledWith(data.id);
  });
});
