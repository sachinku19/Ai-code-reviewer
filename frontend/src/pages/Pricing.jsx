import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/common/Footer.jsx";
import Navbar from "../components/common/Navbar.jsx";
import Page from "../components/common/Page.jsx";

const plans = [
  ["Starter", "Free", ["AI reviews", "10 saved reviews", "Markdown export"]],
  ["Pro", "$12/mo", ["Unlimited reviews", "PDF export", "Code comparison", "Priority AI models"]],
  ["Team", "$39/mo", ["Shared history", "Admin controls", "Team analytics", "Security workflows"]]
];

export default function Pricing() {
  return (
    <Page className="marketing-page">
      <Navbar />
      <section className="pricing-hero">
        <span className="eyebrow"><Sparkles size={15} /> Pricing</span>
        <h1>Premium review power without enterprise friction.</h1>
      </section>
      <div className="pricing-grid standalone">
        {plans.map(([name, price, features], index) => (
          <article className={`glass-card price-card ${index === 1 ? "featured" : ""}`} key={name}>
            <h3>{name}</h3><strong>{price}</strong>
            {features.map((feature) => <p className="check-line" key={feature}><Check size={16} /> {feature}</p>)}
            <Link className={index === 1 ? "primary-button" : "ghost-button"} to="/register">Start {name}</Link>
          </article>
        ))}
      </div>
      <Footer />
    </Page>
  );
}
