function tryJSONstringify(JSONparse) {
  try {
    return JSON.stringify(JSONparse);
  } catch (error) {
    return null;
  }
}

function tryJSONparse(JSONstring) {
  try {
    return JSON.parse(JSONstring);
  } catch (error) {
    return null;
  }
}

module.exports = { tryJSONstringify, tryJSONparse };
