const AuthRouter = require("./auth");
const UserRouter = require("./users");
const CategoryRouter = require("./categories");
const ProtectedRouter = require("./protected");
const ProductRouter = require("./products");

const routes = (app, prefix) => {
  // Simple welcome route
  app.get("/", (req, res) => {
    res.json({
      message: "GMEDIA User Interview API",
      version: "1.0.0",
      status: "running",
    });
  });

  app.use(prefix + "auth", AuthRouter);
  app.use(prefix + "users", UserRouter);
  app.use(prefix + "categories", CategoryRouter);
  app.use(prefix + "products", ProductRouter);
  app.use(prefix + "protected", ProtectedRouter);
};
module.exports = routes;
