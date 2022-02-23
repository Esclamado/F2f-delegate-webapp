import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-popup-message-card',
  templateUrl: './popup-message-card.component.html',
  styleUrls: ['./popup-message-card.component.scss']
})
export class PopupMessageCardComponent implements OnInit , OnChanges, AfterViewInit{
  @Output() close_card = new EventEmitter();
  @Output() close_convo = new EventEmitter();
  constructor(
    public cdk: ChangeDetectorRef
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }
  ngAfterViewInit(){
    this.cdk.detectChanges();
  }
  minimize(){
    this.close_card.emit(0);
  }
  close(){
    this.close_convo.emit(0);
  }

}
