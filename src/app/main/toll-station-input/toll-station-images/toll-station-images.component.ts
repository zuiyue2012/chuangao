import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-toll-station-images',
  templateUrl: './toll-station-images.component.html',
  styleUrls: ['./toll-station-images.component.scss']
})
export class TollStationImagesComponent implements OnInit {
  login: Observable<any>;
  imgArr: Array<any> = [];
  bigNewsImgArr: Array<any> = [];
  hisHorImgArr: Array<any> = [];
  orgCode: string;

  constructor(
    private http: Http,
    private store: Store<any>
  ) {
    this.login = store.select('login');
  }

  getImages(orgCode) {
    this.http.get(`http://119.29.144.125:8080/cgfeesys/BaseInfo/getOrgPicPath?orgCode=${orgCode}`)
            .map(res => res.json())
            .subscribe(res => {
              if (res.code) {
                this.imgArr = res.data;
              }
            });
  }

  upload($event) {
    const formdata = new FormData();
    formdata.append('file', $event.target.files[0]);
    formdata.append('orgCode', this.orgCode);
    this.http.post(`http://119.29.144.125:8080/cgfeesys/upload/baseInfo`, formdata)
      .map(res => res.json())
      .subscribe(res => {
        if (res.code) {
          alert(res.message);
          this.getImages(this.orgCode);
        }else {
          alert(res.message);
        }
      });
  }

  delete(id) {
    this.http.get(`http://119.29.144.125:8080/cgfeesys/BaseInfo/deleteOrgPic?fileId=${id}`)
            .map(res => res.json())
            .subscribe(res => {
              if (res.code) {
                alert(res.message);
                this.getImages(this.orgCode);
                this.getInfo();
              } else {
                alert(res.message);
              }
            });
  }

  getInfo() {
    this.http.get(`http://119.29.144.125:8080/cgfeesys/BaseInfo/getStationInfo?stationCode=${this.orgCode}`)
            .map(res => res.json())
            .subscribe(res => {
              if (res.code) {
                this.bigNewsImgArr = res.data.stationImg1;
                this.hisHorImgArr = res.data.stationImg2;
              }else {
                alert(res.message);
              }
            });
  }

  uploadImgArr($event, type) {
    const formdata = new FormData();
    formdata.append('file', $event.target.files[0]);
    formdata.append('stationCode', this.orgCode);
    formdata.append('type', type);
    this.http.post(`http://119.29.144.125:8080/cgfeesys/upload/station`, formdata)
      .map(res => res.json())
      .subscribe(res => {
        if (res.code) {
          alert(res.message);
          this.getInfo();
        }else {
          alert(res.message);
        }
      });
  }

  ngOnInit() {
    this.login.subscribe(res => {
      if (res) {
        this.orgCode = res.orgCode;
        this.getImages(res.orgCode);
        this.getInfo();
      }
    });
  }

}
