# Speer Backend
Speer Backend is a backend service designed for a notes application. This project consists of a secure and scalable RESTful API that allows users to create, read, update, and delete notes.

The application should also allow users to share their notes with other users and search for notes based on keywords.

The SWAGGER UI for this backend application is hosted at https://speer-backend-p40p.onrender.com/api-docs. You can access the API at https://speer-backend-p40p.onrender.com/.

I will show you how to set up your production environment and start the application, as well as how to set up your test environment to run the test scripts.

## Table of Contents
- Framework and Tools
- Project Setup
  - Clone the Repository
  - Install Dependencies
  - Environment Setup
  - Running the Application
- Running Tests
- Additional Setup for Test Environment

##
  
## Framework and Tools
### 1. Framework:
Express.js: This project uses Express.js, a lightweight and flexible web application framework for Node.js. It is chosen for its minimalistic approach, scalability, and large community support. Express makes it easy to handle routing, middleware, and HTTP requests.
### 2. Database:
PostgreSQL: We use PostgreSQL, an open-source relational database management system, for its reliability, performance, and ACID compliance. PostgreSQL is a strong choice for applications that require complex queries, data integrity, and strong consistency.
### 3. Database Library:
pg: The pg library is used to interact with PostgreSQL from Node.js. It provides a simple and efficient way to execute SQL queries and manage the database connection pool.
### 4. Third-Party Tools:
Jest: We use Jest for testing purposes due to its easy configuration, fast execution, and built-in assertions. Jest is well-suited for testing REST APIs and backend logic.


#


## Project Setup
### Clone the Repository
To get started with the project, first, clone the repository:
- git clone https://github.com/posi23/speer-backend.git
- cd speer-backend

### Environment Setup (See below on how to start this application in a dockerized environment)
Create a **.env** file in the root of the project to configure the environment variables. Example **.env**:
- PORT=3000
- DATABASE_URL=postgres://user:password@localhost:5432/speer
- JWT_SECRET=your_secret_key
  
Replace 'user', 'password', 'localhost' and 'speer' with your actual PostgreSQL connection details.

Replace 'your_secret_key' with your actual JWT secret for secure authentication.
 
### Install Dependencies
Next, install the necessary dependencies:
- npm install
  
This will install all the required packages, including Express, pg, and any other libraries listed in **package.json**.

### Running the Application
Once the environment is set up, start the application with:

- npm build && start
  
This will launch the backend server on the port defined in your .env file (default: 3000). The server will be accessible at http://localhost:3000.

### Additional Setup for Test Environment
To set up a separate test environment (e.g., for running tests with a mock database), create an additional .env.test file with the following configuration:
- DATABASE_URL=postgres://user:password@localhost:5432/speer_test
- JWT_SECRET=your_test_secret_key
  
### Running Tests
To run the tests, use Jest:

- npm test
  
Jest will automatically find and execute the test files in your project.


## Conclusion
This backend project leverages Express.js for routing, PostgreSQL for data storage, and pg for interacting with the database, ensuring a reliable and scalable solution. Jest is used for testing to ensure application stability and quality. By following the setup steps, you can easily get the project up and running locally and begin working with the codebase.

If you encounter any issues, feel free to open an issue on GitHub.
