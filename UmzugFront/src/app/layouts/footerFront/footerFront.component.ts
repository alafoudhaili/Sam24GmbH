import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footerFront',
  templateUrl: './footerFront.component.html',
  styleUrls: ['./footerFront.component.scss']
})
export class FooterfrontComponent implements OnInit {

  // set the currenr year
  year: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
  }

}
