/**
 * Modified from: https://github.com/unjs/changelogen/blob/main/src/git.ts
 *
 * Copyright (c) Pooya Parsa <pooya@pi0.io>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { execCommand } from './exec'

export interface GitCommitAuthor {
  name: string
  email: string
}

export interface RawGitCommit {
  message: string
  body: string
  shortHash: string
  author: GitCommitAuthor
}

export async function getGitDiff(
  since: string,
  until: string,
  cwd?: string,
): Promise<RawGitCommit[]> {
  // https://git-scm.com/docs/pretty-formats
  const r = execCommand(
    `git --no-pager log --since="${since}" --until="${until}" --pretty="----%n%s|%h|%an|%ae%n%b" --name-status`,
    cwd,
  )
  return r
    .split('----\n')
    .splice(1)
    .map((line) => {
      const [firstLine, ..._body] = line.split('\n')
      const [message, shortHash, authorName, authorEmail]
        = firstLine.split('|')
      const r: RawGitCommit = {
        message,
        shortHash,
        author: { name: authorName, email: authorEmail },
        body: _body.join('\n'),
      }
      return r
    })
}
