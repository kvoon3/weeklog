import type { ChangelogConfig } from 'changelogen'

const defaultOutput = 'CHANGELOG.md'
export const config = <ChangelogConfig>{
  types: {
    feat: { title: '新功能', semver: 'minor' },
    perf: { title: '性能优化', semver: 'patch' },
    fix: { title: '问题修复', semver: 'patch' },
    refactor: { title: '代码重构', semver: 'patch' },
    docs: { title: '文档更新', semver: 'patch' },
    build: { title: '构建系统', semver: 'patch' },
    types: { title: '类型相关', semver: 'patch' },
    chore: { title: '杂项维护' },
    examples: { title: '示例更新' },
    test: { title: '测试相关' },
    style: { title: '代码样式' },
    ci: { title: '持续集成' },
  },
  cwd: './',
  from: '',
  to: '',
  output: defaultOutput,
  scopeMap: {},
  tokens: {
    github: '',
    // process.env.CHANGELOGEN_TOKENS_GITHUB ||
    // process.env.GITHUB_TOKEN ||
    // process.env.GH_TOKEN,
  },
  publish: {
    private: false,
    tag: 'latest',
    args: [],
  },
  templates: {
    commitMessage: 'chore(release): v{{newVersion}}',
    tagMessage: 'v{{newVersion}}',
    tagBody: 'v{{newVersion}}',
  },
  excludeAuthors: [],
  noAuthors: true,
}
