// Global TransactionAnalyzer class
window.TransactionAnalyzer = class {
    constructor() {
        this.transactions = [];
        this.categoryMap = {
            'PETROL': ['PETROL', 'FUEL', 'GAS'],
            'FOOD': ['RESTAURANT', 'FOOD', 'SWIGGY', 'ZOMATO', 'DINING'],
            'SHOPPING': ['AMAZON', 'FLIPKART', 'MYNTRA', 'RETAIL'],
            'ENTERTAINMENT': ['NETFLIX', 'PRIME', 'MOVIE', 'SPOTIFY'],
            'UTILITIES': ['ELECTRICITY', 'WATER', 'INTERNET', 'PHONE', 'MOBILE'],
            'TRANSPORT': ['UBER', 'OLA', 'METRO', 'BUS', 'AUTO']
        };
    }

    // Analyze transactions and provide tips
    analyzeTransactions(transactions) {
        const tips = [];
        const expenseCategories = {};

        // Categorize expenses
        transactions.forEach(transaction => {
            if (transaction.type === 'debit') {
                const category = this.categorizeTransaction(transaction.description);
                if (category) {
                    if (!expenseCategories[category]) {
                        expenseCategories[category] = 0;
                    }
                    expenseCategories[category] += transaction.amount;
                }
            }
        });

        // Generate tips based on expense categories
        for (const [category, amount] of Object.entries(expenseCategories)) {
            if (category === 'FOOD' && amount > 5000) {
                tips.push(`Consider reducing your spending on ${category.toLowerCase()} by cooking at home more often.`);
            } else if (category === 'SHOPPING' && amount > 10000) {
                tips.push(`You're spending a lot on ${category.toLowerCase()}. Try to limit unnecessary purchases.`);
            } else if (category === 'TRANSPORT' && amount > 3000) {
                tips.push(`Consider using public transport or carpooling to reduce ${category.toLowerCase()} expenses.`);
            }
        }

        // Investment tips
        tips.push('Consider investing in mutual funds or ETFs for long-term growth.');
        tips.push('Explore high-yield savings accounts for better returns on your savings.');

        return tips;
    }

    // Categorize transaction based on description
    categorizeTransaction(description) {
        for (const [category, keywords] of Object.entries(this.categoryMap)) {
            for (const keyword of keywords) {
                if (description.toUpperCase().includes(keyword)) {
                    return category;
                }
            }
        }
        return null;
    }
};

// Initialize the analyzer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('statementFile');
    if (!fileInput) return;

    const analyzer = new window.TransactionAnalyzer();

    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/upload_csv', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                const transactions = result.transactions || [];
                const tips = analyzer.analyzeTransactions(transactions);
                const aiMessages = document.getElementById('aiMessages');
                tips.forEach(tip => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'message bot';
                    messageDiv.textContent = tip;
                    aiMessages.appendChild(messageDiv);
                });
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    });
});