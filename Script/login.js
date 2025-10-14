function logout() {
  auth.signOut().then(() => {
    Swal.fire({
      icon: 'success',
      title: 'Signed Out',
      text: 'You have been signed out successfully.',
      showConfirmButton: false,
      timer: 1500
    });
    updateUI(null);
  }).catch(error => {
    Swal.fire({
      icon: 'error',
      title: 'Sign Out Failed',
      text: `Error: ${error.message}`
    });
  });
}

function showContactInfo() {
  Swal.fire({
    title: 'Contact Information',
    icon: 'info',
    html: `
        <p>You can reach out through the following channels:</p>
        <ul style="text-align: left; line-height: 1.6; margin: 0; padding-left: 1em;">
          <li><strong>Email:</strong> <a href="mailto:johnrishladica@gmail.com">johnrishladica@gmail.com</a></li>
          <li><strong>Facebook:</strong> <a href="https://facebook.com/HugeSmile.org" target="_blank">HugeSmile.org</a></li>
          <li><strong>GitHub:</strong> <a href="https://github.com/HugeSmile01" target="_blank">HugeSmile01</a></li>
        </ul>
      `,
    confirmButtonText: 'Close',
    background: '#2d2d2d',
    color: '#E8EAED'
  });
}

function updateUI(user) {
  const loginLink = document.querySelector('a[href="login.html"]');
  const logoutLink = document.getElementById('logout-link');
  const dashboardLink = document.getElementById('dashboard-link');
  const scannerLink = document.getElementById('scanner-link');
  const chatbotLink = document.getElementById('chatbot-link');
  const emailSpan = document.querySelector('.demo-avatar-dropdown span');

  if (user) {
    if (loginLink) loginLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'flex';
    if (dashboardLink) dashboardLink.style.display = 'flex';
    if (scannerLink) scannerLink.style.display = 'flex';
    if (chatbotLink) chatbotLink.style.display = 'flex';
    if (emailSpan) emailSpan.textContent = user.email;
  } else {
    if (loginLink) loginLink.style.display = 'flex';
    if (logoutLink) logoutLink.style.display = 'none';
    if (dashboardLink) dashboardLink.style.display = 'none';
    if (scannerLink) scannerLink.style.display = 'none';
    if (chatbotLink) chatbotLink.style.display = 'none';
    if (emailSpan) emailSpan.textContent = 'hello@example.com';
  }
}

auth.onAuthStateChanged(user => {
  updateUI(user);
  if (user) {
    const domain = user.email.split('@')[1];
    const shown = sessionStorage.getItem('welcome-shown');

    if (domain === 'yandex.com' && !shown) {
      Swal.fire({
        icon: 'success',
        title: 'Welcome Admin!',
        text: `Hello Admin, ${user.displayName}!`,
        showConfirmButton: false,
        timer: 1500
      });
      sessionStorage.setItem('welcome-shown', 'true');
    }
  } else {
    sessionStorage.removeItem('welcome-shown');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
});
