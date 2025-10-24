import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  ngOnInit(): void {
    // Initialize jQuery plugins after the view loads

    // Add scroll event for sticky navbar behavior
    window.addEventListener("scroll", this.handleScroll);
  }

  handleScroll = (): void => {
    const headerTop = document.querySelector(".header-style-four") as HTMLElement;
    const navbarArea = document.querySelector(".navbar-area") as HTMLElement;

    if (window.scrollY > 50) {
      headerTop.classList.add("hidden"); // Hide .header-style-four
      navbarArea.classList.add("scrolled"); // Apply dark gray background
    } else {
      headerTop.classList.remove("hidden"); // Show .header-style-four at top
      navbarArea.classList.remove("scrolled"); // Remove dark gray background
    }
  };

  toggleTheme(): void {
    document.body.classList.toggle("dark-mode");
  }

}
