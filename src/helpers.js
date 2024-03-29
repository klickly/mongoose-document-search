const { ObjectID } = require('bson');

const isString = val => typeof val === 'string' || val.constructor === String;
const isObject = val => val && Object.prototype.toString.call(val) === '[object Object]';
const isNumber = val => !isNaN(parseFloat(val)) && isFinite(val);

/**
 *
 * @param {any} obj
 * @returns obj copy with converted types
 */
const convertObjectTypes = (obj) => {
    if (!isObject(obj)) {
        return obj;
    }

    const copy = {};

    for (let prop in obj) {
        if (!obj.hasOwnProperty(prop)) {
            continue;
        }

        const val = obj[ prop ];

        if (isNumber(val)) {
            copy[ prop ] = parseFloat(val);
        } else if (val === 'true') {
            copy[ prop ] = true;
        } else if (val === 'false') {
            copy[ prop ] = false;
        } else if (Array.isArray(val)) {
            copy[ prop ] = val.map(v => convertObjectTypes(v));
        } else if (isString(val) && ObjectID.isValid(val)) {
            copy[ prop ] = new ObjectID(val);
        } else {
            copy[ prop ] = convertObjectTypes(val);
        }
    }

    return copy;
};

module.exports = {
    isString,
    isNumber,
    isObject,
    convertObjectTypes
};
