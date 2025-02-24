document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
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

    // Transaction Management
    const addTransactionForm = document.getElementById('addTransactionForm');
    const creditsList = document.getElementById('creditsList');
    const debitsList = document.getElementById('debitsList');

    // Add new transaction
    addTransactionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const type = document.getElementById('transactionType').value;
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const date = document.getElementById('date').value;

        const transactionItem = createTransactionElement(type, description, amount, date);
        
        if (type === 'credit') {
            creditsList.prepend(transactionItem);
        } else {
            debitsList.prepend(transactionItem);
        }

        addTransactionForm.reset();
    });

    // Create transaction element
    function createTransactionElement(type, description, amount, date) {
        const div = document.createElement('div');
        div.className = `transaction-item ${type}`;
        
        const amountPrefix = type === 'credit' ? '+' : '-';
        
        div.innerHTML = `
            <div class="transaction-content">
                <h3>${description}</h3>
                <p class="amount">${amountPrefix}$${amount}</p>
                <p class="date">${date}</p>
            </div>
            <div class="transaction-actions">
                <button class="edit-btn">✎</button>
                <button class="delete-btn">×</button>
            </div>
        `;

        // Add delete functionality
        div.querySelector('.delete-btn').addEventListener('click', function() {
            div.remove();
        });

        // Add edit functionality
        div.querySelector('.edit-btn').addEventListener('click', function() {
            const newDescription = prompt('Enter new description:', description);
            const newAmount = prompt('Enter new amount:', amount);
            
            if (newDescription && newAmount) {
                div.querySelector('h3').textContent = newDescription;
                div.querySelector('.amount').textContent = `${amountPrefix}$${newAmount}`;
            }
        });

        return div;
    }

    const saviourAiBtn = document.getElementById('saviourAiBtn');
    const aiAssistant = document.getElementById('aiAssistantExpanded');
    const closeAi = document.getElementById('closeAi');
    const addTransactionSection = document.querySelector('.add-transaction-section');

    saviourAiBtn.addEventListener('click', function() {
        aiAssistant.classList.add('active');
        addTransactionSection.classList.add('shrink');
        saviourAiBtn.style.display = 'none';
    });

    closeAi.addEventListener('click', function() {
        aiAssistant.classList.remove('active');
        addTransactionSection.classList.remove('shrink');
        saviourAiBtn.style.display = 'block';
    });
}); 