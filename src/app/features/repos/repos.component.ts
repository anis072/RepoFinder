import { Component, ChangeDetectionStrategy, inject, effect, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Repo } from '../../core/models/repo.model';
import { Router } from '@angular/router';
import { GithubDataService } from '../../core/services/github-data.service';
import { ColumnDef, TableComponent } from '../../shared/table/table.component';
import { controlToSignal, isNonEmpty } from '../../core/utils/helpers';
import { Subject, takeUntil } from 'rxjs';
import { FilterComponent } from '../../shared/filter/filter.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-repos',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent,ReactiveFormsModule,FilterComponent],
  templateUrl: './repos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReposComponent implements OnDestroy  {

  private router = inject(Router);
  private githubService = inject(GithubDataService);

  totalLength = this.githubService.totalCount;
  pageSize = this.githubService.perPage;
  pageIndex = computed(() => this.githubService.page() - 1)

  repos = this.githubService.repos;
  isLoading = this.githubService.repoIsloading
  private destroy$ = new Subject<void>();

  public lastSearchParams: { query: string; language: string; minStars: number | null } = { query: '', language: '', minStars: null };


  columns: ColumnDef<Repo>[] = [
    { columnDef: 'name', header: 'Name', cell: repo => repo.name, isClickable: true },
    { columnDef: 'ownerAvatar', header: 'Owner', cell: repo => `<img src="${repo.owner.avatar_url}" width="50" alt="Avatar">` },
    { columnDef: 'createdAt', header: 'Created At', cell: repo => new Date(repo.created_at).toLocaleDateString() },
  ];

  constructor() {
  }
  onSearchParams(params: { query: string; language: string; minStars: number | null }) {
    this.lastSearchParams = params;
    this.handleSearch(params.query, params.language, params.minStars);
  }
  private handleSearch(query: string, language: string, minStars: number | null, page: number = 1, perPage: number = 10) {
    const hasRepoInputs = isNonEmpty(query) || isNonEmpty(language) || minStars !== null;
    if (hasRepoInputs) {
      this.githubService.searchRepos(query || '', language || '', minStars ?? undefined, page, perPage)
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    } else {
      this.githubService.clearRepos();
    }
  }

  onPageChange(event: PageEvent) {
    const page = event.pageIndex + 1;
    const perPage = event.pageSize;
    this.handleSearch(this.lastSearchParams.query, this.lastSearchParams.language, this.lastSearchParams.minStars, page, perPage);
  }

  handleRowClick(repo: Repo) {
    this.router.navigate(['/commits', repo.full_name]);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}