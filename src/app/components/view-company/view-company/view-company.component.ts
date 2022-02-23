import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-company',
  templateUrl: './view-company.component.html',
  styleUrls: ['./view-company.component.scss']
})
export class ViewCompanyComponent implements OnInit {
  chip=[
    {
      id: 1,
      name:'Ailo',
      type: 1
    }
  ];
  countries=[
    {
      id: 1,
      name:'Philippines',
    },
    {
      id: 2,
      name:'Canada',
    },
    {
      id: 1,
      name:'USA',
    }

  ];
  states=[
    {
      id: 1,
      name:'Toronto',
    },
    {
      id: 2,
      name:'Vancouver',
    },
    {
      id: 1,
      name:'Minesota',
    }

  ];
  payment=[
    {
      id: 1,
      name:'Paymaya',
    },
    {
      id: 2,
      name:'Gcash',
    },
    {
      id: 1,
      name:'others',
    }

  ];
  sort=[
    {
      id: 1,
      name:'name',
    },
    {
      id: 2,
      name:'date',
    },
  ];
  limit=[
    {
      id: 1 ,
      name:10,
    },
    {
      id: 2,
      name:25,
    },
    {
      id: 2,
      name:50,
    },
    {
      id: 2,
      name:100,
    },
    
  ];

  selected_limit:any;
  selected_sort:any;
  selected_payment: any;
  selected_state: any;
  selected_country: any;
  selected_type:any = 1;
  id: any = 1;
  constructor() { }

  ngOnInit(): void {
  }
  addChip(ev){
    let obj = {
      id: this.id,
      name: ev.target.value,
      type: this.selected_type
    }
    console.log(obj)
    if(ev.target.value){
      this.id += 1;
      this.chip.push(obj);
      ev.target.value = '';
    }
  }
  selectRadio(ev){
    this.selected_type = ev.value;
  }
  removeChip(chip, i){
    this.chip.splice(i, 1)
  }
  clickfilter(name, type?){
    switch (type) {
      case 'country':
        this.selected_country = name;
        break;
      case 'state':
        this.selected_state = name;
        break;
      case 'payment':
        this.selected_payment = name;
        break;
      case 'sort':
        this.selected_sort = name;
        break;
      case 'limit':
        this.selected_limit = name;
        break;
    }
  }

}
