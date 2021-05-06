# chat-server

## Installation

```
git clone https://github.com/remiCzn/chat-server.git
cd chat-server
npm install
```
Config the file `confing.template.js`, and rename it `config.js`

## Launch

```
npm start
```
To stop the server, just type `Ctrl+C`

## API - Routes
### Main
#### [GET] /api/
Return infos about the server
### User
#### [POST] /api/user/register
Create a new user

Body:
  - email : string
  - username : string
  - pw : string
  - mood : string

#### [POST] /api/user/login
Return the jwt

Body:
  - email: string
  - pw: string

#### [GET] /api/user/me
Return infos about an user

Header:
  - Authorization : send jwt get with the login request (string)

### [GET] /api/user/all
Return the list of all users
### Message

