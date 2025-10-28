import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineToolsComponent } from './line-tools.component';

describe('LineToolsComponent', () => {
  let component: LineToolsComponent;
  let fixture: ComponentFixture<LineToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineToolsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LineToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
