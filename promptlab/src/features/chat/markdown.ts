export function markdownToHtml(markdown: string) {
  const codeBlocks: string[] = []
  const inlineCode: string[] = []
  let html = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

  html = html.replace(/```(?:[\w-]+)?\n([\s\S]*?)```/g, (_, code: string) => {
    const token = `MARKDOWNCODEBLOCK${codeBlocks.length}TOKEN`
    codeBlocks.push(`<pre><code>${code.trimEnd()}</code></pre>`)
    return token
  })
  html = html.replace(/`([^`\n]+)`/g, (_, code: string) => {
    const token = `MARKDOWNINLINECODE${inlineCode.length}TOKEN`
    inlineCode.push(`<code>${code}</code>`)
    return token
  })

  html = html
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^[-*] (.+)$/gm, '<div class="markdown-list-item">• $1</div>')
    .replace(/^(\d+)\. (.+)$/gm, '<div class="markdown-list-item">$1. $2</div>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(
      /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
    )
    .replace(/\n/g, '<br />')

  inlineCode.forEach((code, index) => {
    html = html.replace(`MARKDOWNINLINECODE${index}TOKEN`, code)
  })
  codeBlocks.forEach((code, index) => {
    html = html.replace(`MARKDOWNCODEBLOCK${index}TOKEN`, code)
  })
  return html
}
