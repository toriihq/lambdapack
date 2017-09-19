module.exports = (entry) => `
import webpackConfig from './node_modules/lambdapack/scripts/webpack.config.babel.js'

export default webpackConfig({
  entry: '${entry}'
})
`
