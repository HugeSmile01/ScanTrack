// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBzpUkxIpekZHhVUCXabTCZyCmUs9bhMD8",
    authDomain: "qrattendance-hnhs.firebaseapp.com",
    projectId: "qrattendance-hnhs",
    storageBucket: "qrattendance-hnhs.appspot.com",
    messagingSenderId: "309027536444",
    appId: "1:309027536444:web:d8c5ec8451c1b8e6ea4d39",
    measurementId: "G-MTJV7RM6PX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const classesRef = database.ref('classes');
const attendanceRef = database.ref('attendance');
