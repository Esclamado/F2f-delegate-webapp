import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Input() border_radius_class; 
  @Input() additional_class; 
  constructor() { }

  ngOnInit(): void {
  }

}
