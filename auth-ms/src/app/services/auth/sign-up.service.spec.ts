import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/infra/database/repositories/user-repository';
import { User } from 'src/domain/entities/user';
import { SignUpDTO } from 'src/interface/auth/dtos';
import { SignUpService } from './sign-up.service';
import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  hash: () => 'somehash',
}));

describe('SingUpService', () => {
  let signUpService: SignUpService,
    signAsync: jest.Func,
    findByEmail: jest.Func,
    create: jest.Func;

  const TOKEN = 'sometoken';
  const CREATE_ID = 'someuuid';
  const USERS = [
    {
      id: 'otheruuid',
      email: 'other@mail.com',
      password: 'otherpass',
      name: 'othername',
    },
  ];

  beforeEach(async () => {
    signAsync = jest.fn(() => TOKEN);
    findByEmail = jest.fn((email) => {
      const userFound = USERS.find((user) => user.email === email);
      return userFound ? new User(userFound as User) : null;
    });
    create = jest.fn((data) => new User({ ...data, id: CREATE_ID }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpService,
        {
          provide: JwtService,
          useValue: {
            signAsync,
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findByEmail,
            create,
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => '10'),
          },
        },
      ],
    }).compile();

    signUpService = module.get<SignUpService>(SignUpService);
  });

  it('Should pass valid sign up payload to return token', async () => {
    const data: SignUpDTO = {
      email: 'test@mail.com',
      password: 'somepass',
      confirmPassword: 'somepass',
      name: 'somename',
    };

    const response = await signUpService.execute(data);

    expect(response).toBe(TOKEN);
    expect(findByEmail).toHaveBeenCalledWith(data.email);
    expect(create).toHaveBeenCalled();
    expect(signAsync).toHaveBeenCalledWith({
      id: CREATE_ID,
      name: data.name,
      email: data.email,
    });
  });

  it('Should pass differents pasword and confirmPassword to throw exception', async () => {
    const data: SignUpDTO = {
      email: 'test@mail.com',
      password: 'somepass',
      confirmPassword: 'someps',
      name: 'somename',
    };

    try {
      await signUpService.execute(data);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }

    expect(findByEmail).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
    expect(signAsync).not.toHaveBeenCalled();
  });

  it('Should pass an existent email to throw exception', async () => {
    const data: SignUpDTO = {
      email: 'other@mail.com',
      password: 'somepass',
      confirmPassword: 'somepass',
      name: 'somename',
    };

    try {
      await signUpService.execute(data);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }

    expect(findByEmail).toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
    expect(signAsync).not.toHaveBeenCalled();
  });
});
