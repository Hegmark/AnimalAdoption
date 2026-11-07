import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('login posts credentials (with credentials) and updates auth state', () => {
    let role: string | null = null;
    let loggedIn = false;
    service.userRole$.subscribe(r => (role = r));

    service.login('a@b.com', 'pw').subscribe();
    const req = httpMock.expectOne('/api/user/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBeTrue();
    req.flush('adopter');

    service.isLoggedIn$.subscribe(v => (loggedIn = v));
    expect(loggedIn).toBeTrue();
    expect(role!).toBe('adopter');
  });

  it('register posts to the register endpoint', () => {
    service.register('u', 'u@b.com', 'pw').subscribe();
    const req = httpMock.expectOne('/api/user/register');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('checkAuth updates the role from the response', () => {
    service.checkAuth().subscribe();
    const req = httpMock.expectOne('/api/user/checkAuth');
    expect(req.request.method).toBe('GET');
    req.flush({ authenticated: true, role: 'admin' });

    let role: string | null = null;
    service.userRole$.subscribe(r => (role = r));
    expect(role!).toBe('admin');
  });

  it('logout clears auth state', () => {
    service.logout().subscribe();
    const req = httpMock.expectOne('/api/user/logout');
    expect(req.request.method).toBe('POST');
    req.flush('ok');

    let loggedIn = true;
    service.isLoggedIn$.subscribe(v => (loggedIn = v));
    expect(loggedIn).toBeFalse();
  });
});
