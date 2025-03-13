import { computed, inject, Injectable, signal } from '@angular/core';
import { Repo, RepoSearchResponse } from '../models/repo.model';
import {
  finalize,
  map,
  Observable,
  tap,
} from 'rxjs';
import { Commit } from '../models/commit.model';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class GithubDataService {
  private readonly apiUrl = 'https://api.github.com';
  private http = inject(HttpClient);

  private reposSignal = signal<Repo[]>([]);
  private commitsSignal = signal<Commit[]>([]);
  private pageSignal = signal<number>(1);
  private perPageSignal = signal<number>(10);
  private totalCountSignal = signal<number>(0);
  private repoloadingSignal = signal<boolean>(false);
  private loadingSignal = signal<boolean>(false);

  repos = computed(() => this.reposSignal());
  commits = computed(() => this.commitsSignal());
  loading = computed(() => this.loadingSignal());
  repoIsloading = computed(() => this.repoloadingSignal());

  page = computed(() => this.pageSignal());
  perPage = computed(() => this.perPageSignal());
  totalCount = computed(() => this.totalCountSignal());

  searchRepos(
    query: string,
    language?: string,
    minStars?: number,
    page: number = this.page(),
    perPage: number = this.perPage()
  ): Observable<Repo[]> {
    this.repoloadingSignal.set(true);
    this.pageSignal.set(page);
    this.perPageSignal.set(perPage);
    let url = `${this.apiUrl}/search/repositories?q=${encodeURIComponent(
      query
    )}`;
    if (language) url += `+language:${language}`;
    if (minStars) url += `+stars:>=${minStars}`;
    url += `&page=${page}&per_page=${perPage}`;
    const request$ = this.http.get<RepoSearchResponse>(url).pipe(
      map((data) => {
        this.totalCountSignal.set(data.total_count);
        return data.items;
      }),
      tap((data) => this.reposSignal.set(data)),
      finalize(() => this.repoloadingSignal.set(false))
    );
    return request$;
  }

  getCommits(repoFullName: string): Observable<Commit[]> {
    this.loadingSignal.set(true);
    const request$ = this.http
      .get<Commit[]>(`${this.apiUrl}/repos/${repoFullName}/commits`)
      .pipe(
        tap((data) => this.commitsSignal.set(data)),
        finalize(() => this.loadingSignal.set(false))
      );
    return request$;
  }

  clearRepos() {
    this.totalCountSignal.set(0);
  }

  setPage(page: number) {
    this.pageSignal.set(page);
  }

  setPerPage(perPage: number) {
    this.perPageSignal.set(perPage);
  }
}
