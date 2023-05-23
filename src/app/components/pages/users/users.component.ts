
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'email'];
  dataSource!: MatTableDataSource<User>;
  pageSize = 10;
  totalUsers = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<User>();
    this.dataSource.sort = this.sort;
    this.getUsers();

    this.userService.users$.subscribe(users => {
      if (users !== null) {
        this.dataSource.data = users;
        this.totalUsers = users.length;
      }
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getUsers() {
    this.userService.getUsers().subscribe();
  }

  onPageChange(event: {
    previousPageIndex?: number;
    pageIndex?: number;
    pageSize: number;
    length?: number;
  }) {
    console.log(event);

    this.pageSize = event.pageSize;
  }

}
