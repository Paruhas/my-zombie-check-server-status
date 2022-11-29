const isOject = (input1) => {
  return Boolean(
    input1 &&
      input1.toString() === "[object Object]" &&
      !Array.isArray(input1) &&
      input1 instanceof Object
  );
};

const isArray = (input1) => {
  return Boolean(input1 && input1 instanceof Array && Array.isArray(input1));
};

module.exports = { isOject, isArray };
