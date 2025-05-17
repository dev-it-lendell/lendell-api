const fs = require("fs");
const logStream = fs.createWriteStream("./logs/app.log", { flags: "a" });

function getIp(remoteAddress) {
  let ip = remoteAddress.split(":");
  ip = ip[ip.length - 1];
  return ip;
}

function randomString(length) {
  const string = Math.random()
    .toString(36)
    .substring(3, 3 + length)
    .toUpperCase();

  return string;
}

function pad(value) {
  if (value < 10) {
    return "0" + value;
  } else {
    return value;
  }
}

/*
 * Returns true if the argument is:
 *    - null
 *    - undefined
 *    - an empty string
 *    - an array with 0 length
 *    - an object with no properties
 */
const empty = (arg) => {
  if (isDate(arg)) return false;

  return (
    arg === null ||
    arg === undefined ||
    arg === "" ||
    isArrAndEmpty(arg) ||
    isObjAndEmpty(arg)
  );
};

const isArrAndEmpty = (arg) => {
  return isArr(arg) && arrEmpty(arg);
};

const isArr = (arg) => {
  return Array.isArray(arg);
};

// For performance, this method does not check if `arr` is really an array.
// Use `isArr` before calling this method, to check if `arr` is really an array.
const arrEmpty = (arr) => {
  return arr.length === 0;
};

const isObjAndEmpty = (arg) => {
  return isObj(arg) && objEmpty(arg);
};

const isObj = function (val) {
  if (val == null) return false;
  return val.constructor.name === "Object";
};

const isMap = isObj;

// For performance, this method does not check if `obj` is really an object.
// Use `isObj` before calling this method, to check if `obj` is really an object.
const objEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

const queryToStr = (query, removeQuestionMark = false) => {
  return `${removeQuestionMark ? "" : "?"}${Object.entries(query)
    .map((entry) => `${entry[0]}=${entry[1]}`)
    .join("&")}`;
};

const isStr = (arg) => {
  return typeof arg === "string";
};

const generateNumber = (length) => {
  return Math.random()
    .toString(10)
    .slice(2, length + 2);
};

const generateAlphaNumericStr = (length) => {
  // Base 36 is alpha-numeric
  return Math.random()
    .toString(36)
    .slice(2, length + 2)
    .toUpperCase();
};

const generateEntityCode = (entityName) => {
  return entityName.replace(/[aeiou\s\W]/gi, "").toLowerCase();
};

const snakifyStr = (str) => {
  return str.replace(/([A-Z])/g, (val) => `_${val.toLowerCase()}`);
};

const camelizeStr = (str) => {
  let ret = str.replace(/_(\w{1})/g, (val) =>
    val.replace("_", "").toUpperCase()
  );
  return ret.replace(/^[A-Z]{1}/, (val) => val.toLowerCase());
};

// Returns a copy of an object but property names are snakified
// Does not change the original object
// Object argument must be a FLAT object
const snakify = (obj) => {
  if (typeof obj !== "object" || Array.isArray(obj)) {
    throw new Error("snakify: Argument should be an object.");
  }

  let ret = {};

  if (typeof obj === "object" && !Array.isArray(obj)) {
    for (const prop in obj) {
      ret[snakifyStr(prop)] = obj[prop];
    }
  }

  return ret;
};

// Returns a copy of an object but property names are camelized
// Does not change the original object
// Object argument must be a FLAT object
const camelize = (obj) => {
  if (typeof obj !== "object" || Array.isArray(obj)) {
    throw new Error("camelize: Argument should be an object.");
  }

  let ret = {};

  if (typeof obj === "object" && !Array.isArray(obj)) {
    for (const prop in obj) {
      ret[camelizeStr(prop)] = obj[prop];
    }
  }

  return ret;
};

const buildTree = (arr, nodeKey = "", parentNodeKey = "") => {
  if (nodeKey === "" || parentNodeKey === "") {
    throw new Error(
      "buildTree: `nodeKey` and `parentNodeKey` arguments are required."
    );
  }

  const hashTable = {};
  const tree = [];

  arr.forEach((node) => (hashTable[node[nodeKey]] = { ...node, children: [] }));

  arr.forEach((node) => {
    if (node[parentNodeKey] && hashTable[node[parentNodeKey]]) {
      hashTable[node[parentNodeKey]].children.push(hashTable[node[nodeKey]]);
    } else {
      tree.push(hashTable[node[nodeKey]]);
    }
  });

  return tree;
};

const buildHashTable = (arr, key = "key") => {
  if (arr === undefined || arr === null || !Array.isArray(arr)) {
    throw new Error("`arr` argument is required and should be an array.");
  }

  const hash_table = {};
  arr.forEach((obj) => (hash_table[obj[key]] = { ...obj }));
  return hash_table;
};

const buildBreadcrumbs = (node, hash_table, parent_key = "parent_key") => {
  if (empty(node) || empty(hash_table)) {
    throw new Error("Incomplete arguments.");
  }

  if (typeof node !== "object" || Array.isArray(node)) {
    throw new Error("`node` argument should be an object.");
  }

  if (typeof hash_table !== "object" || Array.isArray(hash_table)) {
    throw new Error("`hash_table` argument should be an object.");
  }

  let breadcrumbs = [];
  let parent_node = hash_table[node[parent_key]] ?? null;

  while (parent_node) {
    breadcrumbs.unshift(parent_node.name);
    // Nodes which parent does not exist in the group will be considered root nodes
    if (parent_node[parent_key] && hash_table[parent_node[parent_key]]) {
      parent_node = hash_table[parent_node[parent_key]];
      continue;
    }
    parent_node = null;
  }

  return breadcrumbs;
};

const pascalToCamel = (str) => {
  return str[0].toLowerCase() + str.substring(1, str.length);
};

/**
 * Changes the character case of property names of a shallow/flat object.
 *
 * @param {Object} obj Object to be transformed
 */
const changeCase = (obj, transformer) => {
  if (typeof obj !== "object" || Array.isArray(obj)) {
    throw new Error("Argument should be an object.");
  }

  let ret = {};

  for (const prop in obj) {
    ret[transformer(prop)] = obj[prop];
  }

  return ret;
};

/*
 * @param obj (Array or Object) -- obj of which to check a property emptiness
 * @param path (String) -- obj path to a property i.e. "a.b.c"
 */
const deepPropEmpty = (obj, path) => {
  if (!isArr(obj) && !isObj(obj)) {
    throw new Error("`obj` argument should be an array or an object.");
  }

  const routes = path.split(".");
  let prop = obj[routes.shift()];

  if (empty(prop)) {
    return true;
  }

  for (const route of routes) {
    // console.log(`Route ${route} is empty:`, empty(prop[route]));
    if (empty(prop[route])) {
      return true;
    }

    prop = prop[route];
  }

  return false;
};

const getMissingProp = (obj, propNames) => {
  for (const propName of propNames) {
    if (empty(obj[propName])) return propName;
  }

  return null;
};

const convertTime12to24 = function (time12h) {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
};

const formatDate = (dateDetails = null, delimeter = "-") => {
  // dateDetails.date can be a JS date or an ISO date string
  if (!dateDetails || !dateDetails.date) {
    return "";
  }

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const date = isDate(dateDetails.date)
    ? dateDetails.date
    : new Date(dateDetails.date);

  const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  let month = new Intl.DateTimeFormat("en", { month: "short" }).format(date);

  if (dateDetails.straightDate || dateDetails.straightDateTime) {
    month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
  }

  const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
  let minute = date.getMinutes();
  let hour = date.getHours();
  const ampm = hour > 11 ? " PM" : " AM";

  if (minute < 10) {
    minute = `0${minute}`;
  }

  if (hour > 12) {
    hour -= 12;
  }

  const formattedHour = hour < 10 ? `0${hour}` : hour;

  const time = `${formattedHour}:${minute}${ampm}`;
  const dayName = days[date.getDay()];

  if (dateDetails.withDayName) {
    return `${dayName.toUpperCase()}, ${month.toUpperCase()} ${day}, ${year} ${time}`;
  }

  if (dateDetails.dateOnly) {
    return `${month.toUpperCase()} ${day}, ${year}`;
  }

  if (dateDetails.timeOnly) {
    return `${time}`;
  }

  if (dateDetails.militaryTime) {
    return `${convertTime12to24(time)}`;
  }

  if (dateDetails.straightDate) {
    return `${year}${delimeter}${month}${delimeter}${day}`;
  }

  if (dateDetails.straightDateTime) {
    return `${year}${delimeter}${month}${delimeter}${day} ${convertTime12to24(
      time
    )}`;
  }

  if (dateDetails.withDayNameWithTime) {
    return `${dayName.toUpperCase()}, ${month.toUpperCase()} ${day}, ${year} ${time} `;
  }

  if (dateDetails.withDayNameOnly) {
    return `${dayName.toUpperCase()}, ${month.toUpperCase()} ${day}, ${year}`;
  }
  return `${month.toUpperCase()} ${day}, ${year} ${time} `;
};

const isDate = (arg) => {
  return Object.prototype.toString.call(arg) === "[object Date]";
};

const isNone = (v) => {
  return v == null || v === "";
};

const isError = (arg) => {
  return arg instanceof Error;
};

// Checks if a value is flat/shallow
const isFlat = (val) => {
  if (isPrimitive(val)) return true;

  for (const key in val) {
    if (!isPrimitive(val[key])) return false;
  }

  return true;
};

const isPrimitive = (val) => {
  return (typeof val !== "object" && typeof val !== "function") || val === null;
};

// Returns a one-liner presentable text from a primitive, FLAT array or FLAT object
const presentify = (arg) => {
  if (arg === undefined || arg === null || arg === "") {
    return "";
  }

  if (typeof arg === "function") {
    throw new Error("`arg` should not be a function");
  }

  if (isObj(arg) || isArr(arg)) {
    if (!isFlat(arg)) {
      throw new Error(
        "`arg` when an object or an array, should be shallow or flat."
      );
    }

    return presentifyObj(arg);
  }

  return arg;
};

// Renders a one-liner presentable text from a FLAT array or object
// IMPORTANT: Make sure that the arg is an object or an array before calling this function
const presentifyObj = (arg) => {
  let arr = arg;

  if (isObj(arr)) {
    arr = [];
    for (const key in arg) {
      arr.push(`${key}: ${arg[key]}`);
    }
  }

  // return `[${arr.join(", ")}]`;
  return arr.join(", ");
};

const stringifyHWBMI = (val) => {
  return `Height: ${val.height}${val.heightUnitCode}, Weight: ${val.weight}${val.weightUnitCode}, BMI: ${val.bmi}`;
};

// Renders a delimited string from a primitive, array or an object (nested or flat) using DFS
const treeToStr = (val, leafDelimiter = ", ") => {
  if (empty(val)) return "";

  const visited = [];
  const toVisit = [val];

  while (toVisit.length > 0) {
    const node = toVisit.shift();

    if (!empty(node.bmi)) {
      // for "Height, Weight and BMI" data
      visited.push(stringifyHWBMI(node));
    } else if (!empty(node.bgImageFileName) && !empty(node.strokes)) {
      // for sketch data
      visited.push(`[Sketch]`);
    } else if (!empty(node.value) && !empty(node.label)) {
      // for "value and label" data
      visited.push(
        `(${
          typeof node.value === "string" ? node.value.toUpperCase() : node.value
        }) ${node.label}`
      );
    } else if ((isObj(node) || isArr(node)) && isFlat(node)) {
      visited.push(presentifyObj(node));
    } else if (isPrimitive(node)) {
      // Omit null and undefined nodes
      if (node !== null && node !== undefined) {
        visited.push(node);
      }
    } else {
      for (const key in node) {
        toVisit.unshift(node[key]);
      }
    }
  }

  return visited.join(leafDelimiter);
};

const multiLineToOneLine = (str) => {
  return str.replace(/[\n\r]+/g, ", ");
};

const treeToMultiLinerStr = (tree, indentSize = 2) => {
  if (!isObj(tree)) {
    throw new Error("`tree` should be an object.");
  }

  const indent = Array(indentSize).fill(" ").join("");
  const result = [];
  const toVisit = [{ ...tree, indent: "" }];

  while (toVisit.length > 0) {
    const node = toVisit.shift();

    result.push(`${node.indent}${node.label}: ${presentify(node.value)}`);

    if (!empty(node.children)) {
      toVisit.unshift(
        ...node.children.map((n) => {
          n["indent"] = node.indent + indent;
          return n;
        })
      );
    }
  }

  return result.join("\n");
};

// Limits and adds ellipsis to a string.
const addEllipsis = (str, limit) => {
  if (limit < 3) limit = 3;

  if (str.length > limit) {
    return str.substring(0, limit - 3) + "...";
  }

  return str;
};

const getAge = (date) => {
  const today = new Date();
  const birthDate = isDate(date) ? date : new Date(date);

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

  return age;
};

const getDistinct = (arr) => {
  if (!isArr(arr)) {
    throw new Error("Argument should be an array.");
  }

  return [...new Set(arr)];
};

// Used to sort array of strings or objects (with string property to be used for sorting) IN PLACE
const sortStringArr = (arr, key = null, desc = false) => {
  const ret1 = desc ? -1 : 1;
  const ret2 = desc ? 1 : -1;

  arr.sort((a, b) =>
    (a[key] ?? a) > (b[key] ?? b)
      ? ret1
      : (a[key] ?? a) < (b[key] ?? b)
      ? ret2
      : 0
  );
};

// Used to sort array of numbers or objects (with number property to be used for sorting) IN PLACE
const sortNumberArr = (arr, key = null, desc = false) => {
  arr.sort((a, b) => {
    if (desc) return (b[key] ?? b) - (a[key] ?? a);
    return (a[key] ?? a) - (b[key] ?? b);
  });
};

const jsDateToISOString = (jsDate, dateOnly, utc) => {
  if (utc && dateOnly) {
    return jsDate.toISOString().substring(0, 10);
  }

  if (utc) {
    return jsDate.toISOString();
  }

  const year = String(jsDate.getFullYear());
  const month = String(jsDate.getMonth() + 1).padStart(2, "0");
  const date = String(jsDate.getDate()).padStart(2, "0");
  const hours = String(jsDate.getHours()).padStart(2, "0");
  const minutes = String(jsDate.getMinutes()).padStart(2, "0");
  const seconds = String(jsDate.getSeconds()).padStart(2, "0");
  const ms = String(jsDate.getMilliseconds()).padStart(3, "0");

  if (dateOnly) {
    return `${year}-${month}-${date}`;
  }

  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}.${ms}`;
};

// Used to compare two array of primitives or objects
const compareArr = (newArr, oldArr, itemKey = null, itemValue = null) => {
  if (newArr.length !== oldArr.length) return false;

  for (const newArrItem of newArr) {
    const oldArrItem = oldArr.find(
      (e) =>
        (itemKey ? e[itemKey] : e) ===
        (itemKey ? newArrItem[itemKey] : newArrItem)
    );

    if (
      !oldArrItem ||
      (itemValue ? oldArrItem[itemValue] : oldArrItem) !==
        (itemValue ? newArrItem[itemValue] : newArrItem)
    ) {
      return false;
    }
  }

  return true;
};

// CHECKS IF VALUE IS AN INTEGER.
// NOTE: ACCEPTS AN INTEGER IN STRING FORM.
const isInt = (value) => {
  if (typeof value === "string") value = Number(value);
  return Number.isInteger(value);
};

const isDecimal = (value) => {
  return Boolean(value % 1);
};

const isNumber = (value) => {
  return isInt(value) || isDecimal(value);
};

const isValidIcd10Code = (icd10Code) => {
  return /^[a-zA-Z][0-9][a-zA-Z0-9](?:.(?:[a-zA-Z0-9]{1,4}))?$/.test(icd10Code);
};

const sanitizeSQLLikeValue = (val) => {
  return val.replace(/[\%\_\[\]\^]/g, "");
};

const currentDateTime = () => {
  var currentdate = new Date();

  var datetime = `${currentdate.getFullYear()}-${(
    "0" +
    (currentdate.getMonth() + 1)
  ).slice(-2)}-${pad(currentdate.getDate())} ${pad(
    currentdate.getHours()
  )}:${pad(currentdate.getMinutes())}:${pad(currentdate.getSeconds())}`;

  return datetime;
};

const setInitials = (name) => {
  return name.charAt(0);
};

const currentUserToken = (req) => {
  return req.user;
};

const groupBy = (arr, key) => {
  return arr.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const onlyCapitalLetters = (str) => {
  return str.replace(/[^A-Z]+/g, "");
};

const removeHTMLTags = (strToSanitize) => {
  return strToSanitize
    .replace(/<br>/g, "\n")
    .replace(/(&[a-z]+;|&#[0-9]+;)/g, "")
    .replace(/<\/?[^>]+>/gi, "");
};

const sanitizeUserName = (username) => {
  // SYMBOLS @ AND - ARE INTENTIONALLY OMMITTED FOR EMAIL USERNAMES
  return username
    .replace(/[ ]/g, "_")
    .replace(/[`!#$%^&*()+=\[\]{};':"\\|,<>\/?~]/g, "")
    .toLowerCase();
};

// "Safely" adds prop to `obj` if `val` is not "empty". Modifies the `obj` in place.
const addProp = (val, propName, obj, format = null) => {
  if (!empty(val)) obj[propName] = format ? format(val) : val;
};

const parsePhoneNosCol = (str) => {
  const matches = str
    ? str
        .replace(/\+63/g, "0")
        .replace(/\-/g, "")
        .match(/09[0-9]{9}/g)
    : null;

  if (matches && matches.length > 0) return matches[0];

  return null;
};

const getFileExtension = (str) => {
  return str.split(".").pop();
};

const allPropsEmpty = (obj) => {
  return !Object.values(obj).some((val) => !empty(val));
};

const pwFromBirthDate = (date) => {
  if (!date) {
    throw new Error("`date` is required.");
  }

  const birthYear = String(date.getFullYear());
  const birthMonth = String(date.getMonth() + 1).padStart(2, "0");
  const birthDay = String(date.getDate()).padStart(2, "0");
  return `${birthMonth}/${birthDay}/${birthYear}`;
};

const log = (val, prefix) => {
  const arr = [val];
  if (prefix != null && prefix !== "") arr.unshift(prefix + ":");
  console.log(...arr);
};

// Returns a new obj NOT containing the props given
const sliceObj = (obj, ...props) => {
  const copy = { ...obj };
  for (const prop of props) delete copy[prop];
  return copy;
};

// const sliceObj = (obj, ...props) => {
//   return Object.entries(obj).reduce((acc, e) => {
//     if (props.includes(e[0])) {
//       return acc;
//     }

//     acc[e[0]] = e[1];
//     return acc;
//   }, {});
// };

const objContains = (obj1, obj2) => {
  for (const prop in obj2) {
    if (obj1[prop] !== obj2[prop]) return false;
  }

  return true;
};

const tryCatch = (fn, ...args) => {
  try {
    return [null, fn(...args)];
  } catch (err) {
    return [err];
  }
};

const tryCatchAsync = async (fn, ...args) => {
  try {
    return [null, await fn(...args)];
  } catch (err) {
    return [err];
  }
};

const match = (val, defaultVal, ...matchers) => {
  for (const match of matchers) {
    if (typeof match[0] === "function") {
      if (match[0](val)) return match[1];
    } else {
      if (match[0] === val) return match[1];
    }
  }

  return defaultVal;
};

const maskName = (fullName) => {
  const names = fullName.split(" ");

  // Function to mask each name
  const mask = (name) => {
    if (name.length <= 3) {
      return name.slice(0, 2) + "*"; // For short names, mask the last character
    }
    const firstPart = name.slice(0, 2); // First two characters visible
    const lastPart = name.slice(-1); // Last character visible
    const maskedPart = "*".repeat(name.length - 3); // Mask the middle part
    return firstPart + maskedPart + lastPart;
  };

  // Map over all names and mask them individually
  return names.map(mask).join(" ");
};

const formatAmount = (amount) => {
  return parseFloat(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const logMessage = (message) => {
  const timestamp = new Date().toISOString();
  logStream.write(`[${timestamp}] ${message}\n`);
  console.log(message); // Also still log to stdout just in case
};

module.exports = {
  getIp,
  randomString,
  groupBy,
  pad,
  empty,
  objEmpty,
  isObjAndEmpty,
  objEmpty,
  camelize,
  snakify,
  generateNumber,
  generateEntityCode,
  buildTree,
  buildHashTable,
  buildBreadcrumbs,
  generateAlphaNumericStr,
  pascalToCamel,
  changeCase,
  isObj,
  isMap,
  isArr,
  isStr,
  isInt,
  isDecimal,
  isNumber,
  isPrimitive,
  isFlat,
  isDate,
  isNone,
  isError,
  deepPropEmpty,
  getMissingProp,
  presentify,
  presentifyObj,
  treeToStr,
  treeToMultiLinerStr,
  multiLineToOneLine,
  getAge,
  getDistinct,
  sortStringArr,
  sortNumberArr,
  jsDateToISOString,
  formatDate,
  compareArr,
  isValidIcd10Code,
  sanitizeSQLLikeValue,
  currentUserToken,
  setInitials,
  currentDateTime,
  onlyCapitalLetters,
  removeHTMLTags,
  sanitizeUserName,
  addProp,
  parsePhoneNosCol,
  getFileExtension,
  allPropsEmpty,
  addEllipsis,
  pwFromBirthDate,
  log,
  logMessage,
  convertTime12to24,
  sliceObj,
  objContains,
  tryCatch,
  tryCatchAsync,
  match,
  maskName,
  formatAmount,
  queryToStr,
};
