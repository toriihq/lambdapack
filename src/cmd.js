#!/usr/bin/env node

const lambdapack = require('./')

try {
  lambdapack.init()
  console.log('')
  console.log('Changed files: (check them into source control)')
  console.log('  package.json')
  console.log('  up.json')
  console.log('  webpack.config.babel.js')
  console.log('  .babelrc')
  console.log('')
  console.log('Usage:')
  console.log('  npm run start          Start the server and watch for file changes (dev mode)')
  console.log('  npm run start-server   Start the server')
  console.log('  npm run build          Bundle the project into build/index.js')
  console.log('  up start               Run local dev server (after build)')
  console.log('  up                     Deploy to development')
  console.log('  up deploy production   Deploy to production')
  console.log('  up build               Create out.zip')
  console.log('')
} catch (e) {
  console.error('')
  console.error('Error:', e.message)
  console.error('\nNo changes made, fix the errors and try again')
  console.error('')
  process.exit(1)
}
