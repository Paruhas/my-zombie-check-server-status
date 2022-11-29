require("./utils/nodeEnv");
const cors = require("cors");
const compression = require("compression");
const express = require("express");

const app = express();

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || "local";
console.log({ NODE_ENV });

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { StartLogger } = require("./utils/logService.js");
// const { syncDB_force, testConnect } = require("./service/database");

const requestLogger = require("./middleware/logger.js");
const homeMiddleware = require("./middleware/home.js");
const { basicAuth: basicAuthMiddleware } = require("./middleware/authenticate");
const versionCheck = require("./middleware/versionCheck.js");
const errorMiddleware = require("./middleware/errorResponse.js");
const pathErrorMiddleware = require("./middleware/pathError.js");

/* ===== SCHEDULE ===== */
require("./utils/nodeSchedule/schedule.js");

/* ===== LOG ===== */
try {
  StartLogger();
} catch (error) {
  console.log(error);
}
app.use(requestLogger);

/* ===== HOMEPAGE ===== */
app.get("/", homeMiddleware);

/* ===== TEST_API ===== */
app.get("/test", homeMiddleware);

/* ===== API HOOK ===== */

/* ===== FOR ZOMBIE RESTART ===== */
app.get("/api/version/001", versionCheck);

/* ===== ROUTER ===== */

/* ===== ERROR ===== */
app.use(errorMiddleware);

/* ===== INCORRECT PATH ===== */
app.use("*", pathErrorMiddleware);

app.listen(PORT, async () => {
  try {
    // await syncDB_force(false);
    // const db_test = await testConnect();

    // if (!db_test) {
    //   throw new Error("DB connection failed");
    // }

    console.log(
      `
  =====================================

    Sever Starting Success
    Server is running on port: ${PORT}
    Currently running mode: ${NODE_ENV.toUpperCase()}

  =====================================
`
    );
  } catch (error) {
    console.log(
      `
    =====================================
  
      Server error on start up: 
      ${error}
  
    =====================================
  `
    );
  }
});
