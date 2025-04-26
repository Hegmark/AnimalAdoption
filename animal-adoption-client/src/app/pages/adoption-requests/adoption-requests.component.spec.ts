import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdoptionRequestsComponent } from './adoption-requests.component';

describe('AdoptionRequestsComponent', () => {
  let component: AdoptionRequestsComponent;
  let fixture: ComponentFixture<AdoptionRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdoptionRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdoptionRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
