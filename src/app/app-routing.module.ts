import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login/login.component';
import { CompaniesComponent } from './components/companies/companies.component';
import { ViewCompanyComponent } from './components/view-company/view-company/view-company.component';
import { TemplateComponent } from './layout/template/template.component';
import { DelegatesComponent } from './components/delegates/delegates.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AddEditComponent } from './components/add-edit/add-edit.component';
import { AddDelegatesComponent } from './components/add-delegates/add-delegates.component';
import { MessageTemplateComponent } from './components/messaging/message-template/message-template.component';
import { MessagingContentComponent } from './components/messaging/messaging-content/messaging-content.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { FindDelegatesComponent } from './components/find-delegates/find-delegates.component';
import { DelegatesProfileComponent } from './components/delegates-profile/delegates-profile.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ForgotPassComponent } from './pages/forgot-pass/forgot-pass.component';
import { EventsComponent } from './pages/events/events.component';
import { EditCompanyDetailsComponent } from './components/edit-company-details/edit-company-details.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { F2fAboutComponent } from './components/f2f-about/f2f-about.component';
import { FaqsComponent } from './components/faqs/faqs.component';
import { ViewEventsComponent } from './components/view-events/view-events.component';
import { PastEventsComponent } from './pages/past-events/past-events.component';
import { PastEventsViewComponent } from './components/past-events-view/past-events-view.component';
import { MyScheduleComponent } from './pages/my-schedule/my-schedule.component';
import { DelegatesLocatorComponent } from './components/delegates-locator/delegates-locator.component';
import { MyScheduleVirtualComponent } from './pages/my-schedule-virtual/my-schedule-virtual.component';
import { SponsorsComponent } from './components/sponsors/sponsors.component';
import { NoteComponent } from './components/note/note.component';
import { NoShowDelegatesComponent } from './components/no-show-delegates/no-show-delegates.component';
import { Aboutf2fschedulerComponent } from './pages/login-footer/aboutf2fscheduler/aboutf2fscheduler.component';
import { TermsComponent } from './pages/login-footer/terms/terms.component';
import { PrivacyComponent } from './pages/login-footer/privacy/privacy.component';

import { AuthGuard } from './guards/auth.guard';
import { LoginAuthGuard } from './guards/login-auth.guard';


const routes: Routes = [
  { path : '', component: TemplateComponent, 
  
    children:[
      { path: '', pathMatch: 'full', redirectTo: 'events'},
      { path: 'events', component: EventsComponent, canActivate: [AuthGuard] },
      { path: 'companies', component: CompaniesComponent },
      { path: 'view-company', component: ViewCompanyComponent },
      { path: 'delegates', component: DelegatesComponent },
      { path: 'delegates/add-delegates', component: AddDelegatesComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'add-edit', component: AddEditComponent },
      { path: 'find-delegates', component: FindDelegatesComponent },
      { path: 'delegates-profile/:id', component: DelegatesProfileComponent },
      { path: 'user-profile', component: UserProfileComponent} ,
      { path: 'edit-profile/:id', component: EditProfileComponent},
      { path: 'edit-company-details', component: EditCompanyDetailsComponent},
      { path: 'privacy-policy', component: PrivacyPolicyComponent},
      { path: 'terms-condition', component: TermsConditionsComponent},
      { path: 'f2fAboutScheduler', component: F2fAboutComponent},
      { path: 'faqs', component: FaqsComponent},
      { path: 'events/view', component: ViewEventsComponent},
      { path: 'past-events', component: PastEventsComponent},
      { path: 'past-events/view', component: PastEventsViewComponent},
      { path: 'my-schedule', component: MyScheduleComponent},
      { path: 'delegates-locator', component: DelegatesLocatorComponent},
      { path: 'my-schedule-virtual', component: MyScheduleVirtualComponent},
      { path: 'sponsors', component: SponsorsComponent},
      { path: 'notes', component: NoteComponent},
      { path: 'onboarding', component: OnboardingComponent },
      { path: 'no-show-delegates', component: NoShowDelegatesComponent},
    ] 
  },
  { path: 'messaging', component: MessageTemplateComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgotpass', component: ForgotPassComponent },
  { path: 'messaging-content', component: MessagingContentComponent },
  { path: 'loginAboutf2fScheduler', component: Aboutf2fschedulerComponent },
  { path: 'loginTermsCondition', component: TermsComponent },
  { path: 'loginPrivacyPolicy', component: PrivacyComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
