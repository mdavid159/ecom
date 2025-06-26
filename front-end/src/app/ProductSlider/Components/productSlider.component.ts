import {Component, Input} from '@angular/core';
import {SlideInterface} from '../Types/slide.interface';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'product-slider',
  templateUrl: './ProductSlider.component.html',
  imports: [
    NgStyle
  ],
  styleUrls: ['./ProductSlider.component.scss']
})

export class ProductSliderComponent{
  @Input() slides: SlideInterface[] = [];

  currentIndex: number = 0;

  getCurrentSlideUrl(): string {
    if (!this.slides || this.slides.length === 0 || !this.slides[this.currentIndex]) {
      return '';
    }

    console.log("Url slide:", `url('${this.slides[this.currentIndex].url}')`);
    return `url('${this.slides[this.currentIndex].url}')`;
  }

  goToPrevious(): void {
    const isFirstSlide = this.currentIndex === 0;
    const newIndex = isFirstSlide? this.slides.length - 1 : this.currentIndex - 1;
    this.currentIndex = newIndex;
  }

  goToNext(): void {
    const isLastSlide = this.currentIndex === this.slides.length - 1;
    const newIndex = isLastSlide ? 0 : this.currentIndex + 1;
    this.currentIndex = newIndex;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }
}
