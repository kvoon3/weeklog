import { cac } from 'cac'
import { run } from '.'
import { name, version } from '../package.json'

const cli = cac(name)

cli.command('[...cwd]', 'projects root')
  .option('--dry-run', 'Output only')
  .option('--output [dir]', 'Output dir')
  .option('--weeks-back <n>', 'How many weeks back to include', { default: 0 })
  .option('--all', 'Generate all weeks of this year', { default: 0 })
  .action((cwd, options) => {
    run({
      cwd,
      ...options,
    })
  })

cli.help()
cli.version(version)
cli.parse()
