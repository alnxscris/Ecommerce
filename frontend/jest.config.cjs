module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transform: { '^.+\\.[jt]sx?$': 'babel-jest' },
  transformIgnorePatterns: [
    '/node_modules/(?!(msw|@mswjs|until-async|headers-polyfill|strict-event-emitter|nanoid|undici|whatwg-url|fetch-blob|formdata-polyfill)/)'
  ],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/src/tests/fileMock.js'
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

