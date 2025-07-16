import { accessSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { toArray } from '@antfu/utils'
import { formatISO, subWeeks } from 'date-fns'
import c from 'picocolors'
import { globSync } from 'tinyglobby'
import { generate } from './generate'
import { getAllWeekRange, getWeekRange, type WeekRange } from './utils'
import clipboard from 'clipboardy'

export async function run(options?: {
  days?: number
  cwd?: string | string[]
  output?: string
  dryRun: boolean
  weeksBack?: number
  all?: boolean
  copy?: boolean
}): Promise<void> {
  const {
    cwd = './',
    output = './',
    dryRun = false,
    weeksBack = 0,
    all,
    copy: isCopy
  } = options || {}
  const cwds = toArray(cwd)

  const paths = cwds.flatMap(getProjectPaths)

  const genWeeklog = async (weekRange: WeekRange) => {
    const { start: since, end: until, weekNum } = weekRange
    const lines: string[] = [

    ]

    for (const path of paths) {
      const content = await generate(formatISO(since), formatISO(until), path)

      if (content) {
        lines.push(
          `## ${basename(path)}`,
          content.replace('## ...', '').trim(),
        )

        console.log(c.green('Commit Detected:'), path)
      }
    }
    await makeSureDir(output)

    const content = lines
      .join('\n\n')

    if(isCopy)
      clipboard.writeSync(content)

    const filepath = resolve(output, `CHANGELOG.${weekNum}.md`)

    if (!content) {
      console.log(c.yellow('Not find git commits'))
      return
    }

    if (dryRun) {
      console.log(content)
      return
    }
    else {
      await writeFile(
        filepath,
        content,
      )

      console.log(`${c.bgGreen('Done')}: ${c.green(filepath)}`)
    }

  }

  const now = new Date()
  const date = subWeeks(now, weeksBack)
  if (all)
    getAllWeekRange(date).forEach(genWeeklog)
  else
    genWeeklog(getWeekRange(date))
}

function getProjectPaths(cwd: string): string[] {
  return (globSync(['*', '!node_modules'], {
    cwd,
    onlyDirectories: true,
    deep: 1,
  }))
    .filter((d) => {
      const toFilepath = (filename: string): string => resolve(cwd, d, filename)
      return [toFilepath('package.json'), toFilepath('.git')].every(path => isAccessible(path))
    })
    .map(i => resolve(cwd, i))
}

function isAccessible(path: string): boolean {
  try {
    accessSync(path)
    return true
  }
  catch {
    return false
  }
}

export async function makeSureDir(dir: string): Promise<void> {
  if (!isAccessible(dir))
    await mkdir(dir, { recursive: true })
}
