import { Component, ChangeDetectionStrategy, inject, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GithubDataService } from '../../core/services/github-data.service';
import { ColumnDef, TableComponent } from '../../shared/table/table.component';
import { Commit } from '../../core/models/commit.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-commits',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './commit.component.html',
  styleUrls: ['./commit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommitComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private githubService = inject(GithubDataService);
  private destroy$ = new Subject<void>();

  repoFullName = this.route.snapshot.paramMap.get('repoFullName') || '';
  commits = this.githubService.commits;
  loading = this.githubService.loading;

  columns: ColumnDef<Commit>[] = [
    { 
      columnDef: 'author', 
      header: 'Author', 
      cell: commit => commit.author?.login || commit.commit.author.name  
    },
    { 
      columnDef: 'url', 
      header: 'URL', 
      cell: commit => `<a href="${commit.html_url}" target="_blank" rel="noopener noreferrer">${commit.sha.substring(0, 7)}</a>` 
    },
    { 
      columnDef: 'message', 
      header: 'Message', 
      cell: commit => commit.commit.message 
    },
  ];

  constructor() {
    effect(() => {
      if (this.repoFullName) {
        this.githubService.getCommits(this.repoFullName).pipe(takeUntil(this.destroy$)).subscribe();
      }
    });
  }
  ngOnDestroy(): void {
   this.destroy$.next();
   this.destroy$.complete()
  }
}