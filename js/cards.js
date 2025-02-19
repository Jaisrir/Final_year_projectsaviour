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