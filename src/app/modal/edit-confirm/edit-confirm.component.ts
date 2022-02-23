import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-edit-confirm',
  templateUrl: './edit-confirm.component.html',
  styleUrls: ['./edit-confirm.component.scss']
})
export class EditConfirmComponent implements OnInit {

  constructor
  (
    public modal: NgxSmartModalService,
    private spinner: NgxSpinnerService
  ) {}


  ngOnInit(): void {
  }

  close(){
    this.spinner.show();
    setTimeout(() => {
      this.modal.close('editModal');
      this.spinner.hide();
    }, 5000);
  }
}
