const teacherNameDisplay = document.getElementById('teacher-name-display');
const teacherNameInput = document.getElementById('teacher-name-input');
const setTeacherBtn = document.getElementById('set-teacher-btn');
const currentDateElement = document.getElementById('current-date');

function updateTeacherNameDisplay() {
    const name = localStorage.getItem('teacherName') || '';
    if (name) {
        teacherNameDisplay.textContent = name;
        teacherNameDisplay.style.display = 'inline-block';
        teacherNameInput.style.display = 'none';
        setTeacherBtn.style.display = 'none';
    } else {
        teacherNameInput.style.display = 'inline-block';
        setTeacherBtn.style.display = 'inline-block';
        teacherNameDisplay.style.display = 'none';
    }
}

setTeacherBtn.addEventListener('click', () => {
    const name = teacherNameInput.value.trim().toUpperCase();
    if (name) {
        localStorage.setItem('teacherName', name);
        updateTeacherNameDisplay();
        setupRealtimeListener();
    } else {
        Swal.fire('Error', 'Please enter your full name.', 'error');
    }
});

function fetchAttendanceData(teacherName) {
    const sanitizedTeacherName = teacherName.replace(/[.#$[\]]/g, '_');
    const dbPath = `attendance/${sanitizedTeacherName}`;
    console.log(`Fetching data from: ${dbPath}`);
    
    firebase.database().ref(dbPath).on('value', (snapshot) => {
        const data = snapshot.val();
        const attendanceData = [];
        if (data) {
            for (const gradeLevel in data) {
                for (const className in data[gradeLevel]) {
                    for (const recordKey in data[gradeLevel][className]) {
                        const record = data[gradeLevel][className][recordKey];
                        record.grade = gradeLevel;
                        record.subject = className;
                        record.id = recordKey; // Add record ID
                        attendanceData.push(record);
                    }
                }
            }
        }
        populateTable(attendanceData);
    });
}

function populateTable(data) {
  const tbody = document.getElementById("attendance-body");
  tbody.innerHTML = "";

  data.forEach(record => {
    const row = document.createElement("tr");

    const studentIdCell = document.createElement("td");
    studentIdCell.className = "mdl-data-table__cell--non-numeric";
    studentIdCell.textContent = record.studentId || "";

    const nameCell = document.createElement("td");
    nameCell.className = "mdl-data-table__cell--non-numeric";
    nameCell.textContent = record.studentName;

    const classCell = document.createElement("td");
    classCell.className = "mdl-data-table__cell--non-numeric";
    classCell.textContent = record.subject;

    const gradeCell = document.createElement("td");
    gradeCell.className = "mdl-data-table__cell--non-numeric";
    gradeCell.textContent = record.grade;

    const roomCell = document.createElement("td");
    roomCell.className = "mdl-data-table__cell--non-numeric";
    roomCell.textContent = record.room || "";

    const statusCell = document.createElement("td");
    statusCell.className = "mdl-data-table__cell--non-numeric";
    statusCell.innerHTML = `<span class="status ${record.status.toLowerCase()}">${record.status.toUpperCase()}</span>`;

    const dateCell = document.createElement("td");
    dateCell.className = "mdl-data-table__cell--non-numeric";
    dateCell.textContent = record.scannedDate ? record.scannedDate.split('T')[0] : '';

    const actionsCell = document.createElement("td");
    actionsCell.className = "mdl-data-table__cell--non-numeric";
    actionsCell.innerHTML = `
      <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onclick="editRecord('${record.id}')">Edit</button>
      <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" onclick="deleteRecord('${record.id}')">Delete</button>
    `;

    row.appendChild(studentIdCell);
    row.appendChild(nameCell);
    row.appendChild(classCell);
    row.appendChild(gradeCell);
    row.appendChild(roomCell);
    row.appendChild(statusCell);
    row.appendChild(dateCell);
    row.appendChild(actionsCell);

    tbody.appendChild(row);
  });

  filterRecords();
}


function filterRecords() {
    const selectedDate = document.getElementById("dateFilter").value;
    const selectedGrade = document.getElementById("gradeFilter").value;
    const selectedSubject = document.getElementById("classFilter").value;

    const tbody = document.querySelector("tbody");
    const rows = tbody.querySelectorAll("tr");
    rows.forEach(row => {
        const gradeText = row.cells[1].textContent;
        const subjectText = row.cells[2].textContent;
        const dateText = row.cells[3].textContent;

        let match = true;
        if (selectedDate && dateText !== selectedDate) {
            match = false;
        }
        if (selectedGrade && gradeText !== selectedGrade) {
            match = false;
        }
        if (selectedSubject && subjectText !== selectedSubject) {
            match = false;
        }
        row.style.display = match ? "" : "none";
    });
}

function editRecord(recordId) {
    const record = getRecordById(recordId);
    if (!record) {
        console.error(`Record with ID ${recordId} not found.`);
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>Edit Record</h2>
            <form id="editRecordForm">
                <label for="studentName">Student Name:</label>
                <input type="text" id="studentName" name="studentName" value="${record.studentName}" required>
                <label for="grade">Grade:</label>
                <input type="text" id="grade" name="grade" value="${record.grade}" required>
                <label for="subject">Subject:</label>
                <input type="text" id="subject" name="subject" value="${record.subject}" required>
                <label for="date">Date:</label>
                <input type="date" id="date" name="date" value="${record.scannedDate ? record.scannedDate.split('T')[0] : ''}" required>
                <label for="status">Status:</label>
                <select id="status" name="status" required>
                    <option value="Present" ${record.status === 'Present' ? 'selected' : ''}>Present</option>
                    <option value="Absent" ${record.status === 'Absent' ? 'selected' : ''}>Absent</option>
                    <option value="Excused" ${record.status === 'Excused' ? 'selected' : ''}>Excused</option>
                </select>
                <button type="submit">Save</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('editRecordForm').addEventListener('submit', function (e) {
        e.preventDefault();
        saveRecord(recordId);
    });
}

function getRecordById(recordId) {
    const records = document.querySelectorAll('tbody tr');
    for (const record of records) {
        if (record.querySelector('button').getAttribute('onclick').includes(recordId)) {
            return {
                id: recordId,
                studentName: record.cells[0].textContent,
                grade: record.cells[1].textContent,
                subject: record.cells[2].textContent,
                scannedDate: record.cells[3].textContent,
                status: record.cells[4].textContent
            };
        }
    }
    return null;
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

function saveRecord(recordId) {
    const form = document.getElementById('editRecordForm');
    const updatedRecord = {
        studentName: form.studentName.value,
        grade: form.grade.value,
        subject: form.subject.value,
        scannedDate: form.date.value,
        status: form.status.value
    };

    const teacherName = getTeacherName();
    const dbPath = `attendance/${teacherName.replace(/[.#$[\]]/g, '_')}/${updatedRecord.grade}/${updatedRecord.subject}/${recordId}`;
    firebase.database().ref(dbPath).update(updatedRecord)
        .then(() => {
            closeModal();
            fetchAttendanceData(teacherName);
        })
        .catch(error => {
            console.error('Error updating record:', error);
        });
}

function deleteRecord(recordId) {
    const teacherName = getTeacherName();
    const record = getRecordById(recordId);
    if (!record) {
        console.error(`Record with ID ${recordId} not found.`);
        return;
    }

    const dbPath = `attendance/${teacherName.replace(/[.#$[\]]/g, '_')}/${record.grade}/${record.subject}/${recordId}`;
    firebase.database().ref(dbPath).remove()
        .then(() => {
            fetchAttendanceData(teacherName);
        })
        .catch(error => {
            console.error('Error deleting record:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date().toISOString().split('T')[0];
    document.getElementById("dateFilter").value = currentDate;

    document.getElementById("dateFilter").addEventListener('change', filterRecords);
    document.getElementById("gradeFilter").addEventListener('change', filterRecords);
    document.getElementById("classFilter").addEventListener('change', filterRecords);
});


function downloadAttendance() {
    const selected = document.querySelector('input[name="time-filter"]:checked').value;
    const rows = Array.from(document.querySelectorAll("#attendance-body tr"));
    const now = new Date();
    let startDate = new Date();

    switch (selected) {
      case "1day": startDate.setDate(now.getDate() - 1); break;
      case "1week": startDate.setDate(now.getDate() - 7); break;
      case "1month": startDate.setMonth(now.getMonth() - 1); break;
      case "1year": startDate.setFullYear(now.getFullYear() - 1); break;
    }

    const csvHeader = ["Student ID", "Student Name", "Class", "Grade", "Room", "Status", "Timestamp"];
    const csvRows = [csvHeader.join(",")];

    rows.forEach(row => {
      const cols = row.querySelectorAll("td");
      const timestampText = cols[6].textContent;
      const timestamp = new Date(timestampText);
      if (timestamp >= startDate) {
        const rowData = Array.from(cols).slice(0, 7).map(td => `"${td.textContent.trim()}"`);
        csvRows.push(rowData.join(","));
      }
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Attendance_SF2_${selected}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Chart generation (example data for now)
  document.addEventListener('DOMContentLoaded', () => {
    const present = parseInt(document.getElementById("totalPresent").textContent);
    const absent = parseInt(document.getElementById("totalAbsent").textContent);
    const excused = parseInt(document.getElementById("totalExcused").textContent);

    // Bar Chart
    new Chart(document.getElementById('attendanceBarChart'), {
      type: 'bar',
      data: {
        labels: ['Present', 'Absent', 'Excused'],
        datasets: [{
          label: 'Attendance Count',
          data: [present, absent, excused],
          backgroundColor: ['green', 'red', 'blue']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });

    // Line Chart (example with dummy dates)
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const lineData = [20, 18, 22, 19, 21]; // Dummy attendance

    new Chart(document.getElementById('attendanceLineChart'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Attendance This Week',
          data: lineData,
          borderColor: '#10AC84',
          fill: false,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  });