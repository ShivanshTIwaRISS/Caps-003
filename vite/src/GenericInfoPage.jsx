import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function GenericInfoPage() {
  const { page } = useParams();
  const navigate = useNavigate();

  // Return request form state
  const [returnOrderId, setReturnOrderId] = useState("");
  const [returnReason, setReturnReason] = useState("defective");
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "How fast is OS Express Delivery?",
      a: "All orders placed before 2:00 PM are dispatched on the same day. Express delivery takes 1–3 business days across 40+ major Indian metropolitan cities with live real-time package tracking.",
    },
    {
      q: "What is the 7-day replacement guarantee?",
      a: "If your gadget or product arrives with manufacturing defects or damage, simply open a return request in the Returns Centre within 7 days for a hassle-free instant door-step replacement.",
    },
    {
      q: "Are the electronics authentic and warranty-backed?",
      a: "Yes, 100%. Every item sold on OS Store is sourced directly from certified original manufacturers and carries full standard brand warranty with invoice support.",
    },
    {
      q: "What payment methods are supported?",
      a: "We support UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit/Debit cards (Visa, MasterCard, RuPay), Net Banking across 50+ banks, and Cash on Delivery.",
    },
  ];

  const contentMap = {
    about: {
      title: "About OS Store",
      tagline: "Empowering the next generation of tech shopping",
      body: (
        <div>
          <p style={{ lineHeight: 1.7, marginBottom: "16px", color: "var(--text-muted)" }}>
            OS Store was created with a mission to deliver the most futuristic, high-performance electronics, gadgets, and lifestyle tech with zero friction. Combining modern web engineering, 256-bit encryption, and lightning-fast logistics, we curate only genuine, top-tier products.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", margin: "28px 0" }}>
            <div style={{ background: "var(--bg-subtle)", padding: "18px", borderRadius: "14px", textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--brand-primary)" }}>50,000+</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Active Shoppers</div>
            </div>
            <div style={{ background: "var(--bg-subtle)", padding: "18px", borderRadius: "14px", textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--brand-accent)" }}>99.4%</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>On-Time Delivery</div>
            </div>
            <div style={{ background: "var(--bg-subtle)", padding: "18px", borderRadius: "14px", textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--brand-secondary)" }}>2,300+</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Curated Products</div>
            </div>
          </div>
        </div>
      ),
    },
    careers: {
      title: "Join the OS Engineering Team",
      tagline: "Help build the future of next-gen cyber commerce",
      body: (
        <div>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
            We're a distributed team of engineers, designers, and logistics visionaries building cutting-edge commerce infrastructure.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { role: "Senior Fullstack Engineer (React & Node)", loc: "Bengaluru / Remote", type: "Full-Time" },
              { role: "Product UI/UX Visual Designer", loc: "Remote", type: "Full-Time" },
              { role: "Logistics Operations Lead", loc: "Mumbai / On-site", type: "Full-Time" },
            ].map((job, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "var(--bg-subtle)",
                  padding: "16px 20px",
                  borderRadius: "12px",
                  border: "1px solid var(--panel-border)",
                }}
              >
                <div>
                  <strong>{job.role}</strong>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{job.loc} • {job.type}</div>
                </div>
                <button
                  onClick={() => alert(`Thank you for your interest in ${job.role}! Please send your resume to careers@osstore.io`)}
                  className="cta-secondary"
                  style={{ padding: "6px 14px", fontSize: "0.82rem" }}
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    returns: {
      title: "Returns & Replacements Portal",
      tagline: "7-day hassle-free door-step return request",
      body: (
        <div>
          {returnSubmitted ? (
            <div style={{ background: "rgba(16, 185, 129, 0.15)", padding: "20px", borderRadius: "14px", textAlign: "center" }}>
              <h3 style={{ color: "var(--brand-accent)", marginBottom: "6px" }}>✓ Return Request Submitted!</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                Our logistics partner will contact you within 24 hours to schedule pickup for Order #{returnOrderId}.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!returnOrderId) return alert("Please enter your Order ID.");
                setReturnSubmitted(true);
              }}
              style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "480px" }}
            >
              <div className="form-group">
                <label>Order ID</label>
                <input
                  placeholder="e.g. ORD-948210"
                  value={returnOrderId}
                  onChange={(e) => setReturnOrderId(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Reason for Return</label>
                <select value={returnReason} onChange={(e) => setReturnReason(e.target.value)}>
                  <option value="defective">Item defective or not turning on</option>
                  <option value="damaged">Damaged in shipping</option>
                  <option value="wrong_item">Received wrong color or model</option>
                  <option value="quality">Quality not as described</option>
                </select>
              </div>
              <button type="submit" className="cta-primary" style={{ marginTop: "8px" }}>
                Submit Return Request
              </button>
            </form>
          )}
        </div>
      ),
    },
    help: {
      title: "Help & Frequently Asked Questions",
      tagline: "Instant answers to common customer queries",
      body: (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{
                background: "var(--bg-subtle)",
                border: "1px solid var(--panel-border)",
                borderRadius: "14px",
                padding: "16px 20px",
                cursor: "pointer",
              }}
              onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700 }}>
                <span>{faq.q}</span>
                <span>{openFaq === index ? "−" : "+"}</span>
              </div>
              {openFaq === index && (
                <p style={{ marginTop: "12px", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      ),
    },
    sell: {
      title: "Sell on OS Marketplace",
      tagline: "Reach millions of tech shoppers across the country",
      body: (
        <div>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
            Join our verified seller network. Enjoy ultra-low 2.5% marketplace commission, automated fulfillment, and next-day seller payouts.
          </p>
          <button
            className="cta-primary"
            onClick={() => alert("Seller onboarding registration is open! Registration portal link sent to your email.")}
          >
            Register as a Verified Merchant →
          </button>
        </div>
      ),
    },
    affiliate: {
      title: "OS Creator & Affiliate Program",
      tagline: "Earn up to 10% commission on every referred tech purchase",
      body: (
        <div>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
            Are you a tech reviewer, content creator, or developer? Share curated product links and earn recurring commissions with instant UPI withdrawals.
          </p>
          <button
            className="cta-primary"
            onClick={() => alert("Affiliate program application received! Check your dashboard.")}
          >
            Apply for Creator Affiliate Link
          </button>
        </div>
      ),
    },
  };

  const currentPageData = contentMap[page] || {
    title: "Help & Information Center",
    tagline: "Welcome to OS Customer Support",
    body: (
      <div>
        <p style={{ color: "var(--text-muted)", marginBottom: "18px" }}>
          Explore our resources or contact our 24/7 concierge support team at support@osstore.io
        </p>
        <Link to="/products" className="cta-primary">
          Browse Catalog
        </Link>
      </div>
    ),
  };

  const quickNav = [
    { key: "about", label: "About Us" },
    { key: "help", label: "Help & FAQ" },
    { key: "returns", label: "Returns Centre" },
    { key: "careers", label: "Careers" },
    { key: "sell", label: "Sell on OS" },
    { key: "affiliate", label: "Affiliate Program" },
  ];

  return (
    <div className="info-page-shell">
      <div className="info-hub-card">
        {/* Quick Nav Tabs */}
        <div className="info-hub-tabs">
          {quickNav.map((tab) => (
            <button
              key={tab.key}
              className={`info-hub-tab ${page === tab.key ? "active" : ""}`}
              onClick={() => navigate(`/info/${tab.key}`)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--brand-primary)", textTransform: "uppercase" }}>
          {currentPageData.tagline}
        </span>
        <h1 style={{ fontSize: "2.4rem", fontWeight: 900, margin: "6px 0 24px" }}>
          {currentPageData.title}
        </h1>

        {currentPageData.body}

        <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid var(--panel-border)" }}>
          <Link to="/" style={{ color: "var(--brand-primary)", fontWeight: 700, fontSize: "0.9rem" }}>
            ← Back to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
