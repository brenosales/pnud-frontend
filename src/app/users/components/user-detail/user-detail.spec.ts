import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UserService } from '../../../core/services/user.service';
import { UserDetailComponent } from './user-detail';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['getUserById', 'deleteUser']);
    
    await TestBed.configureTestingModule({
      imports: [
        UserDetailComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: UserService, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    
    // Prevent the component from trying to load users during initialization
    spyOn(component, 'loadUserFromRoute' as any);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with null user', () => {
    expect(component.user).toBeNull();
  });

  it('should set loading to false by default', () => {
    expect(component.loading).toBe(false);
  });

  it('should set error to null by default', () => {
    expect(component.error).toBeNull();
  });

  it('should set userId to null by default', () => {
    expect(component.userId).toBeNull();
  });
});
