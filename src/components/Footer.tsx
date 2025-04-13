import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white footer-main">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">FreshGo</h2>
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-green-300 mt-1" />
              <p className="text-sm">
              123 Main St, Apartment 4B, New York, NY 10001
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-green-300" />
              <p className="text-sm">+91 1234567890</p>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-green-300" />
              <p className="text-sm">info@freshgo.in</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-100">
              Quick Links
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: "Home", link: "/" },
                { label: "Products", link: "/products" },
                { label: "Contact", link: "/contact" },
                { label: "Cart", link: "/cart" },
                { label: "Profile", link: "/profile" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.link}
                  className="text-sm text-green-200 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-100">
              Policies
            </h3>
            {[
              {
                name: "Privacy Policy",
              },
              {
                name: "Terms of Conditions",
              },
              {
                name: "Shipping Policy",
              },
              {
                name: "Return Policy",
              },
            ].map((item) => (
              <a
                key={item.name}
                href={"#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-green-200 hover:text-white transition-colors mb-2"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-8 border-t border-green-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-green-200 text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} FreshGo. All rights
            reserved.
          </p>

          <div className="flex items-center space-x-4">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-300 hover:text-white transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;