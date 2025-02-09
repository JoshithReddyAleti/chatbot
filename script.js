document.addEventListener("DOMContentLoaded", function () {
    // Sample login credentials
    const validUsername = "admin";
    const validPassword = "admin123";

    // Handle Login
    window.login = function () {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const errorMsg = document.getElementById("login-error");

        if (username === validUsername && password === validPassword) {
            document.getElementById("login-container").style.display = "none";
            document.getElementById("dashboard").style.display = "block";
            document.getElementById("welcome-message").innerText = `Hi, ${username}!`;
            updateAccountBalance();
            checkUpcomingBills();
        } else {
            errorMsg.style.display = "block";
        }
    };

    // Bank Transactions (Sample Data) + Latest Purchases
    const bankTransactions = [
        { Date: "2025-01-01", Amount: 10000, Category: "Salary" },
        { Date: "2025-01-10", Amount: -300, Category: "Entertainment" },
        { Date: "2025-01-15", Amount: -200, Category: "Utilities" },
        { Date: "2025-01-20", Amount: -300, Category: "Shopping" },
        { Date: "2025-01-25", Amount: -400, Category: "Dining Out" },
        { Date: "2025-01-01", Amount: -2000, Category: "Rent" },
        { Date: "2025-01-01", Amount: -150, Category: "Electricity" },
        { Date: "2025-01-01", Amount: -80, Category: "Internet" },
        { Date: "2025-01-21", Amount: 35, Category: "Zelle Payment 1" },
        { Date: "2025-01-15", Amount: 22, Category: "Zelle Payment 2" },
        { Date: "2025-01-21", Amount: -250, Category: "Misc" },
        { Date: "2025-01-24", Amount: -50, Category: "Amazon Purchase" },
        { Date: "2025-01-25", Amount: -80, Category: "Electric Bill" },
        { Date: "2025-01-25", Amount: -45, Category: "Restaurant" },
        { Date: "2025-01-28", Amount: -200, Category: "Loan EMI" },
        { Date: "2025-01-29", Amount: 5000, Category: "Salary Credited" },
        { Date: "2025-01-30", Amount: -30, Category: "Gym Membership" }
    ];

    // User-entered Bills (Can be added dynamically)
    let userBills = [];

    // Calculate Income, Expenditure, and Checking Account Balance
    let totalCredits = bankTransactions
        .filter(transaction => transaction.Amount > 0)
        .reduce((sum, transaction) => sum + transaction.Amount, 0);

    let totalDebits = bankTransactions
        .filter(transaction => transaction.Amount < 0)
        .reduce((sum, transaction) => sum + Math.abs(transaction.Amount), 0);

    let checkingBalance = totalCredits - totalDebits;

    let expensesByCategory = {};
    bankTransactions.forEach(transaction => {
        if (transaction.Amount < 0) {
            expensesByCategory[transaction.Category] =
                (expensesByCategory[transaction.Category] || 0) + Math.abs(transaction.Amount);
        }
    });
    function updateAccountBalance() {
        document.getElementById("checking-balance").innerText = `$${checkingBalance.toFixed(2)}`;
    };
    const financialData = {
        income: totalCredits,
        expenditure: totalDebits,
        remaining_funds: checkingBalance,
        predicted_expenditure: totalDebits * 1.05, // Assuming a 5% increase
        expenses_by_category: expensesByCategory
    };

    // Update Checking Account Balance in Dashboard
    // Analyze Spending Trends
    function analyzeSpendingTrends() {
        const spendingByMonth = {};

        // Organize spending by month and category
        bankTransactions.forEach(tx => {
            const month = tx.Date.substring(0, 7); // YYYY-MM format
            if (tx.Amount < 0) {
                if (!spendingByMonth[month]) spendingByMonth[month] = {};
                spendingByMonth[month][tx.Category] =
                    (spendingByMonth[month][tx.Category] || 0) + Math.abs(tx.Amount);
            }
        });

        const months = Object.keys(spendingByMonth).sort(); // Sort months chronologically
        if (months.length < 2) return; // Need at least 2 months to compare trends

        const lastMonth = months[months.length - 2]; // Previous month
        const currentMonth = months[months.length - 1]; // Most recent month

        let alerts = [];

        Object.keys(spendingByMonth[currentMonth]).forEach(category => {
            const prevSpending = spendingByMonth[lastMonth][category] || 0;
            const currSpending = spendingByMonth[currentMonth][category];

            if (prevSpending > 0 && (currSpending / prevSpending) >= 1.2) {
                alerts.push(`⚠️ You spent 20% more on ${category} this month! Consider cutting back.`);
            }
        });

        // Show alerts in chatbot
        if (alerts.length > 0) {
            alerts.forEach(alert => {
                document.getElementById("chat-body").innerHTML += `<p><strong>Bot:</strong> ${alert}</p>`;
            });
        }
    }

    // Function to Add User Bills & Remind
    window.addBill = function () {
        const billName = prompt("Enter Bill Name (e.g., Rent, Credit Card Payment):");
        const dueDate = prompt("Enter Due Date (DD format):");
        if (billName && dueDate) {
            userBills.push({ bill: billName, dueDay: parseInt(dueDate) });
            alert(`✅ ${billName} added! You will be reminded before the due date.`);
            checkUpcomingBills();
        }
    };

    // Check for Upcoming Bills and Loan Payments
    function checkUpcomingBills() {
        const today = new Date();
        const dayOfMonth = today.getDate();
        let reminders = [];

        // Fixed due dates for system-defined bills
        const billDueDates = {
            "Rent": 2,
            "Electricity": 5,
            "Internet": 10,
            "Loan EMI": 15
        };

        // Include user-defined bills
        userBills.forEach(bill => {
            billDueDates[bill.bill] = bill.dueDay;
        });

        for (const [bill, dueDay] of Object.entries(billDueDates)) {
            if (dueDay - dayOfMonth <= 3 && dueDay - dayOfMonth >= 0) { // Reminder 3 days before due
                reminders.push(`🔔 Reminder: Your ${bill} payment is due on the ${dueDay}th.`);
            }
        }

        // Show reminders in chatbot
        if (reminders.length > 0) {
            reminders.forEach(reminder => {
                document.getElementById("chat-body").innerHTML += `<p><strong>Bot:</strong> ${reminder}</p>`;
            });
        }
    }


    // Handle Chatbot Input
    const chatInput = document.getElementById("chat-input");
    const chatBody = document.getElementById("chat-body");

    chatInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter" && chatInput.value.trim() !== "") {
            const userMessage = chatInput.value.toLowerCase();
            chatBody.innerHTML += `<p><strong>You:</strong> ${chatInput.value}</p>`;
            chatInput.value = "";
            if (userMessage.includes("add bill")) {
                addBill();
            } else if (userMessage.includes("upcoming bills")) {
                checkUpcomingBills();
                chatBody.innerHTML += `<p><strong>Bot:</strong> Checking upcoming bill payments...</p>`;
            } else if (userMessage.includes("monthly income") || userMessage.includes("expenditure")) {
                displayPieChart(financialData);
                chatBody.innerHTML += `<p><strong>Bot:</strong> Here’s a breakdown of your monthly income and expenses.</p>`;
            } else if (userMessage.includes("categorized spending")) {
                displayBarChart(financialData);
                chatBody.innerHTML += `<p><strong>Bot:</strong> Here's how you spent your money by category.</p>`;
            } else if (userMessage.includes("spending summary")) {
                displayFinancialSummary(financialData);
                chatBody.innerHTML += `<p><strong>Bot:</strong> Here’s your financial summary including predictions for next month.</p>`;
            } else if (userMessage.includes("savings plan")) {
                displaySavingsRecommendation(financialData);
                chatBody.innerHTML += `<p><strong>Bot:</strong> Here's a recommended savings plan.</p>`;
            } else {
                chatBody.innerHTML += `<p><strong>Bot:</strong> I didn't understand that. Try asking about 'monthly income', 'categorized spending', or 'savings plan'.</p>`;
            }
        }
    });

    function displayPieChart(data) {
        document.getElementById("charts-container").style.display = "block";
        const ctx = document.getElementById("incomeExpenditureChart").getContext("2d");

        new Chart(ctx, {
            type: "pie",
            data: {
                labels: Object.keys(data.expenses_by_category).map(category => {
                    let percentage = ((data.expenses_by_category[category] / data.expenditure) * 100).toFixed(1);
                    return `${category} (${percentage}%)`;
                }),
                datasets: [{
                    data: Object.values(data.expenses_by_category),
                    backgroundColor: ["#916BBF", "#0074D9", "#2ECC71", "#FF69B4", "#8B4513", "#DC143C", "#FFA500", "#696969"]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: "Expenditure Distribution"
                    }
                }
            }
        });
    }

    function displayBarChart(data) {
        document.getElementById("charts-container").style.display = "block";
        new Chart(document.getElementById("categoryChart").getContext("2d"), {
            type: "bar",
            data: {
                labels: Object.keys(data.expenses_by_category),
                datasets: [{
                    label: "Amount Spent ($)",
                    data: Object.values(data.expenses_by_category),
                    backgroundColor: "#4a90e2"
                }]
            },
            options: {
                responsive: true
            }
        });
    }

    // Function to Display Financial Summary
    function displayFinancialSummary(data) {
        document.getElementById("financial-summary").style.display = "block";
        document.getElementById("financial-summary").innerHTML = `
            <p><strong>--- Financial Summary ---</strong></p>
            <p><strong>Total Income:</strong> $${data.income.toFixed(2)}</p>
            <p><strong>Total Expenditure:</strong> $${data.expenditure.toFixed(2)}</p>
            <p><strong>Remaining Funds (Checking Balance):</strong> $${data.remaining_funds.toFixed(2)}</p>
            <p><strong>Predicted Next Month’s Expenditure:</strong> $${data.predicted_expenditure.toFixed(2)}</p>
        `;
    }

    function displaySavingsRecommendation(data) {
        document.getElementById("savings-plan").style.display = "block";
        let recommended_savings = data.income * 0.20;
        let savingsMessage = data.remaining_funds >= recommended_savings
            ? "✅ You're on track with your savings plan!"
            : "⚠️ Consider reducing discretionary expenses to save more.";

        document.getElementById("savings-plan").innerHTML = `
            <p><strong>💰 !!Savings Plan Recommendation:!!</strong></p>
            <p><strong>Recommended Monthly Savings:</strong> $${recommended_savings.toFixed(2)}</p>
            <p><strong>Your Estimated Savings This Month:</strong> $${data.remaining_funds.toFixed(2)}</p>
            <p>${savingsMessage}</p>
        `;
    }
});

