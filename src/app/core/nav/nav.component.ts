import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'td-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  isCollapsed: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
