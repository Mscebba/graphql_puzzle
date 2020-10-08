# Typescript Graphql CRUD

> This is a recipes CRUD backend created for Puzzle's challenge

## Used Libraries
* NodeJs
* GraphQl
* Typescript
* Express
* Apollo
* TypeOrm
* Bcrypt
* JsonWebToken
* PostgreSQL

## Pre-requisites
* [Node](https://nodejs.org/es/)
* [Postgres](https://www.postgresql.org/)



## Installation

1) Clone the [repository](git@github.com:Mscebba/graphql_puzzle.git) or download the [zip](https://github.com/Mscebba/graphql_puzzle/archive/master.zip) file

```bash
$ git clone git@github.com:Mscebba/graphql_puzzle.git
```

2) Install dependencies with  npm
```bash
$ npm install
```
or using yarn
```bash
$ yarn
```
Rename *.env.example* to **.env**
```bash
PORT= '...your port (without quotes)'
JWT_SECRET_KEY= '....your jwt secret key (without quotes)'
DB_TYPE=
DB_USERNAME =
DB_PASSWORD=
HOST=
DB_NAME=
```

3) Start PostresQl server and create the database with the name in "database".
4) From the folder you cloned the repository run the application.

Using npm
```bash
$ npm start
```
or using yarn
```bash
$ yarn start
```

## Usage example
1) Open a browser and go to the **Apollo GraphQL Playground**
```bash
http://localhost:4001/graphql
```
2) **Create your user** first with the **signUp** mutation
```bash
mutation signUp {
  signUp(input: { name: "name", email: "email", password: "password" }) {
    id
    email
    name
    createdAt
  }
}
```
3) Then **login** to get the **token** and run the other queries
```bash
mutation login {
  login(email: "email", password: "password") {
    token
  }
}

{
  "data": {
    "login": {
      "token": "eyJhbGciOiJIUzI1NiI....."
             }
           }
 }

```
4) Copy the **token** and paste it below in the header after Bearer

```bash
{
  "authorization": "Bearer eyJhbGciOiJIUzI1NiI....."
}
```


5) You'll find the other queries in the Playground right tabs **DOCS** and **SCHEMA**
6) For more documentation about **"Apollo GraphQL Playground"** go [here](https://www.apollographql.com/docs/apollo-server/testing/graphql-playground/)



### Author
[Martin Scebba](https://www.linkedin.com/in/martinscebba/)
| **October 2020**

### License
[MIT](https://choosealicense.com/licenses/mit/)

