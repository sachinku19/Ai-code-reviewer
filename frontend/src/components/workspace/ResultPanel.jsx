import { Copy, Download, FileDown, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useRef } from "react";
import MarkdownRenderer from "../common/MarkdownRenderer.jsx";
import { copyText, downloadFile, exportReviewAsPdf } from "../../utils/exporters.js";
import { useToast } from "../../context/ToastContext.jsx";

const asMarkdown = (result) => {
  if (!result) return "";
  return `## Summary\n${result.summary}\n\n## Bugs\n${(result.bugs || []).map((x) => `- ${x}`).join("\n") || "- None detected"}\n\n## Suggestions\n${(result.suggestions || []).map((x) => `- ${x}`).join("\n")}\n\n## Complexity\n- Time: ${result.timeComplexity}\n- Space: ${result.spaceComplexity}\n\n## Security\n${(result.security || []).map((x) => `- ${x}`).join("\n")}\n\n## Optimized Code\n\`\`\`\n${result.optimizedCode || "No replacement code generated."}\n\`\`\``;
};

export default function ResultPanel({ result, loading }) {
  const { showToast } = useToast();
  const ref = useRef(null);
  const markdown = asMarkdown(result);

  const copy = async () => {
    await copyText(markdown);
    showToast("AI response copied", "success");
  };

  const download = () => {
    downloadFile("ai-code-review.md", markdown);
    showToast("Review downloaded", "success");
  };

  const pdf = () => {
    exportReviewAsPdf("AI Code Review", ref.current?.innerHTML || markdown);
    showToast("PDF export opened", "info");
  };

  if (loading) {
    return (
      <aside className="result-panel glass-card">
        <div className="panel-loader"><span /><strong>AI reviewer is reading your code</strong><p>Checking correctness, complexity, security, and readability.</p></div>
        <div className="skeleton-lines"><i /><i /><i /><i /></div>
      </aside>
    );
  }

  return (
    <aside className="result-panel glass-card">
      <div className="panel-toolbar">
        <div>
          <span className="eyebrow"><Sparkles size={14} /> AI Output</span>
          <h2>{result ? "Review dossier" : "Ready when you are"}</h2>
        </div>
        <div className="tool-actions">
          <button onClick={copy} disabled={!result} title="Copy response"><Copy size={16} /></button>
          <button onClick={download} disabled={!result} title="Download markdown"><Download size={16} /></button>
          <button onClick={pdf} disabled={!result} title="Export as PDF"><FileDown size={16} /></button>
        </div>
      </div>
      {!result ? (
        <div className="empty-state">
          <Zap size={36} />
          <h3>Paste code, choose an action, and get a production-grade review.</h3>
          <p>The panel will fill with bugs, improvements, complexity, security notes, and a better version.</p>
        </div>
      ) : (
        <div ref={ref} className="review-output">
          <div className="score-ring" style={{ "--score": `${result.score || 80}%` }}>
            <strong>{result.score || 80}</strong><span>Quality</span>
          </div>
          <section><h3>Summary</h3><p>{result.summary}</p></section>
          <section className="insight-grid">
            <div><ShieldCheck size={18} /><strong>Time</strong><p>{result.timeComplexity}</p></div>
            <div><ShieldCheck size={18} /><strong>Space</strong><p>{result.spaceComplexity}</p></div>
          </section>
          <section><h3>Detected bugs</h3><ul>{(result.bugs?.length ? result.bugs : ["No obvious bugs detected."]).map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h3>Suggestions</h3><ul>{(result.suggestions || []).map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h3>Security analysis</h3><ul>{(result.security || []).map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h3>Best practices</h3><ul>{(result.bestPractices || []).map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h3>Explanation</h3><MarkdownRenderer value={result.explanation} /></section>
          {result.optimizedCode && <section><h3>Optimized code</h3><pre>{result.optimizedCode}</pre></section>}
        </div>
      )}
    </aside>
  );
}
