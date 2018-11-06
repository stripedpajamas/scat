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
        case 'ssb-names': {
          const pullStreamVersion = pkg.devDependencies['pull-stream'] || '^3.6.8'
          pkg.dependencies = {
            ...pkg.dependencies,
            'pull-stream': pullStreamVersion
          }
          delete pkg.devDependencies['pull-stream']
          context.log(`Added pull-stream@${pullStreamVersion} to ${pkg.name} dependencies`)
          break
        }
        case 'ssb-friends': {
          pkg.dependencies = {
            ...pkg.dependencies,
            'pull-notify': '^0.1.1'
          }
          context.log('Added pull-notify@$^0.1.1 to ssb-friends dependencies')
          break
        }
        case 'layered-graph': {
          pkg.dependencies = {
            ...pkg.dependencies,
            'pull-stream': '^3.6.9'
          }
          context.log('Added pull-stream@^3.6.9 to layered-graph dependencies')
          break
        }
        default:
          break
      }
      return pkg
    }
  }
}