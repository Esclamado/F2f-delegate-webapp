import { Component, OnInit } from '@angular/core';
import { datatable } from 'src/app/components/datatables/company';
import { NgxSmartModalService } from 'ngx-smart-modal';


@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {
  total = '10';
  limit_value: any;
  limit = [
    {
      type: 1,
      limit: '10',
    },
    {
      type: 2,
      limit: '15',
    },
    {
      type: 3,
      limit: '20'
    }
  ]
  isLoading: boolean = false;
  ths: any = datatable;
  listingArgs = {
    page: 1,
    limit: 10,
    next_page:1
  };
  list = [
    {
      Id: 1,
      name: 'CDO',
      created_at: 1617162410,
      status: 'established'
    },
    {
      Id: 2,
      name: 'Purefoods',
      created_at: 1617162910,
      status: 'established'
    },
    {
      Id: 3,
      name: 'BBC',
      created_at: 1617162210,
      status: 'established'
    },
  ]
  status: any = [
    {
      type: 1,
      name:'Established',
    },
    {
      type: 2,
      name:'Desolve',
    }
  ]
  type_value: any;
  constructor(
    public modal: NgxSmartModalService
    ) { }

  ngOnInit(): void {
  }
  clickedStatus(type){
    this.type_value = type;
  }

  clickedLimit(type){
    this.limit_value = type;
  }

  editConfirmModal(){
    this.modal.open('editModal');
  }

  deleteConfirmModal(){
    this.modal.open('deleteModal');
  }
  
  scrollRequesting: any = false;
  onScroll(ev: any){
    let scrollHeight = ev.target.scrollHeight;
    let combined = ev.target.scrollTop + ev.target.clientHeight;
    let obj = {
      Id: 4,
      name: 'BBC',
      created_at: 1617162210,
      status: 'established'
    }
    if (!this.scrollRequesting && scrollHeight == combined && this.listingArgs.next_page){
      // this.getNewComment();
      console.log('nag scroll')
      // this.scrollRequesting = true;
      this.list.push(obj)
    }else{
      return false;
    }
  }
  viewPhoto(){
    this.modal.open('photoModal')
  }

}
