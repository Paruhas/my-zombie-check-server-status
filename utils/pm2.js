const { exec } = require("child_process");
const dayjs = require("../libs/Day.js");

const restartCommand = "pm2 restart";
const listCommand = "pm2 list";
const stopCommand = "pm2 stop";

function getDate() {
  const id = dayjs().utc().valueOf();
  const start = id;
  const date = dayjs(id).utc().format("YYYY-MM-DD HH:mm:ss:SSSZ");

  return { id, date };
}

function getPm2List() {
  const { id, date } = getDate();
  const startText = `[PM2] ${id}|${date} >>>`;

  console.log(`${startText} RUNNING => getPm2List function`);

  exec(listCommand, (error, stdout, stderr) => {
    if (error) {
      console.log(`${startText} ERROR => ${error}`);
      return;
    }
    if (stderr) {
      console.log(`${startText} ERROR => ${stderr}`);
      return;
    }

    console.log(`${startText} FINISH => getPm2List function`);
    return stdout;
  });
}

function restartPm2ByName(name) {
  const { id, date } = getDate();
  const startText = `[PM2] ${id}|${date} >>>`;

  console.log(`${startText} RUNNING => restartPm2ByName function`);

  if (!name) {
    console.log(`${startText} ERROR => no parameter 'name'`);
    return;
  }

  exec(`${restartCommand} ${name}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`${startText} ERROR => ${error}`);
      return;
    }
    if (stderr) {
      console.log(`${startText} ERROR => ${stderr}`);
      return;
    }

    console.log(`${startText} FINISH => restartPm2ByName function`);
    console.log(getPm2List());
    return;
  });
}

function stopPm2ByName(name) {
  const { id, date } = getDate();
  const startText = `[PM2] ${id}|${date} >>>`;

  console.log(`${startText} RUNNING => stopPm2ByName function`);

  if (!name) {
    console.log(`${startText} ERROR => no parameter 'name'`);
    return;
  }

  exec(`${stopCommand} ${name}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`${startText} ERROR => ${error}`);
      return;
    }
    if (stderr) {
      console.log(`${startText} ERROR => ${stderr}`);
      return;
    }

    console.log(`${startText} FINISH => stopPm2ByName function`);
    console.log(getPm2List());
    return;
  });
}

module.exports = {
  getPm2List,
  restartPm2ByName,
  stopPm2ByName,
};
