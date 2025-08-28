import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { UserService } from '../../../core/services/user.service';
import { UserListComponent } from './user-list';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['getUsers', 'deleteUser'], {
      users$: jasmine.createSpyObj('Observable', ['subscribe']),
      loading$: jasmine.createSpyObj('Observable', ['subscribe']),
      error$: jasmine.createSpyObj('Observable', ['subscribe'])
    });
    
    await TestBed.configureTestingModule({
      imports: [
        UserListComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: UserService, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    
    spyOn(component, 'loadUsers');
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty data source', () => {
    expect(component.dataSource.data).toEqual([]);
  });

  it('should have correct displayed columns', () => {
    expect(component.displayedColumns).toEqual(['id', 'name', 'email', 'status', 'actions']);
  });

  it('should set default page size', () => {
    expect(component.pageSize).toBe(10);
  });

  it('should have correct page size options', () => {
    expect(component.pageSizeOptions).toEqual([5, 10, 25, 50]);
  });
});
