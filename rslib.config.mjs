export default {
  lib: [
    {
      format: 'esm',
      syntax: 'es2021',
      dts: true,
      autoExtension: true,
    },
  ],
  bundle: false,
  outBase: './src',
  output: {
    target: 'node',
    sourceMap: false,
    distPath: {
      root: './dist',
    },
  },
};
