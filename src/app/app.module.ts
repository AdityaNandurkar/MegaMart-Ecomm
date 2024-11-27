import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from './pages/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { FooterComponent } from './pages/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TruncatePipe } from './pipes/truncate/truncate.pipe';
import { CartComponent } from './pages/components/cart/cart.component';
import { LoginRegisterComponent } from './pages/components/login-register/login-register.component';
import { ToastrModule } from 'ngx-toastr';
import { UserDashboardComponent } from './pages/components/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './pages/components/admin-dashboard/admin-dashboard.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ProductDetailsComponent } from './pages/components/product-details/product-details.component';
import { ProductsListsComponent } from './pages/products-lists/products-lists.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NotfoundComponent } from './pages/components/notfound/notfound.component';
import { FilterProductPipe } from './pipes/filterProduct/filter-product.pipe';
import { UpdateUserComponent } from './pages/components/update-user/update-user.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { PaymentComponent } from './pages/components/payment/payment.component';
import { FormatInputDirective } from './directive/FormatInput/format-input.directive';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    TruncatePipe,
    CartComponent,
    LoginRegisterComponent,
    UserDashboardComponent,
    AdminDashboardComponent,
    ProductDetailsComponent,
    ProductsListsComponent,
    NotfoundComponent,
    FilterProductPipe,
    UpdateUserComponent,
    ContactComponent,
    AboutComponent,
    PaymentComponent,
    FormatInputDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
