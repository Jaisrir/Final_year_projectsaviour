document.addEventListener('DOMContentLoaded', function() {
    const saviourAIBtn = document.querySelector('.saviour-ai-btn');
    const saviourAIPopup = document.getElementById('saviourAIPopup');
    const closeAI = document.querySelector('.close-ai');
    const fileInput = document.getElementById('statementFile');
    const fileInfo = document.getElementById('fileInfo');
    const aiMessages = document.getElementById('aiMessages');

    if (!saviourAIBtn || !saviourAIPopup || !closeAI || !fileInput) {
        console.error('One or more Saviour AI elements not found');
        return;
    }

    // Toggle AI popup
    saviourAIBtn.addEventListener('click', () => {
        saviourAIPopup.classList.toggle('active');
    });

    // Close AI popup
    closeAI.addEventListener('click', () => {
        saviourAIPopup.classList.remove('active');
    });

    // Handle file upload
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Show selected file name
        fileInfo.textContent = `Selected: ${file.name}`;

        // Clear previous messages
        aiMessages.innerHTML = '';

        // Add loading message
        addMessage('bot', 'Analyzing your transactions... Please wait.');
        
        // Add loading spinner
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-message';
        loadingDiv.innerHTML = '<div class="loading-spinner"></div>Analyzing your statement...';
        aiMessages.appendChild(loadingDiv);

        try {
            // Simulate file processing (replace with actual analysis later)
            setTimeout(() => {
                // Remove loading message
                loadingDiv.remove();

                // Add analysis results
                addAnalysisResult('Summary', {
                    totalTransactions: 20,
                    totalCredits: '₹58,750',
                    totalDebits: '₹36,548',
                    netBalance: '₹22,202'
                });

                addAnalysisResult('Top Expenses', {
                    housing: '₹15,000 (Rent)',
                    utilities: '₹3,298 (Bills)',
                    dining: '₹1,850 (Restaurants)',
                    transportation: '₹2,500 (Travel)'
                });

                addAnalysisResult('Insights', {
                    savings: 'You saved 37.8% of your income this month',
                    highestSpend: 'Housing is your highest expense category',
                    suggestion: 'Consider reducing dining out expenses to increase savings'
                });

                // Add final message
                addMessage('bot', 'Would you like me to analyze another statement or help you understand these insights better?');
            }, 2000);

        } catch (error) {
            console.error('Error analyzing transactions:', error);
            addMessage('bot', 'Sorry, I had trouble analyzing that file. Please make sure it\'s a valid bank statement.');
        }

        // Reset file input for next upload
        fileInput.value = '';
    });

    // Function to add a message to the AI chat
    function addMessage(type, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        aiMessages.appendChild(messageDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    // Function to add an analysis result section
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
});
