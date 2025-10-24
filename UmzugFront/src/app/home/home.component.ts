import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  showNavigationArrows: any;
  translatedText: string = '';
  originalContent = `
    <h1>Welcome to Our Logistics Service</h1>
    <p>We provide the best logistics services to make sure your goods reach their destination safely and on time.</p>
    <p>Our services include air freight, ocean freight, road transport, and warehousing.</p>
  `;

  constructor() {}

  ngOnInit(): void {}


}
