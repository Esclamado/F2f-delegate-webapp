import { Component, OnInit } from '@angular/core';
import { environment } from 'src/app/lib/environment';
@Component({
  selector: 'app-archive-header',
  templateUrl: './archive-header.component.html',
  styleUrls: ['./archive-header.component.scss']
})
export class ArchiveHeaderComponent implements OnInit {
  [x: string]: any;
  timezone_trimmed: any;
  event: any;
  constructor() 
  {
  
  }

  ngOnInit(): void {
    this.event = JSON.parse(localStorage.getItem('event'));
    console.log('evendas', this.event);
  }

}
