const authForm = document.getElementById('auth-form');
const formTitle = document.getElementById('form-title');
const submitButton = document.getElementById('submit-button');
const toggleLink = document.getElementById('toggle-link');
const teacherNameGroup = document.getElementById('teacher-name-group');
const teacherNameInput = document.getElementById('teacher-name');
const googleSignInButton = document.getElementById('google-signin');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const policyCheckboxGroup = document.getElementById('policy-checkbox-group');
const policyCheckbox = document.getElementById('policy-checkbox');

let isSignUp = false;

authForm.addEventListener('submit', handleFormSubmit);
toggleLink.addEventListener('click', toggleForm);
googleSignInButton.addEventListener('click', signInWithGoogle);
forgotPasswordLink.addEventListener('click', handleForgotPassword);

function toggleForm() {
  isSignUp = !isSignUp;
  formTitle.textContent = isSignUp ? 'Sign Up' : 'Sign In';
  submitButton.textContent = isSignUp ? 'Sign Up' : 'Sign In';
  toggleLink.textContent = isSignUp
    ? 'Already have an account? Sign In'
    : 'Don’t have an account? Sign Up';
  teacherNameGroup.classList.toggle('hidden', !isSignUp);
  teacherNameInput.toggleAttribute('required', isSignUp);
  policyCheckboxGroup.classList.toggle('hidden', !isSignUp);
}

async function handleFormSubmit(e) {
  e.preventDefault();
  submitButton.disabled = true;

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const teacherName = teacherNameInput.value;

  try {
    if (isSignUp) {
      if (!teacherName) {
        throw new Error('Teacher name is required');
      }
      if (!policyCheckbox.checked) {
        throw new Error('You must accept the Terms and Privacy Policy.');
      }

      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({ displayName: teacherName });
      await userCredential.user.sendEmailVerification();
      await auth.signOut();

      Swal.fire({
        icon: 'success',
        title: 'Verify Your Email',
        html: `A verification email has been sent to <strong>${email}</strong>. 
              Please check your inbox and verify before signing in.`,
        confirmButtonText: 'OK'
      });
    } else {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);

      if (!userCredential.user.emailVerified) {
        await auth.signOut();
        throw new Error('Email not verified. Check your inbox for verification link.');
      }
      window.location.href = 'index.html';
    }
  } catch (error) {
    handleAuthError(error, isSignUp);
  } finally {
    submitButton.disabled = false;
  }
}

async function signInWithGoogle() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    const emailDomain = result.user.email.split('@')[1];
    if (emailDomain !== 'deped.gov.ph') {
      await auth.signOut();
      throw new Error('Only deped.gov.ph email addresses are allowed.');
    }
    window.location.href = 'index.html';
  } catch (error) {
    handleAuthError(error, false);
  }
}

function handleAuthError(error, isSignUp) {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/popup-closed-by-user': 'Sign in process canceled.',
  };

  const message = errorMessages[error.code] || error.message;

  Swal.fire({
    icon: 'error',
    title: `${isSignUp ? 'Sign Up' : 'Sign In'} Error`,
    text: message,
    confirmButtonText: 'OK'
  });
}

function handleForgotPassword() {
  const email = document.getElementById('email').value;
  if (!email) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Please enter your email address.',
      confirmButtonText: 'OK'
    });
    return;
  }

  auth.sendPasswordResetEmail(email)
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Password Reset Email Sent',
        text: 'Check your inbox for a password reset link.',
        confirmButtonText: 'OK'
      });
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        confirmButtonText: 'OK'
      });
    });
}
