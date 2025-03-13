import { ChangeDetectionStrategy, Component, computed, input, OnInit, output, signal, Signal, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
export interface ColumnDef<T> {
  columnDef: string;
  header: string;
  cell: (element: T) => string | undefined;
  isClickable?: boolean;
}
@Component({
  selector: 'app-table',
  imports: [MatTableModule,CommonModule,MatPaginatorModule],
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './table.component.scss'
})
export class TableComponent<T>  {
  dataSource = input.required<Signal<T[]>>();
  columns = input<ColumnDef<T>[]>();
  totalLength = input<number>(); 
  pageSize = input<number>(); 
  pageIndex = input<number>(); 

  usePagination = input<boolean>(true);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSizeOptions = [5, 10, 25, 50];
  displayedColumns = signal<string[]>([]);

  rowClicked = output<T>();
  pageChanged = output<PageEvent>(); 

  constructor() {}
 

  ngAfterViewInit() {
    this.displayedColumns.set(this.columns()!.map(col => col.columnDef));
  }

  onRowClick(row: T, column?: ColumnDef<T>) {
    if (column?.isClickable) {
      this.rowClicked.emit(row);
    }
  }

  onPageChange(event: PageEvent) {
    this.pageChanged.emit(event);
  }
}
