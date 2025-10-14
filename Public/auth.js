document.addEventListener('DOMContentLoaded', function() {

  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyADtb-DkiKLntUMp4IVMLOdTLI5kBDC_d0",
    authDomain: "scantr4ck.firebaseapp.com",
    projectId: "scantr4ck",
    storageBucket: "scantr4ck.appspot.com",
    messagingSenderId: "679035674854",
    appId: "1:679035674854:web:6dcb05906d680dc59edb27",
    measurementId: "G-Q9YHK207XW"
  };

  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  // auth.js

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            // Redirect to the page they were trying to access
            const redirectTo = sessionStorage.getItem('redirectTo');
            if (redirectTo) {
                window.location.href = redirectTo;
            } else {
                window.location.href = 'index.html'; // Default page if no redirect URL is saved
            }
        }
    });

    // Handle sign-in with Google
    document.getElementById('loginbtn').addEventListener('click', function() {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).then(function(result) {
            // Successfully signed in
            // The user will be redirected automatically if `onAuthStateChanged` is listening
        }).catch(function(error) {
            // Handle Errors here.
            console.error('Error signing in:', error.message);
        });
    });
});

  
  const auth = firebase.auth();

  // Sign in with Google
  const loginBtn = document.querySelector('#loginbtn');
  const loginBtnMobile = document.querySelector('#loginbtn-mobile');
  loginBtn?.addEventListener('click', signInWithGoogle);
  loginBtnMobile?.addEventListener('click', signInWithGoogle);

  // Sign out
  const signoutBtn = document.querySelector('#signoutbtn');
  const signoutBtnMobile = document.querySelector('#signoutbtn-mobile');
  signoutBtn?.addEventListener('click', signOut);
  signoutBtnMobile?.addEventListener('click', signOut);

  // Display user info
  function updateUserUI(user) {
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const userInfoMobile = document.getElementById('user-info-mobile');
    const userNameMobile = document.getElementById('user-name-mobile');

    if (user) {
      userInfo.style.display = 'block';
      userName.textContent = `Hello, ${user.displayName}`;
      userInfoMobile.style.display = 'block';
      userNameMobile.textContent = `Hello, ${user.displayName}`;

      loginBtn.style.display = 'none';
      loginBtnMobile.style.display = 'none';
      signoutBtn.style.display = 'inline-block';
      signoutBtnMobile.style.display = 'inline-block';
    } else {
      userInfo.style.display = 'none';
      userName.textContent = '';
      userInfoMobile.style.display = 'none';
      userNameMobile.textContent = '';

      loginBtn.style.display = 'inline-block';
      loginBtnMobile.style.display = 'inline-block';
      signoutBtn.style.display = 'none';
      signoutBtnMobile.style.display = 'none';
    }
  }

  // Google Sign-In
  function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then((result) => {
        console.log('User signed in');
        updateUserUI(result.user);

        // Redirect to the saved URL
        const redirectTo = sessionStorage.getItem('redirectTo') || 'index.html';
        sessionStorage.removeItem('redirectTo'); // Clean up the sessionStorage
        window.location.href = redirectTo;
      })
      .catch((error) => {
        console.error('Error signing in: ', error.message);
        alert('Error signing in: ' + error.message);
      });
  }

  // Sign out
  function signOut() {
    auth.signOut()
      .then(() => {
        console.log('User signed out successfully');
        updateUserUI(null);
      })
      .catch((error) => {
        console.error('Error signing out: ', error.message);
        alert('Error signing out: ' + error.message);
      });
  }

  // Handle auth state changes
  auth.onAuthStateChanged((user) => {
    updateUserUI(user);
    
    if (!user) {
      // Save the current page URL to sessionStorage before redirecting
      sessionStorage.setItem('redirectTo', window.location.href);
      window.location.href = "login.html";
    } else {
      const emailDomain = user.email.split('@')[1];
      if (emailDomain !== 'deped.gov.ph') {
        window.location.href = 'index.html';
      }
    }
  });

  // Add event listeners for the login and logout buttons
  document.getElementById('login-btn').addEventListener('click', signInWithGoogle);
  document.getElementById('logout-btn').addEventListener('click', signOut);
  document.getElementById('login-btn-mobile').addEventListener('click', signInWithGoogle);
  document.getElementById('logout-btn-mobile').addEventListener('click', signOut);
});
