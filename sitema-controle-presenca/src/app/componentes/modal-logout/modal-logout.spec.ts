import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLogout } from './modal-logout';

describe('ModalLogout', () => {
  let component: ModalLogout;
  let fixture: ComponentFixture<ModalLogout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalLogout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalLogout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
