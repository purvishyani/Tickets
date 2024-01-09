import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCardModalComponent } from './add-card-modal.component';

describe('AddCardModalComponent', () => {
  let component: AddCardModalComponent;
  let fixture: ComponentFixture<AddCardModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCardModalComponent]
    });
    fixture = TestBed.createComponent(AddCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
