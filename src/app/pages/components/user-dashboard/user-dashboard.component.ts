import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/service/api/api.service';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { NotificationService } from 'src/app/service/notify/notification.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent {

  myData: any;
  profileImage = 'assets/profileImage.png'
  purchaseHistory: any;

  constructor(private _api: ApiService, private dialog: MatDialog, private _notify: NotificationService) { }

  ngOnInit(): void {
    this.profileData();

  }

  profileData() {
    let email = localStorage.getItem('email');
    let password = localStorage.getItem('password');
    if (email && password) {
      this._api.getUser(email, password).subscribe((res: any) => {
        if (res && res.length > 0) {
          this.myData = res[0];
        }
      }, (error) => {
        console.log("Error => ", error);
      })

      this.getHistory(email, password);
    }
  }

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      const objectURL = URL.createObjectURL(file);
      this.profileImage = objectURL;
      this.uploadImage(objectURL);
    }
  }

  uploadImage(imgPath: string) {
    this.myData.profileImage = imgPath;
    this._api.updateUserById(this.myData.id, this.myData).subscribe((res: any) => {
      this._notify.showSuccess("Image Upload Sucessfully.");
    }, (error) => {
      console.log("Error => ", error);
    })
  }

  getHistory(email: string, password: string) {
    this._api.getPurchaseHistory(email, password).subscribe((res: any) => {
      if (res) {
        this.purchaseHistory = res;
      }
    }, (error) => {
      console.log("Error => ", error);
    })
  }

  openPopup(userInfo: any) {
    const dialogRef = this.dialog.open(UpdateUserComponent, {
      width: '800px', // Set the width of the popup
      height: '400px',
      data: { data: userInfo }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}