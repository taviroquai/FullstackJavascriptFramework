# Javascript Fullstack Boilerplate

## Featuring UI Authorization for Graphql

## Server
1. KnexJS - For database connections and migrations
2. ObjectionJS - ORM
3. Apollo Server - GraphQL server
4. Koa - NodeJS web framework
5. (only tested with PostgreSQL)

## Client
1. ReactJS - React app created with CRA
2. React Router DOM - Managing routing in client side
3. React Cookie - Handling cookies
4. React Semantic UI - CSS framework for React
5. Backend starter with authorization UI

## Install & Run
```
$ cd server
$ npm install
$ npm i knex -g
$ knex migrate:latest
$ knex seed:run
$ node app.js &
$ cd ../client
$ npm install
$ npm run start
```

Login with admin@isp.com:admin
