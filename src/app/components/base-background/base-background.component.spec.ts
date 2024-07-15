import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseBackgroundComponent } from './base-background.component';

describe('BaseBackgroundComponent', () => {
  let component: BaseBackgroundComponent;
  let fixture: ComponentFixture<BaseBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
