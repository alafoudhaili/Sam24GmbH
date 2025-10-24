# Sam24 GmbH - Umzugs Platform

Sam24 GmbH is an online platform that allows clients to book **Umzüge** (moving services). The platform provides a **client portal** for booking moves and an **admin dashboard** for managing employees and move assignments. Built with **Spring Boot** for the backend and **Angular** for the frontend, this platform also features **JWT security** for protected endpoints.

## Features

### Client Features:
- **Book a Move**: Clients can book a moving service by filling out a form with details like the date, destination, and type of move.
- **View Move History**: Clients can view and track their previous and upcoming moves.

### Admin Features:
- **Employee Management**: Admins can create accounts for employees and assign them to specific moves.
- **Move Management**: Admins can view all moves, assign employees, and manage the scheduling of moves.
- **Dashboard**: A centralized place for managing users, employees, and moves.

### Security:
- **JWT Authentication**: The application uses **JSON Web Tokens (JWT)** for secure user authentication and role-based access control.

## Technologies

- **Backend**: Spring Boot
  - Java
  - Spring Security (JWT)
  - JPA / Hibernate (for database interaction)
  - MySQL (for data storage)

- **Frontend**: Angular
  - TypeScript
  - RxJS (for handling asynchronous data)
  - Angular Material (for UI components)

## Setup Instructions

### Prerequisites
- **Java 11+** for the Spring Boot backend.
- **Node.js & npm** for the Angular frontend.
- **MySQL** (or any compatible database).
- **Maven** for backend dependency management (or Gradle if preferred).

### Clone the Project (Spring Boot + Agular)

   git clone https://github.com/your-username/sam24gmbh-backend.git
   cd sam24gmbh-backend
