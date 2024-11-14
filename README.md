
# Authorify Coding Challenge

Assessment to apply for Fullstack Role



## Requirements
### Backend
NodeJS 20, NestJS, TypeScript (Run npm install from the backend directory)
### Frontend
React 18, React Bootstrap, Axios
## Clone project
Using git, clone the project from Github

```bash
  git clone https://github.com/djfunes/autorify-assessment.git
```
## Run Backend


Access to the backend directory

```bash
  cd authorify-assessment
  cd backend
```

Install dependencies

```bash
  npm install
```

Run the application

```bash
  npm run start
```
### Optional
Run the aplication in development mode
```bash
  npm run start:dev
```

## Run Frontend

Access to the frontend directory

```bash
  cd authorify-assessment
  cd frontend
```

Install dependencies

```bash
  npm install
```

Run the application
```bash
  npm run start
```
## Backend Test
The backend is now runing on http://localhost:3000, You can now test the endpoints using Postman or any other tool you may like.

You can also run the test suites by executing in the command line:

```bash
    npm run test
```
## Frontend Test
The fontend is now runing on http://localhost:3001, open your browser and type the URL. After the application loads, you can navigate withi the Nav Bar menu. Please notice that the backend should be runing.
## Docker

### Pre-requisites

Have docker or Docker Desktop installed

### Usage

The complete application could run on docker, you just need to build by using the following command inside root folder:


```bash
    docker-compose up --build
```