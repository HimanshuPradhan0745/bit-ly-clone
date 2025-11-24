const bcrypt = require("bcrypt");

const saltRounds = 10;

const createHash = (valueToHash) => bcrypt.hashSync(valueToHash, saltRounds);

const compareHash = (valueToCompare, hashValue) => {
  bcrypt.genSaltSync(saltRounds);
  return bcrypt.compareSync(valueToCompare, hashValue);
};

module.exports = { createHash, compareHash };
