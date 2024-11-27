import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './pages/components/cart/cart.component';
import { LoginRegisterComponent } from './pages/components/login-register/login-register.component';
import { UserDashboardComponent } from './pages/components/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './pages/components/admin-dashboard/admin-dashboard.component';
import { ProductDetailsComponent } from './pages/components/product-details/product-details.component';
import { NotfoundComponent } from './pages/components/notfound/notfound.component';
import { authGuard } from './guards/auth/auth.guard';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: "cart", component: CartComponent, canActivate: [authGuard] },
  { path: "loginRegister", component: LoginRegisterComponent },
  { path: "about-us", component: AboutComponent },
  { path: "contact", component: ContactComponent },
  { path: "user-dashboard", component: UserDashboardComponent },
  { path: "admin-dashboard", component: AdminDashboardComponent },
  { path: "product-info/:category/:id", component: ProductDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
