document.addEventListener('DOMContentLoaded', function() {
    const saviourAIBtn = document.querySelector('.saviour-ai-btn');
    const saviourAIPopup = document.getElementById('saviourAIPopup');
    const closeAI = document.querySelector('.close-ai');
    const fileInput = document.getElementById('statementFile');
    const fileInfo = document.getElementById('fileInfo');
    const aiMessages = document.getElementById('aiMessages');

    if (!saviourAIBtn || !saviourAIPopup || !closeAI || !fileInput || !fileInfo || !aiMessages) {
        console.error('One or more Saviour AI elements not found');
        return;
    }

    // Toggle Saviour AI popup
    saviourAIBtn.addEventListener('click', () => {
        saviourAIPopup.classList.toggle('active');
    });

    // Close Saviour AI popup
    closeAI.addEventListener('click', () => {
        saviourAIPopup.classList.remove('active');
    });

    // Handle file upload
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        fileInfo.textContent = `Selected: ${file.name}`;
        aiMessages.innerHTML = '';
        addMessage('bot', 'Analyzing your transactions... Please wait.');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/upload_csv', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                addMessage('bot', 'Analysis complete! Here are your results:');
                addAnalysisResult('Total Credits', { total: `₹${result.analysis.total_credits}` });
                addAnalysisResult('Total Debits', { total: `₹${result.analysis.total_debits}` });
                addAnalysisResult('Net Worth', { net_worth: `₹${result.analysis.net_worth}` });
                addMessage('bot', `You had ${result.analysis.credit_count} credit transactions and ${result.analysis.debit_count} debit transactions.`);

                // Dynamically update the transactions list without reloading the page
                fetchTransactions();
            } else {
                addMessage('bot', 'Error analyzing the file: ' + result.message);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            addMessage('bot', 'Failed to upload the file.');
        }

        fileInput.value = '';
    });

    // Function to add a message to the AI popup
    function addMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = message;
        aiMessages.appendChild(messageDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    // Function to add an analysis result to the AI popup
    function addAnalysisResult(title, data) {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'analysis-result';
        let html = `<h4>${title}</h4>`;
        for (const [key, value] of Object.entries(data)) {
            html += `<p><span class="highlight">${key}:</span> ${value}</p>`;
        }
        resultDiv.innerHTML = html;
        aiMessages.appendChild(resultDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    // Function to fetch and display transactions
    function fetchTransactions() {
        fetch('/transactions')
            .then(response => response.json())
            .then(data => {
                const creditsList = document.getElementById('creditsList');
                const debitsList = document.getElementById('debitsList');

                // Clear existing transactions
                creditsList.innerHTML = '';
                debitsList.innerHTML = '';

                // Add credit transactions
                data.credits.forEach(transaction => {
                    const element = createTransactionElement('credit', transaction.description, transaction.amount, transaction.date);
                    creditsList.appendChild(element);
                });

                // Add debit transactions
                data.debits.forEach(transaction => {
                    const element = createTransactionElement('debit', transaction.description, transaction.amount, transaction.date);
                    debitsList.appendChild(element);
                });
            })
            .catch(error => console.error('Error fetching transactions:', error));
    }

    // Function to create a transaction element
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

    // Fetch transactions when the page loads
    fetchTransactions();
});