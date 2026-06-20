import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_vvsvt4k",        // Service ID
        "template_1mc8vcf",       // Template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        "VemDTGZP75FyFQhnn"       // Public Key
      )
      .then(
        () => {
          setStatus("✅ Message sent successfully!");
          setFormData({ name: "", email: "", message: "" });
        },
        () => {
          setStatus("❌ Failed to send message. Please try again.");
        }
      );
  };

  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center overflow-hidden px-6 py-16">

      {/* Decorative Glows */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl"></div>

      {/* Contact Form Container */}
      <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 
                      backdrop-blur-xl p-10 rounded-3xl shadow-2xl 
                      border border-slate-700/50 w-full max-w-2xl z-10">
        
        {/* Header */}
        <h2 className="text-4xl font-bold text-white text-center mb-2">Contact Us</h2>
        <p className="text-gray-400 text-center mb-8">
          Have a question or need help? We're here for you.
        </p>

        {/* Status Message */}
        {status && (
          <div className="mb-4 text-center text-sm text-gray-300 bg-slate-800/40 p-3 rounded-xl border border-slate-700">
            {status}
          </div>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name Input */}
          <div>
            <label className="text-gray-300 text-sm">Your Name</label>
            <input
              type="text"
              placeholder="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full bg-slate-800/60 mt-1 p-3 text-white rounded-xl 
                         border border-slate-700 focus:border-purple-400 outline-none 
                         transition-all duration-300"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="text-gray-300 text-sm">Email Address</label>
            <input
              type="email"
              placeholder="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full bg-slate-800/60 mt-1 p-3 text-white rounded-xl 
                         border border-slate-700 focus:border-blue-400 outline-none 
                         transition-all duration-300"
            />
          </div>

          {/* Message Input */}
          <div>
            <label className="text-gray-300 text-sm">Message</label>
            <textarea
              rows="5"
              placeholder="message..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              className="w-full bg-slate-800/60 mt-1 p-3 text-white rounded-xl 
                         border border-slate-700 focus:border-cyan-400 outline-none 
                         transition-all duration-300"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 
                       text-white py-3 rounded-xl text-lg font-semibold 
                       hover:shadow-2xl hover:shadow-cyan-500/30 
                       transform hover:scale-105 transition-all duration-300"
          >
            Send Message
          </button>
        </form>
      </div>

    </div>
  );
};

export default Contact;
