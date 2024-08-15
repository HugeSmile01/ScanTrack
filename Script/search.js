 // Initialize Firebase (use your own configuration)
 const firebaseConfig = {
   apiKey: "AIzaSyBzpUkxIpekZHhVUCXabTCZyCmUs9bhMD8",
   authDomain: "qrattendance-hnhs.firebaseapp.com",
   projectId: "qrattendance-hnhs",
   storageBucket: "qrattendance-hnhs.appspot.com",
   messagingSenderId: "309027536444",
   appId: "1:309027536444:web:d8c5ec8451c1b8e6ea4d39",
   measurementId: "G-MTJV7RM6PX"
 };
 firebase.initializeApp(firebaseConfig);

 document.getElementById('studentIdInput').addEventListener('keypress', function(event) {
   if (event.key === 'Enter') {
     fetchAttendance();
   }
 });

 function fetchAttendance() {
   const studentId = document.getElementById('studentIdInput').value;
   const dbRef = firebase.database().ref('attendance');

   dbRef.orderByChild('studentId').equalTo(studentId).once('value')
     .then(snapshot => {
       const attendanceData = snapshot.val();
       if (attendanceData) {
         // Convert the object to an array and sort it by 'scannedDate' in descending order
         const sortedData = Object.entries(attendanceData)
           .sort(([, a], [, b]) => new Date(b.scannedDate) - new Date(a.scannedDate));

         const formattedData = formatAttendanceData(sortedData);
         document.getElementById('attendanceInfo').innerHTML = formattedData;
       } else {
         document.getElementById('attendanceInfo').textContent = 'No attendance data found.';
       }
     })
     .catch(error => {
       console.error('Error fetching attendance:', error);
     });
 }

 function formatAttendanceData(data) {
   let formattedText = '';
   for (const [key, entry] of data) {
     const scannedDate = new Date(entry.scannedDate);
     const formattedDate = scannedDate.toLocaleDateString('en-US', {
       month: 'long',
       day: 'numeric',
       year: 'numeric',
       hour: 'numeric',
       minute: 'numeric',
       hour12: true,
     });
     formattedText += `<br><strong>Student ID:</strong> ${entry.studentId}<br>`;
     formattedText += `<strong>Student Name:</strong> ${entry.studentName}<br>`;
     formattedText += `<strong>Class:</strong> ${entry.className}<br>`;
     formattedText += `<strong>Grade Level:</strong> ${entry.gradeLevel}<br>`;
     formattedText += `<strong>Room:</strong> ${entry.room}<br>`;
     formattedText += `<strong>Scanned Date:</strong> ${formattedDate}<br>`;
     formattedText += `<strong>Status:</strong> ${entry.status}<br><br>`;
     formattedText += `<hr>`;
   }
   return formattedText.trim();
 }