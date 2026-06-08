// =============================================================================
// fileHighlight — syntax highlighting for read-only file-preview cards.
//
// Uses highlight.js (the "common" language pack — ~36 widely-used grammars) to
// turn file text into themed HTML. The host sends VS Code's languageId when the
// file is open in an editor; otherwise we fall back to the file extension, then
// to highlight.js auto-detection. Token colors are themed in canvas.css against
// the VS Code light/dark body class.
// =============================================================================

import hljs from 'highlight.js/lib/common'

/** VS Code languageId → highlight.js language name (only where they differ). */
const LANG_ALIAS: Record<string, string> = {
  typescriptreact: 'typescript',
  javascriptreact: 'javascript',
  shellscript: 'bash',
  jsonc: 'json',
  jsonl: 'json',
  html: 'xml',
  svg: 'xml',
  vue: 'xml',
  svelte: 'xml',
  xsl: 'xml',
  'objective-c': 'objectivec',
  'objective-cpp': 'objectivec',
  toml: 'ini',
  dockercompose: 'yaml',
}

/** File extension → highlight.js language (fallback when no languageId). */
const EXT_LANG: Record<string, string> = {
  ts: 'typescript',
  tsx: 'typescript',
  mts: 'typescript',
  cts: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  py: 'python',
  rb: 'ruby',
  go: 'go',
  rs: 'rust',
  java: 'java',
  c: 'c',
  h: 'cpp',
  hpp: 'cpp',
  cc: 'cpp',
  cxx: 'cpp',
  cpp: 'cpp',
  cs: 'csharp',
  php: 'php',
  swift: 'swift',
  kt: 'kotlin',
  kts: 'kotlin',
  sh: 'bash',
  bash: 'bash',
  zsh: 'bash',
  fish: 'bash',
  yml: 'yaml',
  yaml: 'yaml',
  json: 'json',
  md: 'markdown',
  markdown: 'markdown',
  html: 'xml',
  htm: 'xml',
  xml: 'xml',
  css: 'css',
  scss: 'scss',
  less: 'less',
  sql: 'sql',
  lua: 'lua',
  pl: 'perl',
  r: 'r',
  ini: 'ini',
  toml: 'ini',
  diff: 'diff',
  patch: 'diff',
  graphql: 'graphql',
  gql: 'graphql',
}

function resolveLanguage(languageId: string | undefined, filePath: string): string | undefined {
  if (languageId) {
    const mapped = LANG_ALIAS[languageId] ?? languageId
    if (hljs.getLanguage(mapped)) return mapped
  }
  const ext = filePath.split('.').pop()?.toLowerCase()
  if (ext && ext !== filePath.toLowerCase()) {
    const mapped = EXT_LANG[ext]
    if (mapped && hljs.getLanguage(mapped)) return mapped
  }
  return undefined
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => (c === '&' ? '&amp;' : c === '<' ? '&lt;' : '&gt;'))
}

/** Highlight `content` into `codeEl` (a `<code>` element). Sets the `hljs`
 * class so the themed token CSS applies. Falls back to escaped plain text if a
 * grammar throws. */
export function highlightInto(
  codeEl: HTMLElement,
  content: string,
  languageId: string | undefined,
  filePath: string,
): void {
  const lang = resolveLanguage(languageId, filePath)
  let html: string
  let cls = 'hljs'
  try {
    if (lang) {
      html = hljs.highlight(content, { language: lang }).value
      cls += ` language-${lang}`
    } else {
      const res = hljs.highlightAuto(content)
      html = res.value
      if (res.language) cls += ` language-${res.language}`
    }
  } catch {
    html = escapeHtml(content)
  }
  codeEl.className = cls
  codeEl.innerHTML = html
}
