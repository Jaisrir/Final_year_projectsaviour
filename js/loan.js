document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const page = this.getAttribute('data-page');
            if (page === 'cards') {
                window.location.href = 'cards.html';
            } else if (page === 'dashboard') {
                window.location.href = 'index.html';
            } else if (page === 'profile') {
                window.location.href = 'profile.html';
            } else if (page === 'loans') {
                window.location.href = 'loan.html';
            }
        });
    });

    // Loan application form submission
    const loanForm = document.getElementById('loanApplicationForm');
    loanForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Loan application submitted successfully!');
        loanForm.reset();
    });
}); 