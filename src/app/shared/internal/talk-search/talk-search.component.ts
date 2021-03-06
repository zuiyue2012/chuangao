import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-talk-search',
  templateUrl: './talk-search.component.html',
  styleUrls: ['./talk-search.component.scss']
})
export class TalkSearchComponent implements OnInit {
  login: Observable<any> = new Observable<any>();
  form: FormGroup;
  startTime: string;
  endTime: string;
  count: number;
  isChosen: boolean;
  doData: any = {};
  doFilePath: string;
  hasDo: number;
  orgList: Array<any>;
  orgName: string;
  planList: Array<any>;
  trainWay: string;
  trainType: string;
  trainPlanName: string;
  page = 0;
  size = 15;
  hasData = false;
  selectionMode = 'single';
  en = {
    firstDayOfWeek: 0,
    dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
    dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  };
  cols: any;
  checkItem: number;

  constructor(
    private http: Http,
    private store: Store<any>
  ) {
    this.login = store.select('login');
    this.form = new FormGroup({
    });
    this.isChosen = false;
    this.cols = [
      { field: 'orgName', header: '单位名称' },
      { field: 'chatLeader', header: '谈心人员' },
      { field: 'chatType', header: '谈心类型' },
      { field: 'chatLoc', header: '谈心地点' },
      { field: 'chatDate', header: '谈心时间' },
      { field: 'chatContent', header: '概要内容' }
    ];
  }

  dateFormat(date) {
    if (date) {
      const _date = new Date(date);
      const _month = (_date.getMonth() + 1) <= 9 ? `0${(_date.getMonth() + 1)}` : _date.getMonth();
      const _day = _date.getDate() <= 9 ? `0${_date.getDate()}` : _date.getDate();
      return `${_date.getFullYear()}-${_month}-${_day}`;
    } else {
      return '';
    }
  }

  selectedOrg($event) {
    this.orgList = $event;
  }

  submit() {
    if (!this.orgList || this.orgList.length === 0) {
      alert('未选择机构');
    } else {
      this.getInfo(this.page, this.size);
    }
  }

  paginate(event) {
    this.getInfo(event.page, this.size);
  }

  getInfo(page: number, size: number) {
    this.form.value.chatStartDate = this.dateFormat(this.startTime);
    this.form.value.chatEndDate = this.dateFormat(this.endTime);
    this.form.value.orgList = this.orgList.map(el => el.data);
    const param = {
      page: page,
      size: size,
    };
    const keys = Object.keys(this.form.value);
    keys.forEach(el => {
      if (this.form.value[el] || this.form.value[el] === 0) {
        param[el] = this.form.value[el];
      }
    });
    const myHeaders: Headers = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    this.http.post('http://119.29.144.125:8080/cgfeesys/Chat/get', JSON.stringify(param) , {
              headers: myHeaders
            })
            .map(res => res.json())
            .subscribe(res => {
              if (res.code) {
                this.count = res.data.count;
                if (res.data.count > 0) {
                  this.hasData = true;
                  res.data.chatDataList.forEach(item => {
                    item.chatType = item.chatType === '0' ? '一般谈心' : '重要谈心';
                  });
                }
                this.planList = res.data.chatDataList;
              } else {
                alert(res.message);
              }
            });
  }

  check($event) {
    this.checkItem = $event.target.value;
  }

  test(val) {
    return val === +this.checkItem;
  }
  detail(id) {
    this.isChosen = true;
    this.planList.forEach(item => {
      if (item.id === id) {
        this.doData = item;
        this.doFilePath = item.fileId;
      }
    });
  }
  download(type) {
    if (type === 'do') {
      window.open(this.doFilePath);
    }
  }
  ngOnInit() {
    this.login.subscribe(res => {
      if (res) {
        this.orgName = res.orgName;
      }
    });
  }

}
