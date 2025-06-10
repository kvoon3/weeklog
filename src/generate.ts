import { generateMarkDown, getGitDiff, parseCommits } from 'changelogen'
import { config } from './config'

export async function generate(since: string): Promise<string> {
  const rawCommits = await getGitDiff(since)
  const commits = parseCommits(rawCommits, config)
  delete config.repo
  const content = generateMarkDown(commits, {
    ...config,
    repo: {},
  })

  return content
}
