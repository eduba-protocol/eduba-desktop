import { type Configuration, DefinePlugin } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import { resolve } from 'path';

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'postcss-loader' }],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins: [
    ...plugins,
    new DefinePlugin({
      'process.env.FEATURE_BACKUP':  JSON.stringify(process.env.FEATURE_BACKUP || ''),
    })
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      "@":  resolve(__dirname, 'src'),
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",     // Must be below test-utils
      "react/jsx-runtime": "preact/jsx-runtime"
    },
  },
};
