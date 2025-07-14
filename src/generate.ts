import { generateMarkDown, parseCommits } from 'changelogen'
import { config } from './config'
import { getGitDiff } from './vender/git'

export async function generate(since: string, until: string, cwd = './'): Promise<string> {
  try {
    const rawCommits = await getGitDiff(since, until, cwd)
    const commits = parseCommits(rawCommits, {
      ...config,
      cwd,
    })

    if (!commits.length)
      return ''

    delete config.repo
    const content = generateMarkDown(commits, {
      ...config,
      repo: {},
    })

    return content
  }
  catch (error) {
    console.error('error', error)
    return ''
  }
}
