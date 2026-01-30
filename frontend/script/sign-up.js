const form = document.getElementById('form');
const firstName = document.getElementById('firstName');
const profile_pic = document.getElementById('profile');
const getProfileBtn = document.getElementById('getProfileBtn');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);

    if (formData.get('firstName')) {
        sessionStorage.setItem('first-name', formData.get('firstName'))

        firstName.style.border = '1px solid white';
        window.location.href = 'http://127.0.0.1:5500/frontend/pages/chat.html'
    }

    firstName.style.border = '1px solid red';

})