import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.scss']
})
export class DeleteConfirmComponent implements OnInit {

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
      this.modal.close('deleteModal');
      this.spinner.hide();
    }, 5000);
  }
}
