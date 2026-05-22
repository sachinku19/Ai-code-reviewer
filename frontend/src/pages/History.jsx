import { Copy, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Page from "../components/common/Page.jsx";
import MarkdownRenderer from "../components/common/MarkdownRenderer.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { historyApi } from "../services/api.js";
import { copyText } from "../utils/exporters.js";

export default function History() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const { showToast } = useToast();

  const load = async () => {
    const { data } = await historyApi.list();
    setItems(data.items);
    setActive(data.items[0] || null);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    await historyApi.delete(id);
    showToast("Review deleted", "success");
    load();
  };

  const clear = async () => {
    await historyApi.clear();
    showToast("History cleared", "success");
    load();
  };

  return (
    <Page className="history page-pad">
      <div className="page-hero compact-hero">
        <div><span className="eyebrow">History</span><h1>Review memory</h1><p>Every saved analysis, ready to reopen and export.</p></div>
        <button className="ghost-button" onClick={clear} disabled={!items.length}>Clear history</button>
      </div>
      <div className="history-grid">
        <aside className="glass-card history-list">
          {items.length === 0 ? <p className="muted">No saved reviews yet.</p> : items.map((item) => (
            <button className={active?._id === item._id ? "active" : ""} key={item._id} onClick={() => setActive(item)}>
              <strong>{item.title}</strong>
              <span>{item.language} · {item.action} · {new Date(item.createdAt).toLocaleDateString()}</span>
            </button>
          ))}
        </aside>
        <section className="glass-card history-detail">
          {!active ? <div className="empty-state"><h3>No review selected</h3><p>Run a review from the workspace and it will appear here.</p></div> : (
            <>
              <div className="panel-toolbar"><div><span className="eyebrow">{active.language}</span><h2>{active.title}</h2></div><div className="tool-actions"><button onClick={() => copyText(active.result?.summary || "")}><Copy size={16} /></button><button onClick={() => remove(active._id)}><Trash2 size={16} /></button></div></div>
              <div className="review-output">
                <section><h3>Summary</h3><p>{active.result.summary}</p></section>
                <section><h3>Bugs</h3><ul>{active.result.bugs.map((x) => <li key={x}>{x}</li>)}</ul></section>
                <section><h3>Suggestions</h3><ul>{active.result.suggestions.map((x) => <li key={x}>{x}</li>)}</ul></section>
                <section><h3>Explanation</h3><MarkdownRenderer value={active.result.explanation} /></section>
                <section><h3>Original code</h3><pre>{active.code}</pre></section>
              </div>
            </>
          )}
        </section>
      </div>
    </Page>
  );
}
