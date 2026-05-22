import Editor, { DiffEditor } from "@monaco-editor/react";
import { AnimatePresence, motion } from "framer-motion";
import { Clipboard, Code2, Download, Eraser, Play, RefreshCw, WandSparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ResultPanel from "../components/workspace/ResultPanel.jsx";
import Page from "../components/common/Page.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { aiApi, userApi } from "../services/api.js";
import { copyText, downloadFile } from "../utils/exporters.js";
import { languages, starterCode } from "../utils/languages.js";

export default function Workspace() {
  const [code, setCode] = useState(starterCode);
  const [language, setLanguage] = useState("javascript");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    userApi.settings().then(({ data }) => setLanguage(data.settings.defaultLanguage || "javascript")).catch(() => {});
  }, []);

  const title = useMemo(() => `${language} review ${new Date().toLocaleDateString()}`, [language]);

  const run = async (action) => {
    if (!code.trim()) return showToast("Paste some code first", "error");
    setLoading(true);
    try {
      const apiCall = action === "optimize" ? aiApi.optimize : action === "explain" ? aiApi.explain : aiApi.review;
      const { data } = await apiCall({ code, language, title });
      setResult(data.result);
      showToast(`${action} completed`, "success");
    } catch (error) {
      showToast(error.response?.data?.message || "AI request failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    await copyText(code);
    showToast("Code copied", "success");
  };

  const downloadCode = () => {
    downloadFile(`snippet.${language === "javascript" ? "js" : language}`, code);
    showToast("Code downloaded", "success");
  };

  return (
    <Page className="workspace page-pad">
      <div className="page-hero compact-hero">
        <div><span className="eyebrow"><Code2 size={14} /> AI Review Workspace</span><h1>Paste code. Get senior feedback.</h1></div>
        <div className="workspace-tabs">
          <button className={!showDiff ? "active" : ""} onClick={() => setShowDiff(false)}>Editor</button>
          <button className={showDiff ? "active" : ""} onClick={() => setShowDiff(true)} disabled={!result?.optimizedCode}>Compare</button>
        </div>
      </div>
      <div className="workspace-grid">
        <section className="editor-panel glass-card">
          <div className="editor-toolbar">
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              {languages.map((item) => <option value={item} key={item}>{item}</option>)}
            </select>
            <div className="tool-actions">
              <button onClick={copyCode} title="Copy code"><Clipboard size={16} /></button>
              <button onClick={downloadCode} title="Download code"><Download size={16} /></button>
              <button onClick={() => { setCode(""); setResult(null); }} title="Clear code"><Eraser size={16} /></button>
            </div>
          </div>
          <div className="monaco-shell">
            <AnimatePresence mode="wait">
              {showDiff && result?.optimizedCode ? (
                <motion.div key="diff" className="editor-fill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <DiffEditor original={code} modified={result.optimizedCode} language={language} theme="vs-dark" options={{ minimap: { enabled: false }, fontSize: 14 }} />
                </motion.div>
              ) : (
                <motion.div key="editor" className="editor-fill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Editor value={code} onChange={(value) => setCode(value || "")} language={language} theme="vs-dark" options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: "on", padding: { top: 18 } }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="workspace-actions">
            <button className="primary-button" onClick={() => run("review")} disabled={loading}><Play size={17} /> Review</button>
            <button className="ghost-button" onClick={() => run("optimize")} disabled={loading}><WandSparkles size={17} /> Optimize</button>
            <button className="ghost-button" onClick={() => run("explain")} disabled={loading}><RefreshCw size={17} /> Explain</button>
          </div>
        </section>
        <ResultPanel result={result} loading={loading} />
      </div>
    </Page>
  );
}
