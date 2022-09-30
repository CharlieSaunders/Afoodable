import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  @Input() dataSource!: Array<any>;
  @Input() displayedColumns: Array<string> = [];
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */

  constructor() {
  }

  ngAfterViewInit(): void {
    this.table.dataSource = this.dataSource;

    //this.dataSource.sort = this.sort;
    //this.dataSource.paginator = this.paginator;
  }
}
