const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const respond = require("./lib/respond");
const env = require("./config/env");

const healthRouter = require("./routes/health");
const authRouter = require("./routes/auth");
const catalogRouter = require("./routes/catalog");
const cartRouter = require("./routes/cart");
const checkoutRouter = require("./routes/checkout");
const ordersRouter = require("./routes/orders");
const paymentsCodRouter = require("./routes/payments/cod");
const paymentsPayhereRouter = require("./routes/payments/payhere");
const paymentsWebhooksRouter = require("./routes/payments/webhooks");
const adminProductsRouter = require("./routes/admin/products");
const adminCategoriesRouter = require("./routes/admin/categories");
const adminSettingsRouter = require("./routes/admin/settings");
const adminOrdersRouter = require("./routes/admin/orders");

const app = express();

app.set("trust proxy", env.isProduction);
app.use(
  cors({
    origin: env.webOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/health", healthRouter);
app.use("/auth", authRouter);
app.use(catalogRouter);
app.use("/cart", cartRouter);
app.use("/checkout", checkoutRouter);
app.use("/orders", ordersRouter);

app.use("/payments/cod", paymentsCodRouter);
app.use("/payments/payhere", paymentsPayhereRouter);
app.use("/payments/webhooks", paymentsWebhooksRouter);

app.use("/admin/products", adminProductsRouter);
app.use("/admin/categories", adminCategoriesRouter);
app.use("/admin/settings", adminSettingsRouter);
app.use("/admin/orders", adminOrdersRouter);

app.use((_req, res) => respond.error(res, 404, "Route not found"));

app.use((err, _req, res, _next) => {
  console.error(err);
  respond.error(res, err.status || 500, err.message || "Internal server error");
});

module.exports = app;
