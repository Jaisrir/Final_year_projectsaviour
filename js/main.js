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
            }
        });
    });

    // Credit Usage Chart
    const creditCtx = document.getElementById('creditChart').getContext('2d');
    new Chart(creditCtx, {
        type: 'doughnut',
        data: {
            labels: ['Credits', 'Debits'],
            datasets: [{
                data: [70, 30],
                backgroundColor: [
                    '#6c5ce7',
                    '#a29bfe'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Spending Insights Chart
    const spendingCtx = document.getElementById('spendingChart').getContext('2d');
    new Chart(spendingCtx, {
        type: 'bar',
        data: {
            labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
            datasets: [{
                label: 'Credits',
                data: [10000, 8000, 15000, 10000, 9000, 8000, 18000, 15000, 17000, 12000],
                backgroundColor: '#6c5ce7'
            }, {
                label: 'Debits',
                data: [8000, 7000, 12000, 9000, 8000, 7000, 15000, 13000, 14000, 10000],
                backgroundColor: '#a29bfe'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 20000 // Add maximum value to prevent overflow
                }
            }
        }
    });

    // Transfer money button functionality
    document.querySelector('.transfer-btn').addEventListener('click', function() {
        alert('Transfer functionality coming soon!');
    });

    // Upgrade button functionality
    document.querySelector('.upgrade-btn').addEventListener('click', function() {
        alert('Upgrade to PRO coming soon!');
    });

    // Profile icon click event
    const profileIcon = document.querySelector('.header-right .profile');
    profileIcon.addEventListener('click', function() {
        window.location.href = 'profile.html'; // Navigate to profile page
    });
}); 