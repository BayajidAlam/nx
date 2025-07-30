module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-max-line-length": [2, "always", 1000], // Body limit increased to 1000
    "header-max-length": [2, "always", 300], // Header limit set to 120
  },
};
