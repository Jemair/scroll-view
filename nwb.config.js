const stylesheets = require('./config/stylesheet')

module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: false,
  },
  webpack: {
    rules: {
      ...stylesheets,
    },
    html: {
      template: 'src/index.html',
    },
    autoprefixer: 'android >= 4, ios >= 8',
  },
  babel: {
    presets: 'stage-1',
    plugins: [
      'syntax-dynamic-import',
      ['module-resolver', {
        root: ['.'],
        alias: {
          src: './src',
        },
      }],
    ],
  },
  devServer: {
    port: 3000,
    disableHostCheck: true,
  },
}
