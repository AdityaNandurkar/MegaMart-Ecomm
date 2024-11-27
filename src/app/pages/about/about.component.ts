import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  // heading = "about us";

  heading: string = 'about megamart';
  companyName: string = 'MegaMart';
  missionStatement: string = `
    At ${this.companyName}, our goal is to make shopping easier, faster, and more convenient than ever before for our customers. 
    We are committed in our mission to build a trustworthy online marketplace that offers the widest range of products across the country. 
    With our proven user experience and reliable services, we are committed to providing customers in India with a trusted and 
    hassle-free one-stop-shop for all their shopping needs across various categories such as Electronics, Grocery, Fashion, Home & Kitchen, etc.
  `;
  stats: string = `
    Every week, about 265 million clients and individuals visit our over 13,200 stores across 27 countries, along 
    with eCommerce sites in 10 countries.
  `;
  revenueInfo: string = `
    With a financial year 2018 revenue of $500.3 billion, ${this.companyName} employs over 2.2 million associates around the world.
  `;

  developerName: string = 'Aditya Nandurkar';
  role: string = 'Web Developer';
  expertise: string[] = ['Java', 'SQL', 'Angular', 'HTML', 'CSS', 'JavaScript', 'Node.js', 'JSON Server', 'Git'];
  projectName: string = 'Megamart Ecomm';
  projectDescription: string = `
    I have developed a web application named "${this.projectName}" using Angular 16 with JSON Server as the database. 
    Key features of this application include:
  `;
  projectFeatures: { heading: string; description: string }[] = [
    { heading: 'User Authentication', description: 'Secure login functionality.' },
    { heading: 'Product Management', description: 'Users can search, filter, and add products to their cart.' },
    { heading: 'Cart and Checkout', description: 'The cart checkout process includes a dummy payment feature with card and UPI options, displayed in a popup.' },
    { heading: 'Order History', description: 'Products purchased are added to the user’s purchase history in the profile section.' },
    { heading: 'Role-Based Authentication', description: 'Admins can view all user details and assign admin roles to other users.' },
    { heading: 'Profile Management', description: 'The profile section allows users to upload a profile picture locally.' },
  ];

  conclusion: string = `
    This project demonstrates my ability to build full-fledged web applications with robust features and user-friendly interfaces.
  `;
}
