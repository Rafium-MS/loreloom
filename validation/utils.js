function asTrimmedString(value) {
  return String(value ?? '').trim();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = { asTrimmedString, capitalize };
