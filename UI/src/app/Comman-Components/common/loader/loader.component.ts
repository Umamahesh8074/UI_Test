import { Component, Input } from '@angular/core';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent {
  showLoader: boolean = false;

  constructor(private loaderService: LoaderService) {}

  ngOnInit() {
    this.loaderService.isLoading$.subscribe((isLoading) => {
      this.showLoader = isLoading;
    });
  }
}
