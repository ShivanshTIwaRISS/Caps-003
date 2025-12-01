import React from "react";
import { useParams, Link } from "react-router-dom";
import "./index.css"; 

export default function GenericInfoPage() {
  const { page } = useParams();

  const contentMap = {
    about: {
      title: "About OS",
      description:
        "Welcome to OS Store! We are committed to providing the best shopping experience...",
    },
    careers: {
      title: "Careers",
      description:
        "Join the OS team and help shape the future of online shopping!",
    },
    press: {
      title: "Press Releases",
      description:
        "Stay up to date with the latest announcements, partnerships, and more.",
    },
    devices: {
      title: "OS Devices",
      description:
        "Explore our range of OS smart devices crafted for convenience.",
    },
    sell: {
      title: "Sell on OS",
      description:
        "Become a seller on OS and reach thousands of customers daily.",
    },
    affiliate: {
      title: "Affiliate Program",
      description:
        "Earn money by promoting OS products. Start earning today!",
    },
    advertise: {
      title: "Advertise Your Products",
      description:
        "Boost sales with OS Ads and target the right customers.",
    },
    account: {
      title: "Your Account",
      description:
        "Manage orders, profile, payments and more.",
    },
    returns: {
      title: "Returns Centre",
      description:
        "Return or exchange items easily with our hassle-free return policy.",
    },
    help: {
      title: "Help & Support",
      description:
        "Visit our help center for FAQs, troubleshooting and quick support.",
    },
  };

  const pageData = contentMap[page] || {
    title: "Page Not Found",
    description:
      "Oops! The page you're looking for does not exist.",
  };

  return (
    <div className="info-page">
      <div className="info-card">
        <h1 className="info-title">{pageData.title}</h1>
        <p className="info-desc">{pageData.description}</p>

        <Link to="/" className="info-back-btn">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
