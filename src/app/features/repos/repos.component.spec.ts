import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReposComponent } from './repos.component';
import { GithubDataService } from '../../core/services/github-data.service';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { Repo } from '../../core/models/repo.model';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../shared/table/table.component';
import { FilterComponent } from '../../shared/filter/filter.component';
import { of } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

const mockRepos: Repo[] = [
  {  name: 'angular', full_name: 'angular/angular', owner: { avatar_url: 'http://example.com/avatar.png', login: 'angular' }, created_at: '2020-01-01T00:00:00Z' },
];

describe('ReposComponent', () => {
  let component: ReposComponent;
  let fixture: ComponentFixture<ReposComponent>;
  let githubServiceSpy: jasmine.SpyObj<GithubDataService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const githubSpy = jasmine.createSpyObj('GithubDataService', ['searchRepos', 'clearRepos'], {
      repos: signal<Repo[]>([]),
      loading: signal(false), 
      totalCount: signal(0),
      perPage: signal(10),
      page: signal(1),
      repoIsloading: signal(false),
    });

    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TableComponent,
        FilterComponent,
        ReposComponent,
      ],
      providers: [
        { provide: GithubDataService, useValue: githubSpy },
        { provide: Router, useValue: routerSpyObj },
      ],
    }).compileComponents();

    githubServiceSpy = TestBed.inject(GithubDataService) as jasmine.SpyObj<GithubDataService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize with empty repos and no loading state', () => {
    expect(component.repos()).toEqual([]);
    expect(component.isLoading()).toBeFalse(); 
    expect(component.totalLength()).toBe(0);
    expect(component.pageSize()).toBe(10);
    expect(component.pageIndex()).toBe(0);
  });

  it('should call searchRepos with correct parameters on search params', () => {
    const searchParams = { query: 'angular', language: 'typescript', minStars: 100 };
    githubServiceSpy.searchRepos.and.returnValue(of(mockRepos));

    component.onSearchParams(searchParams);
    fixture.detectChanges();

    expect(githubServiceSpy.searchRepos).toHaveBeenCalledWith(
      'angular',
      'typescript',
      100,
      1,
      10
    );
    expect(component.lastSearchParams).toEqual(searchParams);
  });

 
});
