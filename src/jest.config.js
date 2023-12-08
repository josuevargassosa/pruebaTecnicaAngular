module.exports = {
  preset: "jest-preset-angular",
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/src/setup-jest.ts"],
  testMatch: ["**/+(*.)+(spec).+(ts)"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  moduleNameMapper: {
    "@app/(.*)": "<rootDir>/src/app/$1",
    "@env": "<rootDir>/src/environments/environment",
  },
  transform: {
    "^.+\\.ts$": "ts-jest",
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/", "\\.pnp\\.[^\\/]+$"],
};
