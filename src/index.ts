import type { Args } from './cli'
import { writeFile } from 'node:fs/promises'
import { glob } from 'tinyglobby'
import { generate } from './generate'

export async function run(options: Args): Promise<void> {
  const {
    rewrite = false,
    startWeek = 0,
    since = '7 days age',
    name = '',
  } = options || {}

  const changelogs = await glob('./CHANGELOG*')

  const lastWeek = Math.max(
    startWeek,
    ...changelogs.map(name =>
      Number(name.split('.')[1]),
    ),
  )

  const week = rewrite ? lastWeek : lastWeek + 1

  const filename = `CHANGELOG.${week}.md`

  const header = [
    `# 第 ${week} 周`,
    name ? `项目：${name}` : '',
  ]
  const content = [
    ...header,
    (await generate(since)).trim(),
  ].filter(i => i !== '').join('\n\n')

  writeFile(filename, content)
}
