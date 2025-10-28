import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextStatistics } from './text-statistics';

describe('TextStatistics', () => {
  let component: TextStatistics;
  let fixture: ComponentFixture<TextStatistics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextStatistics],
    }).compileComponents();

    fixture = TestBed.createComponent(TextStatistics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
