import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  profileImage: string = 'assets/profileImage.png'
  usersList: any[] = [];
  constructor(private _api: ApiService) { }
  ngOnInit(): void {
    this._api.getUserDetails().subscribe((res: any[]) => {
      if (res && res.length > 0) {
        this.usersList = res.filter(x => x.role !== 'admin' && x.role !== true);
      }
    }, (error) => {
      console.log("Error => ", error)
    })
  }
}
