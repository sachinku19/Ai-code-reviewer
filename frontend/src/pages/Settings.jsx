import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import Page from "../components/common/Page.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { userApi } from "../services/api.js";
import { languages } from "../utils/languages.js";

export default function Settings() {
  const [settings, setSettings] = useState({ defaultLanguage: "javascript", autoSaveReviews: true, denseMode: false, emailReports: false, aiPersonality: "balanced", themeAccent: "violet" });
  const { showToast } = useToast();

  useEffect(() => { userApi.settings().then(({ data }) => setSettings(data.settings)); }, []);

  const save = async (event) => {
    event.preventDefault();
    const { data } = await userApi.updateSettings(settings);
    setSettings(data.settings);
    showToast("Settings saved", "success");
  };

  return (
    <Page className="settings page-pad">
      <div className="page-hero compact-hero"><div><span className="eyebrow">Settings</span><h1>Tune your AI workspace</h1></div></div>
      <form className="glass-card settings-card" onSubmit={save}>
        <label>Default language<select value={settings.defaultLanguage} onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}>{languages.map((x) => <option key={x}>{x}</option>)}</select></label>
        <label>AI review style<select value={settings.aiPersonality} onChange={(e) => setSettings({ ...settings, aiPersonality: e.target.value })}><option value="balanced">Balanced</option><option value="strict">Strict</option><option value="mentor">Mentor</option></select></label>
        <label>Accent<select value={settings.themeAccent} onChange={(e) => setSettings({ ...settings, themeAccent: e.target.value })}><option>violet</option><option>cyan</option><option>emerald</option></select></label>
        <div className="toggle-row"><span>Auto-save reviews</span><input type="checkbox" checked={settings.autoSaveReviews} onChange={(e) => setSettings({ ...settings, autoSaveReviews: e.target.checked })} /></div>
        <div className="toggle-row"><span>Dense dashboard mode</span><input type="checkbox" checked={settings.denseMode} onChange={(e) => setSettings({ ...settings, denseMode: e.target.checked })} /></div>
        <div className="toggle-row"><span>Email weekly reports</span><input type="checkbox" checked={settings.emailReports} onChange={(e) => setSettings({ ...settings, emailReports: e.target.checked })} /></div>
        <button className="primary-button"><Save size={17} /> Save settings</button>
      </form>
    </Page>
  );
}
