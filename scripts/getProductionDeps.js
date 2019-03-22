const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const flattenNpmDeps = (obj, deps) => {
  const { dependencies } = (obj || {})
  if (typeof dependencies !== 'object') {
    return
  }
  Object.keys(dependencies).forEach(dep => {
    deps[dep] = true
    flattenNpmDeps(dependencies[dep], deps)
  })
}

const readProductionDeps = (cmd) => {
  let output
  try {
    output = execSync(cmd)
  } catch (e) {
    output = e.stdout
  }
  return JSON.parse(output.toString())
}

const flattenYarnDeps = (obj, deps) => {
  const { children } = (obj || {})
  if (!children || children.length === 0) {
    return
  }
  children.forEach(depObject => {
    const lastIndex = depObject.name.lastIndexOf('@')
    const dep = lastIndex >= 0 ? depObject.name.substr(0, lastIndex) : depObject.name
    deps[dep] = true
    flattenYarnDeps(depObject, deps)
  })
}

const useYarn = () => {
  const deps = {}
  const json = readProductionDeps('yarn list --prod --json 2>/dev/null')
  flattenYarnDeps({ children: json.data.trees }, deps)
  return Object.keys(deps)
}

const useNpm = () => {
  const deps = {}
  const json = readProductionDeps('npm ls --prod --json 2>/dev/null')
  flattenNpmDeps(json, deps)
  return Object.keys(deps)
}

module.exports = () => {
  const hasYarnLock = fs.existsSync(path.resolve('.', 'yarn.lock'))
  return hasYarnLock ? useYarn() : useNpm()
}
