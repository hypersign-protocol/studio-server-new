import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repository/user.repository';
const mockUser = {
  _id: '641d2e711f35ed7575931',
  email: 'varshakumari370@gmail.com',
  userId: 'ab8d48e0-60eb-437c-9a86-e063080b2943',
  did: 'did:hid:testnet:z2JFAEgfG5b7PhjHmCGuAeRPzqUaJ3Te9LUycbDMRzDwH',
  createdAt: '2023-11-13T15:24:49.053Z',
  updatedAt: '2023-11-13T15:24:49.053Z',
};
const reqBody = {
  hypersign: {
    data: {
      user: {
        email: 'varshakumari370@gmail.com',
        appUserID: 'ab8d48e0-60eb-437c-9a86-e063080b2943',
        did: 'did:hid:testnet:z2JFAEgfG5b7PhjHmCGuAeRPzqUaJ3Te9LUycbDMRzDwH',
      },
    },
  },
};
const authenticateResp = {
  error: null,
  message: {
    email: 'varshakumari370@gmail.com',
    appUserID: 'ab8d48e0-60eb-437c-9a86-e063080b2943',
    did: 'did:hid:testnet:z2JFAEgfG5b7PhjHmCGuAeRPzqUaJ3Te9LUycbDMRzDwH',
  },
  status: 200,
};
const authorizeResp = {
  ...authenticateResp,
  message: {
    user: {
      email: 'varshakumari370@gmail.com',
      appUserID: 'ab8d48e0-60eb-437c-9a86-e063080b2943',
      did: 'did:hid:testnet:z2JFAEgfG5b7PhjHmCGuAeRPzqUaJ3Te9LUycbDMRzDwH',
    },
  },
};
describe('UserController', () => {
  let userController: UserController;
  let spyUserService: UserService;
  describe('authenticate() method', () => {
    it('should be register new user', async () => {
      const mockFindOneUser = jest.fn().mockResolvedValue({});
      const createAUser = jest.fn().mockResolvedValue(mockUser);
      const userRepository = {
        findOne: mockFindOneUser,
        create: createAUser,
      };
      const userModule: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [
          UserRepository,
          { provide: UserRepository, useValue: userRepository },
        ],
      }).compile();
      userController = userModule.get<UserController>(UserController);
      const req = {};
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
      await userController.authenticate(res, req, reqBody);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(authenticateResp);
    });
  });
  describe('authorize() method', () => {
    it('should be able to authorize a user and get user inforamtion as response', async () => {
      const mockFindOneUser = jest.fn().mockResolvedValue({});
      const createAUser = jest.fn().mockResolvedValue(mockUser);
      const userRepository = {
        findOne: mockFindOneUser,
        create: createAUser,
      };
      const userModule: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [
          UserRepository,
          { provide: UserRepository, useValue: userRepository },
        ],
      }).compile();
      userController = userModule.get<UserController>(UserController);
      const req = {};
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await userController.authorize(res, req, reqBody);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(authorizeResp);
    });
  });
});
