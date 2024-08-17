        // Firebase configuration
                firebaseConfig = {
          apiKey: process.env.FIREBASE_API_KEY,
          authDomain: process.env.FIREBASE_AUTH_DOMAIN,
          projectId: process.env.FIREBASE_PROJECT_ID,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.FIREBASE_APP_ID,
          measurementId: process.env.FIREBASE_MEASUREMENT_ID
        };
        
        firebase.initializeApp(firebaseConfig);
        
                // Generate a unique timestamp
                function generateUniqueTimestamp() {
                  return new Date().toISOString().replace(/[-:.]/g, '') + Math.floor(Math.random() * 1000);
                }
        
                // Get the current date in YYYY-MM-DD format
                function getCurrentDate() {
                  const today = new Date();
                  return today.toISOString().split('T')[0];
                }
        
                // Mark attendance function
                function markAttendance(studentId, gradeLevel, className, studentName, status, room) {
                  const dbRef = firebase.database().ref('attendance');
                  const uniqueTimestamp = generateUniqueTimestamp();
                  const attendanceKey = `${studentId}_${uniqueTimestamp}`;
                  dbRef.child(attendanceKey).set({
                    studentId,
                    gradeLevel,
                    className,
                    studentName,
                    status,
                    room,
                    scannedDate: new Date().toISOString() // Store the exact timestamp
                  }, (error) => {
                    if (error) {
                      console.error('Error saving attendance:', error);
                    } else {
                      alert('Attendance marked successfully!');
                    }
                  });
                }
        
                // Manual mark attendance
                function manualMarkAttendance() {
                  const studentId = document.getElementById('manualStudentId').value;
                  const studentName = document.getElementById('manualStudentName').value;
                  const className = document.getElementById('manualClassName').value;
                  const gradeLevel = document.getElementById('manualGradeLevel').value;
                  const room = document.getElementById('manualRoom').value;
                  const status = document.getElementById('manualStatus').value;
        
                  if (studentId && studentName && className && gradeLevel && room && status) {
                    markAttendance(studentId, gradeLevel, className, studentName, status, room);
                  } else {
                    alert('Please fill out all fields.');
                  }
                }
        
                // Initialize QR code scanner and other DOM elements
                document.addEventListener('DOMContentLoaded', () => {
                  const html5QrCode = new Html5Qrcode("my-qr-reader");
                  html5QrCode.start({ facingMode: "environment" }, {
                        fps: 10,
                        qrbox: { width: 250, height: 250 }
                      },
                      qrCodeMessage => {
                        const [studentId, gradeLevel, studentName] = qrCodeMessage.split(',');
                        const className = document.getElementById('qrClassName').value;
                        const room = document.getElementById('qrRoom').value;
                        const status = document.getElementById('attendanceStatus').value;
        
                        if (className && room) {
                          markAttendance(studentId, gradeLevel, className, studentName, status, room);
                        } else {
                          alert('Please fill out the Class Name and Room fields.');
                        }
                      })
                    .catch(err => {
                      console.error('Error starting QR code scanner:', err);
                    });
                });
