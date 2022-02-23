// Modules
import { BrowserModule, Title } from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { LoginPageModule } from './pages/login/login-page.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material/material.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxSmartModalModule, NgxSmartModalService} from 'ngx-smart-modal';
import { NgxSpinnerModule } from "ngx-spinner";
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { AgmCoreModule, MapsAPILoader } from "@agm/core";
import { DatePipe } from '@angular/common';

// Admin
import { CompaniesComponent } from './components/companies/companies.component';
import { ViewCompanyComponent } from './components/view-company/view-company/view-company.component';
import { TemplateComponent } from './layout/template/template.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { HeaderComponent } from './layout/header/header.component';
import { DelegatesComponent } from './components/delegates/delegates.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AddEditComponent } from './components/add-edit/add-edit.component';
import { AddDelegatesComponent } from './components/add-delegates/add-delegates.component';
import { LoaderComponent } from './defaults/loader/loader.component';
import { MessageTemplateComponent } from './components/messaging/message-template/message-template.component';
import { MessageLeftPanelComponent } from './components/messaging/message-left-panel/message-left-panel.component';
import { InboxCardComponent } from './components/messaging/inbox-card/inbox-card.component';
import { MessageRightPanelComponent } from './components/messaging/message-right-panel/message-right-panel.component';
import { MessageCardComponent } from './components/messaging/message-card/message-card.component';
import { MessagingContentComponent } from './components/messaging/messaging-content/messaging-content.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { HeaderDashboardComponent } from './layout/header-dashboard/header-dashboard.component';
import { FindDelegatesComponent } from './components/find-delegates/find-delegates.component';
import { DelegatesProfileComponent } from './components/delegates-profile/delegates-profile.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { EditCompanyDetailsComponent } from './components/edit-company-details/edit-company-details.component';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { F2fAboutComponent } from './components/f2f-about/f2f-about.component';
import { FaqsComponent } from './components/faqs/faqs.component';
import { FooterComponent } from './layout/footer/footer.component';
import { DelegatesLocatorComponent } from './components/delegates-locator/delegates-locator.component';
import { SponsorsComponent } from './components/sponsors/sponsors.component';
import { NoteComponent } from './components/note/note.component';
import { ArchiveHeaderComponent } from './layout/archive-header/archive-header.component';
import { NoShowDelegatesComponent } from './components/no-show-delegates/no-show-delegates.component';
import { Aboutf2fschedulerComponent } from './pages/login-footer/aboutf2fscheduler/aboutf2fscheduler.component';
import { TermsComponent } from './pages/login-footer/terms/terms.component';
import { PrivacyComponent } from './pages/login-footer/privacy/privacy.component';


// Toast
import { ToastrModule } from 'ngx-toastr';
import { EditConfirmComponent } from './modal/edit-confirm/edit-confirm.component';
import { DeleteConfirmComponent } from './modal/delete-confirm/delete-confirm.component';
import { SaveModalComponent } from './modal/save-modal/save-modal.component';
import { PhotoModalComponent } from './modal/photo-modal/photo-modal.component';
import { PopupMessageCardComponent } from './components/popup-message-card/popup-message-card.component';
import { ForgotModalComponent } from './modal/forgot-modal/forgot-modal.component';
import { SocialLinksComponent } from './modal/social-links/social-links.component';
import { ImageCropperModalComponent } from './modal/image-cropper-modal/image-cropper-modal.component';
import { EventsComponent } from './pages/events/events.component';
import { ViewEventsComponent } from './components/view-events/view-events.component';
import { PastEventsComponent } from './pages/past-events/past-events.component';
import { PastEventsViewComponent } from './components/past-events-view/past-events-view.component';
import { MyScheduleComponent } from './pages/my-schedule/my-schedule.component';
import { ScrollDirective } from './directives/scroll.directive';
import { ScheduleMeetingComponent } from './modal/schedule-meeting/schedule-meeting.component';
import { ViewMeetingDetailComponent } from './modal/view-meeting-detail/view-meeting-detail.component';
import { FindDelegateMeetingScheduleComponent } from './modal/find-delegate-meeting-schedule/find-delegate-meeting-schedule.component';
import { ReportNoShowComponent } from './modal/report-no-show/report-no-show.component';
import { LoaderModalComponent } from './modal/loader-modal/loader-modal.component';
import { SafePipe } from './lib/pipe/safe.pipe';
import { SafeUrlPipe } from './lib/pipe/safe-url.pipe';
import { MyScheduleVirtualComponent } from './pages/my-schedule-virtual/my-schedule-virtual.component';
import { RecheduleModalComponent } from './modal/rechedule-modal/rechedule-modal.component';
import { RequestCancelMeetingComponent } from './modal/request-cancel-meeting/request-cancel-meeting.component';
import { ScrollTopComponent } from './components/scroll-top/scroll-top.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { AngularFireModule } from '@angular/fire';
import { environment } from './../environments/environment';
import { MessagingModalSearchComponent } from './modal/messaging-modal-search/messaging-modal-search.component';
import { TransformDatePipe } from './lib/pipe//transform-date.pipe';
import { ChatService } from './services/chat/chat.service';


const config: SocketIoConfig = { url: '', options: {} };
@NgModule({
  declarations: [
    AppComponent,
    CompaniesComponent,
    ViewCompanyComponent,
    TemplateComponent,
    SidenavComponent,
    HeaderComponent,
    DelegatesComponent,
    SettingsComponent,
    EditConfirmComponent,
    DeleteConfirmComponent,
    AddEditComponent,
    LoaderComponent,
    SaveModalComponent,
    AddDelegatesComponent,
    PhotoModalComponent,
    MessageTemplateComponent,
    MessageLeftPanelComponent,
    InboxCardComponent,
    MessageRightPanelComponent,
    MessageCardComponent,
    MessagingContentComponent,
    PopupMessageCardComponent,
    ForgotModalComponent,
    OnboardingComponent,
    HeaderDashboardComponent,
    FindDelegatesComponent,
    DelegatesProfileComponent,
    UserProfileComponent,
    EditProfileComponent,
    EditCompanyDetailsComponent,
    SocialLinksComponent,
    ImageCropperModalComponent,
    EventsComponent,
    FooterComponent,
    PrivacyPolicyComponent,
    TermsConditionsComponent,
    F2fAboutComponent,
    FaqsComponent,
    ViewEventsComponent,
    PastEventsComponent,
    PastEventsViewComponent,
    MyScheduleComponent,
    ScrollDirective,
    ScheduleMeetingComponent,
    ViewMeetingDetailComponent,
    FindDelegateMeetingScheduleComponent,
    ReportNoShowComponent,
    LoaderModalComponent,
    DelegatesLocatorComponent,
    SafePipe,
    MyScheduleVirtualComponent,
    RecheduleModalComponent,
    RequestCancelMeetingComponent,
    SponsorsComponent,
    ScrollTopComponent,
    NoteComponent,
    ArchiveHeaderComponent,
    NoShowDelegatesComponent,
    SafeUrlPipe,
    MessagingModalSearchComponent,
    Aboutf2fschedulerComponent,
    TermsComponent,
    PrivacyComponent,
    TransformDatePipe
  

   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    NgxWebstorageModule.forRoot(),
    BrowserAnimationsModule,
    LoginPageModule,
    MaterialModule,
    ToastrModule.forRoot({
      closeButton: true,
      // disableTimeOut: true,
      positionClass : 'toast-center-center'
    }),
    InfiniteScrollModule,
    MatSlideToggleModule,
    NgxSmartModalModule.forRoot(),
    SocketIoModule.forRoot(config),
    FormsModule, 
    ReactiveFormsModule,
    NgxSpinnerModule,
    ImageCropperModule,
    NgxSkeletonLoaderModule,
    GooglePlaceModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBXiSTnuChE03T8ascsYAeBWm4QAiBaE-E',
      libraries: ["places"]
    }),
    NgCircleProgressModule.forRoot({
      // set defaults here
      "radius": 60,
      "space": -10,
      "outerStrokeGradient": true,
      "outerStrokeWidth": 10,
      "outerStrokeColor": "#86AE1A",
      "outerStrokeGradientStopColor": "#86AE1A",
      "innerStrokeColor": "#CCCCCC",
      "innerStrokeWidth": 10,
      "title": "UI",
      "animateTitle": false,
      "animationDuration": 1000,
      "showUnits": false,
      "showBackground": false,
      "clockwise": false,
      "startFromZero": false,
      "lazy": true})
  ],
  exports: [BrowserAnimationsModule],
  providers: [NgxSmartModalService, Title, DatePipe],
  bootstrap: [AppComponent]


})
export class AppModule { }