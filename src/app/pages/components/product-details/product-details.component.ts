import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api/api.service';
import { Product, ProductService } from 'src/app/service/product/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  productDetail: Product | any;

  constructor(private _product: ProductService, private _api: ApiService, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    let pId = this._route.snapshot.paramMap.get('id');
    pId && this._api.getProductsById(pId).subscribe((res) => {
      if (res) {
        this.productDetail = res;
      }
    })
  }
}
