import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductSliderComponent} from './Components/productSlider.component';

@NgModule({
  imports: [CommonModule, ProductSliderComponent],
  exports: [ProductSliderComponent],
})

export class ProductSliderModule {}
