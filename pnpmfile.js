module.exports = {
  hooks: {
    readPackage: (pkg, context) => {
      switch (pkg.name) {
        case 'ssb-validate': {
          const ssbKeysVersion = pkg.devDependencies['ssb-keys']
          pkg.dependencies = {
            ...pkg.dependencies,
            'ssb-keys': ssbKeysVersion
          }
          delete pkg.devDependencies['ssb-keys']
          context.log(`Added ssb-keys@${ssbKeysVersion} to ssb-validate dependencies`)
          break
        }
        case 'ssb-ws':
        case 'ssb-names':
        case 'ssb-meme': {
          const pullStreamVersion = pkg.devDependencies['pull-stream'] || '^3.6.8'
          pkg.dependencies = {
            ...pkg.dependencies,
            'pull-stream': pullStreamVersion
          }
          delete pkg.devDependencies['pull-stream']
          context.log(`Added pull-stream@${pullStreamVersion} to ${pkg.name} dependencies`)
        }
        default:
          break
      }
      return pkg
    }
  }
}