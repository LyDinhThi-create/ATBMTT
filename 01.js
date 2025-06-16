 // Check if SHA-256 is loaded
    if (typeof sha256 === 'undefined') {
      alert('Không thể tải thư viện SHA-256. Vui lòng kiểm tra kết nối mạng.');
    }

    // Mock database with localStorage persistence
    let users = JSON.parse(localStorage.getItem('users')) || [
      { username: 'admin', password: sha256('admin123'), role: 'admin', name: 'Quản trị viên' },
      { username: 'giangvien', password: sha256('thi123'), role: 'instructor', name: 'Giảng viên 1' }
    ];

    let projects = JSON.parse(localStorage.getItem('projects')) || [
      { id: 'proj1', title: 'Phát triển ứng dụng AI dự đoán thời tiết', description: 'Xây dựng mô hình AI dự đoán thời tiết dựa trên dữ liệu lịch sử.', status: 'Chưa đăng ký' },
      { id: 'proj2', title: 'Hệ thống quản lý thư viện thông minh', description: 'Ứng dụng IoT để quản lý sách và mượn trả tự động.', status: 'Chưa đăng ký' },
      { id: 'proj3', title: 'Phân tích dữ liệu y tế bằng machine learning', description: 'Sử dụng ML để phân tích dữ liệu bệnh nhân và dự đoán bệnh.', status: 'Chưa đăng ký' },
      { id: 'proj4', title: 'Ứng dụng blockchain trong quản lý chuỗi cung ứng', description: 'Xây dựng hệ thống minh bạch hóa chuỗi cung ứng.', status: 'Chưa đăng ký' },
      { id: 'proj5', title: 'Robot điều khiển bằng giọng nói', description: 'Phát triển robot nhận diện và thực thi lệnh giọng nói.', status: 'Chưa đăng ký' },
      { id: 'proj6', title: 'Hệ thống phát hiện gian lận giao dịch', description: 'Sử dụng AI để phát hiện các giao dịch bất thường.', status: 'Chưa đăng ký' },
      { id: 'proj7', title: 'Ứng dụng học trực tuyến cá nhân hóa', description: 'Xây dựng nền tảng học tập dựa trên sở thích người dùng.', status: 'Chưa đăng ký' },
      { id: 'proj8', title: 'Phân tích cảm xúc qua văn bản', description: 'Xây dựng mô hình NLP phân tích cảm xúc từ bình luận.', status: 'Chưa đăng ký' },
      { id: 'proj9', title: 'Hệ thống giám sát giao thông thông minh', description: 'Ứng dụng AI để tối ưu hóa luồng giao thông.', status: 'Chưa đăng ký' },
      { id: 'proj10', title: 'Ứng dụng thực tế ảo trong giáo dục', description: 'Phát triển môi trường học tập thực tế ảo.', status: 'Chưa đăng ký' }
    ];
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    let feedback = JSON.parse(localStorage.getItem('feedback')) || [];
    let reports = JSON.parse(localStorage.getItem('reports')) || [];

    // Current user
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

    // Save data to localStorage
    function saveData() {
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('projects', JSON.stringify(projects));
      localStorage.setItem('appointments', JSON.stringify(appointments));
      localStorage.setItem('feedback', JSON.stringify(feedback));
      localStorage.setItem('reports', JSON.stringify(reports));
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    // Show/hide sections
    function showSection(sectionId) {
      document.querySelectorAll('.content-section').forEach(section => section.classList.add('hidden'));
      document.getElementById(sectionId).classList.remove('hidden');
      document.getElementById('loginError').classList.add('hidden');
      document.getElementById('registerError').classList.add('hidden');
      if (currentUser) {
        document.getElementById('currentUser').textContent = `Xin chào, ${currentUser.name} (${currentUser.role === 'admin' ? 'Quản trị viên' : currentUser.role === 'instructor' ? 'Giảng viên' : 'Sinh viên'})`;
      }
    }

    // Show error message
    function showError(elementId, message) {
      const errorElement = document.getElementById(elementId);
      errorElement.textContent = message;
      errorElement.classList.remove('hidden');
    }

    // Login form submission
    document.getElementById('loginForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
      const role = document.getElementById('role').value;
      if (!username || !password) {
        showError('loginError', 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
        return;
      }
      const hashedPassword = sha256(password);
      const user = users.find(u => u.username === username && u.password === hashedPassword && u.role === role);
      if (user) {
        currentUser = user;
        saveData();
        if (role === 'student') {
          showSection('studentSection');
          loadStudentDashboard();
        } else if (role === 'instructor') {
          showSection('instructorSection');
          loadInstructorDashboard();
        } else {
          showSection('adminSection');
          loadAdminDashboard();
        }
      } else {
        showError('loginError', 'Tên đăng nhập, mật khẩu hoặc vai trò không đúng!');
      }
    });

    // Register form submission
    document.getElementById('registerForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('regUsername').value.trim();
      const password = document.getElementById('regPassword').value;
      const name = document.getElementById('regName').value.trim();
      if (!username || !password || !name) {
        showError('registerError', 'Vui lòng nhập đầy đủ thông tin.');
        return;
      }
      if (username.length < 4 || password.length < 6) {
        showError('registerError', 'Tên đăng nhập phải từ 4 ký tự và mật khẩu từ 6 ký tự.');
        return;
      }
      if (users.find(u => u.username === username)) {
        showError('registerError', 'Tên đăng nhập đã tồn tại!');
        return;
      }
      users.push({ username, password: sha256(password), role: 'student', name });
      saveData();
      alert('Đăng ký thành công!');
      showSection('loginSection');
    });

    // Show register section
    document.getElementById('showRegister').addEventListener('click', function() {
      showSection('registerSection');
    });

    // Back to login
    document.getElementById('backToLogin').addEventListener('click', function() {
      showSection('loginSection');
    });

    // Logout
    document.getElementById('logoutLink').addEventListener('click', function() {
      currentUser = null;
      saveData();
      document.getElementById('currentUser').textContent = '';
      showSection('loginSection');
    });

    // Load student dashboard
    function loadStudentDashboard() {
      const projectList = document.getElementById('projectList');
      projectList.innerHTML = '';
      projects.forEach(project => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
          <span class="project-title" style="cursor: pointer;" data-toggle="modal" data-target="#projectDetailsModal" onclick="showProjectDetails('${project.id}')">${project.title}</span>
          ${!project.studentId ? `<button class="btn btn-sm btn-primary" onclick="registerProject('${project.id}')"><i class="fas fa-plus"></i> Đăng ký</button>` : ''}
        `;
        projectList.appendChild(li);
      });

      const projectStatus = document.getElementById('projectStatus');
      const studentProjects = projects.filter(p => p.studentId === currentUser.username);
      projectStatus.innerHTML = studentProjects.map(p => `
        <p><strong>${p.title}</strong>: ${p.status} <button class="btn btn-sm btn-info" data-toggle="modal" data-target="#projectDetailsModal" onclick="showProjectDetails('${p.id}')"><i class="fas fa-info-circle"></i> Chi tiết</button></p>
      `).join('');

      const reportProjectId = document.getElementById('reportProjectId');
      reportProjectId.innerHTML = '<option value="">Chọn đề tài</option>' + studentProjects.map(p => `<option value="${p.id}">${p.title}</option>`).join('');

      const studentAppointments = document.getElementById('studentAppointments');
      studentAppointments.innerHTML = appointments
        .filter(a => a.studentId === currentUser.username)
        .map(a => `<p>${new Date(a.time).toLocaleString()}: Với ${users.find(u => u.username === a.instructorId)?.name || 'Không xác định'}</p>`).join('');

      const instructorFeedback = document.getElementById('instructorFeedback');
      instructorFeedback.innerHTML = feedback
        .filter(f => f.studentId === currentUser.username)
        .map(f => `<p>${f.text} <small>(Từ ${users.find(u => u.username === f.instructorId)?.name || 'Không xác định'} - ${new Date(f.timestamp).toLocaleString()})</small></p>`).join('');

      // Search projects
      document.getElementById('studentProjectSearch').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        projectList.innerHTML = '';
        projects
          .filter(p => p.title.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm))
          .forEach(project => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
              <span class="project-title" style="cursor: pointer;" data-toggle="modal" data-target="#projectDetailsModal" onclick="showProjectDetails('${project.id}')">${project.title}</span>
              ${!project.studentId ? `<button class="btn btn-sm btn-primary" onclick="registerProject('${project.id}')"><i class="fas fa-plus"></i> Đăng ký</button>` : ''}
            `;
            projectList.appendChild(li);
          });
      });
    }

    // Register project
    function registerProject(projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project && !project.studentId) {
        project.studentId = currentUser.username;
        project.status = 'Đang chờ duyệt';
        saveData();
        loadStudentDashboard();
      } else {
        alert('Đề tài đã được đăng ký hoặc không tồn tại!');
      }
    }

    // Show project details
    function showProjectDetails(projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        document.getElementById('projectDetailTitle').textContent = project.title;
        document.getElementById('projectDetailDescription').textContent = project.description;
        document.getElementById('projectDetailStatus').textContent = project.status;
        document.getElementById('projectDetailStudent').textContent = project.studentId ? users.find(u => u.username === project.studentId)?.name || 'Không xác định' : 'Chưa có';
        document.getElementById('projectDetailInstructor').textContent = project.instructorId ? users.find(u => u.username === project.instructorId)?.name || 'Không xác định' : 'Chưa có';
      }
    }

    // Propose project
    document.getElementById('proposeProjectForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const title = document.getElementById('proposeTitle').value.trim();
      const description = document.getElementById('proposeDescription').value.trim();
      if (!title || !description) {
        alert('Vui lòng nhập đầy đủ tên đề tài và mô tả.');
        return;
      }
      const id = 'proj' + Math.random().toString(36).substr(2, 9);
      projects.push({ id, title, description, studentId: currentUser.username, status: 'Đang chờ duyệt' });
      saveData();
      const proposeModal = new bootstrap.Modal(document.getElementById('proposeProjectModal'));
      proposeModal.hide();
      loadStudentDashboard();
    });

    // Submit report
    document.getElementById('submitReportForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const projectId = document.getElementById('reportProjectId').value;
      const file = document.getElementById('reportFile').files[0];
      if (!projectId) {
        alert('Vui lòng chọn đề tài.');
        return;
      }
      if (file) {
        reports.push({ studentId: currentUser.username, projectId, fileName: file.name, timestamp: new Date().toISOString() });
        saveData();
        alert('Nộp báo cáo thành công!');
      } else {
        alert('Vui lòng chọn một file để nộp.');
      }
    });

    // Load instructor dashboard
    function loadInstructorDashboard() {
      const instructorProjectList = document.getElementById('instructorProjectList');
      instructorProjectList.innerHTML = projects
        .filter(p => p.instructorId === currentUser.username)
        .map(p => `
          <p>
            <span style="cursor: pointer;" data-toggle="modal" data-target="#projectDetailsModal" onclick="showProjectDetails('${p.id}')">${p.title}</span>: ${p.status}
            (Sinh viên: ${users.find(u => u.username === p.studentId)?.name || 'Chưa có'})
          </p>
        `).join('');

      const pendingProjects = document.getElementById('pendingProjects');
      pendingProjects.innerHTML = projects
        .filter(p => p.status === 'Đang chờ duyệt' && p.instructorId === currentUser.username)
        .map(p => `
          <p>
            <span style="cursor: pointer;" data-toggle="modal" data-target="#projectDetailsModal" onclick="showProjectDetails('${p.id}')">${p.title}</span>
            <button class="btn btn-sm btn-success" onclick="approveProject('${p.id}')"><i class="fas fa-check"></i> Duyệt</button>
            <button class="btn btn-sm btn-danger" onclick="rejectProject('${p.id}')"><i class="fas fa-times"></i> Từ chối</button>
          </p>
        `).join('');

      const studentReports = document.getElementById('studentReports');
      const instructorProjects = projects.filter(p => p.instructorId === currentUser.username);
      const relevantReports = reports.filter(r => instructorProjects.some(p => p.id === r.projectId));
      studentReports.innerHTML = relevantReports.length > 0 ? relevantReports
        .map(r => {
          const project = projects.find(p => p.id === r.projectId);
          return `
            <p>
              <strong>${project?.title || 'Đề tài không xác định'}</strong><br>
              File: ${r.fileName}<br>
              Sinh viên: ${users.find(u => u.username === r.studentId)?.name || 'Không xác định'}<br>
              Thời gian nộp: ${new Date(r.timestamp).toLocaleString()}
            </p>
          `;
        }).join('') : '<p>Chưa có báo cáo nào.</p>';

      const studentIds = [...new Set(projects.filter(p => p.instructorId === currentUser.username).map(p => p.studentId).filter(id => id))];
      const studentSelect = document.getElementById('studentId');
      const feedbackStudentSelect = document.getElementById('feedbackStudentId');
      studentSelect.innerHTML = feedbackStudentSelect.innerHTML = studentIds
        .map(id => `<option value="${id}">${users.find(u => u.username === id)?.name || id}</option>`).join('');

      // Search projects
      document.getElementById('instructorProjectSearch').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        instructorProjectList.innerHTML = projects
          .filter(p => p.instructorId === currentUser.username && (p.title.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm)))
          .map(p => `
            <p>
              <span style="cursor: pointer;" data-toggle="modal" data-target="#projectDetailsModal" onclick="showProjectDetails('${p.id}')">${p.title}</span>: ${p.status}
              (Sinh viên: ${users.find(u => u.username === p.studentId)?.name || 'Chưa có'})
            </p>
          `).join('');
      });
    }

    // Approve project
    function approveProject(projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        project.status = 'Đã duyệt';
        saveData();
        loadInstructorDashboard();
        loadAdminDashboard();
      }
    }

    // Reject project
    function rejectProject(projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        project.status = 'Bị từ chối';
        saveData();
        loadInstructorDashboard();
        loadAdminDashboard();
      }
    }

    // Schedule appointment
    document.getElementById('scheduleAppointmentForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const studentId = document.getElementById('studentId').value;
      const time = document.getElementById('appointmentTime').value;
      if (!studentId || !time) {
        alert('Vui lòng chọn sinh viên và thời gian.');
        return;
      }
      appointments.push({ studentId, instructorId: currentUser.username, time, timestamp: new Date().toISOString() });
      saveData();
      alert('Đặt lịch thành công!');
      loadInstructorDashboard();
    });

    // Submit feedback
    document.getElementById('submitFeedbackForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const studentId = document.getElementById('feedbackStudentId').value;
      const text = document.getElementById('feedbackText').value.trim();
      if (!studentId || !text) {
        alert('Vui lòng chọn sinh viên và nhập nhận xét.');
        return;
      }
      feedback.push({ studentId, instructorId: currentUser.username, text, timestamp: new Date().toISOString() });
      saveData();
      alert('Gửi nhận xét thành công!');
      loadInstructorDashboard();
    });

    // Load admin dashboard
    function loadAdminDashboard() {
      const assignProjectId = document.getElementById('assignProjectId');
      assignProjectId.innerHTML = '<option value="">Chọn đề tài</option>' + projects.map(p => `<option value="${p.id}">${p.title}</option>`).join('');

      const assignInstructorId = document.getElementById('assignInstructorId');
      assignInstructorId.innerHTML = '<option value="">Chọn giảng viên</option>' + users
        .filter(u => u.role === 'instructor')
        .map(u => `<option value="${u.username}">${u.name}</option>`).join('');

      const userList = document.getElementById('userList');
      userList.innerHTML = users
        .filter(u => u.role !== 'admin')
        .map(u => `
          <tr>
            <td>${u.username}</td>
            <td>${u.name}</td>
            <td>${u.role === 'student' ? 'Sinh viên' : 'Giảng viên'}</td>
          </tr>
        `).join('');

      document.getElementById('totalProjects').textContent = projects.length;
      document.getElementById('totalStudents').textContent = users.filter(u => u.role === 'student').length;
      document.getElementById('totalInstructors').textContent = users.filter(u => u.role === 'instructor').length;
      document.getElementById('approvedProjects').textContent = projects.filter(p => p.status === 'Đã duyệt').length;
      document.getElementById('pendingProjectsCount').textContent = projects.filter(p => p.status === 'Đang chờ duyệt').length;

      // Draw chart
      const ctx = document.getElementById('statusChart').getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Chưa đăng ký', 'Đang chờ duyệt', 'Đã duyệt', 'Bị từ chối'],
          datasets: [{
            data: [
              projects.filter(p => p.status === 'Chưa đăng ký').length,
              projects.filter(p => p.status === 'Đang chờ duyệt').length,
              projects.filter(p => p.status === 'Đã duyệt').length,
              projects.filter(p => p.status === 'Bị từ chối').length
            ],
            backgroundColor: ['#007bff', '#ffc107', '#28a745', '#dc3545']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' }
          }
        }
      });
    }

    // Create account
    document.getElementById('manageAccountForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('accountUsername').value.trim();
      const password = document.getElementById('accountPassword').value;
      const role = document.getElementById('accountRole').value;
      if (!username || !password) {
        alert('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
        return;
      }
      if (username.length < 4 || password.length < 6) {
        alert('Tên đăng nhập phải từ 4 ký tự và mật khẩu từ 6 ký tự.');
        return;
      }
      if (users.find(u => u.username === username)) {
        alert('Tên đăng nhập đã tồn tại!');
        return;
      }
      users.push({ username, password: sha256(password), role, name: username });
      saveData();
      alert('Tạo tài khoản thành công!');
      loadAdminDashboard();
    });

    // Create project
    document.getElementById('createProjectForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const title = document.getElementById('projectTitle').value.trim();
      const description = document.getElementById('projectDescription').value.trim();
      if (!title || !description) {
        alert('Vui lòng nhập đầy đủ tên đề tài và mô tả.');
        return;
      }
      const id = 'proj' + Math.random().toString(36).substr(2, 9);
      projects.push({ id, title, description, status: 'Chưa đăng ký' });
      saveData();
      alert('Tạo đề tài thành công!');
      loadAdminDashboard();
    });

    // Assign instructor
    document.getElementById('assignInstructorForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const projectId = document.getElementById('assignProjectId').value;
      const instructorId = document.getElementById('assignInstructorId').value;
      if (!projectId || !instructorId) {
        alert('Vui lòng chọn đề tài và giảng viên.');
        return;
      }
      const project = projects.find(p => p.id === projectId);
      if (project) {
        project.instructorId = instructorId;
        saveData();
        alert('Phân công thành công!');
        loadAdminDashboard();
      }
    });

    // Initial load
    if (currentUser) {
      if (currentUser.role === 'student') {
        showSection('studentSection');
        loadStudentDashboard();
      } else if (currentUser.role === 'instructor') {
        showSection('instructorSection');
        loadInstructorDashboard();
      } else {
        showSection('adminSection');
        loadAdminDashboard();
      }
    } else {
      showSection('loginSection');
    }