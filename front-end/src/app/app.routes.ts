import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MainComponent } from './main/main.component'; // Create a main component for the logged-in view
import { authGuard } from './auth.guard';
import {CreateProductComponent} from './create-product/create-product.component';
import {ProductPageComponent} from './product-page/product-page.component';
import {UpdateProductComponent} from './update-product/update-product.component';
import {CartComponent} from './cart/cart.component';
import {CheckoutSuccessComponent} from './checkout-success/checkout-success.component';
import { SettingsComponent } from './settings/settings.component';
import { StatsComponent } from './stats/stats.component';
import {SettingsProductsComponent} from './settings-products/settings-products.component';
import {ChangeNameComponent} from './change-name/change-name.component';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' }, // Redirect the root to /main
  { path: 'main', component: MainComponent }, // Main page visible after login
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'verify-email/:id', component: VerifyEmailComponent },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },
  { path: 'change-password/:id', component: ChangePasswordComponent },
  { path: 'product/create', component: CreateProductComponent },
  { path: 'product/:id', component: ProductPageComponent },
  { path: 'edit-product/:id', component: UpdateProductComponent },
  { path: 'cart/:id', component: CartComponent },
  { path: 'checkout', component: CheckoutSuccessComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'settings/product/stats/:id', component: StatsComponent },
  { path: 'settings/products/:id', component: SettingsProductsComponent },
  { path: 'settings/change-name/:id', component:  ChangeNameComponent },
  { path: '**', redirectTo: 'main' }, // Redirect unknown routes to the main page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
