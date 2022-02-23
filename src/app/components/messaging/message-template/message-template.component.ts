import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/app/lib/environment';
import { LayoutService } from 'src/app/services/tailwind/layout/layout.service';
import { Urls } from 'src/app/lib/urls';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage/storage.service';
import { DebounceService } from 'src/app/debounce.service';
import { RequestsService } from 'src/app/services/http/requests.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { element } from 'protractor';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-message-template',
  templateUrl: './message-template.component.html',
  styleUrls: ['./message-template.component.scss']
})
export class MessageTemplateComponent implements OnInit,OnDestroy {
  delegate_is_empty: boolean = false;
  delegate_is_loading: boolean = false;
  expanded = true;

  event: any;
  token: string;
  convo: any;
  user: any;
  messageForm: FormGroup;
  messageToSend: any = '';
  inbox_loading: boolean = false;
  isActive: boolean;
  delegate_convo:any;
  searchForm: FormGroup;
  searchKey: any=null;
  search_keyword='';
  search_is_open: boolean = false;

  current_page = 1;
  limit = 30;
  sort: any = 'id';
  order: any = 'asc';
  search: any = '';
  delegate: any;
  delegates_page: any = 1;
  @ViewChild('message_container', { read: ElementRef }) public message_container: ElementRef<any>;
  constructor(
    private fb: FormBuilder,
    private layout: LayoutService,
    public env: environment,
    public storage: StorageService,
    public newDebounce: DebounceService,
    public request: RequestsService,
    public modal: NgxSmartModalService,
    private toastr: ToastrService,
    private profile: ProfileService,
    // private chatService: ChatService
    ) { 
      this.layout.expanded.subscribe( res => {
      this.expanded = res;
      
    this.messageForm = this.fb.group({
      message_content: ['', Validators.compose([Validators.required,])]
    });

    this.searchForm = this.fb.group({
      search: [''],
    });

    this.searchKey = this.newDebounce.debounce(() => {
      this.current_page=1;
      this.search_keyword=this.searchForm.value.search;
      this.searchList();
    }, 500);

      this.event = JSON.parse(localStorage.getItem('event'));
      this.token = localStorage.getItem('aup_f2f_token');
      this.convo = JSON.parse(localStorage.getItem('convo'));
      this.user = JSON.parse(localStorage.getItem('user_profile'));
      this.delegate_convo = JSON.parse(localStorage.getItem('delegate_message'));
      
      
    }) 
  }
  after_init_counter: any = 0;
  selectSearch(delegate){
    localStorage.setItem('delegate_message', JSON.stringify(delegate));
    //   this.delegate_convo = JSON.parse(localStorage.getItem('delegate_message'));
      
      this.delegate_convo = delegate;
      if(this.delegate_convo && this.after_init_counter == 0 && (this.selected_delegate != delegate)){
        this.after_init_counter ++
        this.delegate_convo ? this.found  = this.env.chatSocket.convos.datas.find(element => element.userid == this.delegate_convo.id) : '';
        //console.log('delegate convo', this.delegate_convo)
        // console.log('found convo', this.found)

        // this.env.chatSocket.chat_with_id = this.delegate_convo.id

          if(this.delegate_convo && !this.found){
            this.first_send = true;
            this.env.chatSocket.convos.datas.forEach(element => {
              if(!element.hasOwnProperty('last_message')){
                this.env.chatSocket.convos.datas.shift()
              }
            });
            // console.log('ailo: ', this.env.chatSocket.convos.datas)
            let obj= {
              my_id: this.env.payload.jti,
              chat_with_id: this.delegate_convo.id,
              event_id: this.event.id,
              id: this.delegate_convo.id,
              profile_photo: this.delegate_convo.profile_photo_url ? this.delegate_convo.profile_photo_url: '/assets/empty_states/profile_avatar'+this.delegate_convo.profile_photo+'.png',
              company: this.delegate_convo.company.name,
              fullname: this.delegate_convo.fullname,
              isUnshift: true,
            }
            
            localStorage.setItem('convo', JSON.stringify(obj));
            this.selected_delegate = this.delegate_convo
            console.log('sinelect ung search', obj)
            this.env.chatSocket.convos.datas.unshift(obj)

            console.log('convo list', this.env.chatSocket.convos.datas)

            this.getInitConvo(this.delegate_convo.id);
            // this.initChat(obj);
            this.env.chatSocket.messages = null
            
          }else if(this.found){
            this.selectConvo(this.found)
            this.first_send = false;
            
          }
      }
  }
  ngOnDestroy(){
    this.storage.clearMessageDelegate();
    this.env.chatSocket.messages = null;
  }

  found: any;
  ngOnInit(): void {
    // this.searchListModal()
    this.getDelegateList();
    this.inbox_loading = true;
    if(this.event && this.token){
      this.getConvos()
    }
    this.env.chatSocket.removeListener('new convo msg');
    this.env.chatSocket.on('new convo msg', data => {
      if( parseInt(this.event.id) === parseInt(data.event_id) ){
        this.updateConvo(data);
      }
    });

    this.env.chatSocket.removeListener('get convos');
    this.env.chatSocket.on('get convos', data => {
      console.log('pumasok dito sa on', this.env.chatSocket)
      this.inbox_loading = false;
      let _convos = this.env.chatSocket.setConverseWith(data.data)
      // console.log('convo ng madami: ', _convos)
      if(!this.env.chatSocket.convos){
        this.env.chatSocket.convos = _convos;
        this.delegate_convo ? this.found  = this.env.chatSocket.convos.datas.find(element => element.userid == this.delegate_convo.id || element.userid == this.delegate_convo.delegate_id) : '';

    
        if(this.delegate_convo && !this.found){
          this.first_send = true;
          let obj= {
            my_id: this.env.payload.jti,
            chat_with_id: this.delegate_convo.delegate_id ? this.delegate_convo.delegate_id : this.delegate_convo.id,
            event_id: this.event.id,
            id: this.delegate_convo.delegate_id ? this.delegate_convo.delegate_id : this.delegate_convo.id,
            profile_photo: this.delegate_convo.profile_photo_url ? this.delegate_convo.profile_photo_url: '/assets/empty_states/profile_avatar'+ this.delegate_convo.delegate_profile_photo ? this.delegate_convo.delegate_profile_photo : this.delegate_convo.profile_photo+'.png',
            company: this.delegate_convo.delegate_company_name ? this.delegate_convo.delegate_company_name : this.delegate_convo.company.name,
            fullname: this.delegate_convo.delegate_fullname ? this.delegate_convo.delegate_fullname : this.delegate_convo.fullname,
            isUnshift: true,
          }
          localStorage.setItem('convo', JSON.stringify(obj));
          this.selected_delegate = this.delegate_convo
          // console.log('pumasok else1', this.delegate_convo)
           //console.log('sinelect ung init', obj)
          this.env.chatSocket.convos.datas.unshift(obj)
          this.getInitConvo(this.delegate_convo.delegate_id ? this.delegate_convo.delegate_id : this.delegate_convo.id);
        }else if(this.found){
          this.selectConvo(this.found)
          this.first_send = false;
        }
        
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

  /* keep search input open */
  openSearch(bool){
    if(bool == true){
      this.search_is_open = true;
      this.storage.clearMessageDelegate();
      this.after_init_counter = 0;
    }else{
      setTimeout(() => {
        this.search_is_open = false;
      }, 300);
    }
  }

  getInitConvo(id){
    if(this.token && this.env.devicetoken){
      this.env.chatSocket.setVar('baseUrl', this.env.getUrl(''))
        .setVar('apiToken', this.token)
        .setVar('currentLogedInUserId', this.env.payload.jti)
        .setVar('devicetoken', this.env.devicetoken)
        .setVar('deviceid', this.env.deviceid)
        .setVar('event_id', this.event.id)
        .setVar('chat_with_id', this.delegate_convo.delegate_id ? this.delegate_convo.delegate_id : this.delegate_convo.id)
        .getConvo();
        // // setTimeout(() => {
        //   console.log('ailo2',this.env.chatSocket.convos.datas);
        //   let new_convo = this.env.chatSocket.convo;
        //   console.log('ailo1',new_convo);
        //   this.env.chatSocket.convos.datas.unshift(new_convo)
        //   console.log('ailo3',this.env.chatSocket.convos.datas);
        // }, 200);
        // if(this.env.chatSocket.convo){
        //   console.log('pumasok sa get init convo', this.env.chatSocket.convo.user2)
          this.GetProfile(id);
        // }
    }else{
      // this.env.setDeviceToken();
    }
  }

  
  selected_delegate: any;
  shift_bool: boolean= false;
  conv_id: any = null;
  selectConvo(conversation){
    console.log('conversation: ', conversation)
    if(this.conv_id != conversation.id){
      this.conv_id = conversation.id
      this.other_profile = null
      this.storage.clearMessageDelegate();
      this.selected_delegate = conversation

      this.delegate_convo = null
      if(!this.shift_bool){
        // this.env.chatSocket.convos.datas.shift();
        this.shift_bool = true
      }
  
      
      conversation.unread = false;
        let chatwithid = conversation.user1;
        if(this.env.payload.jti == conversation.user1){
          chatwithid = conversation.user2;
        }else if(conversation.chat_with_id){
          //console.log('reached', conversation)
          chatwithid = conversation.chat_with_id
        }
        /** 
         * decrement the number of unread messages 
         * and set it on storage
         */
        // console.log('pumasok')
        if(this.env.unread_msg['event_'+this.event.id]){
          if(this.env.unread_msg['event_'+this.event.id].convos['convo_'+conversation.id]){
            this.env.unread_msg['event_'+this.event.id].convos['convo_'+conversation.id];
            this.env.unread_msg['event_'+this.event.id].unread_msg_convo--;
  
            // this.env.storage.set('unread_msg', this.env.unread_msg);
            localStorage.setItem('unread_msg', JSON.stringify(this.env.unread_msg));
            // console.log('update unread msg count', this.env.unread_msg);
          }
        }
  
        if(!conversation.userid){
          conversation['userid'] = chatwithid
        }
  
        let obj= {
          my_id: this.env.payload.jti,
          chat_with_id: chatwithid,
          event_id: this.event.id,
          convo: conversation
        }
        console.log('objobj: ', obj)
      localStorage.setItem('convo', JSON.stringify(obj));
      this.initChat(obj);
    }else{
      return false
    }
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

  debounce: any =false
  infiEl: any = null;
  chatWidthIsTyping: boolean = false;
  sendButton: boolean = false;

  convo_with: any;
  
  other_profile: any;
  
  initChat(obj){
    this.convo_with = obj.convo
    this.GetProfile(this.convo_with.userid);
    
    this.reset();
    this.env.push_click_counter = 0;
    
    localStorage.setItem('chatbox_active', JSON.stringify(true));

    this.debounce = this.env.debounce(f => {
      let data = {
        chatWith: obj.chat_with_id,
        event_id: this.event.id
      }
      this.env.chatSocket.emit('stop typing', data);
    }, 1000);

    this.env.chatSocket.on('messages', data => {
      if(!this.env.chatSocket.messages){
        this.sortMessage(data.data);
        console.log('env.chatSocket.messages: ', this.env.chatSocket.messages)
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

      if(!this.convo){
        this.convo = this.env.chatSocket.convo;
      }
      
      // console.log('messages: ', this.env.chatSocket.messages.datas)
    }); 
    

    this.env.chatSocket.removeListener('chat message');
    this.env.chatSocket.on('chat message', data => {


      if( parseInt(data.data.event_id) == parseInt(this.event.id) ){
        // console.log('convo mobile',this.env.chatSocket.convo);
        
        if(!this.convo){
          this.convo = this.env.chatSocket.convo;
        }


        if(data.data.chat_conversation_id == obj.convo.id){
          this.env.chatSocket.messages.datas.push(data.data);

          this.setMessageAsRead(data.data);
        }
      }
    });

    this.env.chatSocket.removeListener('is typing');
    this.env.chatSocket.on('is typing', data => {
      if( parseInt(data.event_id) == parseInt(this.event.id) ){

        if(!this.convo){
          this.convo = this.env.chatSocket.convo;
        }

        if(data.chat_conversation_id == obj.convo.id){
          this.chatWidthIsTyping = true;
        }
      }
    });

    this.env.chatSocket.removeListener('stop typing');
    this.env.chatSocket.on('stop typing', data => {
      this.chatWidthIsTyping = false;
    });

    if(this.token && this.env.devicetoken){
      this.env.chatSocket.setVar('baseUrl', this.env.getUrl(''))
        .setVar('apiToken', this.token)
        .setVar('currentLogedInUserId', this.env.payload.jti)
        .setVar('devicetoken', this.env.devicetoken)
        .setVar('deviceid', this.env.deviceid)
        .setVar('event_id', this.event.id)
        .setVar('chat_with_id', obj.chat_with_id)
        .getConvo();
    }else{
      // this.env.setDeviceToken();
    }
    setTimeout(() =>{
      //your code to be executed after 1 second
      if(this.env.chatSocket.messages && this.env.chatSocket.messages.datas){

        this.scrollbot();
        this.reloader();
        
      }
    }, 500);
  }

  async reloader(){
    let reloader_done = await localStorage.getItem('reloader_done')
    if(reloader_done) return true
    await localStorage.setItem('reloader_done', 'true')
    await window.location.reload();
  }

  /* get profile */
  GetProfile(id){
    this.profile.getDelegateProfile(id).then((data:any) => {
      if(data.error == 0){
        this.other_profile = data.data
        console.log('get profile: ', this.other_profile);
      }else{
        this.other_profile = null
      }
    });
  }


  setMessageAsRead(data: any = null){
    if(parseInt(this.env.payload.jti) != parseInt(data.user_id)){
      let url = this.env.getUrl(Urls.api_chat_setasread);
      url += "?id=" + data.id;
      this.env.http.get<any>(url, this.env.getHttpOptions())
      .subscribe(f => {
        if(this.convo){
          this.convo.unread = false;
        }
      });
    }
  }
  reset(){
    // console.log('reset');
    this.env.chatSocket.removeListener('messages');
    this.env.chatSocket.removeListener('chat message');

    this.env.chatSocket.messages = null;
    this.env.chatSocket.convo = null;
    this.infiEl = null;
  }
    /**
   * for some reason array.sort() not working on mobile device
   * so we have to sort the messages here manually
   */
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
      /**
   * return the specifc divider for date
   * @param calcDay 
   */
  getDivider(calcDay, date){
    let divider = "Today";

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    if(calcDay.difference_in_days > 0){
      let remainingDaysTonextWeek = 7 - calcDay.day_no_in_week2;
      let lastDayOfWeek = remainingDaysTonextWeek + calcDay.date2;
      let firstDayOfWeek = lastDayOfWeek - 6;

      if(calcDay.difference_in_days == 1){
        divider = 'Yesterday';
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

  baseUrl = this.env.getUrl('');
  sending: boolean = false;
  initSend(){
    if(this.messageForm.controls.message_content.value){
      if(this.messageForm.value.message_content.replace(/\s/g, "") != ''){
        this.sending = true
        this.messageToSend = this.messageForm.controls.message_content.value;
        // this.message.push(obj);
        this.messageForm.reset();
        this.sendMessage();
      }else{
      
        this.messageForm.reset();
      }
    }else{
      return false
    }
  }

  /**
   * emit is typing to user
   */
   isTyping (){
     console.log('convo: ', this.convo)
    if(this.env.chatSocket.convo){
      let c = this.env.chatSocket.convo;
      let data = {
        chatWith: c['user'+c.chatWith],
        event_id: this.event.id,
        chat_conversation_id: this.convo.convo && this.convo.convo.id ? this.convo.convo.id : this.convo.id,
      }
  
      this.env.chatSocket.emit('is typing', data);
      // this.debounce();
    }
  }

  temp_convo: any = [];
  first_send: boolean = false;
  sendMessage(){
    console.log('send message: ',this.env.chatSocket.convos)
    // if(this.sendButton){
          if(this.token && this.env.devicetoken){
            if(this.messageToSend.length){
              let param = {
                token: this.token,
                baseUrl: this.baseUrl,
                uripath: '/api/chat/savemessage',
                convo: this.env.chatSocket.convo,
                Devicetoken: this.env.devicetoken,
                Deviceid: this.env.deviceid
              }
              let form = {
                  request_type: 'mobile',
                  senderid: this.env.payload.jti,
                  receiverid: this.convo.chat_with_id,
                  msg: this.messageToSend,
                  convoid: this.env.chatSocket.convo.id,
                  attachmentIds: null,
                  token: this.token
              };
              let _data = {
                form: form,
                param: param,
              }

              this.messageToSend = "";
              this.sendButton = true;
              // let el = document.getElementById('texarea-container');
              // el.innerHTML = "";
              
        console.log('env.chatSocket.messages sinend: ', this.env.chatSocket.messages)
        this.env.chatSocket.on('messages', data => {
          if(!this.env.chatSocket.messages){
            this.sortMessage(data.data);
            console.log('env.chatSocket.messages: ', this.env.chatSocket.messages)
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
    
          if(!this.convo){
            this.convo = this.env.chatSocket.convo;
          }
          
          // console.log('messages: ', this.env.chatSocket.messages.datas)
        }); 
              
              this.env.chatSocket.convos.datas.forEach(element => {
                if(!element.hasOwnProperty('isUnshift')){
                    this.temp_convo.push(element)
                    console.log('c temp cnvo',this.temp_convo);
                }
              });
              //console.log('temp_convo0: ', this.env.chatSocket.convos.datas)
              console.log('c1: ')
            console.log('temp convo: ', this.temp_convo)
              if(this.temp_convo ){
                this.env.chatSocket.convos.datas = this.temp_convo;
                this.temp_convo = []
                if(this.first_send && !this.found){
                  //console.log('mga convo1: ',this.env.chatSocket.convos.datas)
                  // console.log('pumaok111111: ',this.env.chatSocket.convos.datas)
                  let message = 'Creating conversation...'
                  // this.modal.resetModalData('loaderModal');
                  // this.modal.setModalData(message, 'loaderModal')
                  // this.modal.open('loaderModal')
                  this.env.loaderText = message;
                  this.env.spinner.show(this.env.loaderSpinner);
                  setTimeout(() => {
                    this.selectConvo(this.env.chatSocket.convos.datas[0])
                    this.temp_convo = [];
                    this.first_send = false;
                    // this.modal.close('loaderModal')
                    this.env.spinner.hide(this.env.loaderSpinner);
                  }, 5500);
                }
              }
              
              this.env.chatSocket.emit('chat message', _data);
              setInterval(()=>{ 
                this.sending = false;
                
              }, 2500);
            }
            this.scrollbot();

          }else{
            // this.env.setDeviceToken();
          }
    // }
  }
  scrollbot(){
    // console.log('scroll top: ', this.message_container.nativeElement.scrollTop);
    // console.log('scroll hieght: ', this.message_container.nativeElement.scrollHeight);
    // this.message_container.nativeElement.scrollTop = this.message_container.nativeElement.scrollHeight;
    this.message_container.nativeElement.scroll({
      top: this.message_container.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
    // console.log('ducoment: ', document.getElementById('message_container'))
  }


  searchList() {
    this.delegates_page = 1;
    this.search = this.searchForm.value.search;
    this.getDelegateList();
    this.delegate_is_loading = true;
  }

  getDelegateList() {
    this.delegate_is_loading = true;
    let url = Urls.api_delegates_get;
    url += '?event_id=' + this.event.event_id;
    url += '&app_delegate_id=' + this.user.id;

    if (this.limit) {
      url += '&limit=' + this.limit;
    }
    if (this.sort) {
      url += '&sort=' + this.sort;
    }
    if (this.order) {
      url += '&order=' + this.order;
    }
    if (this.delegates_page) {
      url += '&page=' + this.delegates_page;
    }
    if (this.search) {
      url += '&search=' + this.search;
    }
    this.request.get(url).then(response => {
      if (response.error == 0) {
        this.delegate = response['data']['datas'];
        // console.log('delegate sa message',this.delegate)
        this.delegate_is_empty = false;
      }else{
        this.delegate_is_empty = true;
      }
    }).finally(()=>{
      this.delegate_is_loading = false;
    });
  }

  /* for modal messaging search */
  searchListModal(){
    // console.log('sasasa');
    this.modal.open('searchMessaging');
    this.after_init_counter = 0;
  }
  noSpace(){
    if(this.messageForm.value.message_content && this.messageForm.value.message_content.replace(/\s/g, "") != ''){
      return true
    }else{
      return false
    }
  }
  allowNewLine(text){
    return text.replace(/\r\n|\r|\n/g, "<br />");
  }
  viewNewLine(text){
    return text.replace(/\r\n|\r|\n/g, " ");
  }

  reformatTime(dateTime){
    return dateTime.replace(' ', 'T')
  }
}
