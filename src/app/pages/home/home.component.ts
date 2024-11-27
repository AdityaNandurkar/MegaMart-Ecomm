import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api/api.service';
import { NotificationService } from 'src/app/service/notify/notification.service';
import { ProductService } from 'src/app/service/product/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categoryType: string = ""
  images = [
    '../../../../assets/images/ban1.jpg',
    '../../../../assets/images/ban2.jpg',
    '../../../../assets/images/ban3.jpg',
    '../../../../assets/images/ban4.jpg',
  ];
  constructor(private _route: ActivatedRoute, private _productServeice: ProductService) { }

  ngOnInit(): void {
    this.getCategoryType();
  }
  getCategoryType() {
    this._productServeice.category.subscribe(data => {
      this.categoryType = data;
    });
  }
}
