module.exports = {
    presets: [
      '@babel/preset-env',  // Handles modern JavaScript syntax
      '@babel/preset-react',  // Handles React JSX syntax
      '@babel/preset-typescript',  // Handles TypeScript syntax
    ],
    plugins: [
      '@babel/plugin-transform-runtime',  // Helps with asynchronous code
    ],
  };
  