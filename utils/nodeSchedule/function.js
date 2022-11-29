const dayjs = require("../../libs/Day");

exports.showTime = () => {
  var object_time = {
    TH_time: dayjs().tz("Asia/Bangkok").format(),
    UTC_time: dayjs().utc().format(),
  };

  return console.table(object_time);
};
