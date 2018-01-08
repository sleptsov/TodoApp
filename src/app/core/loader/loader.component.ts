import { Component, OnInit } from '@angular/core';
import { LoaderService } from './loader.service';

@Component({
  selector: 'td-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  constructor(
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
  }

  get isLoading(): boolean {
    return this.loaderService.isLoading;
  }

}
