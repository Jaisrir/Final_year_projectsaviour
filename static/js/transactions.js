document.addEventListener('DOMContentLoaded', function() {
    const creditsList = document.getElementById('creditsList');
    const debitsList = document.getElementById('debitsList');

    // Function to fetch and display transactions
    function fetchTransactions() {
        fetch('/transactions')
            .then(response => response.json())
            .then(data => {
                // Clear existing transactions
                creditsList.innerHTML = '';
                debitsList.innerHTML = '';

                // Add credit transactions
                data.credits.forEach(transaction => {
                    const element = createTransactionElement('credit', transaction.description, transaction.amount, transaction.date, transaction._id);
                    creditsList.appendChild(element);
                });

                // Add debit transactions
                data.debits.forEach(transaction => {
                    const element = createTransactionElement('debit', transaction.description, transaction.amount, transaction.date, transaction._id);
                    debitsList.appendChild(element);
                });

                // Add event listeners for delete buttons
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', handleDelete);
                });

                // Add event listeners for edit buttons
                document.querySelectorAll('.edit-btn').forEach(button => {
                    button.addEventListener('click', handleEdit);
                });
            })
            .catch(error => console.error('Error fetching transactions:', error));
    }

    // Function to create a transaction element
    function createTransactionElement(type, description, amount, date, id) {
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
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'transaction-actions';
        const editButton = document.createElement('button');
        editButton.className = 'edit-btn';
        editButton.textContent = '✎';
        editButton.setAttribute('data-id', id);
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = '×';
        deleteButton.setAttribute('data-id', id);
        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);
        div.appendChild(descDiv);
        div.appendChild(amountDiv);
        div.appendChild(dateDiv);
        div.appendChild(actionsDiv);
        return div;
    }

    // Function to handle delete button clicks
    function handleDelete(event) {
        const transactionId = event.target.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this transaction?')) {
            fetch(`/delete_transaction/${transactionId}`, {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Refresh the transactions list
                    fetchTransactions();
                } else {
                    alert('Failed to delete transaction: ' + data.message);
                }
            })
            .catch(error => console.error('Error deleting transaction:', error));
        }
    }

    // Function to handle edit button clicks
    function handleEdit(event) {
        const transactionId = event.target.getAttribute('data-id');
        const transactionItem = event.target.closest('.transaction-item');
        const description = transactionItem.querySelector('.transaction-description').textContent;
        const amount = parseFloat(transactionItem.querySelector('.transaction-amount').textContent.replace('₹', ''));
        const date = transactionItem.querySelector('.transaction-date').textContent;
        const type = transactionItem.classList.contains('credit') ? 'credit' : 'debit';

        // Create a form for editing the transaction
        const editForm = document.createElement('form');
        editForm.className = 'edit-form';
        editForm.innerHTML = `
            <div class="form-group">
                <label for="description">Description</label>
                <input type="text" id="description" value="${description}" required>
            </div>
            <div class="form-group">
                <label for="amount">Amount</label>
                <input type="number" id="amount" value="${amount}" required>
            </div>
            <div class="form-group">
                <label for="date">Date</label>
                <input type="date" id="date" value="${date}" required>
            </div>
            <div class="form-group">
                <label for="type">Type</label>
                <select id="type">
                    <option value="credit" ${type === 'credit' ? 'selected' : ''}>Credit</option>
                    <option value="debit" ${type === 'debit' ? 'selected' : ''}>Debit</option>
                </select>
            </div>
            <button type="submit" class="submit-btn">Save</button>
            <button type="button" class="cancel-btn">Cancel</button>
        `;

        // Replace the transaction content with the edit form
        transactionItem.innerHTML = '';
        transactionItem.appendChild(editForm);

        // Handle form submission
        editForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const updatedDescription = editForm.querySelector('#description').value;
            const updatedAmount = parseFloat(editForm.querySelector('#amount').value);
            const updatedDate = editForm.querySelector('#date').value;
            const updatedType = editForm.querySelector('#type').value;

            fetch(`/edit_transaction/${transactionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `description=${encodeURIComponent(updatedDescription)}&amount=${updatedAmount}&date=${updatedDate}&type=${updatedType}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Refresh the transactions list
                    fetchTransactions();
                } else {
                    alert('Failed to update transaction: ' + data.message);
                }
            })
            .catch(error => console.error('Error updating transaction:', error));
        });

        // Handle cancel button click
        editForm.querySelector('.cancel-btn').addEventListener('click', function() {
            fetchTransactions();
        });
    }

    // Fetch transactions when the page loads
    fetchTransactions();
});