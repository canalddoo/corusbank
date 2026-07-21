"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-links-grid">
          {/* HELP & CONTACT Column */}
          <div className="footer-col">
            <h3>CorusBank Support</h3>
            <ul>
              <li>
                <Link href="tel:+43190202">
                  <i className="fa-solid fa-phone icon-left"></i> +43190202
                </Link>
              </li>
              <li>
                <Link href="mailto:contact@corusbank.com">
                  <i className="fa-solid fa-envelope icon-left"></i> contact@corusbank.com
                </Link>
              </li>
              <li className="phone-line">
                <span>Mon - Fri: 8am to 6pm</span>
              </li>
              <li><Link href="#"><i className="fa-regular fa-circle-question icon-left"></i> FAQ & Locations</Link></li>
            </ul>
          </div>

          {/* SECURITY Column */}
          <div className="footer-col">
            <h3>Security</h3>
            <ul>
              <li><Link href="#">Card Blocking</Link></li>
              <li><Link href="#">Data Protection</Link></li>
              <li><Link href="#">Legal Notice</Link></li>
            </ul>
          </div>

          {/* ABOUT US Column */}
          <div className="footer-col">
            <h3>CorusBank</h3>
            <ul>
              <li><Link href="#">About us</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#">Accessibility</Link></li>
            </ul>
          </div>
        </div>

        {/* SCROLL TO TOP BUTTON */}
        <button className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
          <i className="fa-solid fa-arrow-up"></i>
        </button>

        {/* FOOTER BOTTOM */}
        <div className="footer-bottom">
          <p style={{ fontSize: "12px", textAlign: "center", color: "#64748b", marginTop: "15px" }}>
            &copy; {new Date().getFullYear()} CorusBank AG. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}