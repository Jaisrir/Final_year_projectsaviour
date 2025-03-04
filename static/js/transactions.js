document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            const page = this.getAttribute('data-page');
            switch(page) {
                case 'dashboard':
                    window.location.href = 'index.html';
                    break;
                case 'cards':
                    window.location.href = 'cards.html';
                    break;
                case 'transactions':
                    window.location.href = 'transactions.html';
                    break;
                case 'profile':
                    window.location.href = 'profile.html';
                    break;
            }
        });
    });

    // Sample transaction data
    const transactions = {
        credits: [
            { description: 'Salary', amount: 5000, date: '2024-03-15' },
            { description: 'Freelance Work', amount: 2000, date: '2024-03-10' }
        ],
        debits: [
            { description: 'Rent', amount: 2000, date: '2024-03-01' },
            { description: 'Groceries', amount: 500, date: '2024-03-05' }
        ]
    };

    // Initialize transaction lists
    const creditsHistory = document.querySelector('.credits-history');
    const debitsHistory = document.querySelector('.debits-history');

    if (creditsHistory && debitsHistory) {
        // Add credit transactions
        transactions.credits.forEach(transaction => {
            const element = createTransactionElement('credit', transaction.description, transaction.amount, transaction.date);
            creditsHistory.appendChild(element);
        });

        // Add debit transactions
        transactions.debits.forEach(transaction => {
            const element = createTransactionElement('debit', transaction.description, transaction.amount, transaction.date);
            debitsHistory.appendChild(element);
        });
    }

    // Function to create transaction element
    function createTransactionElement(type, description, amount, date) {
        const div = document.createElement('div');
        div.className = 'transaction-item';
        
        const descDiv = document.createElement('div');
        descDiv.className = 'transaction-description';
        descDiv.textContent = description;
        
        const amountDiv = document.createElement('div');
        amountDiv.className = 'transaction-amount';
        amountDiv.textContent = `₹${amount}`;
        amountDiv.style.color = type === 'credit' ? '#4CAF50' : '#F44336';
        
        const dateDiv = document.createElement('div');
        dateDiv.className = 'transaction-date';
        dateDiv.textContent = new Date(date).toLocaleDateString();
        
        div.appendChild(descDiv);
        div.appendChild(amountDiv);
        div.appendChild(dateDiv);
        
        return div;
    }
});