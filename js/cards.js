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
            const page = this.getAttribute('data-page');
            if (page === 'dashboard') {
                window.location.href = 'index.html';
            }
            // Add other page navigations as needed
        });
    });

    // Card Form Handling
    const cardForm = document.getElementById('addCardForm');
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');

    // Format card number with spaces
    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = '';
        for(let i = 0; i < value.length; i++) {
            if(i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        e.target.value = formattedValue;
    });

    // Format expiry date
    expiryDate.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0,2) + '/' + value.slice(2);
        }
        e.target.value = value;
    });

    // Form submission
    cardForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            cardHolder: document.getElementById('cardHolder').value,
            cardNumber: cardNumber.value,
            expiryDate: expiryDate.value,
            cvv: document.getElementById('cvv').value,
            cardType: document.getElementById('cardType').value
        };

        // Add card to grid (in real app, this would be sent to a server)
        addCardToGrid(formData);
        
        // Reset form
        cardForm.reset();
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
        <div class="card-number">${cardData.cardNumber}</div>
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