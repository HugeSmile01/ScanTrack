document.getElementById('qrForm').addEventListener('submit', function(e) {
  e.preventDefault();
  clearErrors();
  
  // Get and convert values to uppercase
  const studentId = document.getElementById('studentId').value.trim().toUpperCase();
  const gradeLevel = document.getElementById('gradeLevel').value.trim().toUpperCase();
  const studentName = document.getElementById('studentName').value.trim().toUpperCase();
  
  // Update fields with uppercase values
  document.getElementById('studentId').value = studentId;
  document.getElementById('gradeLevel').value = gradeLevel;
  document.getElementById('studentName').value = studentName;
  
  let hasError = false;
  
  // Validation checks
  if (studentId === '') {
    showError('studentIdError');
    hasError = true;
    Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Student ID cannot be empty!' });
  }
  
  if (gradeLevel === '') {
    showError('gradeLevelError');
    hasError = true;
    Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Grade Level cannot be empty!' });
  }
  
  if (studentName === '') {
    showError('studentNameError');
    hasError = true;
    Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Student Name cannot be empty!' });
  }
  
  if (hasError) return;
  
  // Show loading spinner
  const loadingSpinner = document.getElementById('loadingSpinner');
  loadingSpinner.style.display = 'inline-block';
  
  // Generate QR code content
  const qrContent = `${studentId}, ${gradeLevel}, ${studentName}`;
  
  try {
    // Generate QR code (base canvas)
    const qr = new QRious({
      value: qrContent,
      size: 250,
    });
    
    // Add white margin around QR code and center it
    const margin = 20; // px margin
    const originalCanvas = qr.canvas;
    const paddedCanvas = document.createElement('canvas');
    const sizeWithMargin = originalCanvas.width + margin * 2;
    paddedCanvas.width = sizeWithMargin;
    paddedCanvas.height = sizeWithMargin;
    const ctx = paddedCanvas.getContext('2d');
    
    // Fill background with white
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, sizeWithMargin, sizeWithMargin);
    
    // Draw QR code centered on padded canvas
    ctx.drawImage(originalCanvas, margin, margin);
    
    // Show success message
    Swal.fire({
      icon: 'success',
      title: 'QR Code Generated',
      text: 'Your QR code has been generated successfully!',
      confirmButtonText: 'OK'
    }).then(() => {
      document.getElementById('successMessage').style.display = 'block';
      document.getElementById('downloadBtn').style.display = 'block';
      document.querySelector('button[type="submit"]').style.display = 'none';
      
      // Clear previous QR code display (if any)
      const qrContainer = document.getElementById('qrContainer');
      if (qrContainer) {
        qrContainer.innerHTML = '';
        qrContainer.appendChild(paddedCanvas);
      } else {
        // If no container exists, create and append it somewhere
        const newContainer = document.createElement('div');
        newContainer.id = 'qrContainer';
        newContainer.style.textAlign = 'center';
        newContainer.style.marginTop = '16px';
        newContainer.appendChild(paddedCanvas);
        document.querySelector('.page-content').appendChild(newContainer);
      }
    });
    
    // Set up download functionality using paddedCanvas
    document.getElementById('downloadBtn').onclick = function() {
      const link = document.createElement('a');
      link.href = paddedCanvas.toDataURL("image/png");
      link.download = `ScanTrackSys_v3.2.2_Qr_${studentName}.png`;
      link.click();
    };
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'QR Code Generation Error',
      text: 'An error occurred while generating the QR code. Please try again.',
    });
    console.error(error);
  } finally {
    loadingSpinner.style.display = 'none';
  }
});

// Helper functions
function showError(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.style.display = 'block';
}

function clearErrors() {
  document.querySelectorAll('.error').forEach(error => {
    error.style.display = 'none';
  });
}