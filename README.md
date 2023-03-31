# PGExpressAPI
https://pgexpressapi.onrender.com/

Created using node, express and PostgreSQL for the backend.

### Fetch all users (GET REQUEST)
```js
/users
```

### Fetch user by id (GET REQUEST)
```js
/users/{id}
```

### Create a user (POST REQUEST)
```js
/users
```

with JSON body:

```js
{
  "username": "username",
  "password": "password"
}
```

### Update a user with id (POST REQUEST)
```js
/users/{id}
```

with JSON body:

```js
{
  "username": "username",
  "password": "password"
}
```

### Delete a user (DELETE REQUEST)
```js
/users/{id}
```

### Login with username and password (POST REQUEST)
```js
/login
```

with JSON body:

```js
{
  "username": "username",
  "password": "password"
}
```

