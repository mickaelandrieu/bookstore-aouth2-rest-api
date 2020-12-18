# Book Store Node.js/Express.js REST API using OAuth 2 (for learning purposes only)

## Installation

```
git clone https://github.com/mickaelandrieu/bookstore-oauth2-rest-api.git
cd bookstore-oauth2-rest-api
npm i
```

## Security

This application demonstrates how to implement OAuth 2 in order to secure access to a simple REST API
and [Facebook Login](https://developers.facebook.com/docs/facebook-login/).

## Endpoints

### Security (using FB Login & OAuth2)

* `/oauth-redirect`
* `/error`
* `/logout`

### Login (obtain your token)

* `/login`

> Submit in the Body of your HTTP request the mail and the password of the user and you will obtain a JSON Web Token if the credentials are valid. 

### Books

* `/books`
* `/books/<isbn>`

### Users

* `/users`
* `/users/<mail>`

### Book Store management

* `/borrow/<mail>/<isbn>`: borrow a book from the book store as an user
* `/bring-back/<mail>/<isbn>`: bring back a book to the book store as an user

This project is licensed under the [MIT license](https://opensource.org/licenses/MIT).
