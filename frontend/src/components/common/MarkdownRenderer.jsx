const escapeHtml = (value = "") =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export default function MarkdownRenderer({ value = "" }) {
  const html = escapeHtml(value)
    .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/`([^`]+)`/gim, "<code>$1</code>")
    .replace(/^\- (.*$)/gim, "<li>$1</li>")
    .replace(/\n/g, "<br />");

  return <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />;
}
