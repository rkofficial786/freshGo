import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  FaFileInvoiceDollar,
  FaInstagram,
  FaRegFileAlt,
  FaYoutube,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Thank you for subscribing!");
        setEmail("");
      } else {
        setMessage(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gradient-to-r from-secondary-900 via-secondary-950 to-black text-white footer-main">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Address */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src="/assets/logo/logo.png"
                alt="Shreya Collection Logo"
                className="h-20 mx-auto md:mx-0 "
              />
            </div>
            <p className="text-center font-semibold text-lg">
              Shreya Collection
            </p>
            <div className="flex items-start space-x-2">
              <MapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
              <p className="text-sm">
                SHOP NO 12, Beside Anil Trading Company, Near Car Parking
                Ground, Pan Bazar, Old Gudi, Old Bhoiguda, Rani Gunj,
                Secunderabad, Telangana 500003
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {" "}
              <FaRegFileAlt className="h-5 w-5 text-blue-400" />
              <h3 className="font-semibold">GSTIN</h3>
              <p>36BMCPT7957E2ZK</p>
            </div>

            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
              <p className="text-sm">+91 8885533619</p>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
              <p className="text-sm">info@shreyacollection.in</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Home", link: "/" },
                { label: "Contact Us", link: "/contact" },
                { label: "Cart", link: "/cart" },
                { label: "Profile", link: "/profile" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.link}
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              Policies
            </h3>
            <ul className="space-y-2">
              {[
                {
                  name: "Privacy Policy",
                  url: "https://shreyacollections.tawk.help/article/privacy-policy",
                },
                {
                  name: "Terms of Conditions",
                  url: "https://shreyacollections.tawk.help/article/terms-conditions",
                },
                {
                  name: "Shipping and Delivery Policy",
                  url: "https://shreyacollections.tawk.help/article/shipping-and-delivery-policy",
                },
                {
                  name: "Return and Refund Policy",
                  url: "https://shreyacollections.tawk.help/article/cancellations-returns-refunds",
                },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.url}
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              Newsletter
            </h3>
            <p className="text-sm mb-4">
              Stay updated with our latest news and offers.
            </p>
            <form onSubmit={handleSubmit} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className=" border-blue-400 text-white placeholder:text-white"
                required
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
              {message && (
                <p
                  className={`text-sm ${
                    message.includes("Thank you")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Social Media Icons and Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-center md:text-left mb-4 md:mb-0">
            &copy; 2024 Shreya Collection. All rights reserved.
          </p>
          <p className="text-sm">
            Designed By{" "}
            <Link
              href="https://www.webgeon.com/"
              target="_blank"
              className="text-blue-400 hover:underline"
            >
              Webgeon
            </Link>
          </p>
          <div className="flex items-center space-x-4">
            <a
              href="https://www.instagram.com/shreya_collection_nightys/"
              target="_blank"
              className="text-gray-400 hover:text-pink-600 transition-colors"
            >
              <FaInstagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
