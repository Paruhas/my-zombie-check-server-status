const dayjs = require("../libs/Day.js");
const { writeLog_request } = require("../utils/logService.js");

module.exports = (req, res, next) => {
  try {
    const { method, originalUrl, body, query, params } = req;

    const id = dayjs().utc().valueOf();
    const start = id;
    const date = dayjs(id).utc().format("YYYY-MM-DD HH:mm:ss:SSSZ");
    let finish = null;

    console.log(`[START]${id}|${date} >>> ${method} => ${originalUrl} : -ms`);
    if (process.env.NODE_ENV !== "production") {
      if (
        originalUrl.search("login") === -1 &&
        originalUrl.search("register") === -1
      ) {
        console.log(`| params: ${JSON.stringify(params)} |`);
        console.log(`| query: ${JSON.stringify(query)} |`);
        console.log(`| body: ${JSON.stringify(body)} |`);
      }
    }

    res.on("finish", () => {
      finish = dayjs().utc().valueOf();
    });

    res.on("close", () => {
      const duration = finish - start;
      console.log(
        `[CLOSE]${id}|${date} >>> ${method} => ${originalUrl} : ${duration}ms`
      );

      writeLog_request(id, date, method, originalUrl, { body, query, params });
    });

    next();
  } catch (error) {
    next(error);
  }
};
