import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
const HeroSection = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/signup");
  } ;
  const handleContactUs = () => {
    navigate("/contact");
  }
  return (
    <>
      <section className="min-h-screen bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent" />

        <div className="relative container mx-auto px-6 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                Manage Your Expenses Easily With{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  NidhiBook
                </span>
              </h1>

              <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
                Track your daily income and expenses effortlessly. Upload your
                annual budget, view statistical graphs, and get personalized
                financial guidance to build better money habits.
              </p>

              <div className="flex flex-wrap gap-4">
                <button onClick={handleGetStarted} className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105">
                  Get Started Free
                </button>
              </div>
            </div>

            {/* Right Dashboard Preview */}
            <div className="relative">
              <div className="relative space-y-2">
                {/* Total Balance Card */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300 border border-slate-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-400">Total Balance</div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-15">
                    ₹91,100
                  </div>
                </div>

                {/* Financial Overview with Pie Chart */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-300 absolute top-20 right-0 w-96 z-10 border border-slate-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-white text-lg">
                      Financial Overview
                    </h3>
                  </div>

                  {/* Pie Chart */}
                  <div className="relative flex items-center justify-center my-8">
                    <svg className="w-56 h-56 transform -rotate-90">
                      <circle
                        cx="112"
                        cy="112"
                        r="80"
                        fill="none"
                        stroke="#A78BFA"
                        strokeWidth="40"
                        strokeDasharray="302 503"
                      />
                      <circle
                        cx="112"
                        cy="112"
                        r="80"
                        fill="none"
                        stroke="#FB923C"
                        strokeWidth="40"
                        strokeDasharray="201 503"
                        strokeDashoffset="-302"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xs text-gray-400 mb-1">
                          Total Balance
                        </div>
                        <div className="text-2xl font-bold text-white">
                          ₹91,100
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-purple-400 rounded-full"></span>
                      <span className="text-gray-300">Balance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-orange-400 rounded-full"></span>
                      <span className="text-gray-300">Income</span>
                    </div>
                  </div>
                </div>

                {/* AI Suggestions Card */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl text-white mt-48 border border-slate-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">AI Suggestions</h3>
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                        high
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">
                    Reduce Dining Out - You spent ₹80 on dining out. Try cooking
                    at home to save ~₹200/month.
                  </p>
                </div>

                {/* Last 30 Days Expenses Bar Chart */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl absolute bottom-32 left-0 w-80 transform -rotate-2 hover:rotate-0 transition-transform duration-300 border border-slate-700">
                  <div className="text-white font-semibold mb-6">
                    Last 30 Days Expenses
                  </div>
                  <div className="flex items-end justify-between h-40 gap-2 px-2">
                    <div
                      className="bg-purple-500 rounded-t-lg w-10 transition-all hover:bg-purple-400 cursor-pointer"
                      style={{ height: "96px" }}
                    />
                    <div
                      className="bg-purple-500 rounded-t-lg w-10 transition-all hover:bg-purple-400 cursor-pointer"
                      style={{ height: "120px" }}
                    />
                    <div
                      className="bg-purple-500 rounded-t-lg w-10 transition-all hover:bg-purple-400 cursor-pointer"
                      style={{ height: "72px" }}
                    />
                    <div
                      className="bg-purple-500 rounded-t-lg w-10 transition-all hover:bg-purple-400 cursor-pointer"
                      style={{ height: "144px" }}
                    />
                    <div
                      className="bg-purple-500 rounded-t-lg w-10 transition-all hover:bg-purple-400 cursor-pointer"
                      style={{ height: "112px" }}
                    />
                    <div
                      className="bg-purple-500 rounded-t-lg w-10 transition-all hover:bg-purple-400 cursor-pointer"
                      style={{ height: "88px" }}
                    />
                  </div>
                  <div className="flex justify-between mt-4 px-2 text-xs text-gray-400">
                    <span>₹1200</span>
                    <span>₹1500</span>
                    <span>₹900</span>
                    <span>₹1100</span>
                  </div>
                </div>

                {/* Income Card */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl absolute bottom-0 right-0 w-72 border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Income</h3>
                    <button className="text-blue-400 text-sm hover:text-blue-300">
                      See All →
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">
                            Salary
                          </div>
                          <div className="text-gray-500 text-xs">
                            1st Feb 2025
                          </div>
                        </div>
                      </div>
                      <span className="text-emerald-400 font-semibold">
                        + ₹12,000 ↑
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-screen bg-black relative overflow-hidden py-20">
        <div className="absolute inset-0" />

        <div className="relative container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-block">
                <span className="text-sm font-semibold text-cyan-400 tracking-wider uppercase">
                  Smart Financial Tools
                </span>
              </div>

              <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                We Offer{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Interactive Dashboard
                </span>
              </h2>

              <p className="text-xl text-gray-400 leading-relaxed">
                Visualize your financial journey with stunning real-time charts
                and graphs. Get instant insights into your spending patterns and
                make smarter money decisions.
              </p>

              <div className="space-y-6 pt-6">
                {/* Feature 1 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Real-Time Analytics
                    </h3>
                    <p className="text-gray-400">
                      Track your expenses and income with live updates and
                      beautiful visualizations
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Smart Budgeting
                    </h3>
                    <p className="text-gray-400">
                      Set goals, monitor progress, and stay on track with
                      intelligent budget recommendations
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-pink-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-white"
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
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      AI-Powered Insights
                    </h3>
                    <p className="text-gray-400">
                      Get personalized recommendations to optimize your spending
                      and savings
                    </p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      AI-Powered Financial Advisor
                    </h3>
                    <p className="text-gray-400">
                      Access financial advice whenever you need it, day or night
                      (Finance Guru)
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button onClick={handleGetStarted} className=" bg-gradient-to-r from-blue-400 to-cyan-400 px-10 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105">
                  Explore Dashboard
                </button>
              </div>
            </div>

            {/* Right Image - Dashboard Preview */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-purple-900/20 to-cyan-900/20 rounded-3xl p-8 backdrop-blur-sm border border-purple-500/30">
                {/* Dashboard Image Placeholder */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                  {/* Header */}
                  <div className="bg-slate-800/50 p-6 border-b border-slate-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold text-lg">
                        Dashboard Overview
                      </h3>
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-6 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-4 border border-purple-500/30">
                        <div className="text-purple-400 text-sm mb-1">
                          Total Income
                        </div>
                        <div className="text-white text-2xl font-bold">
                          ₹45,200
                        </div>
                        <div className="text-green-400 text-xs mt-1">
                          ↑ 12.5%
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 rounded-xl p-4 border border-cyan-500/30">
                        <div className="text-cyan-400 text-sm mb-1">
                          Total Expenses
                        </div>
                        <div className="text-white text-2xl font-bold">
                          ₹32,890
                        </div>
                        <div className="text-red-400 text-xs mt-1">↑ 8.2%</div>
                      </div>
                    </div>

                    {/* Chart Area */}
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <div className="flex items-end justify-between h-32 gap-2">
                        <div
                          className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg w-full transition-all hover:from-purple-500 hover:to-purple-300"
                          style={{ height: "60%" }}
                        />
                        <div
                          className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg w-full transition-all hover:from-purple-500 hover:to-purple-300"
                          style={{ height: "80%" }}
                        />
                        <div
                          className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg w-full transition-all hover:from-purple-500 hover:to-purple-300"
                          style={{ height: "45%" }}
                        />
                        <div
                          className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg w-full transition-all hover:from-purple-500 hover:to-purple-300"
                          style={{ height: "90%" }}
                        />
                        <div
                          className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg w-full transition-all hover:from-purple-500 hover:to-purple-300"
                          style={{ height: "70%" }}
                        />
                        <div
                          className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg w-full transition-all hover:from-purple-500 hover:to-purple-300"
                          style={{ height: "55%" }}
                        />
                      </div>
                      <div className="flex justify-between mt-3 text-xs text-gray-500">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                      </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-lg">🍔</span>
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">
                              Food & Dining
                            </div>
                            <div className="text-gray-500 text-xs">Today</div>
                          </div>
                        </div>
                        <span className="text-red-400 font-semibold">
                          -₹580
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-lg">💼</span>
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">
                              Salary
                            </div>
                            <div className="text-gray-500 text-xs">
                              Yesterday
                            </div>
                          </div>
                        </div>
                        <span className="text-green-400 font-semibold">
                          +₹12,000
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Accent Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>
      </section>
      <section className="min-h-screen bg-black relative overflow-hidden py-20">
        <div className="absolute inset-0" />

        <div className="relative container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-sm font-semibold text-cyan-400 tracking-wider uppercase">
                Got Questions?
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Frequently Asked{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Questions
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to know about NidhiBook
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden hover:border-purple-500/50 transition-all duration-300">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-white pr-8">
                    What is NidhiBook and how does it work?
                  </h3>
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center group-open:rotate-180 transition-transform duration-300">
                    <svg
                      className="w-5 h-5 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-400 leading-relaxed">
                    NidhiBook is a comprehensive expense management platform
                    that helps you track your daily income and expenses
                    effortlessly. You can upload your annual budget, view
                    statistical graphs, and receive personalized financial
                    guidance from our AI-powered Finance Guru to build better
                    money habits.
                  </p>
                </div>
              </details>
            </div>

            {/* FAQ 2 */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden hover:border-purple-500/50 transition-all duration-300">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-white pr-8">
                    Is NidhiBook free to use?
                  </h3>
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center group-open:rotate-180 transition-transform duration-300">
                    <svg
                      className="w-5 h-5 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-400 leading-relaxed">
                    Yes! NidhiBook offers a free plan that includes essential
                    features like expense tracking, basic analytics, and access
                    to Finance Guru. We also offer premium plans with advanced
                    features such as unlimited budget categories, detailed
                    reports, and priority support.
                  </p>
                </div>
              </details>
            </div>

            {/* FAQ 3 */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden hover:border-purple-500/50 transition-all duration-300">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-white pr-8">
                    How does Finance Guru provide personalized recommendations?
                  </h3>
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center group-open:rotate-180 transition-transform duration-300">
                    <svg
                      className="w-5 h-5 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-400 leading-relaxed">
                    Finance Guru analyzes your spending patterns, income
                    sources, and financial goals using advanced AI algorithms.
                    It identifies areas where you can save money, suggests
                    budget optimizations, and provides actionable insights
                    tailored specifically to your financial situation—available
                    24/7 to answer your questions.
                  </p>
                </div>
              </details>
            </div>

            {/* FAQ 4 */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden hover:border-purple-500/50 transition-all duration-300">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-white pr-8">
                    Is my financial data secure?
                  </h3>
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center group-open:rotate-180 transition-transform duration-300">
                    <svg
                      className="w-5 h-5 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-400 leading-relaxed">
                    Absolutely! We take security seriously. All your data is
                    encrypted using bank-level security protocols (AES-256
                    encryption). We never share your personal information with
                    third parties, and you have complete control over your data.
                    We're also compliant with industry standards and
                    regulations.
                  </p>
                </div>
              </details>
            </div>

        

          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-6">Still have questions?</p>
            <button onClick={handleContactUs} className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105">
              Contact Support
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>
      </section>
    </>
  );
};

export default HeroSection;
