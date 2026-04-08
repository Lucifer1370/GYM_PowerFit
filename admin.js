document.addEventListener('DOMContentLoaded', () => {
    // Basic Admin Authentication Logic
    const adminConfig = { username: 'admin', password: 'password' };
    
    // Ensure default admin credentials exist
    if (!localStorage.getItem('powerfit_admin')) {
        localStorage.setItem('powerfit_admin', JSON.stringify(adminConfig));
    }

    // Remove any lingering persistent authentication to force login upon visit
    localStorage.removeItem('powerfit_admin_auth');
    let isAdminAuthenticated = false;

    if (!isAdminAuthenticated) {
        showLoginModal();
    } else {
        document.querySelector('.admin-content').style.display = 'grid';
        document.querySelector('.dashboard-stats').style.display = 'grid';
        initAdminDashboard();
    }

    function showLoginModal() {
        // Hide dashboard content to prevent flickering
        document.querySelector('.admin-content').style.display = 'none';
        document.querySelector('.dashboard-stats').style.display = 'none';

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content fade-in-up';
        modalContent.innerHTML = `
            <h2>ADMIN <span>LOGIN</span></h2>
            <form id="admin-login-form">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" id="admin-username" required placeholder="Enter username">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="admin-password" required placeholder="Enter password (default: password)">
                </div>
                <div id="login-error" style="color: var(--primary-color); display: none; margin-bottom: 1rem; font-size: 0.9rem;"></div>
                <button type="submit" class="btn-primary" style="width: 100%;">ACCESS PORTAL</button>
            </form>
        `;
        
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);

        document.getElementById('admin-login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('admin-username').value;
            const p = document.getElementById('admin-password').value;
            const adminData = JSON.parse(localStorage.getItem('powerfit_admin'));
            
            if (u === adminData.username && p === adminData.password) {
                // Success
                localStorage.setItem('powerfit_admin_auth', 'true');
                document.body.removeChild(modalOverlay);
                
                // Show dashboard content
                document.querySelector('.admin-content').style.display = 'grid';
                document.querySelector('.dashboard-stats').style.display = 'grid';
                initAdminDashboard();
            } else {
                const err = document.getElementById('login-error');
                err.style.display = 'block';
                err.textContent = 'Invalid credentials. Access Denied.';
            }
        });
    }

    function initAdminDashboard() {
        // Add Logout button dynamically to sidebar
        const sidebarMenu = document.querySelector('.sidebar-menu');
        const logoutLi = document.createElement('li');
        logoutLi.innerHTML = `<a href="#" id="admin-logout"><i class="fas fa-sign-out-alt" style="width:25px; color: var(--primary-color);"></i> Logout</a>`;
        sidebarMenu.appendChild(logoutLi);

        document.getElementById('admin-logout').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('powerfit_admin_auth');
            location.reload();
        });

        // Load Users Data
        renderDashboardData();
    }

    function renderDashboardData() {
        const users = JSON.parse(localStorage.getItem('powerfit_users')) || [];
        
        // 1. Update Stats
        const statElements = document.querySelectorAll('.stat-card p');
        // Total members
        statElements[0].textContent = users.length;
        // Active Plans
        statElements[1].textContent = users.length; // Assuming all listed users are active
        
        // Calculate Monthly Revenue
        let totalRevenue = 0;
        users.forEach(u => {
            let price = u.membershipPrice ? u.membershipPrice.replace('₹', '').replace('/mo', '').trim() : '0';
            totalRevenue += parseInt(price) || 0;
        });
        statElements[2].textContent = `₹${totalRevenue.toLocaleString()}`;

        // 2. Render Table
        const tbody = document.querySelector('.recent-members tbody');
        tbody.innerHTML = '';

        if (users.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">No members registered yet.</td></tr>`;
            return;
        }

        // Sort users roughly descending
        const reversedUsers = [...users].reverse();

        reversedUsers.forEach((user, idx) => {
            const tr = document.createElement('tr');
            
            const joinDate = new Date();
            // Just faking a join date based on index for visual effect
            joinDate.setDate(joinDate.getDate() - idx); 
            
            tr.innerHTML = `
                <td style="font-weight: 600;">${user.fullname}</td>
                <td>${user.membership || 'Unknown'}</td>
                <td>${joinDate.toLocaleDateString()}</td>
                <td><span class="status active">Active</span></td>
                <td><button class="action-btn delete-btn" data-email="${user.email}">Delete</button></td>
            `;
            tbody.appendChild(tr);
        });

        // Attach event listeners for delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const emailToDelete = this.getAttribute('data-email');
                if (confirm(`Are you sure you want to delete the user with email: ${emailToDelete}?`)) {
                    deleteUser(emailToDelete);
                }
            });
        });
    }

    function deleteUser(email) {
        let users = JSON.parse(localStorage.getItem('powerfit_users')) || [];
        users = users.filter(user => user.email !== email);
        localStorage.setItem('powerfit_users', JSON.stringify(users));
        renderDashboardData(); // Re-render the dashboard efficiently
    }
});
