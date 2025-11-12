const app = require("./app");
const env = require("./config/env");

app.listen(env.port, () => {
  console.log(
    `Corn backend running on port ${env.port} (${env.nodeEnv} mode)`,
  );
});
