import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoderComponent } from './loder.component';

describe('LoderComponent', () => {
  let component: LoderComponent;
  let fixture: ComponentFixture<LoderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoderComponent]
    });
    fixture = TestBed.createComponent(LoderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
