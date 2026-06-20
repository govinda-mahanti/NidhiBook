import React, { useState, useEffect } from "react";
import {
  ArrowUp,
  ArrowDown,
  ShoppingBag,
  Receipt,
  Lightbulb,
  Plane,
  User,
  Zap,
  Home,
  ArrowRight,
  Wallet,
  TrendingUp,
  TrendingDown,
  Building,
  Banknote,
  Utensils,
  Brain,
  Car,
  Globe,
  Coins,
  HeartPulse,
} from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import {BASE_URL} from '../config/urlconfig'

const Dashboard = () => {
  const token = useSelector((state) => state.auth.token);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const iconMap = {
    food: Utensils,
    transport: Car,
    health: HeartPulse,
    bills: Receipt,
    shopping: ShoppingBag,
    other: Banknote,
  };
  const incomeIconMap = {
    salary: User,
    freelance: Globe,
    investment: Coins,
    business: TrendingUp,
    other: Banknote,
  };
  const suggestionIconMap = {
    budget: Wallet,
    default: Globe,
    investment: Brain,
    emergency: Lightbulb,
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const headers = {
          Authorization: token,
        };
        const response = await axios.get(`${BASE_URL}/api/expenses`, {
          headers,
        });
        const expenseData = Array.isArray(response.data.expenses)
          ? response.data.expenses
          : [];
        setExpenses(expenseData);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setError("Failed to fetch expenses");
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [token]);

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Math.abs(expense.amount || 0),
    0
  );

  const expensesSummary = expenses.reduce((acc, expense) => {
    const category = expense.category?.toLowerCase() || "other";
    if (!acc[category]) {
      acc[category] = {
        category,
        amount: 0,
      };
    }
    acc[category].amount += Math.abs(expense.amount || 0);
    return acc;
  }, {});
  const expensesSummaryArray = Object.values(expensesSummary);

  // Helper: get week number for a date
  const getWeekNumber = (date) => {
    const dt = new Date(date);
    dt.setHours(0, 0, 0, 0);
    dt.setDate(dt.getDate() + 4 - (dt.getDay() || 7));
    const yearStart = new Date(dt.getFullYear(), 0, 1);
    return Math.ceil(((dt - yearStart) / 86400000 + 1) / 7);
  };

  // Compute weekly expenses for dynamic bar chart
  const computeWeeklyExpenses = (expenses) => {
    const weeklyMap = {};
    expenses.forEach((e) => {
      const weekNum = getWeekNumber(e.date);
      const weekLabel = `Week ${weekNum}`;
      if (!weeklyMap[weekLabel]) weeklyMap[weekLabel] = 0;
      weeklyMap[weekLabel] += Math.abs(e.amount || 0);
    });
    return Object.entries(weeklyMap)
      .map(([label, value]) => ({ label, value }))
      .sort(
        (a, b) =>
          parseInt(a.label.split(" ")[1]) - parseInt(b.label.split(" ")[1])
      );
  };

  // Compute income distribution dynamically for doughnut chart
  const computeIncomeDistribution = (income) => {
    const sourceMap = {};
    income.forEach((i) => {
      const src = i.source || "other";
      if (!sourceMap[src]) sourceMap[src] = 0;
      sourceMap[src] += i.amount || 0;
    });
    const colors = [
      "#8b5cf6",
      "#ef4444",
      "#f97316",
      "#3b82f6",
      "#22c55e",
      "#eab308",
    ];
    return Object.entries(sourceMap).map(([label, value], idx) => ({
      label,
      value,
      color: colors[idx % colors.length],
    }));
  };

  const [income, setIncome] = useState([]);
  useEffect(() => {
    const fetchIncome = async () => {
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const headers = {
          Authorization: token,
        };
        const response = await axios.get(`${BASE_URL}/api/income`, {
          headers,
        });
        const incomeData = Array.isArray(response.data.incomes)
          ? response.data.incomes
          : [];
        setIncome(incomeData);
      } catch (error) {
        console.error("Error fetching income:", error);
        setError("Failed to fetch income");
      } finally {
        setLoading(false);
      }
    };
    fetchIncome();
  }, [token]);

  const totalIncome = income.reduce((sum, item) => sum + (item.amount || 0), 0);

  const incomeSummary = income.reduce((acc, item) => {
    const source = item.source?.toLowerCase() || "other";
    if (!acc[source]) {
      acc[source] = {
        source,
        amount: 0,
      };
    }
    acc[source].amount += item.amount || 0;
    return acc;
  }, {});
  const incomeSummaryArray = Object.values(incomeSummary);

  // Dynamic chart data
  const dynamicExpensesBarData = computeWeeklyExpenses(expenses);
  const dynamicIncomeDistributionData = computeIncomeDistribution(income);

  const totalBalance = totalIncome - totalExpenses;
  // AI Suggestions Data
  const [aiSuggestions, setAiSuggestions] = useState([]);
  useEffect(() => {
    const fetchAiSuggestions = async () => {
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const headers = {
          Authorization: token,
        };
        const response = await axios.get(
          `${BASE_URL}/api/suggestions`,
          {
            headers,
          }
        );
        console.log("AI Suggestions API response:", response.data);
        const suggestionsData = Array.isArray(response.data.data?.suggestions)
          ? response.data.data.suggestions
          : [];
        console.log("Suggestions data from API:", suggestionsData);
        setAiSuggestions(suggestionsData);
        console.log("Fetched AI suggestions:", suggestionsData);
      } catch (error) {
        setError("Failed to fetch suggestions");

        console.error("Error fetching AI suggestions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAiSuggestions();
  }, [token]);

  // Custom Doughnut Chart Component
  const DoughnutChart = ({ data, centerText, centerValue }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) {
      // Render a placeholder circle if all data is zero to avoid NaNs
      return (
        <div className="relative w-64 h-64 mx-auto">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="35" fill="#ddd" />
            <circle cx="50" cy="50" r="20" fill="transparent" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-gray-400 text-sm font-medium">{centerText}</p>
            <p className="text-3xl font-bold text-white">{centerValue}</p>
          </div>
        </div>
      );
    }
    let currentAngle = 0;
    const paths = data.map((item, index) => {
      if (item.value === 0) return null; // skip zero slices
      const percentage = item.value / total;
      const angle = percentage * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      const x1 = 50 + 35 * Math.cos(((startAngle - 90) * Math.PI) / 180);
      const y1 = 50 + 35 * Math.sin(((startAngle - 90) * Math.PI) / 180);
      const x2 = 50 + 35 * Math.cos(((endAngle - 90) * Math.PI) / 180);
      const y2 = 50 + 35 * Math.sin(((endAngle - 90) * Math.PI) / 180);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = [
        `M 50 50`,
        `L ${x1} ${y1}`,
        `A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `Z`,
      ].join(" ");

      currentAngle += angle;

      return (
        <path
          key={index}
          d={pathData}
          fill={item.color}
          className="hover:opacity-80 transition-opacity"
        />
      );
    });

    return (
      <div className="relative w-64 h-64 mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {paths}
          <circle cx="50" cy="50" r="20" fill="transparent" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-gray-400 text-sm font-medium">{centerText}</p>
          <p className="text-3xl font-bold text-white">{centerValue}</p>
        </div>
      </div>
    );
  };

  // Custom Bar Chart Component
  const BarChart = ({ data }) => {
    const maxValue = Math.max(...data.map((d) => d.value));

    return (
      <div className="h-64 flex items-end justify-center gap-8 px-4">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 200;
          return (
            <div key={index} className="flex flex-col items-center gap-3">
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-sm mb-2">
                  {`\u20B9`}
                  {item.value}
                </span>
                <div
                  className="w-12 bg-purple-500 rounded-t-lg transition-all duration-500 hover:bg-purple-400"
                  style={{ height: `${height}px` }}
                />
              </div>
              <span className="text-gray-400 text-sm">{item.label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Chart data
  const financialOverviewData = [
    { value: totalBalance, color: "#8b5cf6", label: "Balance" },
    { value: totalExpenses, color: "#ef4444", label: "Expenses" },
    { value: totalIncome, color: "#f97316", label: "Income" },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-red-500 bg-red-500/5";
      case "medium":
        return "border-yellow-500 bg-yellow-500/5";
      case "low":
        return "border-green-500 bg-green-500/5";
      default:
        return "border-gray-500 bg-gray-500/5";
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400";
      case "low":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  // --- MAIN DASHBOARD COMPONENT ---
  return (
    <div className="min-h-screen bg-black text-gray-300 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Total Balance Card */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Total Balance
                </p>
                <p className="text-2xl font-bold text-white">
                  {`\u20B9`}
                  {totalBalance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          {/* Total Income Card */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Total Income
                </p>
                <p className="text-2xl font-bold text-white">
                  {`\u20B9`}
                  {totalIncome.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          {/* Total Expenses Card */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Total Expenses
                </p>
                <p className="text-2xl font-bold text-white">
                  {`\u20B9`}
                  {totalExpenses.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: AI Suggestions & Expenses */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Suggestions Card */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    AI Suggestions
                  </h2>
                </div>
                <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <span className="text-sm font-medium">See All</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {aiSuggestions.length === 0 ? (
                  <p className="text-gray-400 text-center">
                    No AI suggestions available
                  </p>
                ) : (
                  aiSuggestions.map((suggestion) => {
                    const Icon =
                      suggestionIconMap[suggestion.icon] ||
                      suggestionIconMap.default;

                    return (
                      <div
                        key={
                          suggestion.id || suggestion._id || suggestion.title
                        }
                        className={`border rounded-xl p-4 ${getPriorityColor(
                          suggestion.priority
                        )}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-purple-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-white text-sm">
                                {suggestion.title}
                              </h3>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadgeColor(
                                  suggestion.priority
                                )}`}
                              >
                                {suggestion.priority}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                              {suggestion.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Expenses Card */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Expenses</h2>
                <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <span className="text-sm font-medium">See All</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {expensesSummaryArray.map((e) => {
                  const Icon = iconMap[e.category] || ShoppingBag;
                  return (
                    <div
                      key={e.category}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center`}
                        >
                          <Icon className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {e.category}
                          </p>
                        </div>
                      </div>
                      <div className="font-bold text-red-500">
                        {`\u20B9`}
                        {e.amount.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 2: Financial Overview & Bar Chart */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                Financial Overview
              </h2>
              <div className="mb-6">
                <DoughnutChart
                  data={financialOverviewData}
                  centerText="Total Balance"
                  centerValue={`\u20B9${totalBalance.toLocaleString()}`}
                />
              </div>
              <div className="flex justify-center gap-6 text-sm">
                {financialOverviewData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-900 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                Last 30 Days Expenses
              </h2>
              <BarChart data={dynamicExpensesBarData} />
            </div>
          </div>

          {/* Column 3: Income Overview & Income List */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                Last 60 Days Income
              </h2>
              <div className="mb-6">
                <DoughnutChart
                  data={dynamicIncomeDistributionData}
                  centerText="Total Income"
                  centerValue={`\u20B9${totalIncome.toLocaleString()}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {dynamicIncomeDistributionData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Income</h2>
                <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <span className="text-sm font-medium">See All</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {incomeSummaryArray.map((i) => {
                  const Icon = incomeIconMap[i.source] || User;
                  return (
                    <div
                      key={i.source}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center`}
                        >
                          <Icon className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{i.source}</p>
                        </div>
                      </div>
                      <div className="font-bold text-green-500">
                        {`\u20B9`}
                        {i.amount.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
