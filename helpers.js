const isString = val => typeof val === 'string' || val.constructor === String;
const isObject = val => val && Object.prototype.toString.call(val) === '[object Object]';
const isNumber = val => !isNaN(parseFloat(val)) && isFinite(val);

module.exports = {
  isString,
  isNumber,
  isObject
};