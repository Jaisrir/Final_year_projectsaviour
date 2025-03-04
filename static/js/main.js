document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality - Update active state
    const navLinks = document.querySelectorAll('.nav-links li');
    const currentPath = window.location.pathname;

    if (navLinks) {
        navLinks.forEach(link => {
            const linkPath = link.querySelector('a').getAttribute('href');
            if (currentPath === linkPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Navigation functionality
    const navLinksOld = document.querySelectorAll('.nav-links li');
    if (navLinksOld) {
        navLinksOld.forEach(link => {
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
    }

    // Credit Usage Chart
    const creditCtx = document.getElementById('creditChart');
    if (creditCtx) {
        new Chart(creditCtx.getContext('2d'), {
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
    }

    // Spending Insights Chart
    const spendingCtx = document.getElementById('spendingChart');
    if (spendingCtx) {
        new Chart(spendingCtx.getContext('2d'), {
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
    }

    // Transfer money button functionality
    const transferBtn = document.querySelector('.transfer-btn');
    if (transferBtn) {
        transferBtn.addEventListener('click', function() {
            alert('Transfer functionality coming soon!');
        });
    }

    // Upgrade button functionality
    const upgradeBtn = document.querySelector('.upgrade-btn');
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', function() {
            alert('Upgrade to PRO coming soon!');
        });
    }

    // Profile icon click event
    const profileIcon = document.querySelector('.header-right .profile');
    if (profileIcon) {
        profileIcon.addEventListener('click', function() {
            window.location.href = 'profile.html'; // Navigate to profile page
        });
    }
}); 