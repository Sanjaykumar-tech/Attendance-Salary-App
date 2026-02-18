// ==================== GLOBAL VARIABLES ====================
let currentUser = null;

// Local Storage Keys
const STORAGE_KEYS = {
    USERS: 'attendance_users',
    EMPLOYEES: 'attendance_employees',
    ATTENDANCE: 'attendance_records',
    CURRENT_USER: 'current_user'
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    setupEventListeners();
    showSplashAndNavigate();
});

function initializeData() {
    // Initialize users
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        const defaultUsers = [
            {
                id: '1',
                name: 'Admin User',
                email: 'admin@demo.com',
                password: 'admin123',
                phone: '9876543210',
                role: 'admin'
            },
            {
                id: '2',
                name: 'Employee User',
                email: 'emp@demo.com',
                password: 'emp123',
                phone: '9876543211',
                role: 'employee'
            }
        ];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    }

    // Initialize employees
    if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
        const defaultEmployees = [
            {
                id: 'emp1',
                name: 'Kumar',
                email: 'kumar@company.com',
                phone: '9876543212',
                department: 'IT',
                position: 'Developer',
                salary: 25000,
                joinDate: '2024-01-01'
            },
            {
                id: 'emp2',
                name: 'Rajesh',
                email: 'rajesh@company.com',
                phone: '9876543213',
                department: 'Sales',
                position: 'Executive',
                salary: 20000,
                joinDate: '2024-01-15'
            }
        ];
        localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(defaultEmployees));
    }

    // Initialize attendance
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
        const today = new Date().toISOString().split('T')[0];
        const defaultAttendance = [
            {
                id: 'att1',
                employeeId: 'emp1',
                date: today,
                status: 'present',
                checkIn: '09:00 AM'
            }
        ];
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(defaultAttendance));
    }
}

function setupEventListeners() {
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('show');
        }
    };
}

function showSplashAndNavigate() {
    setTimeout(() => {
        document.getElementById('splashScreen').classList.add('hide');
        
        const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            navigateToDashboard();
        } else {
            showScreen('loginScreen');
        }
    }, 2000);
}

// ==================== SCREEN NAVIGATION ====================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    const screen = document.getElementById(screenId);
    if (screen) screen.classList.add('active');
    
    if (screenId === 'adminDashboard') {
        loadAdminData();
    } else if (screenId === 'employeeDashboard') {
        loadEmployeeData();
    }
}

function navigateToDashboard() {
    if (currentUser.role === 'admin') {
        showScreen('adminDashboard');
        loadAdminData();
    } else {
        showScreen('employeeDashboard');
        loadEmployeeData();
    }
}

// ==================== AUTHENTICATION ====================
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showToast('Email and password required', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        showToast('Login successful!', 'success');
        navigateToDashboard();
    } else {
        showToast('Invalid email or password', 'error');
    }
}

function register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;
    
    if (!name || !email || !phone || !password || !role) {
        showToast('All fields are required', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    
    if (users.some(u => u.email === email)) {
        showToast('Email already exists', 'error');
        return;
    }
    
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        phone: phone,
        password: password,
        role: role
    };
    
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    showToast('Registration successful! Please login.', 'success');
    showScreen('loginScreen');
}

function demoLogin(role) {
    if (role === 'admin') {
        document.getElementById('loginEmail').value = 'admin@demo.com';
        document.getElementById('loginPassword').value = 'admin123';
    } else {
        document.getElementById('loginEmail').value = 'emp@demo.com';
        document.getElementById('loginPassword').value = 'emp123';
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    showScreen('loginScreen');
    showToast('Logged out successfully', 'success');
}

// ==================== PASSWORD TOGGLE ====================
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = event.target;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ==================== SIDEBAR TOGGLES ====================
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
}

function toggleEmployeeSidebar() {
    document.getElementById('empSidebar').classList.toggle('show');
}

function toggleProfileMenu() {
    document.getElementById('profileMenu').classList.toggle('show');
}

function toggleEmpProfileMenu() {
    document.getElementById('empProfileMenu').classList.toggle('show');
}

document.addEventListener('click', function(event) {
    if (!event.target.closest('.profile-dropdown')) {
        document.querySelectorAll('.profile-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});

// ==================== ADMIN FUNCTIONS ====================
function showAdminTab(tabName) {
    document.querySelectorAll('#adminDashboard .sidebar-menu li').forEach(li => {
        li.classList.remove('active');
    });
    if (event && event.target) {
        const li = event.target.closest('li');
        if (li) li.classList.add('active');
    }
    
    document.querySelectorAll('#adminDashboard .tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const tabId = 'admin' + tabName.charAt(0).toUpperCase() + tabName.slice(1);
    const tab = document.getElementById(tabId);
    if (tab) tab.classList.add('active');
    
    if (window.innerWidth <= 768) toggleSidebar();
    
    if (tabName === 'employees') {
        loadEmployees();
    } else if (tabName === 'attendance') {
        loadAttendanceByDate();
    } else if (tabName === 'salary') {
        loadSalaries();
    }
}

function showEmployeeTab(tabName) {
    document.querySelectorAll('#empSidebar .sidebar-menu li').forEach(li => {
        li.classList.remove('active');
    });
    if (event && event.target) {
        const li = event.target.closest('li');
        if (li) li.classList.add('active');
    }
    
    document.querySelectorAll('#employeeDashboard .tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const tabId = 'emp' + tabName.charAt(0).toUpperCase() + tabName.slice(1);
    const tab = document.getElementById(tabId);
    if (tab) tab.classList.add('active');
    
    if (window.innerWidth <= 768) toggleEmployeeSidebar();
    
    if (tabName === 'attendance') {
        loadFullAttendanceHistory();
    } else if (tabName === 'salary') {
        loadEmployeeSalary();
    }
}

function loadAdminData() {
    loadStats();
    loadTodayAttendance();
}

function loadStats() {
    const employees = JSON.parse(localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) || [];
    const attendance = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) || [];
    const today = new Date().toISOString().split('T')[0];
    
    const todayAttendance = attendance.filter(a => a.date === today);
    const present = todayAttendance.filter(a => a.status === 'present').length;
    const leave = todayAttendance.filter(a => a.status === 'leave').length;
    const absent = employees.length - todayAttendance.length;
    
    document.getElementById('totalEmployees').textContent = employees.length;
    document.getElementById('presentToday').textContent = present;
    document.getElementById('onLeave').textContent = leave;
    document.getElementById('absentToday').textContent = absent;
}

function loadTodayAttendance() {
    const attendance = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) || [];
    const employees = JSON.parse(localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) || [];
    const today = new Date().toISOString().split('T')[0];
    
    const todayRecords = attendance.filter(a => a.date === today);
    const tbody = document.getElementById('todayAttendanceBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    todayRecords.forEach(record => {
        const employee = employees.find(e => e.id === record.employeeId);
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${employee ? employee.name : 'Unknown'}</td>
            <td><span class="status-badge status-${record.status}">${record.status}</span></td>
            <td>${record.checkIn || '-'}</td>
        `;
    });
}

// ==================== EMPLOYEE MANAGEMENT ====================
function showAddEmployeeModal() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('empJoinDate').value = today;
    document.getElementById('addEmployeeModal').classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function saveEmployee() {
    const name = document.getElementById('empName').value;
    const email = document.getElementById('empEmail').value;
    const phone = document.getElementById('empPhone').value;
    const department = document.getElementById('empDepartment').value;
    const position = document.getElementById('empPosition').value;
    const salary = document.getElementById('empSalary').value;
    const joinDate = document.getElementById('empJoinDate').value;
    
    if (!name || !email || !phone || !department || !position || !salary || !joinDate) {
        showToast('All fields are required', 'error');
        return;
    }
    
    const employees = JSON.parse(localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) || [];
    
    const newEmployee = {
        id: Date.now().toString(),
        name: name,
        email: email,
        phone: phone,
        department: department,
        position: position,
        salary: parseFloat(salary),
        joinDate: joinDate
    };
    
    employees.push(newEmployee);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    
    closeModal('addEmployeeModal');
    loadEmployees();
    showToast('Employee added successfully', 'success');
    document.getElementById('addEmployeeForm').reset();
}

function loadEmployees() {
    const employees = JSON.parse(localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) || [];
    const tbody = document.getElementById('employeesBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    employees.forEach(emp => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${emp.name}</td>
            <td>${emp.email}</td>
            <td>${emp.phone}</td>
            <td>${emp.department}</td>
            <td>₹${emp.salary}</td>
            <td>
                <button class="btn-edit" onclick="editEmployee('${emp.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-delete" onclick="deleteEmployee('${emp.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
    });
}

function searchEmployees() {
    const searchTerm = document.getElementById('searchEmployee').value.toLowerCase();
    const employees = JSON.parse(localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) || [];
    const tbody = document.getElementById('employeesBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const filtered = employees.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm) ||
        emp.department.toLowerCase().includes(searchTerm)
    );
    
    filtered.forEach(emp => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${emp.name}</td>
            <td>${emp.email}</td>
            <td>${emp.phone}</td>
            <td>${emp.department}</td>
            <td>₹${emp.salary}</td>
            <td>
                <button class="btn-edit" onclick="editEmployee('${emp.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-delete" onclick="deleteEmployee('${emp.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
    });
}

function editEmployee(id) {
    showToast('Edit feature coming soon', 'warning');
}

function deleteEmployee(id) {
    if (confirm('Delete this employee?')) {
        let employees = JSON.parse(localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) || [];
        employees = employees.filter(e => e.id !== id);
        localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
        loadEmployees();
        showToast('Employee deleted', 'success');
    }
}

// ==================== ATTENDANCE MANAGEMENT ====================
function loadAttendanceByDate() {
    const dateInput = document.getElementById('attendanceDate');
    const date = dateInput ? dateInput.value : new Date().toISOString().split('T')[0];
    
    const attendance = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) || [];
    const employees = JSON.parse(localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) || [];
    const dayRecords = attendance.filter(a => a.date === date);
    
    const tbody = document.getElementById('attendanceBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    employees.forEach(emp => {
        const record = dayRecords.find(r => r.employeeId === emp.id);
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${emp.name}</td>
            <td><span class="status-badge status-${record ? record.status : 'absent'}">${record ? record.status : 'absent'}</span></td>
            <td>${record ? record.checkIn || '-' : '-'}</td>
            <td>${record ? record.checkOut || '-' : '-'}</td>
            <td>
                <button class="btn-edit" onclick="markAttendanceForEmployee('${emp.id}')">Mark</button>
            </td>
        `;
    });
}

function markAttendanceForEmployee(employeeId) {
    document.getElementById('attendanceModal').classList.add('show');
    window.currentEmployeeId = employeeId;
}

function markAttendance() {
    document.getElementById('attendanceModal').classList.add('show');
}

function submitAttendance(status) {
    const employeeId = currentUser.role === 'employee' ? currentUser.id : window.currentEmployeeId;
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    let attendance = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) || [];
    
    const existingIndex = attendance.findIndex(a => a.employeeId === employeeId && a.date === today);
    
    const attendanceRecord = {
        id: existingIndex !== -1 ? attendance[existingIndex].id : Date.now().toString(),
        employeeId: employeeId,
        date: today,
        status: status,
        checkIn: status === 'present' ? currentTime : null
    };
    
    if (existingIndex !== -1) {
        attendance[existingIndex] = attendanceRecord;
    } else {
        attendance.push(attendanceRecord);
    }
    
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
    
    closeModal('attendanceModal');
    showToast('Attendance marked successfully', 'success');
    
    if (currentUser.role === 'admin') {
        loadAttendanceByDate();
    } else {
        loadEmployeeData();
    }
}

// ==================== SALARY MANAGEMENT ====================
function calculateAllSalaries() {
    const month = document.getElementById('salaryMonth').value;
    const year = document.getElementById('salaryYear').value;
    
    const employees = JSON.parse(localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) || [];
    const attendance = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) || [];
    
    const daysInMonth = new Date(year, month, 0).getDate();
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const endDate = `${year}-${month.padStart(2, '0')}-${daysInMonth}`;
    
    let salaries = [];
    
    employees.forEach(emp => {
        const monthAttendance = attendance.filter(a => 
            a.employeeId === emp.id && 
            a.date >= startDate && 
            a.date <= endDate
        );
        
        const present = monthAttendance.filter(a => a.status === 'present').length;
        const leave = monthAttendance.filter(a => a.status === 'leave').length;
        const absent = daysInMonth - present - leave;
        
        const perDaySalary = emp.salary / daysInMonth;
        const netSalary = present * perDaySalary;
        
        salaries.push({
            employeeName: emp.name,
            basicSalary: emp.salary,
            present: present,
            leave: leave,
            absent: absent,
            netSalary: netSalary,
            status: 'pending'
        });
    });
    
    displaySalaries(salaries);
}

function displaySalaries(salaries) {
    const tbody = document.getElementById('salaryBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    salaries.forEach(sal => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${sal.employeeName}</td>
            <td>₹${sal.basicSalary}</td>
            <td>${sal.present}</td>
            <td>${sal.leave}</td>
            <td>${sal.absent}</td>
            <td>₹${sal.netSalary.toFixed(2)}</td>
            <td><span class="status-badge">${sal.status}</span></td>
        `;
    });
}

function loadSalaries() {
    const today = new Date();
    document.getElementById('salaryMonth').value = today.getMonth() + 1;
    document.getElementById('salaryYear').value = today.getFullYear();
    calculateAllSalaries();
}

// ==================== EMPLOYEE FUNCTIONS ====================
function loadEmployeeData() {
    if (!currentUser) return;
    
    document.getElementById('welcomeMessage').textContent = `Welcome, ${currentUser.name}!`;
    
    const today = new Date();
    document.getElementById('currentDate').textContent = today.toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
    
    loadEmployeeStats();
    loadEmployeeAttendance();
    checkTodayStatus();
}

function loadEmployeeStats() {
    const attendance = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) || [];
    const employees = JSON.parse(localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) || [];
    const employee = employees.find(e => e.id === currentUser.id);
    
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    
    const monthAttendance = attendance.filter(a => 
        a.employeeId === currentUser.id &&
        new Date(a.date).getMonth() + 1 === currentMonth &&
        new Date(a.date).getFullYear() === currentYear
    );
    
    const present = monthAttendance.filter(a => a.status === 'present').length;
    const absent = monthAttendance.filter(a => a.status === 'absent').length;
    const leave = monthAttendance.filter(a => a.status === 'leave').length;
    
    document.getElementById('totalPresent').textContent = present;
    document.getElementById('totalAbsent').textContent = absent;
    document.getElementById('totalLeave').textContent = leave;
    
    if (employee) {
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
        const perDaySalary = employee.salary / daysInMonth;
        const monthSalary = present * perDaySalary;
        document.getElementById('thisMonthSalary').textContent = `₹${monthSalary.toFixed(2)}`;
    }
}

function loadEmployeeAttendance() {
    const attendance = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) || [];
    const employeeRecords = attendance
        .filter(a => a.employeeId === currentUser.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    const tbody = document.getElementById('employeeAttendanceHistory');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    employeeRecords.forEach(record => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${record.date}</td>
            <td><span class="status-badge status-${record.status}">${record.status}</span></td>
            <td>${record.checkIn || '-'}</td>
            <td>${record.checkOut || '-'}</td>
        `;
    });
}

function loadFullAttendanceHistory() {
    const attendance = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) || [];
    const employeeRecords = attendance
        .filter(a => a.employeeId === currentUser.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const tbody = document.getElementById('fullAttendanceHistory');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    employeeRecords.forEach(record => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${record.date}</td>
            <td><span class="status-badge status-${record.status}">${record.status}</span></td>
            <td>${record.checkIn || '-'}</td>
            <td>${record.checkOut || '-'}</td>
        `;
    });
}

function loadEmployeeSalary() {
    const employees = JSON.parse(localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) || [];
    const employee = employees.find(e => e.id === currentUser.id);
    
    if (!employee) return;
    
    const attendance = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) || [];
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    const monthAttendance = attendance.filter(a => 
        a.employeeId === currentUser.id &&
        new Date(a.date).getMonth() + 1 === currentMonth &&
        new Date(a.date).getFullYear() === currentYear
    );
    
    const present = monthAttendance.filter(a => a.status === 'present').length;
    const leave = monthAttendance.filter(a => a.status === 'leave').length;
    const absent = daysInMonth - present - leave;
    const perDaySalary = employee.salary / daysInMonth;
    const netSalary = present * perDaySalary;
    
    document.getElementById('empBasicSalary').textContent = `₹${employee.salary}`;
    document.getElementById('empPresentDays').textContent = present;
    document.getElementById('empLeaveDays').textContent = leave;
    document.getElementById('empAbsentDays').textContent = absent;
    document.getElementById('empNetSalary').textContent = `₹${netSalary.toFixed(2)}`;
}

function checkTodayStatus() {
    const attendance = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) || [];
    const today = new Date().toISOString().split('T')[0];
    
    const todayRecord = attendance.find(a => 
        a.employeeId === currentUser.id && a.date === today
    );
    
    const statusDiv = document.getElementById('todayStatus');
    if (!statusDiv) return;
    
    if (todayRecord) {
        statusDiv.innerHTML = `
            <i class="fas fa-check-circle" style="color: #2ecc71; font-size: 50px;"></i>
            <p>${todayRecord.status}</p>
            <small>${todayRecord.checkIn || ''}</small>
        `;
    } else {
        statusDiv.innerHTML = `
            <i class="fas fa-clock" style="color: #95a5a6; font-size: 50px;"></i>
            <p>Not marked yet</p>
        `;
    }
}

// ==================== UTILITY FUNCTIONS ====================
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}