import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Recipe } from '../../types/recipes/recipe.type'

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() data!: Array<Recipe>;
  @Input() headers!: Array<string>;

  constructor() {
  }

  ngAfterViewInit(): void {
    //this.data.sort = this.sort;
    //this.data.paginator = this.paginator;
  }
}
