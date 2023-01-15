import { ValidateHeadersMiddleware } from './validate-headers.middleware';

describe('ValidateHeadersMiddleware', () => {
  it('should be defined', () => {
    expect(new ValidateHeadersMiddleware()).toBeDefined();
  });
});
