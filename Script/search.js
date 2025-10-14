document.getElementById('studentIdInput').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    fetchAttendance();
  }
});

document.getElementById('searchButton').addEventListener('click', fetchAttendance);


function fetchAttendance() {
  const studentId = document.getElementById('studentIdInput').value.trim();
  const recordList = document.getElementById('recordList');
  recordList.innerHTML = ''; // Clear previous entries
  
  if (!studentId) {
    recordList.innerHTML = '<div style="color: #ccc;">Please enter a student ID.</div>';
    return;
  }
  
  const dbRef = firebase.database().ref('attendance');
  
  dbRef.orderByChild('studentId').equalTo(studentId).once('value')
    .then(snapshot => {
      const attendanceData = snapshot.val();
      if (attendanceData) {
        const sortedData = Object.entries(attendanceData)
          .sort(([, a], [, b]) => new Date(b.scannedDate) - new Date(a.scannedDate));
        
        const formattedCards = formatAttendanceData(sortedData);
        recordList.innerHTML = formattedCards;
      } else {
        recordList.innerHTML = '<div style="color: #ccc;">No attendance data found.</div>';
      }
    })
    .catch(error => {
      console.error('Error fetching attendance:', error);
      recordList.innerHTML = '<div style="color: #f44336;">Error loading data. Please try again later.</div>';
    });
}

function formatAttendanceData(data) {
  let html = '';
  for (const [key, entry] of data) {
    const scannedDate = new Date(entry.scannedDate);
    const formattedDate = scannedDate.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    
    html += `
        <div style="background: #383838; padding: 16px; border-radius: 8px;">
          <strong>Student ID:</strong> ${entry.studentId}<br>
          <strong>Name:</strong> ${entry.studentName}<br>
          <strong>Class:</strong> ${entry.className}<br>
          <strong>Grade Level:</strong> ${entry.gradeLevel}<br>
          <strong>Room:</strong> ${entry.room}<br>
          <strong>Scanned Date:</strong> ${formattedDate}<br>
          <strong>Status:</strong> ${entry.status}
        </div>
      `;
  }
  return html.trim();
}

function showAttendanceSummaryNotice() {
  Swal.fire({
    icon: 'info',
    title: 'Coming Soon',
    text: 'The Attendance Summary feature is currently in development.',
    confirmButtonText: 'OK'
  });
}