document.addEventListener('DOMContentLoaded', function() {
  const loginBtn = document.querySelector('#loginbtn');
  const loginBtnMobile = document.querySelector('#loginbtn-mobile');
  const signoutBtn = document.querySelector('#signoutbtn');
  const signoutBtnMobile = document.querySelector('#signoutbtn-mobile');
  const loginBtnAlt = document.getElementById('login-btn');
  const logoutBtnAlt = document.getElementById('logout-btn');
  const loginBtnMobileAlt = document.getElementById('login-btn-mobile');
  const logoutBtnMobileAlt = document.getElementById('logout-btn-mobile');

  function updateUserUI(user) {
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const userInfoMobile = document.getElementById('user-info-mobile');
    const userNameMobile = document.getElementById('user-name-mobile');

    if (user) {
      if (userInfo) userInfo.style.display = 'block';
      if (userName) userName.textContent = `Hello, ${user.displayName}`;
      if (userInfoMobile) userInfoMobile.style.display = 'block';
      if (userNameMobile) userNameMobile.textContent = `Hello, ${user.displayName}`;
      if (loginBtn) loginBtn.style.display = 'none';
      if (loginBtnMobile) loginBtnMobile.style.display = 'none';
      if (signoutBtn) signoutBtn.style.display = 'inline-block';
      if (signoutBtnMobile) signoutBtnMobile.style.display = 'inline-block';
    } else {
      if (userInfo) userInfo.style.display = 'none';
      if (userName) userName.textContent = '';
      if (userInfoMobile) userInfoMobile.style.display = 'none';
      if (userNameMobile) userNameMobile.textContent = '';
      if (loginBtn) loginBtn.style.display = 'inline-block';
      if (loginBtnMobile) loginBtnMobile.style.display = 'inline-block';
      if (signoutBtn) signoutBtn.style.display = 'none';
      if (signoutBtnMobile) signoutBtnMobile.style.display = 'none';
    }
  }

  function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then((result) => {
        updateUserUI(result.user);
        const redirectTo = sessionStorage.getItem('redirectTo') || 'index.html';
        sessionStorage.removeItem('redirectTo');
        window.location.href = redirectTo;
      })
      .catch((error) => {
        console.error('Error signing in: ', error.message);
        alert('Error signing in: ' + error.message);
      });
  }

  function signOut() {
    auth.signOut()
      .then(() => {
        updateUserUI(null);
      })
      .catch((error) => {
        console.error('Error signing out: ', error.message);
        alert('Error signing out: ' + error.message);
      });
  }

  auth.onAuthStateChanged((user) => {
    updateUserUI(user);
    
    if (!user) {
      sessionStorage.setItem('redirectTo', window.location.href);
      window.location.href = "login.html";
    } else {
      const emailDomain = user.email.split('@')[1];
      if (emailDomain !== 'deped.gov.ph') {
        window.location.href = 'index.html';
      }
    }
  });

  if (loginBtn) loginBtn.addEventListener('click', signInWithGoogle);
  if (loginBtnMobile) loginBtnMobile.addEventListener('click', signInWithGoogle);
  if (signoutBtn) signoutBtn.addEventListener('click', signOut);
  if (signoutBtnMobile) signoutBtnMobile.addEventListener('click', signOut);
  if (loginBtnAlt) loginBtnAlt.addEventListener('click', signInWithGoogle);
  if (logoutBtnAlt) logoutBtnAlt.addEventListener('click', signOut);
  if (loginBtnMobileAlt) loginBtnMobileAlt.addEventListener('click', signInWithGoogle);
  if (logoutBtnMobileAlt) logoutBtnMobileAlt.addEventListener('click', signOut);
});
