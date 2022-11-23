# NodeJS-CRUD-Project

**Introduction:**

The purpose of this project is to understand NodeJS along with express by creating a smiple CRUD functionality.

<h3 align="left">Technology stack:</h3>

<p align="left"> 
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" alt="mongodb" width="40" height="40"/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/>
</p>

<h3 align="left">Third party libarys:</h3>

- JWT Auth
- JOI validation
- http-errors
- mongoose
- bcrypt
- multer

## USER APIS

#### Get all users

```http
  GET /api/user
```

#### Get user by Id

```http
  GET /api/user/${id}
```

| Name | Type     | Description   |
| :--- | :------- | :------------ |
| `id` | `string` | **Parameter** |

#### create signup

```http
  POST /api/user/create
```

| Name       | Type     | Description |
| :--------- | :------- | :---------- |
| `name`     | `string` | **Body**    |
| `age`      | `number` | **Body**    |
| `email`    | `string` | **Body**    |
| `password` | `string` | **Body**    |

#### Login user

```http
  POST /api/user/login
```

| Name       | Type     | Description |
| :--------- | :------- | :---------- |
| `email`    | `string` | **Body**    |
| `password` | `string` | **Body**    |

#### Delete user

```http
  DELETE /api/user/delete/${userId}
```

| Name           | Type     | Description       |
| :------------- | :------- | :---------------- |
| `userId`       | `string` | **Parameter**     |
| `Bearer Token` | `string` | **Authenticaion** |

## POST APIS

#### Get all posts

```http
  GET /api/post
```

#### Create Post

```http
  GET /api/post/create/
```

| Name           | Type     | Description           |
| :------------- | :------- | :-------------------- |
| `Title`        | `string` | **Body**              |
| `ImageUrl`     | `file`   | **Body**              |
| `Content`      | `string` | **Body**              |
| `Creater`      | `string` | **Body** Aka: User Id |
| `Bearer Token` | `string` | **Authenticaion**     |

#### Create Post

```http
  PUT /api/post/update/${postId}
```

| Name           | Type     | Description           |
| :------------- | :------- | :-------------------- |
| `Title`        | `string` | **Body**              |
| `ImageUrl`     | `file`   | **Body**              |
| `Content`      | `string` | **Body**              |
| `Creater`      | `string` | **Body** Aka: User Id |
| `Bearer Token` | `string` | **Authenticaion**     |
| `postId`       | `string` | **Parameter**         |

#### Delete Post

```http
  DELETE /api/post/delete/${postId}
```

| Name           | Type     | Description       |
| :------------- | :------- | :---------------- |
| `postId`       | `string` | **Parameter**     |
| `Bearer Token` | `string` | **Authenticaion** |
