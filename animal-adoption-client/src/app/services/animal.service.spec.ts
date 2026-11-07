import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AnimalService } from './animal.service';
import { Animal } from '../models/animal';

describe('AnimalService', () => {
  let service: AnimalService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnimalService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AnimalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getAllAnimals GETs the animals endpoint', () => {
    service.getAllAnimals().subscribe();
    const req = httpMock.expectOne('/api/animals');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getAnimalById GETs by id', () => {
    service.getAnimalById(7).subscribe();
    const req = httpMock.expectOne('/api/animals/7');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('createAnimal posts FormData with each image under "images"', () => {
    const animal = {
      name: 'Rex', species: 'Kutya', breed: 'K', age: 3, description: 'd',
      temperament: 't', healthInfo: 'h', available: true, animalId: 0,
    } as Animal;
    const f1 = new File(['x'], 'a.jpg', { type: 'image/jpeg' });
    const f2 = new File(['y'], 'b.jpg', { type: 'image/jpeg' });

    service.createAnimal(animal, [f1, f2]).subscribe();
    const req = httpMock.expectOne('/api/animals/create');
    expect(req.request.method).toBe('POST');
    const body = req.request.body as FormData;
    expect(body.get('name')).toBe('Rex');
    expect(body.getAll('images').length).toBe(2);
    req.flush({});
  });

  it('deleteAnimal DELETEs by id', () => {
    service.deleteAnimal(5).subscribe();
    const req = httpMock.expectOne('/api/animals/5');
    expect(req.request.method).toBe('DELETE');
    req.flush('ok');
  });
});
