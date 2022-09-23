import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeServiceComponent } from './recipe-service.component';

describe('RecipeServiceComponent', () => {
  let component: RecipeServiceComponent;
  let fixture: ComponentFixture<RecipeServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
