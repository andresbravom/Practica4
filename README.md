# Bills with authentication  🔐
Bills with authentication is a Node.js app. The user can add users, edit and remove bills, the query is through graphql.
## Install 🛠️
To use this app it is necessary to install:
* npm
```sh
npm install
```
* mongo DB
```sh
https://www.mongodb.com/download-center
```
## Dependencies ⚙️
* GraphQL server will listen on `127.0.0.1:4000`
* Install graphql
```sh
npm install graphql-yoga
```
* install mongo DB
```sh
npm install mongodb
```

## Clone respository 👇🏽
To clone or download this repository copy this link:
```sh
git@github.com:andresbravom/Practica4.git
```

## Run ▶️
Use this command to start the execution
```js
npm start
```
## Features 💻
### Mutations
```js
addUser
addBills
login
logout
getBills
removeUser
```
#### Add User 👨🏻‍💼
```js
    mutation{
        addUser(userName: "Andrés", password: "qwerty")
}
```
#### Add Bills 🧾
To add bills is it necesary put the next fields

```js
    mutation{
  addBill(userName: "Anes", token: "6828e3b9-10fa-4b18-ba2f-91ebcffd6cf8", amount: 23, concept: "concept1", date: "02/10/2019"){
} 
}
```

### Queries
```js
getBills
removeUser

```
#### INPUT
```js
query{
  getBills(userName:"Andres", token:"270a5fcc-70b5-401f-a411-a69684a31e11"){
    concept
    user{
      userName
      bills{
        concept
      }
    }
  }
}
```
#### OUTPUT
```js
{
  "data": {
    "getBills": [
      {
        "concept": "concept1",
        "user": {
          "userName": "Andres",
          "bills": [
            {
              "concept": "concept1"
            }
          ]
        }
      }
    ]
  }
}
```

## Mongo DB 📸
In the following images you can see the database of the application distributed in 3 collections

