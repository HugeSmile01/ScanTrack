document.addEventListener('DOMContentLoaded', function () {
    firebase.auth().onAuthStateChanged((user) => {
      const loginLink = document.getElementById('login-link');
      const logoutLink = document.getElementById('logout-link');
      const emailLabel = document.getElementById('user-email'); // may be null
      const dashboardLink = document.getElementById('dashboard-link');
      const scannerLink = document.getElementById('scanner-link');

      if (user) {
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'flex';
        if (emailLabel) emailLabel.textContent = user.email;

        const domain = user.email.split('@')[1];
        if (domain === 'yandex.com') {
          if (dashboardLink) dashboardLink.style.display = 'flex';
          if (scannerLink) scannerLink.style.display = 'flex';
        }
      } else {
        if (loginLink) loginLink.style.display = 'flex';
        if (logoutLink) logoutLink.style.display = 'none';
        if (emailLabel) emailLabel.textContent = 'ScanTrack email';
      }
    });

    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', function (e) {
        e.preventDefault();
        firebase.auth().signOut()
          .then(() => location.reload())
          .catch((error) => console.error('Logout error:', error));
      });
    }
  });
