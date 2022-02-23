/*
* Install the following plugins
* PDF - npm i jspdf-autotable
* PDF - npm i jspdf
* ICS - npm install -S ics
* npm i file-saver
* npm i @types/node and then open tsconfig.app.json
* add "nodes" in type []
*/

import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RequestsService } from 'src/app/services/http/requests.service';
import { Urls } from 'src/app/lib/urls';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ScrollService } from 'src/app/services/scroll/scroll.service';
import { environment } from 'src/app/lib/environment';
import { ClockService } from 'src/app/services/clock.service';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';

import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
@Component({
  selector: 'app-my-schedule',
  templateUrl: './my-schedule.component.html',
  styleUrls: ['./my-schedule.component.scss'],
  providers: [DatePipe]
})
export class MyScheduleComponent implements OnInit, AfterViewInit , AfterContentInit{

  @ViewChild('widgetsContent', { read: ElementRef }) public widgetsContent: ElementRef<any>;

  user: any;
  event: any;
  event_delegate: any;

  schedules: any = null;
  event_delegate_id: any;
  schedules_isLoaded: boolean = false;

  ongoing_meeting_data: any;
  ongoing_meeting: any = null;
  ongoing_meeting_details: any;
  ongoing_meeting_id: any;

  next_meeting_data: any;
  next_meeting: any = null;
  next_meeting_details: any;
  next_meeting_id: any;

  nowDate: any = null;
  clockService: any = null;

  show_itenerary: boolean = false;
  meetings_itinerary: any = null;
  meeting_itinerary_IsLoaded: boolean = false;
  
  show_meeting_request: boolean = false;
  showReceiveMeeting: boolean = false;
  showSentMeeting: boolean = false;

  receive_request: any;
  receive_request_isLoaded: boolean = false;
  receive_request_total_count = 0;

  sent_request: any;
  sent_request_isLoaded: boolean = false;
  sent_request_total_count = 0;

  meeting_details: any;
  meeting_details_total_count: any = 0;
  meeting_details_isloaded: boolean = false;

  download_pdf: boolean = false;
  download_ics: boolean = false;
  send_pdf: boolean = false;
  send_ics: boolean = false;
  ics_itinerary = [];
  
  zoom_setting: any = null;
  filebase64data: any;
  autoTable_dim = 0;

  openedReceiveMeetting: any;
  openedRequestMeetingSent: any;

  constructor(
    public request: RequestsService,
    public modal : NgxSmartModalService,
    public scroll: ScrollService,
    public env: environment,
    public datePipe: DatePipe,
  ) {
    this.user = JSON.parse(localStorage.getItem('user_profile'));
    this.event = JSON.parse(localStorage.getItem('event'));

    this.clockService = new ClockService();
  }

  scrollRight(){
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft + 400), behavior: 'smooth' });
  }

  scrollLeft() {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft - 400), behavior: 'smooth' });
  }

  ngAfterContentInit(): void {

  }

  ngOnInit(): void {
    
    this.event_delegate = JSON.parse(localStorage.getItem('event_delegate'));
    
    if(this.event_delegate){
      console.log(this.event_delegate);  
      this.clockService = new ClockService();      
      this.clockService.setDateTime(this.event_delegate).startTime();   

      let format = 'y-m-d';
      this.nowDate = this.env.getnowDate(format);
    }
    
    this.getMySchedule();
    this.getMeetingReceive();
    this.getMeetingSent();
    this.getZoomSetting();
    this.getItinerarySchedule();
  }

  ngAfterViewInit() {
    this.modal.getModal('scheduleMeeting').onAnyCloseEvent.subscribe(data => {
      this.getMySchedule();
    });

    this.modal.getModal('rescheduleModal').onAnyCloseEvent.subscribe(data => {
      this.getMySchedule();
    });

    this.modal.getModal('cancelMeetingModal').onAnyCloseEvent.subscribe(data => {
      this.getMySchedule();
    });

    this.modal.getModal('reportNoShow').onAnyCloseEvent.subscribe(data => {
      this.getMySchedule();
    });

    this.modal.getModal('rescheduleModal').onAnyCloseEvent.subscribe(data => {
      this.getMySchedule();
    });
  }

  getTemplateHeigth(val){
    return Math.floor(val);
  }

  date_diff;

  getMySchedule(){

    let event_details = JSON.parse(localStorage.getItem('event'))
    let start = event_details.start_date
    let end = event_details.end_date
    this.date_diff = this.env.datediff(start, end)

    //console.log('ck date diff', date_diff+1);

    let url = Urls.mapi_event_schedule;
    url += '?event_id=' + this.event.id;

    this.request.get(url).then(data=>{
      this.schedules_isLoaded = true;
      if(data.error == 0){
        this.schedules = data.data;
        console.log('schedules: ', this.schedules)
        this.event_delegate_id = data.event_delegate_id;
        localStorage.setItem('event_delegate_id', data.event_delegate_id);
        this.getOngoingMeeting();
      }
    }).finally(()=>{
      this.schedules_isLoaded = true;
      setTimeout(() => {
        this.scroll.updateScroll(document.getElementById('scroll_top'))
      }, 1000);
    });
  }
  
  setMeetingSchedule(timeslot){
    let obj = {
      timeslot: timeslot,
      schedule: this.schedules,
      type: 'physical',

    }
    console.log('objdas', obj);
    this.modal.resetModalData('scheduleMeeting');
    this.modal.setModalData(obj, 'scheduleMeeting')
    this.modal.open('scheduleMeeting')
  }
  
  viewMeetingDetail(timeslot){
    this.clockService = new ClockService();      
    this.clockService.setDateTime(this.event_delegate).startTime();   
    console.log(timeslot);
    if(timeslot.data.meeting_schedule){
      if(
        (timeslot.data.meeting_schedule.status == '1' || timeslot.data.meeting_schedule.status == '3') && 
        (timeslot.data.meeting_schedule.state == 'On-going' || timeslot.data.meeting_schedule.state == 'Upcomming' || timeslot.data.meeting_schedule.state == 'Done')
      ){
        let obj = {
          timeslot: timeslot,
          schedule: this.schedules
        }
        if(timeslot.data.meeting_schedule){
          this.modal.resetModalData('viewMeeting');
          this.modal.setModalData(obj, 'viewMeeting');
          this.modal.open('viewMeeting');
        }
      }
    }
  }
  viewMeetingDetailFinalItinerary(timeslot){
    this.clockService = new ClockService();      
    this.clockService.setDateTime(this.event_delegate).startTime();   
    if(timeslot){

      if(
        (timeslot.status == '1' || timeslot.status == '3')
      ){
        let obj = {
          timeslot: timeslot,
          schedule: this.schedules
        }
        console.log('obj: ', obj);

        if(timeslot){
          this.modal.resetModalData('viewMeeting');
          this.modal.setModalData(obj, 'viewMeeting');
          this.modal.open('viewMeeting');
        }
      }
    }
  }

  toggleTimeslot(ev, schedule){
    this.env.loaderText = 'Blocking the timeslot...';
    if(ev.target.checked){
      this.env.loaderText = 'Enabling the timeslot...';
    }
    this.env.spinner.show(this.env.loaderSpinner);
    
    let formData = new FormData();
    formData.append('status',ev.target.checked);
    formData.append('timeslot_id',schedule.data.id);
    formData.append('event_delegate_id',this.event_delegate_id);
    
    this.request.post(Urls.mapi_timeslot_status, formData).then(data =>{
      this.env.spinner.hide(this.env.loaderSpinner);
      if(data.error == 0){
        this.env.toastr.success(data.message);
      }else{
        this.env.toastr.error('Error.',data.message)
      }
    }).finally(()=>{
      this.getMySchedule()
    });
  }

  /**
  * which scheduled meeting is on going
  */
  getOngoingMeeting(){
    this.schedules.forEach((val, key) => {
      val.filter_date = this.env.getDateFormat(val);

      this.schedules[key] = val;
      
      val.schedules.forEach(sval => {
        if(sval.type === 'timeslot'){
          let ts = sval.data;
          if(ts.meeting_schedule){
            if(ts.meeting_schedule.state == 'On-going' && (ts.meeting_schedule.status == '1' || ts.meeting_schedule.status == '3')){
              this.ongoing_meeting = ts.meeting_schedule;
              this.ongoing_meeting_data = val;
              this.ongoing_meeting_details = ts;
              this.ongoing_meeting_id = this.ongoing_meeting_details.id;

            } else if(ts.meeting_schedule.state == 'Upcomming' && (ts.meeting_schedule.status == '1' || ts.meeting_schedule.status == '3')) {
              if(val.date == this.nowDate){
                if(!this.ongoing_meeting){
                  if(!this.next_meeting){
                    this.next_meeting = ts.meeting_schedule;
                    this.next_meeting_data = val;
                    this.next_meeting_details = ts;
                    this.next_meeting_id = this.next_meeting_details.id;
                  }
                }
              }
            }
          }
        }

        sval.filter_time = sval.data.start_time+' - '+sval.data.end_time;
        sval.candisplay = true;
      });
    });
  }

  /**
  * open a confirmation modal to report as no show
  */
  reporter_delegate_id : any = null;
  reported_delegate_id : any = null;
  reportAsNoshow(day, meeting){
    let obj = {
      day: day,
      meeting: meeting,
    }

    this.modal.resetModalData('reportNoShow');
    this.modal.setModalData(obj, 'reportNoShow');
    this.modal.open('reportNoShow');
  }

  /**
  * open a confirmation modal to cancel report as no show
  */
  cancelRequest(noshow, meeting){
    let obj = {
      noshow: noshow,
      meeting: meeting,
    }

    this.modal.resetModalData('reportNoShow');
    this.modal.setModalData(obj, 'reportNoShow');
    this.modal.open('reportNoShow');
  }



  showMeetingRequest(){
    this.show_meeting_request = !this.show_meeting_request;
  }

  showReceiveMeetingRequest(timeslot, id){
    this.openedReceiveMeetting = id;
    this.showReceiveMeeting = true;
    this.getMeetingDetails(timeslot, 'received', );
  }

  closeReceiveMeetingRequest(){
    this.openedReceiveMeetting = "id";
    this.showReceiveMeeting = false;
    this.meeting_details = null;
    this.meeting_details_total_count = 0;
    this.meeting_details_isloaded = true;
  }

  showRequestMeetingSent(timeslot, id){
    this.openedRequestMeetingSent = id;
    this.showSentMeeting = true;
    this.getMeetingDetails(timeslot, 'sent', );
  }

  closeShowRequestMeetingSent(){
    this.openedRequestMeetingSent = "id";
    this.showSentMeeting = false;
    this.meeting_details = null;
    this.meeting_details_total_count = 0;
    this.meeting_details_isloaded = true;
  }

  getMeetingReceive(){
    let url = Urls.mapi_delegate_meetingrequest;
    url += '?event_id=' + this.event.id;
    url += '&type=received';
    if(this.event && this.event.type == '2'){
      url += '&is_virtual=true';
    }
    this.request.get(url).then(response => {
      this.receive_request_isLoaded = true;
      if(response.error == 0){
        this.receive_request = response.data;
        this.receive_request.forEach(req => {
          if(req.timeslots.length > 0){
            req.timeslots.forEach(tms => {
              if(tms.meeting_schedule_count > 0){
                this.receive_request_total_count++;
              }
            });
          }
        });
      }
    });
  }

  getMeetingSent(){
    let url = Urls.mapi_delegate_meetingrequest;
    url += '?event_id=' + this.event.id;
    url += '&type=sent';
    if(this.event && this.event.type == '2'){
      url += '&is_virtual=true';
    }
    this.request.get(url).then(response =>{
      this.sent_request_isLoaded = true;
      if(response.error == 0){
        this.sent_request = response.data;
        this.sent_request.forEach(sen => {
          if(sen.timeslots.length > 0){
            sen.timeslots.forEach(tms => {
              if(tms.meeting_schedule_count > 0){
                this.sent_request_total_count++;
              }
            });
          }
        });
      }
    });
  }
  
  getMeetingDetails(timeslot, type?){
    this.meeting_details_isloaded = false;

    let url = Urls.mapi_delegate_meetingrequestlist;
    if(timeslot.id){
      url += '?timeslot_id=' + timeslot.id;
    }
    if(type){
      url += '&type=' + type;
    }
    if(timeslot.event_delegate_id){
      url += '&edid=' + timeslot.event_delegate_id;
    }
    url += '&limit=100';
    url += '&page=1';

    this.request.get(url).then(response =>{
      this.meeting_details_isloaded = true;
      if(response.error == 0){
        this.meeting_details = response['data']['datas'];
        this.meeting_details_total_count = response['data']['total_count'];
      }
    })
  }

  /**
  * open a confirmation modal
  */
  async actionRequest(action, meeting, timeslot?) {
    let formData = new FormData();
    let msg;
    let btn_save;
    let title;

    formData.append('meeting_schedule_id', meeting.id);
    formData.append('edid', meeting.ed_id);
    formData.append('action', action);

    if(action == 'accept') {
      msg = 'Are you sure you want to accept <span class="fw-500 capitalize">' + meeting.del_fullname + '</span> meeting request?';
      btn_save = 'Accept request';
      title = 'Accept Meeting Request';
      this.env.loaderText = 'Accept Meeting request ...';

    }else if(action == 'decline') {
      title = 'Decline Meeting Request';
      msg = 'Are you sure you want to decline <span class="fw-500 capitalize">' + meeting.del_fullname+ '</span> meeting request?';
      btn_save = 'Decline request';
      this.env.loaderText = 'Declining Meeting request ...';

    }else if(action == 'cancel') {
      title = 'Cancel Meeting Request';
      msg = 'Are you sure you want to cancel this meeting request?';
      btn_save = 'Cancel request';
      this.env.loaderText = 'Cancelling meeting request ...';
    }
    this.env.spinner.show(this.env.loaderSpinner);

    this.request.post(Urls.mapi_delegate_meetingrequestaction, formData).then(response=>{
      this.env.spinner.hide(this.env.loaderSpinner);
      if(response.error == 0){

        if(action == 'accept') {
          this.env.toastr.success('Successfully Accepted meeting request');
          this.showMeetingRequest();
        }else if(action == 'decline') {
          this.env.toastr.success('Successfully Declined meeting request');
          this.showMeetingRequest();
        }else if(action == 'cancel') {
          this.env.toastr.success('Successfully Cancelled meeting request');
          this.showMeetingRequest();
        }
        timeslot.meeting_schedule_count--;
        let indexOf = this.meeting_details.findIndex(x => x.id == meeting.id);
        this.meeting_details.splice(indexOf, 1);
        this.meeting_details_total_count--;
        if(!this.meeting_details.length){
          this.meeting_details = null;
        }
      }
    });
  }


  showFinalItinerary(ev){
    if(this.show_itenerary){
      this.show_itenerary = false;
    }else{
      this.env.loaderText = 'Show Final Itinerary...';
      this.env.spinner.show(this.env.loaderSpinner);
      this.env.spinner.hide(this.env.loaderSpinner);

      this.show_itenerary = true;
    }
  }

  getItinerarySchedule(){
    this.meeting_itinerary_IsLoaded = false; 
    let formData = {
      event_id: this.event.id,
      delegate_id: this.user.id
    };

    if(this.event.type == 2){
      formData['is_virtual'] = true;
    }

    this.request.post(Urls.api_delegate_meetingitinerary, formData).then(response =>{
      if(response.error == 0){
        this.event_delegate_id = response.event_delegate_id;
        if(response.data){
          this.meeting_itinerary_IsLoaded = true;  

          response.data.forEach(res => {
            let temp_data = []; 
            if(res.data){
              res['meeting_date'] = this.datePipe.transform(res.date, 'MMM d, y');
              res.data.forEach((res1, key) => {

                if(res1.start_time_delegate){
                  res1['start_time_delegate'] = res1['start_time_delegate'].replace(" ", "T");
                }
                if(res1.end_time_delegate){
                  res1['end_time_delegate'] = res1['end_time_delegate'].replace(" ", "T");
                }
                let temp_arr = [];
                res1['meeting_time'] = this.datePipe.transform(res1.start_time_delegate, 'h:mm a') +' - '+this.datePipe.transform(res1.end_time_delegate, 'h:mm a');
                res1['other_delegate_fullname'] = this.event_delegate_id == res1.d1_id ? res1.d2_fullname : res1.d1_fullname;
                res1['other_delegate_company'] = this.event_delegate_id == res1.d1_id ? res1.d2_company_name : res1.d1_company_name;
                res1['other_delegate_jobtitle'] = this.event_delegate_id == res1.d1_id ? res1.d2_job_title : res1.d1_job_title;
                if(this.event.type == 1){
                  if(res1.table_type == 3){
                    res1['table'] = 'Table '+res1.table_table_no;
                  }else if(res1.table_type == 2){
                    res1['table'] = 'Booth '+res1.table_table_no;
                  }else if(res1.table_type == 1){
                    res1['table'] = 'VIP '+res1.table_table_no;
                  }
                }else{
                  res1['zoom_email_address'] = this.event_delegate_id == res1.d1_id ? res1.d2_social_media_links.zoom : res1.d1_social_media_links.zoom;
                  if(this.zoom_setting.status == '1'){
                    let url = this.env.getUrl(Urls.api_virtualconference_shortenurl);
                    if(this.user.email == res1.d1_email){
                      // res1['meeting_link'] = res1.zoom_meeting_link_1;
                      let type = "s"; //start
                      url += '?t=' + type;
                      url += '&c=' + res1.zoom_id;
                      res1['meeting_link'] = url;
                    }else{
                      //res1['meeting_link'] = res1.zoom_meeting_link_2;
                      let type = "j";
                      url += '?t=' + type;
                      url += '&c=' + res1.zoom_id;
                      res1['meeting_link'] = url;
                    }
                  }
                }
                temp_arr.push(this.datePipe.transform(res1.start_time_delegate, 'h:mm a') +' - '+this.datePipe.transform(res1.end_time_delegate, 'h:mm a'));
                temp_arr.push(this.event_delegate_id == res1.d1_id ? res1.d2_fullname : res1.d1_fullname);
                temp_arr.push(this.event_delegate_id == res1.d1_id ? res1.d2_company_name : res1.d1_company_name);
                temp_arr.push(this.event_delegate_id == res1.d1_id ? res1.d2_job_title : res1.d1_job_title);
                if(this.event.type == 1){
                  if(res1.table_type == 3){
                    temp_arr.push('Table '+res1.table_table_no);
                  }else if(res1.table_type == 2){
                    temp_arr.push('Booth '+res1.table_table_no);
                  }else if(res1.table_type == 1){
                    temp_arr.push('VIP '+res1.table_table_no);
                  }
                }else{
                  temp_arr.push(this.event_delegate_id == res1.d1_id ? res1.d2_social_media_links.zoom : res1.d1_social_media_links.zoom);
                  if(this.zoom_setting.status == '1'){
                    let url = this.env.getUrl(Urls.api_virtualconference_shortenurl);
                    if(this.user.email == res1.d1_email){
                      // res1['meeting_link'] = res1.zoom_meeting_link_1;
                      let type = "s"; //start
                      url += '?t=' + type;
                      url += '&c=' + res1.zoom_id;
                      temp_arr.push(url);
                    }else{
                      //res1['meeting_link'] = res1.zoom_meeting_link_2;
                      let type = "j";
                      url += '?t=' + type;
                      url += '&c=' + res1.zoom_id;
                      temp_arr.push(url);
                    }
                  }
                }

                temp_data.push(temp_arr);
              });
              res['meeting_data'] = temp_data;
            }
          });
          this.meetings_itinerary = response.data;
          console.log('meetings_itinerary', this.meetings_itinerary);
        }
      }
    });
  }

  getZoomSetting(){
    this.request.get(Urls.api_virtualconference_getzoomsettings).then(response =>{
      if(response.error == 0){
        this.zoom_setting = response.data;
      }
    });
  }

  downloadItineray(){
    console.log('d pdf', this.download_pdf);
    console.log('d ics', this.download_ics);
    
    if(this.download_pdf){
      this.downloadPDF(this.meetings_itinerary);
    }
    if(this.download_ics){
      this.downloadICS();
    }

    this.download_pdf = false;
    this.download_ics = false;
  }

  sendItineray(){
    console.log('s pdf', this.send_pdf);
    console.log('s ics', this.send_ics);

    if(this.send_pdf && this.send_ics){
      this.sendMultipleFile(this.meetings_itinerary);
    }else{
      if(this.send_pdf){
        this.sendPDF(this.meetings_itinerary);
      }
      if(this.send_ics){
        this.sendICS();
      }
    }
    this.env.toastr.success('Your final itinerary has been sent. Please check your mail.');
    this.send_pdf = false;
    this.send_ics = false;
  }

  /* 
  * Send PDF Itinerary to User Email
  * Print filtered meeting scheduled list 
  */
  protected sendPDF(data){
    let a = this;

    let doc;
    if(a.event.type == 1){
      doc = new jsPDF.default();
    }else{
      doc = new jsPDF.default({
        orientation: "landscape"
      });
    }

    doc.setTextColor(40);
    //doc.setFontStyle('normal');
    doc.setFontSize(13);

    let file_name = a.event.name + " : " + a.user.fullname + "'s meeting schedules ";
  
    let letter_head = "/assets/images/f2f_logo.png";
    a.env.toDataURL(letter_head, function(dataUrl){
      let headerTitle = file_name;

      let headerY = 20;
      if(letter_head){
        // addImage(imageData, format, x, y, width, height, alias, compression, rotation)
        doc.addImage(dataUrl, 'PNG', 15, 15, 45, 10, '', 'FAST');
        headerY = headerY + 15;
      }
      // text(text, x, y, optionsopt, transform)
      doc.text(headerTitle, 15, headerY, {maxWidth: 180});

      let headerTitle_dim = doc.getTextDimensions(headerTitle);
      let splitTitle = doc.splitTextToSize(headerTitle, 180, {fontSize:13});
      let headerTitle_height = (headerTitle_dim.h * splitTitle.length) + 2;  

      doc.setFontSize(11);
      doc.text(a.event.event_date, 15, headerTitle_height + headerY, {maxWidth: 180});
      
      let eventDate_dim = doc.getTextDimensions(a.event.event_date);
      let spliteventDate = doc.splitTextToSize(a.event.event_address,180,{fontSize:10});
      a.autoTable_dim = (eventDate_dim.h * spliteventDate.length) + headerTitle_height + headerY + 1; 

      data.forEach(element => {
        if(element.data){
          let rows = element.data;
          if(element.data){

            if(a.event.type == 1){
              autoTable(doc,
                {
                  theme: 'striped',
                  columnStyles: { 
                    europe: { halign: 'center' },
                    0: {  
                      cellWidth: 30,
                      fontSize: 8
                    },
                    1: {  
                      cellWidth: 35,  
                      fontSize: 8
                    },
                    2: {  
                      cellWidth: 50,  
                      fontSize: 8
                    },
                    3: {  
                      cellWidth: 48,  
                      fontSize: 8
                    },
                    4: {  
                      cellWidth: 18,  
                      fontSize: 8
                    },
                  },
                  head: [
                    [{ content: element.meeting_date, colSpan: 6, styles: { halign: 'center', fillColor: [104, 139, 6], textColor: [256, 256, 256] } }],
                    [
                      { content: 'Meeting time'},
                      { content: 'Delegate Name'},
                      { content: 'Company'},
                      { content: 'Position'},
                      { content: 'Table No'},
                    ]
                  ],
                  body: element.meeting_data,
                  margin: { top: a.autoTable_dim },
                  styles: { 
                    fillColor: [204, 204, 204], 
                    textColor: [68, 68, 68]
                  },
                }
              );
            }else{
              if(a.zoom_setting.status == '1'){
                autoTable(doc,
                  {
                    theme: 'striped',
                    columnStyles: { 
                      europe: { halign: 'center' },
                      0: {  
                        cellWidth: 30,
                        fontSize: 8
                      },
                      1: {  
                        cellWidth: 35,  
                        fontSize: 8
                      },
                      2: {  
                        cellWidth: 50,  
                        fontSize: 8
                      },
                      3: {  
                        cellWidth: 40,  
                        fontSize: 8
                      },
                      4: {  
                        cellWidth: 50,  
                        fontSize: 8
                      },
                      5: {   
                        fontSize: 8
                      }
                    },
                    head: [
                      [{ content: element.meeting_date, colSpan: 6, styles: { halign: 'center', fillColor: [104, 139, 6], textColor: [256, 256, 256] } }],
                      [
                        { content: 'Meeting time'},
                        { content: 'Delegate Name'},
                        { content: 'Company'},
                        { content: 'Position'},
                        { content: 'Zoom Email Address Id'},
                        { content: 'Zoom Meeting URL', styles: { cellWidth: 'wrap'}},
                      ]
                    ],
                    body: element.meeting_data,
                    margin: { top: a.autoTable_dim },
                    styles: { fillColor: [204, 204, 204], textColor: [68, 68, 68] },
                  }
                );
              }else{
                autoTable(doc,
                  {
                    theme: 'striped',
                    columnStyles: { 
                      europe: { halign: 'center' },
                      0: {  
                        cellWidth: 30,
                        fontSize: 8
                      },
                      1: {  
                        cellWidth: 45,  
                        fontSize: 8
                      },
                      2: {  
                        cellWidth: 65,  
                        fontSize: 8
                      },
                      3: {  
                        cellWidth: 70,  
                        fontSize: 8
                      },
                      4: {  
                        cellWidth: 45,  
                        fontSize: 8
                      },
                    },
                    head: [
                      [{ content: element.meeting_date, colSpan: 6, styles: { halign: 'center', fillColor: [104, 139, 6], textColor: [256, 256, 256] } }],
                      [
                        { content: 'Meeting time'},
                        { content: 'Delegate Name'},
                        { content: 'Company'},
                        { content: 'Position'},
                        { content: 'Zoom Email Address Id'}
                      ]
                    ],
                    body: element.meeting_data,
                    margin: { top: a.autoTable_dim },
                    styles: { fillColor: [204, 204, 204], textColor: [68, 68, 68] },
                  }
                );
              }
            }
          }
        }
      });

      var fileBlob = doc.output('blob');
      var reader = new FileReader();

      reader.readAsDataURL(fileBlob); 
      reader.onloadend = function() { // for blob to base64
        a.filebase64data = reader.result; 
        if(a.filebase64data){
          let formData = new FormData();
          formData.append('file_name', file_name);
          formData.append('file', fileBlob);
          formData.append('b64_file', a.filebase64data);
          formData.append('event_name', a.event.name);
          formData.append('delegate_email', a.user.email);
      
          a.request.post(Urls.api_delegates_senditineraries, formData).subscribe(send =>{
            if(send.error == 0){

            }
          });
        }
      }
    });
  }

  /* 
  * Send ICS/Ical Itinerary to User Email
  * Print filtered meeting scheduled list 
  */
  async sendICS(){
    const ics = require('ics');
    let a = this;
    
    this.meetings_itinerary.forEach((meeting) => {
      if(meeting.data){
        meeting.data.forEach((data) => {
          if(data){
            let yr = parseInt(this.datePipe.transform(data.start_time_delegate, 'yyyy'));
            let mon = parseInt(this.datePipe.transform(data.start_time_delegate, 'M'));
            let date = parseInt(this.datePipe.transform(data.start_time_delegate, 'd'));
            let hr = parseInt(this.datePipe.transform(data.start_time_delegate, 'H'));
            let min = parseInt(this.datePipe.transform(data.start_time_delegate, 'm'));

            let e_yr = parseInt(this.datePipe.transform(data.end_time_delegate, 'yyyy'));
            let e_mon = parseInt(this.datePipe.transform(data.end_time_delegate, 'M'));
            let e_date = parseInt(this.datePipe.transform(data.end_time_delegate, 'd'));
            let e_hr = parseInt(this.datePipe.transform(data.end_time_delegate, 'H'));
            let e_min = parseInt(this.datePipe.transform(data.end_time_delegate, 'm'));

            // start: [2018, 1, 15, 12, 15],
            // Year, Month, Date, HH, MM
  
            let title = '';
            if(this.event_delegate_id == data.d1_id){
              title = 'Face2face Meeting with '+ data.d2_fullname;
            }else{
              title = 'Face2face Meeting with '+ data.d1_fullname;
            }

            let temp_itinerary;
            if(this.event.type == 1){
              temp_itinerary = {
                title: title,
                start: [yr, mon, date, hr, min],
                end: [e_yr, e_mon, e_date, e_hr, e_min],
                // duration: { minutes: parseInt(data.timeslot_interval) }
              };
            }else{
              temp_itinerary = {
                title: title,
                start: [yr, mon, date, hr, min],
                end: [e_yr, e_mon, e_date, e_hr, e_min],
                // duration: { minutes: parseInt(data.timeslot_interval) },
              };

              if(this.zoom_setting.status == '1'){
                if(this.user.email == data.d1_email){
                  //start
                  temp_itinerary['url'] = data.zoom_meeting_link_1;
                  temp_itinerary['description'] = 'This serves as your Zoom Meeting Link '+ data.zoom_meeting_link_1;
                }else{
                  //join
                  temp_itinerary['url'] = data.zoom_meeting_link_2;
                  temp_itinerary['description'] = 'This serves as your Zoom Meeting Link '+ data.zoom_meeting_link_2;
                }
              }
            }

            if(this.event_delegate_id == data.d1_id){
              temp_itinerary['attendees'] = [{ 
                name: data.d2_fullname, 
                email: data.d2_email, 
                rsvp: true, 
                partstat: 'ACCEPTED', 
                role: data.d2_job_title 
              }]
            }else{
              temp_itinerary['attendees'] = [{ 
                name: data.d1_fullname, 
                email: data.d1_email, 
                rsvp: true, 
                partstat: 'ACCEPTED', 
                role: data.d1_job_title 
              }]
            }

            this.ics_itinerary.push(temp_itinerary);
  
            // const { error, value } = ics.createEvents([
            //   {
            //     title: 'Lunch',
            //     start: [2018, 1, 15, 12, 15],
            //     duration: { minutes: 45 }
            //   },
            //   {
            //     title: 'Dinner',
            //     start: [2018, 1, 15, 12, 15],
            //     duration: { hours: 1, minutes: 30 }
            //   }
            // ]);
          }
        });
      }
    });

    if(this.ics_itinerary){
      const { error, value } = ics.createEvents(this.ics_itinerary);

      let fileName = this.event.name+' Final Itinerary';

      var file = new File([value], fileName+".ics", {type: "text/calendar;charset=utf-8"});
      var blob = new Blob([value], { type: "text/calendar;charset=utf-8" });

      //saveAs.saveAs(file);
      let formData = new FormData();
      formData.append('file_name', fileName);
      formData.append('file', blob);
      formData.append('b64_file', value);
      formData.append('event_name', this.event.name);
      formData.append('file_type', 'ics');
      formData.append('delegate_email', this.user.email);
  
      a.request.post(Urls.api_delegates_senditineraries, formData).subscribe(send =>{
        if(send.error == 0){

        }
      });
    }
  }  

  /* 
  * Download PDF Itinerary
  * Print filtered meeting scheduled list 
  */
  downloadPDF(data){
    let a = this;

    let doc;
    if(a.event.type == 1){
      doc = new jsPDF.default();
    }else{
      doc = new jsPDF.default({
        orientation: "landscape"
      });
    }
    
    doc.setTextColor(40);
    //doc.setFontStyle('normal');
    doc.setFontSize(13);

    let file_name = a.event.name + " : " + a.user.fullname + "'s meeting schedules ";
  
    let letter_head = "/assets/images/f2f_logo.png";
    a.env.toDataURL(letter_head, async function(dataUrl){
      let headerTitle = file_name;

      let headerY = 20;
      if(letter_head){
        // addImage(imageData, format, x, y, width, height, alias, compression, rotation)
        doc.addImage(dataUrl, 'PNG', 15, 15, 45, 10, '', 'FAST');
        headerY = headerY + 15;
      }
      // text(text, x, y, optionsopt, transform)
      doc.text(headerTitle, 15, headerY, {maxWidth: 180});

      let headerTitle_dim = doc.getTextDimensions(headerTitle);
      let splitTitle = doc.splitTextToSize(headerTitle, 180, {fontSize:13});
      let headerTitle_height = (headerTitle_dim.h * splitTitle.length) + 2;  
      doc.setFontSize(11);
      doc.text(a.event.event_date, 15, headerTitle_height + headerY, {maxWidth: 180});
      
      let eventDate_dim = doc.getTextDimensions(a.event.event_date);
      let spliteventDate = doc.splitTextToSize(a.event.event_address,180,{fontSize:10});
      a.autoTable_dim = (eventDate_dim.h * spliteventDate.length) + headerTitle_height + headerY + 1; 

      data.forEach(element => {
        if(element.data){
          let rows = element.data;
          if(element.data){
            if(a.event.type == 1){
              autoTable(doc,
                {
                  theme: 'striped',
                  tableWidth: 'auto',
                  columnStyles: { 
                    europe: { halign: 'center' },
                    0: {  
                      cellWidth: 30,
                      fontSize: 8
                    },
                    1: {  
                      cellWidth: 35,  
                      fontSize: 8
                    },
                    2: {  
                      cellWidth: 50,  
                      fontSize: 8
                    },
                    3: {  
                      cellWidth: 48,  
                      fontSize: 8
                    },
                    4: {  
                      cellWidth: 18,  
                      fontSize: 8
                    },
                  },
                  head: [
                    [{ content: element.meeting_date, colSpan: 6, styles: { halign: 'center', fillColor: [104, 139, 6], textColor: [256, 256, 256] } }],
                    [
                      {content: 'Meeting time'},
                      {content: 'Delegate Name'},
                      {content: 'Company'},
                      {content: 'Position'},
                      {content: 'Table No'},
                    ]
                  ],
                  body: element.meeting_data,
                  margin: { top: a.autoTable_dim },
                  styles: { fillColor: [204, 204, 204], textColor: [68, 68, 68] },
                }
              );
            }else{
              if(a.zoom_setting.status == '1'){
                autoTable(doc,
                  {
                    theme: 'striped',
                    columnStyles: { 
                      europe: { halign: 'center' },
                      0: {  
                        cellWidth: 30,
                        fontSize: 8
                      },
                      1: {  
                        cellWidth: 35,  
                        fontSize: 8
                      },
                      2: {  
                        cellWidth: 50,  
                        fontSize: 8
                      },
                      3: {  
                        cellWidth: 40,  
                        fontSize: 8
                      },
                      4: {  
                        cellWidth: 50,  
                        fontSize: 8
                      },
                      5: {   
                        fontSize: 8
                      }
                    },
                    head: [
                      [{ content: element.meeting_date, colSpan: 6, styles: { halign: 'center', fillColor: [104, 139, 6], textColor: [256, 256, 256] } }],
                      [
                        { content: 'Meeting time'},
                        { content: 'Delegate Name'},
                        { content: 'Company'},
                        { content: 'Position'},
                        { content: 'Zoom Email Address Id'},
                        { content: 'Zoom Meeting URL', styles: { cellWidth: 'wrap'}},
                      ]
                    ],
                    body: element.meeting_data,
                    margin: { top: a.autoTable_dim },
                    styles: { fillColor: [204, 204, 204], textColor: [68, 68, 68] },
                  }
                );
              }else{
                autoTable(doc,
                  {
                    theme: 'striped',
                    columnStyles: { 
                      europe: { halign: 'center' },
                      0: {  
                        cellWidth: 30,
                        fontSize: 8
                      },
                      1: {  
                        cellWidth: 45,  
                        fontSize: 8
                      },
                      2: {  
                        cellWidth: 65,  
                        fontSize: 8
                      },
                      3: {  
                        cellWidth: 70,  
                        fontSize: 8
                      },
                      4: {  
                        cellWidth: 45,  
                        fontSize: 8
                      },
                    },
                    head: [
                      [{ content: element.meeting_date, colSpan: 6, styles: { halign: 'center', fillColor: [104, 139, 6], textColor: [256, 256, 256] } }],
                      [
                        { content: 'Meeting time'},
                        { content: 'Delegate Name'},
                        { content: 'Company'},
                        { content: 'Position'},
                        { content: 'Zoom Email Address Id'}
                      ]
                    ],
                    body: element.meeting_data,
                    margin: { top: a.autoTable_dim },
                    styles: { fillColor: [204, 204, 204], textColor: [68, 68, 68] },
                  }
                );
              }
            } 
          }
        }
      });

      var fileBlob = doc.output('blob');
      var reader = new FileReader();

      console.log('broweser')
      doc.save(a.event.name + ":" + a.user.fullname + "'s Final Itinerary.pdf");
      this.env.toastr.success(a.event.name + ":" + a.user.fullname + "'s Final Itinerary has been downloaded");
    });
  }

  /* 
  * Download ICS/Ical Itinerary
  * Print filtered meeting scheduled list 
  */
  async downloadICS(){
    const ics = require('ics');

    this.meetings_itinerary.forEach((meeting) => {
      console.log('meeting.data',meeting.data);
      if(meeting.data){
        meeting.data.forEach((data) => {
          if(data){
            let yr = parseInt(this.datePipe.transform(data.start_time_delegate, 'yyyy'));
            let mon = parseInt(this.datePipe.transform(data.start_time_delegate, 'M'));
            let date = parseInt(this.datePipe.transform(data.start_time_delegate, 'd'));
            let hr = parseInt(this.datePipe.transform(data.start_time_delegate, 'H'));
            let min = parseInt(this.datePipe.transform(data.start_time_delegate, 'm'));

            let e_yr = parseInt(this.datePipe.transform(data.end_time_delegate, 'yyyy'));
            let e_mon = parseInt(this.datePipe.transform(data.end_time_delegate, 'M'));
            let e_date = parseInt(this.datePipe.transform(data.end_time_delegate, 'd'));
            let e_hr = parseInt(this.datePipe.transform(data.end_time_delegate, 'H'));
            let e_min = parseInt(this.datePipe.transform(data.end_time_delegate, 'm'));

            // start: [2018, 1, 15, 12, 15],
            // Year, Month, Date, HH, MM
  
            let title = '';
            if(this.event_delegate_id == data.d1_id){
              title = 'Face2face Meeting with '+ data.d2_fullname;
            }else{
              title = 'Face2face Meeting with '+ data.d1_fullname;
            }

            let temp_itinerary;
            if(this.event.type == 1){
              temp_itinerary = {
                title: title,
                start: [yr, mon, date, hr, min],
                end: [e_yr, e_mon, e_date, e_hr, e_min],
                // duration: { minutes: parseInt(data.timeslot_interval) }
              };
            }else{
              temp_itinerary = {
                title: title,
                start: [yr, mon, date, hr, min],
                end: [e_yr, e_mon, e_date, e_hr, e_min],
                // duration: { minutes: parseInt(data.timeslot_interval) },
              };

              if(this.zoom_setting.status == '1'){
                if(this.user.email == data.d1_email){
                  //start
                  temp_itinerary['url'] = data.zoom_meeting_link_1;
                  temp_itinerary['description'] = 'This serves as your Zoom Meeting Link '+ data.zoom_meeting_link_1;
                }else{
                  //join
                  temp_itinerary['url'] = data.zoom_meeting_link_2;
                  temp_itinerary['description'] = 'This serves as your Zoom Meeting Link '+ data.zoom_meeting_link_2;
                }
              }
            }

            if(this.event_delegate_id == data.d1_id){
              temp_itinerary['attendees'] = [{ 
                name: data.d2_fullname, 
                email: data.d2_email, 
                rsvp: true, 
                partstat: 'ACCEPTED', 
                role: data.d2_job_title 
              }]
            }else{
              temp_itinerary['attendees'] = [{ 
                name: data.d1_fullname, 
                email: data.d1_email, 
                rsvp: true, 
                partstat: 'ACCEPTED', 
                role: data.d1_job_title 
              }]
            }

            // const event = {
            //   start: [2018, 5, 30, 6, 30],
            //   duration: { hours: 6, minutes: 30 },
            //   title: 'Bolder Boulder',
            //   description: 'Annual 10-kilometer run in Boulder, Colorado',
            //   location: 'Folsom Field, University of Colorado (finish line)',
            //   url: 'http://www.bolderboulder.com/',
            //   geo: { lat: 40.0095, lon: 105.2669 },
            //   categories: ['10k races', 'Memorial Day Weekend', 'Boulder CO'],
            //   status: 'CONFIRMED',
            //   busyStatus: 'BUSY',
            //   organizer: { name: 'Admin', email: 'Race@BolderBOULDER.com' },
            //   attendees: [
            //     { name: 'Adam Gibbons', email: 'adam@example.com', rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
            //     { name: 'Brittany Seaton', email: 'brittany@example2.org', dir: 'https://linkedin.com/in/brittanyseaton', role: 'OPT-PARTICIPANT' }
            //   ]
            // }

            this.ics_itinerary.push(temp_itinerary);
  
            // const { error, value } = ics.createEvents([
            //   {
            //     title: 'Lunch',
            //     start: [2018, 1, 15, 12, 15],
            //     duration: { minutes: 45 }
            //   },
            //   {
            //     title: 'Dinner',
            //     start: [2018, 1, 15, 12, 15],
            //     duration: { hours: 1, minutes: 30 }
            //   }
            // ]);
          }
        });
      }
    });

    if(this.ics_itinerary){
      const { error, value } = ics.createEvents(this.ics_itinerary);

      console.log('value rhan', value);
      let fileName = this.event.name+' Final Itinerary';

      console.log('broweser')
      var file = new File([value], this.env.rmSpace(fileName+".ics"), {type: "text/calendar;charset=utf-8"});
      saveAs.saveAs(file);
      this.env.toastr.success(this.event.name + "_" + this.user.fullname + "'s Final Itinerary has been downloaded");
    }
  }

  /* 
  * This will send email of both PDF and Ical Final Itineray
  * Print filtered meeting scheduled list 
  */
  protected sendMultipleFile(data){
    let a = this;

    let doc;
    if(a.event.type == 1){
      doc = new jsPDF.default();
    }else{
      doc = new jsPDF.default({
        orientation: "landscape"
      });
    }
    
    doc.setTextColor(40);
    //doc.setFontStyle('normal');
    doc.setFontSize(13);

    let file_name = a.event.name + " : " + a.user.fullname + "'s meeting schedules ";
  
    let letter_head = "/assets/images/f2f_logo.png";
    a.env.toDataURL(letter_head, function(dataUrl){
      let headerTitle = file_name;

      let headerY = 20;
      if(letter_head){
        // addImage(imageData, format, x, y, width, height, alias, compression, rotation)
        doc.addImage(dataUrl, 'PNG', 15, 15, 45, 10, '', 'FAST');
        headerY = headerY + 15;
      }
      // text(text, x, y, optionsopt, transform)
      doc.text(headerTitle, 15, headerY, {maxWidth: 180});

      let headerTitle_dim = doc.getTextDimensions(headerTitle);
      let splitTitle = doc.splitTextToSize(headerTitle, 180, {fontSize:13});
      let headerTitle_height = (headerTitle_dim.h * splitTitle.length) + 2;  
      doc.setFontSize(11);
      doc.text(a.event.event_date, 15, headerTitle_height + headerY, {maxWidth: 180});
      
      let eventDate_dim = doc.getTextDimensions(a.event.event_date);
      let spliteventDate = doc.splitTextToSize(a.event.event_address,180,{fontSize:10});
      a.autoTable_dim = (eventDate_dim.h * spliteventDate.length) + headerTitle_height + headerY + 1; 

      data.forEach(element => {
        if(element.data){
          let rows = element.data;
          if(element.data){
            if(a.event.type == 1){
              autoTable(doc,
                {
                  theme: 'striped',
                  columnStyles: { 
                    europe: { halign: 'center' },
                    0: {  
                      cellWidth: 30,
                      fontSize: 8
                    },
                    1: {  
                      cellWidth: 35,  
                      fontSize: 8
                    },
                    2: {  
                      cellWidth: 50,  
                      fontSize: 8
                    },
                    3: {  
                      cellWidth: 48,  
                      fontSize: 8
                    },
                    4: {  
                      cellWidth: 18,  
                      fontSize: 8
                    },
                  },
                  head: [
                    [{ content: element.meeting_date, colSpan: 6, styles: { halign: 'center', fillColor: [104, 139, 6], textColor: [256, 256, 256] } }],
                    [
                      {content: 'Meeting time'},
                      {content: 'Delegate Name'},
                      {content: 'Company'},
                      {content: 'Position'},
                      {content: 'Table No'},
                    ]
                  ],
                  body: element.meeting_data,
                  margin: { top: a.autoTable_dim },
                  styles: { fillColor: [204, 204, 204], textColor: [68, 68, 68] },
                }
              );
            }else{
              if(a.zoom_setting.status == '1'){
                autoTable(doc,
                  {
                    theme: 'striped',
                    columnStyles: { 
                      europe: { halign: 'center' },
                      0: {  
                        cellWidth: 30,
                        fontSize: 8
                      },
                      1: {  
                        cellWidth: 35,  
                        fontSize: 8
                      },
                      2: {  
                        cellWidth: 50,  
                        fontSize: 8
                      },
                      3: {  
                        cellWidth: 40,  
                        fontSize: 8
                      },
                      4: {  
                        cellWidth: 50,  
                        fontSize: 8
                      },
                      5: {   
                        fontSize: 8
                      }
                    },
                    head: [
                      [{ content: element.meeting_date, colSpan: 6, styles: { halign: 'center', fillColor: [104, 139, 6], textColor: [256, 256, 256] } }],
                      [
                        { content: 'Meeting time'},
                        { content: 'Delegate Name'},
                        { content: 'Company'},
                        { content: 'Position'},
                        { content: 'Zoom Email Address Id'},
                        { content: 'Zoom Meeting URL', styles: { cellWidth: 'wrap'}},
                      ]
                    ],
                    body: element.meeting_data,
                    margin: { top: a.autoTable_dim },
                    styles: { fillColor: [204, 204, 204], textColor: [68, 68, 68] },
                  }
                );
              }else{
                autoTable(doc,
                  {
                    theme: 'striped',
                    columnStyles: { 
                      europe: { halign: 'center' },
                      0: {  
                        cellWidth: 30,
                        fontSize: 8
                      },
                      1: {  
                        cellWidth: 45,  
                        fontSize: 8
                      },
                      2: {  
                        cellWidth: 65,  
                        fontSize: 8
                      },
                      3: {  
                        cellWidth: 70,  
                        fontSize: 8
                      },
                      4: {  
                        cellWidth: 45,  
                        fontSize: 8
                      },
                    },
                    head: [
                      [{ content: element.meeting_date, colSpan: 6, styles: { halign: 'center', fillColor: [104, 139, 6], textColor: [256, 256, 256] } }],
                      [
                        { content: 'Meeting time'},
                        { content: 'Delegate Name'},
                        { content: 'Company'},
                        { content: 'Position'},
                        { content: 'Zoom Email Address Id'}
                      ]
                    ],
                    body: element.meeting_data,
                    margin: { top: a.autoTable_dim },
                    styles: { fillColor: [204, 204, 204], textColor: [68, 68, 68] },
                  }
                );
              }
            }
          }
        }
      });

      var fileBlob = doc.output('blob');
      var reader = new FileReader();

      reader.readAsDataURL(fileBlob); 
      reader.onloadend = function() { // for blob to base64
        a.filebase64data = reader.result; 
        if(a.filebase64data){
          let formData = new FormData();

          const ics = require('ics')
    
          a.meetings_itinerary.forEach((meeting) => {
            if(meeting.data){
              meeting.data.forEach((data) => {
                if(data){
                  let yr = parseInt(a.datePipe.transform(data.start_time_delegate, 'yyyy'));
                  let mon = parseInt(a.datePipe.transform(data.start_time_delegate, 'M'));
                  let date = parseInt(a.datePipe.transform(data.start_time_delegate, 'd'));
                  let hr = parseInt(a.datePipe.transform(data.start_time_delegate, 'H'));
                  let min = parseInt(a.datePipe.transform(data.start_time_delegate, 'm'));

                  let e_yr = parseInt(a.datePipe.transform(data.end_time_delegate, 'yyyy'));
                  let e_mon = parseInt(a.datePipe.transform(data.end_time_delegate, 'M'));
                  let e_date = parseInt(a.datePipe.transform(data.end_time_delegate, 'd'));
                  let e_hr = parseInt(a.datePipe.transform(data.end_time_delegate, 'H'));
                  let e_min = parseInt(a.datePipe.transform(data.end_time_delegate, 'm'));
      
                  // start: [2018, 1, 15, 12, 15],
                  // Year, Month, Date, HH, MM
        
                  let title = '';
                  if(a.event_delegate_id == data.d1_id){
                    title = 'Face2face Meeting with '+ data.d2_fullname;
                  }else{
                    title = 'Face2face Meeting with '+ data.d1_fullname;
                  }
      
                  let temp_itinerary;
                  if(a.event.type == 1){
                    temp_itinerary = {
                      title: title,
                      start: [yr, mon, date, hr, min],
                      end: [e_yr, e_mon, e_date, e_hr, e_min],
                      // duration: { minutes: parseInt(data.timeslot_interval) }
                    };
                  }else{
                    temp_itinerary = {
                      title: title,
                      start: [yr, mon, date, hr, min],
                      end: [e_yr, e_mon, e_date, e_hr, e_min],
                      // duration: { minutes: parseInt(data.timeslot_interval) },
                    };

                    if(a.zoom_setting.status == '1'){
                      if(a.user.email == data.d1_email){
                        //start
                        temp_itinerary['url'] = data.zoom_meeting_link_1;
                        temp_itinerary['description'] = 'This serves as your Zoom Meeting Link '+ data.zoom_meeting_link_1;
                      }else{
                        //join
                        temp_itinerary['url'] = data.zoom_meeting_link_2;
                        temp_itinerary['description'] = 'This serves as your Zoom Meeting Link '+ data.zoom_meeting_link_2;
                      }
                    }
                  }

                  if(a.event_delegate_id == data.d1_id){
                    temp_itinerary['attendees'] = [{ 
                      name: data.d2_fullname, 
                      email: data.d2_email, 
                      rsvp: true, 
                      partstat: 'ACCEPTED', 
                      role: data.d2_job_title 
                    }]
                  }else{
                    temp_itinerary['attendees'] = [{ 
                      name: data.d1_fullname, 
                      email: data.d1_email, 
                      rsvp: true, 
                      partstat: 'ACCEPTED', 
                      role: data.d1_job_title 
                    }]
                  }
      
                  a.ics_itinerary.push(temp_itinerary);
                }
              });
            }
          });

          formData.append('pdf_file_name', file_name);
          formData.append('pdf_file', fileBlob);
          formData.append('pdf_b64_file', a.filebase64data);

          if(a.ics_itinerary){
            const { error, value } = ics.createEvents(a.ics_itinerary);
      
            let fileName = a.event.name+' Final Itinerary';
            var blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
            //saveAs.saveAs(file);
        
            formData.append('ics_file_name', fileName);
            formData.append('ics_file', blob);
            formData.append('ics_b64_file', value);
          }

          formData.append('event_name', a.event.name);
          formData.append('delegate_email', a.user.email);
      
          a.request.post(Urls.api_delegates_sendmultipleitineraries, formData).subscribe(send =>{
            if(send.error == 0){

            }
          });
        }
      }
    });
  }
}