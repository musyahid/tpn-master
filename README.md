# User Management API Service

a service for managing user

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

1. have git installed
2. have npm installed
3. have docker installed
4. have docker-compose installed
5. have mongodb up and running

### Installing

1. Pull this repo and switch to intended branch
2. Install dependencies
```
$ npm install
```
3. Set the environment variables:
```
NODE_ENV: 'development|test|productio'
APP_NAME: 'TPN User Management API'
APP_PORT:'your-port'
APP_TIMEOZNE:'your-timezone'
DB_DRIVER:'mongodb'
DB_HOST:'your-mongodb-host'
DB_PORT:'your-mongodb-password'
DB_DATABASE:'your-database-name'
DB_USERNAME:'your-username'
DB_PASSWORD:'your-password'
```
4. Start the application:
```
$ npm start
```
or you can use
```
$ nodemon bin/www
```

## Running the tests
to start test use this command
```
$ npm test
```

## Deployment
You can follow the installing steps, use npm start instead of nodemon and just make sure that the environment variables are secured

## Built With

* [NodeJs v12.16.1](https://nodejs.org/en/) - The language used
* [ExpressJs v4.17.1](https://expressjs.com/) - The web framework used
* [Minio](https://min.io/index.html) - Storage Platform
* [npm](https://www.npmjs.com/) - Dependency Management


## Versioning

We use [SemVer](http://semver.org/) for versioning.

## Authors

* **Agung Mulyawan**
* **Muhammad Iqbal**
* **Ronaldo Triandes**
* **Musyahid Abror**

## License

This project is not licensed and is a private property of Partnership Management Team of Telkom Divisi Digital Service

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc

