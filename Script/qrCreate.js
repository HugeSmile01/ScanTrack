document.getElementById('qrForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Clear previous error messages
  clearErrors();

  const studentId = document.getElementById('studentId').value.trim();
  const gradeLevel = document.getElementById('gradeLevel').value.trim();
  const studentName = document.getElementById('studentName').value.trim();

  let hasError = false;

  // Validate inputs
  if (studentId === '') {
    showError('studentIdError');
    hasError = true;
  }

  if (gradeLevel === '') {
    showError('gradeLevelError');
    hasError = true;
  }

  if (studentName === '') {
    showError('studentNameError');
    hasError = true;
  }

  if (hasError) return;

  // Show loading spinner
  const loadingSpinner = document.getElementById('loadingSpinner');
  loadingSpinner.style.display = 'inline-block';

  // Clear previous QR code and messages
  const qrCodeContainer = document.getElementById('qrCodeContainer');
  document.getElementById('successMessage').style.display = 'none';
  document.getElementById('downloadBtn').style.display = 'none';

  // Generate QR code content
  const qrContent = `ID: ${studentId}, Grade: ${gradeLevel}, Name: ${studentName}`;

  try {
    // Generate QR code
    const qr = new QRious({
      value: qrContent,
      size: 250,
    });

    // Append the canvas to the QR code container
    qrCodeContainer.appendChild(qr.canvas);
    qrCodeContainer.style.display = 'block';

    // Show success message and download button
    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('downloadBtn').style.display = 'block';

    // Download QR code
    document.getElementById('downloadBtn').onclick = function() {
      const canvas = qr.canvas;
      if (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL("image/png");
        link.download = `QR_${studentId}.png`;
        link.click();
      } else {
        alert("Failed to generate the QR code.");
      }
    };
  } catch (error) {
    alert("An error occurred while generating the QR code. Please try again.");
    console.error(error);
  } finally {
    // Hide loading spinner
    loadingSpinner.style.display = 'none';
  }
});

function showError(elementId) {
  document.getElementById(elementId).style.display = 'block';
}

function clearErrors() {
  const errorMessages = document.querySelectorAll('.error');
  errorMessages.forEach(error => error.style.display = 'none');
}
