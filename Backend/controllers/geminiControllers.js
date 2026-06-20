import fetch from "node-fetch";
import User from "../models/userModel.js";
import Expense from "../models/expenseModel.js";
import Income from "../models/incomeModel.js";

export const generateGeminiResponse = async (req, res) => {
  try {
    const userId = req.user; // From auth middleware

    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: oneMonthAgo, $lte: currentDate },
    }).sort({ date: -1 });

    const incomes = await Income.find({
      user: userId,
      date: { $gte: oneMonthAgo, $lte: currentDate },
    }).sort({ date: -1 });

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
    const savingsAmount = totalIncome - totalExpenses;
    const savingsRate =
      totalIncome > 0 ? ((savingsAmount / totalIncome) * 100).toFixed(2) : 0;

    const expensesByCategory = expenses.reduce((acc, exp) => {
      const category = exp.category || "Other";
      if (!acc[category]) {
        acc[category] = { total: 0, count: 0, transactions: [] };
      }
      acc[category].total += exp.amount;
      acc[category].count += 1;
      acc[category].transactions.push({
        amount: exp.amount,
        description: exp.description,
        date: exp.date,
      });
      return acc;
    }, {});

    const incomeBySource = incomes.reduce((acc, inc) => {
      const source = inc.source || "Other";
      if (!acc[source]) {
        acc[source] = { total: 0, count: 0 };
      }
      acc[source].total += inc.amount;
      acc[source].count += 1;
      return acc;
    }, {});

    // Calculate estimated monthly income (annualized)
    const estimatedMonthlyIncome = user.annualIncome / 12;

    // Prepare financial summary
    const financialSummary = {
      period: "Last 30 Days",
      totalIncome: totalIncome,
      totalExpenses: totalExpenses,
      netSavings: savingsAmount,
      savingsRate: savingsRate,
      expensesByCategory: expensesByCategory,
      incomeBySource: incomeBySource,
      topExpenseCategories: Object.entries(expensesByCategory)
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 5)
        .map(([category, data]) => ({
          category,
          amount: data.total,
          percentage: ((data.total / totalExpenses) * 100).toFixed(2),
          transactionCount: data.count,
        })),
      userProfile: {
        name: user.name,
        profession: user.profession,
        annualIncome: user.annualIncome,
        estimatedMonthlyIncome: estimatedMonthlyIncome,
        monthlyBudget: user.monthlyBudget || estimatedMonthlyIncome,
        yearlyBudget: user.yearlyBudget || user.annualIncome,
      },
    };

    // Construct detailed prompt for Gemini AI
    const prompt = `You are a professional financial advisor AI. Analyze the following user's financial data from the last month and provide 3-5 personalized financial suggestions.

USER PROFILE:
- Name: ${user.name}
- Profession: ${user.profession}
- Annual Income: ₹${user.annualIncome}
- Estimated Monthly Income: ₹${estimatedMonthlyIncome.toFixed(2)}
- Monthly Budget: ₹${user.monthlyBudget || estimatedMonthlyIncome}

LAST 30 DAYS FINANCIAL DATA:
- Total Income Received: ₹${totalIncome.toFixed(2)}
- Total Expenses: ₹${totalExpenses.toFixed(2)}
- Net Savings: ₹${savingsAmount.toFixed(2)}
- Savings Rate: ${savingsRate}%

INCOME SOURCES (Last Month):
${
  Object.entries(incomeBySource)
    .map(
      ([source, data]) =>
        `- ${source}: ₹${data.total.toFixed(2)} (${data.count} transactions)`
    )
    .join("\n") || "- No income recorded this month"
}

TOP SPENDING CATEGORIES (Last Month):
${
  financialSummary.topExpenseCategories.length > 0
    ? financialSummary.topExpenseCategories
        .map(
          (cat) =>
            `- ${cat.category}: ₹${cat.amount.toFixed(2)} (${
              cat.percentage
            }% of expenses, ${cat.transactionCount} transactions)`
        )
        .join("\n")
    : "- No expenses recorded this month"
}

DETAILED CATEGORY BREAKDOWN:
${
  Object.entries(expensesByCategory)
    .map(
      ([category, data]) =>
        `- ${category}: ₹${data.total.toFixed(2)} (${data.count} transactions)`
    )
    .join("\n") || "- No detailed expenses available"
}

BUDGET ANALYSIS:
- Budget Adherence: ${
      user.monthlyBudget > 0
        ? `${((totalExpenses / user.monthlyBudget) * 100).toFixed(
            2
          )}% of monthly budget used`
        : "No budget set"
    }
- Budget Remaining: ${
      user.monthlyBudget > 0
        ? `₹${(user.monthlyBudget - totalExpenses).toFixed(2)}`
        : "N/A"
    }

INSTRUCTIONS:
Generate 3-5 actionable financial suggestions in the following JSON format. Each suggestion should have:
1. A clear, concise title (max 5 words)
2. A priority level: "high", "medium", or "low"
3. A detailed description (1-2 sentences) with specific numbers and actionable advice
4. An icon category: "dining", "emergency", "investment", "savings", "budget", "debt", or "general"
5. Potential monthly savings (number, 0 if not applicable)

Focus on:
- Categories where spending is unusually high (compare to typical percentages: Food 15%, Transport 10%, Bills 20%)
- Emergency fund building (should be 3-6 months of expenses: ₹${(
      totalExpenses * 3
    ).toFixed(2)} to ₹${(totalExpenses * 6).toFixed(2)})
- Investment opportunities if savings rate is good (>20%)
- Budget optimization tips based on their set budget
- Specific, measurable goals with dollar amounts
- Consider their profession and income level for advice

IMPORTANT: Return ONLY a valid JSON array with no markdown, no code blocks, no additional text. Just the pure JSON array:
[
  {
    "title": "Suggestion Title",
    "priority": "high",
    "description": "Detailed suggestion with specific numbers.",
    "icon": "dining",
    "potentialSaving": 200
  }
]`;

    // Call Google Gemini API
    const geminiApiKey = process.env.GEMINI_API_KEY;
    console.log("🔑 GEMINI_API_KEY:", geminiApiKey ? "Found" : "Not Found");
    if (!geminiApiKey) {
      console.log("⚠️  GEMINI_API_KEY not found - using fallback suggestions");
      const aiSuggestions = generateFallbackSuggestions(financialSummary);
      return res.json({
        success: true,
        data: {
          suggestions: aiSuggestions,
          financialSummary: {
            totalIncome: totalIncome,
            totalExpenses: totalExpenses,
            netSavings: savingsAmount,
            savingsRate: savingsRate,
            topCategories: financialSummary.topExpenseCategories,
          },
        },
        note: "Using fallback suggestions - API key not configured",
      });
    }

    console.log("🤖 Calling Gemini API for AI suggestions...");

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error(
        `❌ Gemini API error: ${geminiResponse.status} - ${geminiResponse.statusText}`
      );
      console.error(`Error details: ${errorText}`);

      // Use fallback suggestions if API fails
      const aiSuggestions = generateFallbackSuggestions(financialSummary);
      return res.json({
        success: true,
        data: {
          suggestions: aiSuggestions,
          financialSummary: {
            totalIncome: totalIncome,
            totalExpenses: totalExpenses,
            netSavings: savingsAmount,
            savingsRate: savingsRate,
            topCategories: financialSummary.topExpenseCategories,
          },
        },
        note: "Using fallback suggestions - API call failed",
      });
    }

    const geminiData = await geminiResponse.json();
    console.log("✅ Gemini API response received");

    // Extract AI response
    let aiSuggestions = [];
    if (
      geminiData.candidates &&
      geminiData.candidates[0]?.content?.parts?.[0]?.text
    ) {
      const responseText = geminiData.candidates[0].content.parts[0].text;

      // Try to parse JSON from response
      try {
        // Remove markdown code blocks if present
        let cleanedText = responseText.trim();
        cleanedText = cleanedText.replace(/```json\n?/g, "");
        cleanedText = cleanedText.replace(/```\n?/g, "");
        cleanedText = cleanedText.trim();

        // Find JSON array
        const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          aiSuggestions = JSON.parse(jsonMatch[0]);
        } else {
          aiSuggestions = JSON.parse(cleanedText);
        }

        console.log(`✅ Parsed ${aiSuggestions.length} AI suggestions`);
      } catch (parseError) {
        console.error(
          "⚠️  Failed to parse AI response, using fallback:",
          parseError.message
        );
        aiSuggestions = generateFallbackSuggestions(financialSummary);
      }
    } else {
      console.log("⚠️  No valid AI response, using fallback");
      aiSuggestions = generateFallbackSuggestions(financialSummary);
    }

    // Return response
    res.json({
      success: true,
      data: {
        suggestions: aiSuggestions,
        financialSummary: {
          period: "Last 30 Days",
          totalIncome: totalIncome,
          totalExpenses: totalExpenses,
          netSavings: savingsAmount,
          savingsRate: parseFloat(savingsRate),
          budgetUsage:
            user.monthlyBudget > 0
              ? parseFloat(
                  ((totalExpenses / user.monthlyBudget) * 100).toFixed(2)
                )
              : null,
          topCategories: financialSummary.topExpenseCategories,
        },
        userInfo: {
          monthlyBudget: user.monthlyBudget,
          estimatedMonthlyIncome: estimatedMonthlyIncome,
        },
      },
    });
  } catch (error) {
    console.error("❌ Error generating financial suggestions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate financial suggestions",
      message: error.message,
    });
  }
};

// Fallback suggestions generator (rule-based)
function generateFallbackSuggestions(financialSummary) {
  const suggestions = [];
  const {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    topExpenseCategories,
    userProfile,
    expensesByCategory,
  } = financialSummary;

  const monthlyBudget =
    userProfile.monthlyBudget || userProfile.estimatedMonthlyIncome;

  // 1. Check Food/Dining expenses
  const foodCategory = topExpenseCategories.find((cat) =>
    cat.category.toLowerCase().includes("food")
  );

  if (foodCategory && foodCategory.amount > totalIncome * 0.15) {
    const potentialSaving = foodCategory.amount - totalIncome * 0.15;
    suggestions.push({
      title: "Reduce Dining Out",
      priority: "high",
      description: `You spent ₹${foodCategory.amount.toFixed(2)} on food (${
        foodCategory.percentage
      }% of expenses). Industry standard is 10-15%. Try meal prepping to save ~₹${potentialSaving.toFixed(
        2
      )}/month.`,
      icon: "dining",
      potentialSaving: parseFloat(potentialSaving.toFixed(2)),
    });
  }

  // 2. Emergency fund check (3 months of expenses)
  const emergencyFundGoal = totalExpenses * 3;
  suggestions.push({
    title: "Emergency Fund Goal",
    priority: "medium",
    description: `Build an emergency fund of ₹${emergencyFundGoal.toFixed(
      2
    )} (3 months expenses). Start by saving ₹${(netSavings * 0.3).toFixed(
      2
    )}/month from your current savings.`,
    icon: "emergency",
    potentialSaving: 0,
  });

  // 3. Budget adherence
  if (monthlyBudget > 0 && totalExpenses > monthlyBudget) {
    const overspending = totalExpenses - monthlyBudget;
    suggestions.push({
      title: "Budget Overspending Alert",
      priority: "high",
      description: `You've exceeded your monthly budget by ₹${overspending.toFixed(
        2
      )} (${((overspending / monthlyBudget) * 100).toFixed(
        1
      )}%). Review your top spending categories to identify cuts.`,
      icon: "budget",
      potentialSaving: parseFloat(overspending.toFixed(2)),
    });
  }

  // 4. Investment opportunity if savings rate is good
  if (savingsRate > 15 && netSavings > 500) {
    const investmentAmount = Math.min(netSavings * 0.3, 2000);
    suggestions.push({
      title: "Investment Opportunity",
      priority: "medium",
      description: `Great savings rate of ${savingsRate}%! Consider investing ₹${investmentAmount.toFixed(
        2
      )} in index funds or retirement accounts to build long-term wealth.`,
      icon: "investment",
      potentialSaving: 0,
    });
  }

  // 5. Low savings warning
  if (savingsRate < 10 && totalIncome > 0) {
    const recommendedSaving = totalIncome * 0.2;
    const currentSaving = netSavings > 0 ? netSavings : 0;
    const gap = recommendedSaving - currentSaving;

    suggestions.push({
      title: "Increase Savings Rate",
      priority: "high",
      description: `Your savings rate is ${savingsRate}%. Aim for at least 20% (₹${recommendedSaving.toFixed(
        2
      )}/month). Cut unnecessary expenses by ₹${gap.toFixed(
        2
      )} to reach this goal.`,
      icon: "savings",
      potentialSaving: parseFloat(gap.toFixed(2)),
    });
  }

  // 6. Check transport expenses
  const transportCategory = topExpenseCategories.find((cat) =>
    cat.category.toLowerCase().includes("transport")
  );

  if (transportCategory && transportCategory.amount > totalIncome * 0.15) {
    const saving = transportCategory.amount * 0.3;
    suggestions.push({
      title: "Reduce Transport Costs",
      priority: "medium",
      description: `Transport expenses are high at ₹${transportCategory.amount.toFixed(
        2
      )}. Consider carpooling, public transport, or remote work to save ~₹${saving.toFixed(
        2
      )}/month.`,
      icon: "general",
      potentialSaving: parseFloat(saving.toFixed(2)),
    });
  }

  // 7. Shopping expenses check
  const shoppingCategory = topExpenseCategories.find((cat) =>
    cat.category.toLowerCase().includes("shopping")
  );

  if (shoppingCategory && shoppingCategory.amount > totalIncome * 0.1) {
    const saving = shoppingCategory.amount * 0.4;
    suggestions.push({
      title: "Limit Shopping Expenses",
      priority: "medium",
      description: `Shopping expenses at ₹${shoppingCategory.amount.toFixed(
        2
      )} are ${
        shoppingCategory.percentage
      }% of your budget. Implement a 24-hour rule before purchases to save ~₹${saving.toFixed(
        2
      )}.`,
      icon: "budget",
      potentialSaving: parseFloat(saving.toFixed(2)),
    });
  }

  // Return top 5 suggestions, prioritizing high priority ones
  return suggestions
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 5);
}

export default generateGeminiResponse;
