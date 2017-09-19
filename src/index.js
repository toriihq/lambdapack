const fs = require('fs')
const path = require('path')
const webpackTemplate = require('./webpack.config.template')

const requireJsonIfExists = (file) => {
  const filePath = path.resolve('.', file)
  const exists = fs.existsSync(filePath)
  return exists && JSON.parse(fs.readFileSync(filePath).toString())
}

const requireJsonOrFail = (file) => {
  const filePath = path.resolve('.', file)
  const exists = fs.existsSync(filePath)
  if (!exists) {
    throw new Error(`"${file}" could not be found. Please run this in the root folder of your project`)
  }

  return JSON.parse(fs.readFileSync(filePath).toString())
}

const handlePackageJson = () => {
  const scripts = {
    'build': 'webpack --progress',
    'start': 'webpack --watch',
    'start-server': 'NODE_ENV=$UP_STAGE node build/index.js'
  }

  const json = requireJsonOrFail('package.json')

  if (json.name === 'lambdapack') {
    throw new Error('Do not run "lambdapack" on the "lambdapack" project')
  }

  Object.keys(scripts).forEach(script => {
    if (json.scripts && json.scripts[script]) {
      throw new Error(`package.json already includes a "${script}" script "${json.scripts[script]}". Remove it and run "lambdapack" again`)
    }
  })

  json.scripts = Object.assign({}, json.scripts, scripts)

  return json
}

const handleBabelRc = () => {
  const preset = [
    'env',
    {
      targets: {
        node: '6.10.3'
      }
    }
  ]

  const json = requireJsonIfExists('.babelrc') || {
    presets: []
  }

  json.presets = json.presets || []
  json.presets.push(preset)

  return json
}

const handleWebpack = (entry) => {
  const webpackFiles = [
    'webpack.config.js',
    'webpack.config.babel.js'
  ]
  webpackFiles.forEach(file => {
    const exists = fs.existsSync(path.resolve('.', file))
    if (exists) {
      throw new Error(`"${file}" already exists. "lambdapack" is designed to take over webpack transpiling. Remove it and run "lambdapack" again`)
    }
  })

  if (entry.substr(0, 2) !== './') {
    entry = './' + entry
  }

  return webpackTemplate(entry)
}

const handleUpJson = () => {
  const hooks = {
    'build': [
      'npm run build',
      'node ./node_modules/lambdapack/scripts/createUpIgnoreFile.js'
    ],
    'clean': [
      'rm -f .upignore'
    ]
  }

  const json = requireJsonIfExists('up.json') || {
    hooks: {}
  }

  Object.keys(hooks).forEach(hook => {
    if (json.hooks && json.hooks[hook]) {
      throw new Error(`up.json already includes a "${hook}" script "${json.hooks[hook]}". Remove it and run "lambdapack" again`)
    }
  })

  json.hooks = Object.assign({}, json.hooks, hooks)
  json.proxy = json.proxy || {}
  json.proxy.command = 'npm run start-server'

  return json
}

const writeJson = (file, json) => {
  const data = (typeof json === 'string') ? json : JSON.stringify(json, null, 2)
  fs.writeFileSync(path.resolve('.', file), data)
}

const init = () => {
  const packageJson = handlePackageJson()
  const babelRcJson = handleBabelRc()
  const webpackConfig = handleWebpack(packageJson.main || 'server.js')
  const upJson = handleUpJson()

  writeJson('package.json', packageJson)
  writeJson('.babelrc', babelRcJson)
  writeJson('webpack.config.babel.js', webpackConfig)
  writeJson('up.json', upJson)
}

module.exports = {
  init
}