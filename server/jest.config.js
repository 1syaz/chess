export default {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  roots: ["<rootDir>/tests"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "((\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
