# Breezy Homes Backend API

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## About the Project

The Breezy Homes Backend API is a RESTful API designed to support the operations of Breezy Homes platform. It provides endpoints for managing users, properties, authentication, and other core functionalities required for the platform.

---

## Features

- User authentication and authorization (JWT-based).
- Property listing management.
- Image upload and storage using Cloudinary.
- Input validation using `express-validator`.
- Secure password hashing with `bcryptjs`.

---

## Technologies Used

- **Node.js**: JavaScript runtime for building scalable server-side applications.
- **Express.js**: Web framework for building RESTful APIs.
- **Sequelize**: ORM for database management.
- **Cloudinary**: Cloud-based image storage and management.
- **JWT**: Secure token-based authentication.
- **Multer**: Middleware for handling file uploads.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v14 or higher)
- npm (Node Package Manager)
- A database (MySQL)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hismyhill/tc-16_breezy-homes_backend-api.git
   ```

2. Navigate to the project directory:

```bash
cd tc-16_breezy-homes_backend-api
```

3. Install dependencies:

```bash
npm install
```

## Usage

Start the server:

```bash
npm run dev
```

## Folder Structure

├── config/ # Configuration files (database, cloudinary)
├── controllers/ # Route controllers
├── middlewares/ # Custom middleware
├── models/ # Database models
├── routes/ # API route definitions
├── server.js # Entry point of the application
├── .env # Environment variables
├── .gitignore # Files to ignore in version control
├── package.json # Project metadata and dependencies
