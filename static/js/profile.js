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

    // Handle profile form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(profileForm);
            fetch('/profile', {
                method: 'POST',
                body: formData
            }).then(response => {
                if (response.ok) {
                    window.location.reload();
                }
            });
        });
    }

    // Handle image change
    const profileImageInput = document.getElementById('profileImage');
    if (profileImageInput) {
        profileImageInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const profileImage = document.querySelector('.profile-image');
                    profileImage.innerHTML = `<img src="${e.target.result}" alt="Profile Image">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});