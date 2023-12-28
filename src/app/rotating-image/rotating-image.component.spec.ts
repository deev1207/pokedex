import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RotatingImageComponent } from './rotating-image.component';

describe('RotatingImageComponent', () => {
  let component: RotatingImageComponent;
  let fixture: ComponentFixture<RotatingImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RotatingImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RotatingImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
