import { marked } from 'marked';
import katex from 'katex';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Render Markdown with inline & display KaTeX math
 */
export function renderMarkdownWithMath(content) {
  if (!content) return '';

  try {
    // 1. Process Display Math: $$ ... $$
    let processed = content.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
      try {
        return katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
      } catch (err) {
        return `<pre class="katex-error">${math}</pre>`;
      }
    });

    // 2. Process Inline Math: $ ... $ (excluding escaped \$)
    processed = processed.replace(/(?<!\\)\$([^\$\n]+?)\$/g, (match, math) => {
      try {
        return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
      } catch (err) {
        return `<code class="katex-error">${math}</code>`;
      }
    });

    // 3. Render through marked
    return marked.parse(processed);
  } catch (e) {
    console.error('Markdown parse error:', e);
    return content;
  }
}
