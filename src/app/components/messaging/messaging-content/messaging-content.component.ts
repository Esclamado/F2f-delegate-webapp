import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-messaging-content',
  templateUrl: './messaging-content.component.html',
  styleUrls: ['./messaging-content.component.scss']
})
export class MessagingContentComponent implements OnInit {
  name = 'John Ailo Cahibaybayan';
  messageForm: FormGroup;

  constructor
  (private fb: FormBuilder) 
  {
    this.messageForm = this.fb.group({
      message_content: ['', Validators.compose([Validators.required,])]
    });
  }

  ngOnInit(): void {
  }
  

}
