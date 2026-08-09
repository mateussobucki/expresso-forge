export function buildPrettierConfig() {
  return `{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 80,
  "tabWidth": 2
}
`;
}

export function buildPrettierIgnore() {
  return `node_modules
package-lock.json
`;
}