import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
// import { MatMomentDateModule } from "@angular/material-moment-adapter/core";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
// import { MatDrawer } from '@angular/material/sidenav';


const Materials = [
  MatSliderModule,
  MatTabsModule,
  MatMenuModule,
  MatCardModule,
  MatBadgeModule,
  MatIconModule,
  MatSidenavModule,
  MatSelectModule,
  MatInputModule,
  MatProgressBarModule,
  MatStepperModule,
  MatCheckboxModule,
  MatButtonModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatRadioModule,
  // MatDrawer
];

@NgModule({
  imports: [Materials],
  exports: [Materials]

})
export class MaterialModule { }
