import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-inbox-card',
  templateUrl: './inbox-card.component.html',
  styleUrls: ['./inbox-card.component.scss']
})
export class InboxCardComponent implements OnInit {
  @Input() message;
  constructor( ) {}

  ngOnInit(): void {
    console.log('this.message: ', this.message)
  }

}
