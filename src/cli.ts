import { cac } from 'cac'
import { run } from '.'
import { name, version } from '../package.json'

const cli = cac(name)

export interface Args {
  name?: string
  rewrite?: boolean
  startWeek?: number
  since?: string
}

cli
  .command('', 'run')
  .option('--name', 'project name')
  .option('--rewrite', 'rewrite last changelog')
  .option('--since', 'commits more recent than a specific date.')
  .option('--startWeek', 'start week number')
  .action((_, args: Args) => {
    run(args)
  })

cli.help()
cli.version(version)
cli.parse()
