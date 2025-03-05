document.addEventListener('DOMContentLoaded', function() {
    // Initialize remove buttons for existing cards
    const existingCards = document.querySelectorAll('.card');
    existingCards.forEach(card => {
        const removeBtn = card.querySelector('.remove-card-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                card.classList.add('card-removing');
                setTimeout(() => {
                    card.parentElement.removeChild(card);
                }, 300);
            });
        }
    });

    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to the clicked link
            this.classList.add('active');
            
            const page = this.getAttribute('data-page');
            switch(page) {
                case 'dashboard':
                    window.location.href = "{{ url_for('index') }}";
                    break;
                case 'cards':
                    window.location.href = "{{ url_for('cards_page') }}";
                    break;
                case 'transactions':
                    window.location.href = "{{ url_for('transactions') }}";
                    break;
                case 'profile':
                    window.location.href = "{{ url_for('profile') }}";
                    break;
            }
        });
    });

    // Set the active class based on the current page
    const currentPage = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        if (link.getAttribute('data-page') === currentPage) {
            link.classList.add('active');
        }
    });

    // Add card form submission
    document.getElementById('addCardForm')?.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        try {
            const response = await fetch("/cards", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(new FormData(this))
            });

            if (response.ok) {
                window.location.reload(); // Refresh to show updated cards
            } else {
                alert('Failed to save card');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving the card');
        }
    });
});

function addCardToGrid(cardData) {
    const cardsGrid = document.querySelector('.cards-grid');
    
    const newCard = document.createElement('div');
    newCard.className = 'card';
    newCard.innerHTML = `
        <button class="remove-card-btn" aria-label="Remove card">×</button>
        <div class="card-logos">
            <span class="mastercard-logo">○○</span>
            <span class="apple-pay">${cardData.cardType}</span>
        </div>
        <div class="card-number">${formatCardNumberForDisplay(cardData.cardNumber)}</div>
        <div class="card-details">
            <div class="valid-thru">
                <span>VALID THRU</span>
                <span>${cardData.expiryDate}</span>
            </div>
            <div class="card-holder">
                <span>CARD HOLDER</span>
                <span>${cardData.cardHolder}</span>
            </div>
        </div>
    `;
    
    // Add remove button functionality
    const removeBtn = newCard.querySelector('.remove-card-btn');
    removeBtn.addEventListener('click', function() {
        newCard.classList.add('card-removing');
        setTimeout(() => {
            cardsGrid.removeChild(newCard);
        }, 300); // Match this with CSS animation duration
    });
    
    cardsGrid.appendChild(newCard);
}

// Function to format card number for display (show only last 4 digits)
function formatCardNumberForDisplay(cardNumber) {
    return 'xxxx-xxxx-xxxx-' + cardNumber.slice(-4);
}

// Function to format card number into groups of four
function formatCardNumber(input) {
    const value = input.value.replace(/\D/g, ''); // Remove all non-digit characters
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim(); // Format into groups of four
    input.value = formattedValue;
}

// Expiry date formatting
document.getElementById('expiryDate').addEventListener('input', function() {
    const value = this.value.replace(/\D/g, ''); // Remove non-digit characters
    if (value.length >= 2) {
        this.value = value.slice(0, 2) + '/' + value.slice(2, 4); // Format as MM/YY
    } else {
        this.value = value;
    }
});