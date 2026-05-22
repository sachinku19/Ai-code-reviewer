import { Link } from "react-router-dom";
import Page from "../components/common/Page.jsx";

export default function NotFound() {
  return (
    <Page className="not-found">
      <div className="glass-card">
        <span className="eyebrow">404</span>
        <h1>This route drifted out of orbit.</h1>
        <p>The product is alive, but this page is not part of the map.</p>
        <Link className="primary-button" to="/">Go home</Link>
      </div>
    </Page>
  );
}
