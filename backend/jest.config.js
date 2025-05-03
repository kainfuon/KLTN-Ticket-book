// jest.config.js
export default {
    testEnvironment: 'node',
    transform: {}, // giữ nguyên nếu bạn không dùng Babel
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    
  };
  