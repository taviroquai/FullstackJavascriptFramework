// Load enviroment variables
require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const Manager = require('./Manager');

// Create koa app
const app = new Koa();

// Load and use middleware
const middleware = Manager.loadMiddleware();
for (let name in middleware) app.use(middleware[name]);

// Use apollo server middleware
const apolloServer = Manager.getGraphqlServer(); 
apolloServer.applyMiddleware({ app });

// Load routes
const router = new Router();
const routes = Manager.loadRoutes();
for (let name in routes) routes[name](app, router);
app.use(router.routes()).use(router.allowedMethods());

// Finally, listen to HTTP
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`),
);
