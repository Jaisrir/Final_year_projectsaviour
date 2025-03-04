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

    // ... rest of the TransactionAnalyzer class implementation ...
};

// Initialize the analyzer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('statementFile');
    if (!fileInput) return;
    
    const analyzer = new window.TransactionAnalyzer();
    // ... rest of the initialization code ...
}); 