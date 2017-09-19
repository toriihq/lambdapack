const fs = require('fs')
const path = require('path')
const getProductionDeps = require('./getProductionDeps')

const config = {
  outputFile: path.resolve('.', '.upignore'),
  whitelist: [
    '.env',
    '.babelrc',
    'build',
    'babel-polyfill'
  ],
  blacklist: [
    'node_modules/*',
    'aws-sdk',
    'package-lock.json',
    'npm-debug.log',
    'yarn.lock',
    'yarn-error.log',
    '__mocks__',
    '__tests__',
    'readme*',
    'readme.md',
    'README.md',
    'CHANGELOG.md',
    'changelog*',
    'history.md',
    'CONTRIBUTING.md',
    'LICENSE',
    '*.js.map',
    'examples',
    'tests'
  ]
}

const doNotIgnore = dep => `!${dep}`

const removeBlacklistedDeps = dep => !config.blacklist.includes(dep)

const includeNamespaces = dep => {
  if (dep.indexOf('/') >= 0) {
    return dep.split('/')[0]
  }
  return dep
}

console.log('Reading production dependencies')
console.time('Done')
const productionDeps = getProductionDeps()
  .filter(removeBlacklistedDeps)
  .map(includeNamespaces)
console.timeEnd('Done')

const upignore = [].concat(
  config.blacklist,
  config.whitelist.map(doNotIgnore),
  productionDeps.map(doNotIgnore)
).join('\n')

console.log(`Writing upignore file: ${config.outputFile}`)
console.time('Done')
fs.writeFileSync(config.outputFile, upignore, { flag: 'w' })
console.timeEnd('Done')
