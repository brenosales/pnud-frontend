import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { RouterTestingModule } from '@angular/router/testing';

import { UserService } from '../../../core/services/user.service';
import { UserFormComponent } from './user-form';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['getUserById', 'createUser', 'updateUser']);
    
    await TestBed.configureTestingModule({
      imports: [
        UserFormComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatSnackBarModule
      ],
      providers: [
        { provide: UserService, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.userForm).toBeDefined();
    expect(component.userForm.get('name')?.value).toBe('');
    expect(component.userForm.get('email')?.value).toBe('');
    expect(component.userForm.get('status')?.value).toBe('active');
  });

  it('should not be in edit mode by default', () => {
    expect(component.isEditMode).toBe(false);
  });

  it('should have loading set to false by default', () => {
    expect(component.loading).toBe(false);
  });

  it('should have submitting set to false by default', () => {
    expect(component.submitting).toBe(false);
  });

  it('should have userId set to null by default', () => {
    expect(component.userId).toBeNull();
  });
});
