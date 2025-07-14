import { cac } from 'cac'
import { run } from '.'
import { name, version } from '../package.json'

const cli = cac(name)

cli.command('[...cwd]', 'projects root')
  .option('--dry-run', 'dry')
  .option('--output [dir]', 'output dir')
  .action((cwd, options) => {
    run({
      cwd,
      ...options,
    })
  })

cli.help()
cli.version(version)
cli.parse()
