import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/app/lib/environment';

@Component({
  selector: 'app-message-right-panel',
  templateUrl: './message-right-panel.component.html',
  styleUrls: ['./message-right-panel.component.scss']
})
export class MessageRightPanelComponent implements OnInit {
  messageForm: FormGroup;
  message = [
    {
       sender: 'delegate1',
       content: 'HI!'
    },
    {
      sender: 'delegate2',
      content: 'hello!'
   }
  ]

  my_id: any = null;
  chat_with_id: any = null;
  event_id: any = null;
  messageToSend: any = '';

    /**
   * the element of infi scroll
   * we need to hold it here for the infi completion
   */
     infiEl: any = null;
     chatWidthIsTyping: boolean = false;
     sendButton: boolean = false;
     debounce: any = false;

  @ViewChild('message_container', { read: ElementRef }) public message_container: ElementRef<any>;
  convo: any;

  constructor(
    private fb: FormBuilder,
    public env: environment
  ) 
  {
    this.messageForm = this.fb.group({
      message_content: ['', Validators.compose([Validators.required,])]
    });

    this.convo = JSON.parse(localStorage.getItem('convo'));
  }

  ngOnInit(): void {
    this.reset()
    if(this.convo){
      this.my_id = this.convo.my_id
      this.chat_with_id = this.convo.chat_with_id
      this.event_id = this.convo.event_id
    }
    // this.env.chatSocket.removeListener('messages');
    this.env.chatSocket.on('messages', data => {
      console.log('pumasok dito: ')
      console.log('sdaa',data);
      if(!this.env.chatSocket.messages){
        this.sortMessage(data.data);
      } else {
        this.env.chatSocket.messages.current_page = data.data.current_page;

        data.data = this.sortMessage(data.data, true);

        data.data.datas.forEach(val => {
          this.env.chatSocket.messages.datas.unshift(val);
        });
        if(this.infiEl){
          this.infiEl.target.complete();
        }
      }
      // this.content.scrollToBottom();

      if(!this.convo){
        this.convo = this.env.chatSocket.convo;
      }
    }); 
  }
  reset(){
    console.log('reset');
    this.env.chatSocket.removeListener('messages');
    this.env.chatSocket.removeListener('chat message');

    this.env.chatSocket.messages = null;
    this.env.chatSocket.convo = null;
    this.infiEl = null;
  }

  sortMessage(data, returnData = false){
    let msgs = data.datas;
    const _msgs = [];

    msgs.forEach((val, key) => {
      let date = new Date(val.created_at);
      let calcDay = this.calculateDays(date);

      let nextIndex = key + 1;

      if(msgs[nextIndex]){
        let nextMsg = msgs[nextIndex];
        let nextDate = new Date(nextMsg.created_at);
        let calcNextDate = this.calculateDays(nextDate);

        if(calcDay.difference_in_days < calcNextDate.difference_in_days){ /* the next msg sent earlier than today */
          val['date_divider'] = this.getDivider(calcDay, date);
        }
      } else {
        val['date_divider'] = this.getDivider(calcDay, date);
      }
      if(returnData){
        _msgs.push(val);
      } else {
        _msgs.unshift(val);
      }

    });
    data.datas = _msgs;

    if(returnData){
      return data;
    } else {
      this.env.chatSocket.messages = data;
    }
  }
  
  sendMessage(){
    if(this.messageForm.controls.message_content.value){
      let obj = {
        sender: 'delegate1',
        content: this.messageForm.controls.message_content.value
      }
      this.message.push(obj)
      this.scrollRight()
      this.messageForm.reset();
    }else{
      return false
    }
  }

    /**
   * return the specifc divider for date
   * @param calcDay 
   */
     getDivider(calcDay, date){
      let divider = "today";
  
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
      if(calcDay.difference_in_days > 0){
        let remainingDaysTonextWeek = 7 - calcDay.day_no_in_week2;
        let lastDayOfWeek = remainingDaysTonextWeek + calcDay.date2;
        let firstDayOfWeek = lastDayOfWeek - 6;
  
        if(calcDay.difference_in_days == 1){
          divider = 'yesterday';
        } 
        else if(firstDayOfWeek <= calcDay.date1 && lastDayOfWeek >= calcDay.date1){
          divider = days[calcDay.day_no_in_week1 - 1];
        } 
        else {
          divider = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
        }
      }
      return divider;
    }
  
    /**
     * calculate the number of day in between
     * two dates
     * @param date1 the first date to compare must be less than the date2
     * @param date2 must be greater than date1
     * the 2 params is an instance of javascript Data() class
     * return obj
     */
    calculateDays(date1, date2: any = null){
      if(!date2){
        date2 = new Date();
      }
      /* rebuild the date to ensure no time will be included */
      date1 = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate();
      date1 = new Date(date1);
      date2 = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate();
      date2 = new Date(date2);
  
      /* calculate the time difference of two dates */
      let Difference_In_Time = date2.getTime() - date1.getTime(); 
  
      /* calculate the no. of days between two dates */ 
      let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 
  
      return {
        difference_in_days: Difference_In_Days,
        day_no_in_week1: date1.getDay() + 1,
        day_no_in_week2: date2.getDay() + 1,
        date1: date1.getDate(),
        date2: date2.getDate(),
      }
    }

  scrollRight(){
    // this.message_container.nativeElement.scrollTo({ bottom: (this.message_container.nativeElement.scrollHeight), behavior: 'smooth' });
    this.message_container.nativeElement.scrollTop = this.message_container.nativeElement.scrollHeight
  }
  
}
