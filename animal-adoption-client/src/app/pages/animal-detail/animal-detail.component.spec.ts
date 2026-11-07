import { AnimalDetailComponent } from './animal-detail.component';

// The gallery navigation is pure logic, so we test it on a directly-constructed
// instance (no TestBed / template needed).
describe('AnimalDetailComponent gallery', () => {
  let component: AnimalDetailComponent;

  beforeEach(() => {
    component = new AnimalDetailComponent({} as any, {} as any, {} as any, {} as any, {} as any);
    component.animal = { images: ['/a.webp', '/b.webp', '/c.webp'] } as any;
  });

  it('nextImage advances and wraps around to the first image', () => {
    expect(component.currentImageIndex).toBe(0);
    component.nextImage();
    expect(component.currentImageIndex).toBe(1);
    component.nextImage();
    component.nextImage();
    expect(component.currentImageIndex).toBe(0);
  });

  it('prevImage wraps around to the last image', () => {
    component.prevImage();
    expect(component.currentImageIndex).toBe(2);
  });

  it('goToImage jumps to the given index', () => {
    component.goToImage(2);
    expect(component.currentImageIndex).toBe(2);
  });

  it('does nothing when there are no images', () => {
    component.animal = { images: [] } as any;
    component.nextImage();
    expect(component.currentImageIndex).toBe(0);
  });
});
