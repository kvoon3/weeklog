import { cac } from 'cac'
import { run } from '.'
import { name, version } from '../package.json'

const cli = cac(name)

cli.command('[...cwd]', 'projects root')
  .option('--dry-run', 'dry')
  .option('--output [dir]', 'output dir')
  .option('--weeks-back <n>', 'how many weeks back to include', { default: 0 })
  .action((cwd, options) => {
    run({
      cwd,
      ...options,
    })
  })

cli.help()
cli.version(version)
cli.parse()
