const path = require('path')
const convertLessToJson = require('./utils/convertLessToJson')

module.exports = {
  'less-css': {
    modules: true,
    localIdentName: '[folder]-[local]'
  },
  'less-postcss': {
    plugins: [
      require('autoprefixer')(),
      require('postcss-pxtorem')({
        'rootValue': 125,
        'propList': ['*']
      })
    ]
  }
}
