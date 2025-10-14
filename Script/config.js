const firebaseConfig = {
  apiKey: "AIzaSyADtb-DkiKLntUMp4IVMLOdTLI5kBDC_d0",
  authDomain: "scantr4ck.firebaseapp.com",
  projectId: "scantr4ck",
  storageBucket: "scantr4ck.appspot.com",
  messagingSenderId: "679035674854",
  appId: "1:679035674854:web:6dcb05906d680dc59edb27",
  measurementId: "G-Q9YHK207XW"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
