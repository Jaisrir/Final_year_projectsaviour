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
});