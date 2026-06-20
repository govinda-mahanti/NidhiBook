import React from "react";
import d from "../assets/d.png";
import govin from "../assets/govin.jpg";
import { UserRound } from "lucide-react";

const About = () => {
  return (
    <section className="min-h-screen bg-black relative overflow-hidden py-20">
      <div className="absolute inset-0" />

      <div className="relative container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Meet{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              NidhiBook
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Your personal finance companion, built to help you achieve financial
            freedom through smart money management
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Our Mission</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                We believe everyone deserves access to powerful financial tools.
                NidhiBook was created to simplify expense tracking and empower
                individuals to take control of their financial future with
                AI-powered insights and intuitive design.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Our Vision</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                To become the world's most trusted financial management
                platform, helping millions of users build wealth, achieve their
                goals, and secure their financial independence through
                intelligent automation and personalized guidance.
              </p>
            </div>
          </div>

          {/* Right Content - Image Placeholder */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-purple-900/20 to-cyan-900/20 rounded-3xl p-8 backdrop-blur-sm border border-purple-500/30">
              <img
                src={d}
                alt="NidhiBook Dashboard"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />

              {/* Floating Accent Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>

        {/* Developer Section */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-12 border border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl"></div>

          <div className="relative text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Developed By
            </h3>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto"></div>
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Developer Image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-4 border-slate-700 group-hover:border-purple-500 transition-colors duration-300">
                <img
                  src={govin}
                  alt="Developer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Developer Info */}
            <div className="text-center md:text-left space-y-4">
              <h4 className="text-3xl font-bold text-white">Govinda Mahanti</h4>
              <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Full Stack Developer & Founder
              </p>
              <p className="text-gray-400 max-w-lg">
                Passionate about creating innovative financial solutions that
                empower people to achieve their dreams. Building NidhiBook to
                make financial management accessible to everyone.
              </p>

              {/* Social Links */}
              <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                <a
                  href="https://github.com/govinda-mahanti"
                  className="w-12 h-12 bg-slate-700 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/govinda-mahanti"
                  className="w-12 h-12 bg-slate-700 hover:bg-cyan-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                {/* Website Button */}
                <a
                  href="https://govindamahanti.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-slate-700 hover:bg-gradient-to-r hover:from-blue-400 hover:to-cyan-400 
             rounded-lg flex items-center justify-center transition-all duration-300 group"
                >
                  <UserRound className="w-6 h-6 text-gray-300 group-hover:text-white transition-all duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Financial Life?
          </h3>
          <button className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105">
            Get Started Free
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default About;
