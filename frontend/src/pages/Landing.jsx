import { motion } from "framer-motion";
import { ArrowRight, Bot, BrainCircuit, Code2, Gauge, LockKeyhole, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/common/Footer.jsx";
import Navbar from "../components/common/Navbar.jsx";
import Page from "../components/common/Page.jsx";

const features = [
  { icon: BrainCircuit, title: "Staff-level AI review", text: "Find correctness, security, readability, and architecture issues in seconds." },
  { icon: Gauge, title: "Complexity intelligence", text: "Understand time and space complexity with practical optimization guidance." },
  { icon: Code2, title: "Better code generation", text: "Generate improved versions, comments, explanations, and production-ready fixes." },
  { icon: LockKeyhole, title: "Private workspace", text: "JWT protected accounts, persistent history, profile settings, and autosave controls." }
];

const faqs = [
  ["Can I use Gemini or OpenAI?", "Yes. Configure GEMINI_API_KEY or OPENAI_API_KEY on the backend and choose the provider with AI_PROVIDER."],
  ["Does it save my reviews?", "Yes. Reviews are saved to MongoDB when autosave is enabled in settings."],
  ["Can I export reviews?", "Yes. You can copy, download markdown, or export a print-ready PDF from the output panel."],
  ["Is this deployment ready?", "Yes. The frontend is ready for Vercel and the backend is ready for Render."]
];

export default function Landing() {
  return (
    <Page className="marketing-page">
      <Navbar />
      <section className="hero-section">
        <div className="orbital-bg" />
        <motion.div className="hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <span className="eyebrow"><Sparkles size={15} /> AI Code Reviewer Pro</span>
          <h1>Ship cleaner code with an AI reviewer that thinks like a senior engineer.</h1>
          <p className="typing-line">Review bugs, explain logic, optimize performance, detect complexity, and generate better code in one glowing workspace.</p>
          <div className="hero-actions">
            <Link className="primary-button large" to="/register">Launch workspace <ArrowRight size={18} /></Link>
            <Link className="ghost-button large" to="/pricing">View pricing</Link>
          </div>
          <div className="hero-metrics">
            <span><strong>12k+</strong> reviews</span>
            <span><strong>98%</strong> faster feedback</span>
            <span><strong>24/7</strong> AI pair support</span>
          </div>
        </motion.div>
        <motion.div className="hero-product" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
          <div className="window-bar"><span /><span /><span /></div>
          <div className="code-preview">
            <pre>{`function checkout(cart) {\n  if (!cart.items.length) return null\n  return cart.items.reduce((t, item) => t + item.price, 0)\n}`}</pre>
            <div className="review-chip"><Bot size={18} /> Missing tax, currency, and validation checks</div>
            <div className="review-chip green"><Sparkles size={18} /> Suggested score: 86 / 100</div>
          </div>
        </motion.div>
      </section>

      <section className="logo-strip">
        {["ChatGPT-inspired", "Vercel fast", "Linear polished", "Cursor-like flow", "MongoDB backed"].map((item) => <span key={item}>{item}</span>)}
      </section>

      <section className="section" id="features">
        <div className="section-heading">
          <span>Features</span>
          <h2>Everything expected from a serious coding assistant.</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article className="glass-card feature-card" key={feature.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}>
                <Icon size={24} />
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="section split-band">
        <div className="section-heading">
          <span>Testimonials</span>
          <h2>Built for demos, placements, and real engineering work.</h2>
        </div>
        <div className="testimonial-grid">
          {["The review workspace feels like a premium IDE with a senior engineer beside you.", "Complexity analysis and optimized output turned our code review demos into a highlight.", "The UI has that polished startup feel people instantly remember."].map((quote, index) => (
            <article className="glass-card testimonial" key={quote}>
              <p>“{quote}”</p>
              <strong>{["Aarav, Fullstack Intern", "Mira, CS Student", "Dev Team Lead"][index]}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section pricing-section">
        <div className="section-heading">
          <span>Pricing</span>
          <h2>Pick the runway that matches your ambition.</h2>
        </div>
        <div className="pricing-grid">
          {["Starter", "Pro", "Team"].map((plan, index) => (
            <article className={`glass-card price-card ${index === 1 ? "featured" : ""}`} key={plan}>
              <h3>{plan}</h3>
              <strong>{index === 0 ? "Free" : index === 1 ? "$12" : "$39"}<small>{index ? "/mo" : ""}</small></strong>
              <p>{["Core reviews and history", "Unlimited AI reviews and exports", "Shared workspace and governance"][index]}</p>
              <Link className={index === 1 ? "primary-button" : "ghost-button"} to="/register">Choose {plan}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="section-heading">
          <span>FAQ</span>
          <h2>Useful details before you launch.</h2>
        </div>
        <div className="faq-list">
          {faqs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </div>
      </section>
      <Footer />
    </Page>
  );
}
