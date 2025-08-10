import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanadorModalComponent } from './ganador-modal.component';

describe('GanadorModalComponent', () => {
  let component: GanadorModalComponent;
  let fixture: ComponentFixture<GanadorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GanadorModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GanadorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
