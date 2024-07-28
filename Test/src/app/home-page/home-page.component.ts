import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  @ViewChild('homeContainer', { static: true }) homeContainer!: ElementRef;
  texts: string[] = ['?נו למה לחצת', '...איזה סחרחורת יא אללה', '?ביקשתי לא ללחוץ נכון', '?למה הלכתי להיות טקסט ולא הלכתי ללמוד רפואה כמו שאמא שלי רצתה', '!...אל תלחצו יותר בבקשה'];
  shownTexts: string[] = [];

  showAlert() {
    alert('Click on Demo tab to show the task results!');
  }

  changeBackground() {
    if (this.homeContainer) {
      this.homeContainer.nativeElement.style.backgroundColor = this.getRandomColor();
    }
  }

  rotateText() {
    const rotatingText = document.getElementById('rotating-text');
    if (rotatingText) {
      rotatingText.classList.add('rotating');
      setTimeout(() => {
        rotatingText.classList.remove('rotating');
        rotatingText.textContent = this.getNextText();
      }, 1000);
    }
  }

  getNextText() {
    if (this.shownTexts.length === this.texts.length) {
      this.shownTexts = [];
    }
    let nextText;
    do {
      nextText = this.texts[Math.floor(Math.random() * this.texts.length)];
    } while (this.shownTexts.includes(nextText));
    this.shownTexts.push(nextText);
    return nextText;
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
