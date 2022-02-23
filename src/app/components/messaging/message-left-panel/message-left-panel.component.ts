import { Component, OnInit } from '@angular/core';
import { environment } from 'src/app/lib/environment';

@Component({
  selector: 'app-message-left-panel',
  templateUrl: './message-left-panel.component.html',
  styleUrls: ['./message-left-panel.component.scss']
})
export class MessageLeftPanelComponent implements OnInit {
  isEmpty: boolean = false;
  event: any;
  token: string;
  constructor(
    public env: environment,
  ) { 

    this.event = JSON.parse(localStorage.getItem('event'));
    this.token = localStorage.getItem('aup_f2f_token');
  }

  ngOnInit(): void {
    if(this.event && this.token){
      console.log('pumasok dito')
      this.getConvos()
    }
    this.env.chatSocket.removeListener('new convo msg');
    // console.log('pumasok dito sa on', this.env.chatSocket)
    this.env.chatSocket.on('new convo msg', data => {
      if( parseInt(this.event.id) === parseInt(data.event_id) ){
        this.updateConvo(data);
      }
    });

    this.env.chatSocket.removeListener('get convos');
    this.env.chatSocket.on('get convos', data => {
      let _convos = this.env.chatSocket.setConverseWith(data.data)
      console.log('this.env.chatSocket.convos.datas: ', _convos)
      if(!this.env.chatSocket.convos){
        this.env.chatSocket.convos = _convos;
      } else {
          /* todo infinite scroll */
          this.env.chatSocket.convos.current_page = _convos.current_page;
          this.env.chatSocket.convos.next_page = _convos.next_page;
          this.env.chatSocket.convos.previous_page = _convos.previous_page;

          _convos.datas.forEach(val => {
            this.env.chatSocket.convos.datas.push(val);
          });
          
        }
    });
  }
  selected_delegate: any;
  selectConvo(conversation){
    this.selected_delegate = conversation
    
    conversation.unread = false;
      let chatwithid = conversation.user1;
      if(this.env.payload.jti == conversation.user1){
        chatwithid = conversation.user2;
      }
      /** 
       * decrement the number of unread messages 
       * and set it on storage
       */
      console.log('pumasok')
      if(this.env.unread_msg['event_'+this.event.id]){
        if(this.env.unread_msg['event_'+this.event.id].convos['convo_'+conversation.id]){
          this.env.unread_msg['event_'+this.event.id].convos['convo_'+conversation.id];
          this.env.unread_msg['event_'+this.event.id].unread_msg_convo--;

          // this.env.storage.set('unread_msg', this.env.unread_msg);
          localStorage.setItem('unread_msg', JSON.stringify(this.env.unread_msg));
          console.log('update unread msg count', this.env.unread_msg);
        }
      }
      let obj= {
        my_id: this.env.payload.jti,
        chat_with_id: chatwithid,
        event_id: this.event.id,
        convo: conversation
      }
      
    localStorage.setItem('convo', JSON.stringify(this.selected_delegate));
  }

  getConvos(page: any = 1){
    if(this.env.devicetoken){
        this.env.chatSocket.setVar('baseUrl', this.env.getUrl(''))
        .setVar('apiToken', this.token)
        .setVar('currentLogedInUserId', this.env.payload.jti)
        .setVar('devicetoken', this.env.devicetoken)
        .setVar('deviceid', this.env.deviceid)
        .setVar('event_id', this.event.id);
        
        // .setVar('apiToken', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwYW5lbC5mYWNlMmZhY2VzY2hlZHVsZXIuY29tIiwiYXVkIjoicmhhbmxleXNpY29AZ21haWwuY29tIiwianRpIjoiNSIsImlhdCI6MTYyMjU5NzMzNiwic3ViIjoibG9nZWQgdXNlciB0b2tlbiJ9.a77f6198d8d53b28f53db6823b4a53391cadc0f22d1901516c7d061cb40decc2")
        // .setVar('currentLogedInUserId', this.env.payload.jti)
        // .setVar('devicetoken', "cVxqju9gbkI:APA91bG366jmIjlrFlspNy4IeTSKirpOdIicShu_BpX-rQkXSWAf_nFZ8LCB_YRYfTIcbKbUlcku1D2zy2gpqr5LFWDVhkbAv9OusTADH4VfmeUhRwSkfMVzeY-L2HX5QSU3oEDXoeCG")
        // .setVar('deviceid', "a81aff7f682351187khheq_rhanni")
        // .setVar('event_id', this.event.id);

        if(page == 1){
          this.env.chatSocket.setVar('convos', null);
        }
        this.env.chatSocket.getConvos(page);
      }else{
        // this.env.setDeviceToken();
      }
  }

  updateConvo(convo){
    let convos = this.env.chatSocket.convos.datas;
    let convoFOund = false;
    /* need to do this as string because zero if considered as false or null */
    let convoFOundKey: any = 'null'; 
    convos.forEach((c, key) => {
      if(c.id === convo.id){
        convoFOund = true;
        convoFOundKey = key;

        c.last_message = convo.last_message;
        c.last_message_by = convo.last_message_by;
        if(c.last_message_by == this.env.payload.jti){
          c.unread = false;
        } else {
          c.unread = true;
        }
        c.last_message_date_foramatted = convo.last_message_date_foramatted;
      }
    });

    if(convoFOundKey != 'null'){
      let newConvo = convos.splice(convoFOundKey, 1);
      if(newConvo.length){
        this.env.chatSocket.convos.datas.unshift(newConvo[0]);
      }
    }

    if(!convoFOund){
      convo = this.env.chatSocket.setConverseWithHelper(convo, true);
      this.env.chatSocket.convos.datas.unshift(convo);
    }
    /* this.sortConvos(); */
  }
}
