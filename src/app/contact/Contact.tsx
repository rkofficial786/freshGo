"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaInstagram,
  FaYoutube,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import toast from "react-hot-toast";
import ButtonMain from "@/components/ButtonMain";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Contact form submitted successfully!");
        setFormData({ name: "", email: "", mobile: "", description: "" });
      } else {
        toast.error(data.msg || "Failed to submit form");
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 my-16">
      <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="w-full"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="w-full"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Input
                  type="number"
                  name="mobile"
                  placeholder="Your Phone"
                  className="w-full"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Textarea
                  name="description"
                  placeholder="Your Query"
                  className="w-full min-h-[120px]"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <ButtonMain
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </ButtonMain>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <FaPhone className="text-2xl text-primary-600" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p> +91 8885533619</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-2xl text-primary-600" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p>info@shreyacollection.in</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <FaMapMarkerAlt className="text-2xl text-primary-600" />
              <div>
                <h3 className="font-semibold">Location</h3>
                <p>
                  SHOP NO 12, Beside Anil Trading Company, Near Car Parking
                  Ground, Pan Bazar, Old Gudi, Old Bhoiguda, Rani Gunj,
                  Secunderabad, Telangana 500003
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <FaClock className="text-2xl text-primary-600" />
              <div>
                <h3 className="font-semibold">Business Hours</h3>
                <p>Sunday - Saturday: 11AM - 9PM</p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-5">
              <div className="flex items-center space-x-4">
                <FaInstagram className="text-2xl text-primary-600" />
                <div>
                  <h3 className="font-semibold">Instagram</h3>
                  <a
                    href="https://www.instagram.com/shreya_collection_nightys/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    @shreya_collection_nightys
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-5">
              <div className="flex items-center space-x-4">
                <FaFileInvoiceDollar className="text-2xl text-primary-600" />
                <div>
                  <h3 className="font-semibold">GSTIN</h3>
                  <p>36BMCPT7957E2ZK</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Our Location
        </h2>
        <div className="w-full h-[400px] bg-gray-200 rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.495109795162!2d78.4895666!3d17.4360012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9b429824f7e1%3A0x6a671c9a57db1279!2sShreya%20collection%20nighties!5e0!3m2!1sen!2sin!4v1731514515382!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            title="Map of our location"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
