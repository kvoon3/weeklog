import { accessSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { toArray } from '@antfu/utils'
import { endOfWeek, formatISO, getISOWeek, startOfWeek, subWeeks } from 'date-fns'
import c from 'picocolors'
import { globSync } from 'tinyglobby'
import { generate } from './generate'
import { getAllWeekRange, getWeekRange, type WeekRange } from './utils'

export async function run(options?: {
  days?: number
  cwd?: string | string[]
  output?: string
  dryRun: boolean
  weeksBack?: number
  all?: boolean
}): Promise<void> {
  const {
    cwd = './',
    output = './',
    dryRun = false,
    weeksBack = 0,
    all,
  } = options || {}
  const cwds = toArray(cwd)

  const paths = cwds.flatMap(getProjectPaths)

  const lines: string[] = [

  ]

  const genWeeklog = async (weekRange: WeekRange) => {
    const { start: since, end: until, weekNum } = weekRange

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

    if (dryRun) {
      console.log(content)
      return
    }

    const filepath = resolve(output, `CHANGELOG.${weekNum}.md`)

    if (!content) {
      console.log(c.yellow('Not find git commits'))
      return
    }

    await writeFile(
      filepath,
      content,
    )

    console.log(`${c.bgGreen('Done')}: ${c.green(filepath)}`)
  }

  const now = new Date()
  const date = subWeeks(now, weeksBack)
  if(all)
    getAllWeekRange(date).forEach(genWeeklog)
  else
    getWeekRange(date)
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

function getWeekInfo(date: Date): { weekNumber: number, since: string, until: string } {
  const weekNumber = getISOWeek(date)
  const since = formatISO(startOfWeek(date, { weekStartsOn: 1 }))
  const until = formatISO(endOfWeek(date, { weekStartsOn: 1 }))

  return {
    weekNumber,
    since,
    until,
  }
}
