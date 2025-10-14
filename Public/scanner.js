function manualMarkAttendance() {
      const studentId = document.getElementById('manualStudentId').value;
      const studentName = document.getElementById('manualStudentName').value;
      const className = document.getElementById('manualClassName').value;
      const room = document.getElementById('manualRoom').value;
      const status = document.getElementById('manualStatus').value;
      const teacher = document.getElementById('teacher-name').value;
      if (!studentId || !studentName || !className || !teacher) {
        return Swal.fire("Missing Info", "Please fill out all fields", "warning");
      }
      const date = new Date().toISOString().split('T')[0];
      const ref = firebase.database().ref(`attendance/${date}/${className}/${studentId}`);
      ref.set({
        studentId, studentName, className, room, status, teacher, timestamp: new Date().toLocaleTimeString()
      }).then(() => {
        Swal.fire("Success", "Attendance recorded", "success");
      });
    }

    new Html5Qrcode("my-qr-reader").start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      qrCodeMessage => {
        document.getElementById("manualStudentId").value = qrCodeMessage;
      },
      errorMessage => {
        console.warn(errorMessage);
      }
    );