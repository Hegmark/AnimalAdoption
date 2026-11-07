import { requireRole, requireAuthentication } from '../../src/middlewares/auth';
import { Response } from 'express';

function mockRes(): Response {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
}

describe('requireRole', () => {
  it('responds 401 when the request is not authenticated', () => {
    const req: any = { isAuthenticated: () => false };
    const res = mockRes();
    const next = jest.fn();
    requireRole('admin')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('responds 403 when the role does not match', () => {
    const req: any = { isAuthenticated: () => true, user: { role: 'adopter' } };
    const res = mockRes();
    const next = jest.fn();
    requireRole('admin')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next when the role matches', () => {
    const req: any = { isAuthenticated: () => true, user: { role: 'admin' } };
    const res = mockRes();
    const next = jest.fn();
    requireRole('admin')(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

describe('requireAuthentication', () => {
  it('calls next when authenticated', () => {
    const req: any = { isAuthenticated: () => true };
    const res = mockRes();
    const next = jest.fn();
    requireAuthentication()(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('responds 401 when not authenticated', () => {
    const req: any = { isAuthenticated: () => false };
    const res = mockRes();
    const next = jest.fn();
    requireAuthentication()(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
