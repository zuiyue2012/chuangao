import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-leave-search',
  templateUrl: './leave-search.component.html',
  styleUrls: ['./leave-search.component.scss']
})
export class LeaveSearchComponent implements OnInit {
  form: FormGroup;
  startTime: string;
  endTime: string;
  count: number;
  leaveDataList: Array<any>;
  orgList: Array<any>;
  page = 0;
  size = 15;
  hasData = false;
  selectionMode = 'checkbox';
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
    private http: Http
  ) {
    this.form = new FormGroup({
      listGroup: new FormControl('', Validators.nullValidator),
      userName: new FormControl('', Validators.nullValidator),
      leaveType: new FormControl('', Validators.nullValidator)
    });
    this.cols = [
      { field: 'orgName', header: '组织机构' },
      { field: 'userName', header: '请假人' },
      { field: 'applyType', header: '请假类型' },
      { field: 'applyDate', header: '开始请假时间' },
      { field: 'applyDateEnd', header: '结束请假时间' },
      { field: 'remark', header: '请假理由' },
      { field: 'leaveTipDownload', header: '请假条下载' }
    ];
  }

  dateFormat(date) {
    if (date) {
      const _date = new Date(date);
      const _month = (_date.getMonth() + 1) <= 9 ? `0${(_date.getMonth() + 1)}` : _date.getMonth();
      const _day = _date.getDate() <= 9 ? `0${_date.getDate()}` : _date.getDate();
      return `${_date.getFullYear()}-${_month}-${_day}`;
    }else {
      return '';
    }
  }

  selectedOrg($event) {
    this.orgList = $event;
  }

  submit() {
    if (!this.orgList || this.orgList.length === 0) {
      alert('未选择机构');
    }else {
      this.getInfo(this.page, this.size);
    }
  }

  paginate(event) {
    this.getInfo(event.page, this.size);
  }

  getInfo(page: number, size: number) {
    this.form.value.startTime = this.dateFormat(this.startTime);
    this.form.value.endTime = this.dateFormat(this.endTime);
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
    this.http.post('http://119.29.144.125:8080/cgfeesys/Leave/getLeave', JSON.stringify(param) , {
              headers: myHeaders
            })
            .map(res => res.json())
            .subscribe(res => {
              if (res.code) {
                this.count = res.data.count;
                this.leaveDataList = res.data.leaveDataList;
                if (res.data.count > 0) {
                  this.hasData = true;
                }
              }else {
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

  ngOnInit() {
  }

}