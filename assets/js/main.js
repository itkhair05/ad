function initCharts() {
    // Dashboard revenue Chart
    if (window.revenueChart) window.revenueChart.destroy();
    const revenueCtx = document.getElementById('revenueCanvas').getContext('2d');
    window.revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['T2','T3','T4','T5','T6','T7','CN'],
            datasets: [{
                label: 'Doanh thu (triệu đồng)',
                data: [12, 19, 15, 22, 18, 25, 28],
                backgroundColor: 'rgba(102, 126, 234, 0.14)',
                borderColor: '#667eea',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: "#764ba2"
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // Reports - Monthly revenue
    if (document.getElementById('monthlyRevenueChart')) {
        if (window.monthlyRevenueChart) window.monthlyRevenueChart.destroy();
        const monthlyCtx = document.getElementById('monthlyRevenueChart').getContext('2d');
        window.monthlyRevenueChart = new Chart(monthlyCtx, {
            type: 'bar',
            data: {
                labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
                datasets: [{
                    label: 'Doanh thu (triệu đồng)',
                    data: [120, 190, 150, 220, 180, 250],
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}

// ========== USERS CRUD ==========

let users = JSON.parse(localStorage.getItem('foodhub_users')) || [
    {id: 1, name: 'Nguyễn Văn A', email: 'vana@email.com', role: 'Khách hàng', status: 'Hoạt động', created: '15/06/2025'},
    {id: 2, name: 'Trần Thị B', email: 'thib@email.com', role: 'Nhà hàng', status: 'Hoạt động', created: '13/06/2025'},
];

function renderUsersTable(filter = '') {
    const tbody = document.querySelector("#users .table tbody");
    tbody.innerHTML = '';
    let filtered = users.filter(u =>
        u.name.toLowerCase().includes(filter.toLowerCase()) ||
        u.email.toLowerCase().includes(filter.toLowerCase())
    );
    filtered.forEach((u,i) => {
        tbody.innerHTML += `
            <tr>
                <td>${String(u.id).padStart(3,'0')}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.role}</td>
                <td><span class="status-badge status-active">${u.status}</span></td>
                <td>${u.created}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editUser(${u.id})"><i class='fas fa-pen'></i> Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser(${u.id})"><i class='fas fa-trash'></i> Xóa</button>
                </td>
            </tr>
        `;
    });
    // Update dashboard number
    document.getElementById('totalUsers').textContent = users.length.toLocaleString();
}

document.querySelector("#userModal form").onsubmit = function(e) {
e.preventDefault();
const id = this.userId.value;
const name = document.getElementById('name').value.trim();
const email = document.getElementById('email').value.trim().toLowerCase();
const role = document.getElementById('role').value;

if (!name || !email) return;

if (id) {
    const user = users.find(u => u.id == id);
    if (!user) return;

    if (users.some(u => u.email === email && u.id != id)) {
        alert('Email đã tồn tại!');
        return;
    }

    user.name = name;
    user.email = email;
    user.role = role;

} else {
    if (users.some(u => u.email === email)) {
        alert('Email đã tồn tại!');
        return;
    }

    users.unshift({
        id: Date.now(),
        name,
        email,
        role,
        status: 'Hoạt động',
        created: (new Date()).toLocaleDateString('vi-VN')
    });
}

localStorage.setItem('foodhub_users', JSON.stringify(users));
renderUsersTable();
closeModal('userModal');
this.reset();
this.userId.value = '';
};



    function deleteUser(id) {
        if (confirm("Bạn chắc chắn muốn xóa user này?")) {
            users = users.filter(u => u.id !== id);
            localStorage.setItem('foodhub_users', JSON.stringify(users));
            renderUsersTable(document.querySelector("#users .search-box input").value);
        }
    }

    // Tìm kiếm user
    document.querySelector("#users .search-box input").oninput = function() {
        renderUsersTable(this.value);
    };

    window.editUser = function(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;

    const form = document.querySelector("#userModal form");
    form.userId.value = user.id; // Gán ID vào input hidden
    form.querySelector('input[type=text]').value = user.name;
    form.querySelector('input[type=email]').value = user.email;
    form.querySelector('select').value = user.role;

    openModal('userModal'); // Hiển thị modal
};
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
    const form = document.querySelector(`#${id} form`);
    if (form) {
        form.reset();
        form.userId.value = '';
    }
}


    

    // Restaurants CRUD
        let restaurants = JSON.parse(localStorage.getItem('foodhub_restaurants')) || [
            { id: 'R001', name: 'Nhà hàng ABC', owner: 'Lê Văn C', address: '123 Đường ABC, Q1, TP.HCM', status: 'Hoạt động', rating: '4.5 ⭐', phone: '0901234567', email: 'abc@example.com', rejectReason: '' }
        ];

        function renderRestaurantsTable(filter = '') {
            const tbody = document.querySelector("#restaurants .table tbody");
            tbody.innerHTML = '';
            let filtered = restaurants.filter(r =>
                r.name.toLowerCase().includes(filter.toLowerCase()) ||
                r.owner.toLowerCase().includes(filter.toLowerCase())
            );
            filtered.forEach(r => {
                const statusClass = r.status === 'Hoạt động' ? 'status-active' : r.status === 'pending' ? 'status-pending' : 'status-inactive';
                const actions = r.status === 'pending' ? `
                    <button class="btn btn-success btn-sm" onclick="openApproveRestaurantModal('${r.id}')"><i class='fas fa-check'></i> Duyệt</button>
                    <button class="btn btn-danger btn-sm" onclick="openApproveRestaurantModal('${r.id}')"><i class='fas fa-eye'></i> Xem</button>
                ` : `
                    <button class="btn btn-warning btn-sm" onclick="editRestaurant('${r.id}')"><i class='fas fa-pen'></i> Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteRestaurant('${r.id}')"><i class='fas fa-trash'></i> Xóa</button>
                `;
                tbody.innerHTML += `
                    <tr>
                        <td>${r.id}</td>
                        <td>${r.name}</td>
                        <td>${r.owner}</td>
                        <td>${r.address}</td>
                        <td><span class="status-badge ${statusClass}">${r.status === 'pending' ? 'Chờ duyệt' : r.status}</span></td>
                        <td>${r.rating}</td>
                        <td>${actions}</td>
                    </tr>
                `;
            });
            document.getElementById('totalRestaurants').textContent = restaurants.length;
        }

        function saveRestaurant(e) {
            e.preventDefault();
            const id = document.getElementById('restaurantId').value;
            const name = document.getElementById('restaurantName').value.trim();
            const owner = document.getElementById('restaurantOwner').value.trim();
            const address = document.getElementById('restaurantAddress').value.trim();
            const rating = document.getElementById('restaurantRating').value.trim() || '4.0 ⭐';
            const phone = document.getElementById('restaurantPhone').value.trim();
            const email = document.getElementById('restaurantEmail').value.trim();

            if (!name || !owner || !address) {
                alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
                return;
            }

            if (id) {
                const r = restaurants.find(r => r.id === id);
                if (!r) return;
                r.name = name;
                r.owner = owner;
                r.address = address;
                r.rating = rating;
                r.phone = phone;
                r.email = email;
            } else {
                const newId = 'R' + (Math.floor(Math.random() * 900) + 100);
                restaurants.push({
                    id: newId,
                    name,
                    owner,
                    address,
                    status: 'pending',
                    rating,
                    phone,
                    email,
                    rejectReason: ''
                });
            }

            localStorage.setItem('foodhub_restaurants', JSON.stringify(restaurants));
            renderRestaurantsTable();
            closeModal('restaurantModal');
            e.target.reset();
            document.getElementById('restaurantId').value = '';
            document.getElementById('restaurantModalTitle').textContent = 'Thêm nhà hàng mới';
        }

        function deleteRestaurant(id) {
            if (confirm("Bạn chắc chắn muốn xóa nhà hàng này?")) {
                restaurants = restaurants.filter(r => r.id !== id);
                localStorage.setItem('foodhub_restaurants', JSON.stringify(restaurants));
                renderRestaurantsTable(document.querySelector("#restaurants .search-box input").value);
            }
        }

        window.editRestaurant = function (id) {
            const r = restaurants.find(r => r.id === id);
            if (!r) return;

            document.getElementById('restaurantModalTitle').textContent = "Sửa thông tin nhà hàng";
            document.getElementById('restaurantId').value = r.id;
            document.getElementById('restaurantName').value = r.name;
            document.getElementById('restaurantOwner').value = r.owner;
            document.getElementById('restaurantAddress').value = r.address;
            document.getElementById('restaurantRating').value = r.rating;
            document.getElementById('restaurantPhone').value = r.phone || '';
            document.getElementById('restaurantEmail').value = r.email || '';

            openModal('restaurantModal');
        };

        function openApproveRestaurantModal(id) {
            const r = restaurants.find(r => r.id === id);
            if (!r) return;

            document.getElementById('approveRestaurantId').value = id;
            document.getElementById('approveRestaurantName').textContent = r.name;
            document.getElementById('approveRestaurantOwner').textContent = r.owner;
            document.getElementById('approveRestaurantAddress').textContent = r.address;
            document.getElementById('restaurantAction').value = '';
            document.getElementById('rejectReason').value = r.rejectReason || '';
            document.getElementById('rejectReasonGroup').style.display = 'none';

            openModal('approveRestaurantModal');
        }

        function toggleRejectReason() {
            const action = document.getElementById('restaurantAction').value;
            document.getElementById('rejectReasonGroup').style.display = action === 'reject' ? 'block' : 'none';
        }

        function processRestaurantReview(e) {
            e.preventDefault();
            const id = document.getElementById('approveRestaurantId').value;
            const action = document.getElementById('restaurantAction').value;
            const rejectReason = document.getElementById('rejectReason').value.trim();
            const restaurant = restaurants.find(r => r.id === id);

            if (!restaurant || !action) {
                alert('Thông tin không hợp lệ!');
                return;
            }

            if (action === 'reject' && !rejectReason) {
                alert('Vui lòng nhập lý do từ chối!');
                return;
            }

            if (action === 'approve') {
                restaurant.status = 'Hoạt động';
                restaurant.rejectReason = '';
            } else if (action === 'reject') {
                restaurant.status = 'Từ chối';
                restaurant.rejectReason = rejectReason;
            }

            localStorage.setItem('foodhub_restaurants', JSON.stringify(restaurants));
            renderRestaurantsTable();
            closeModal('approveRestaurantModal');
        }

    // ========== DASHBOARD TỔNG HỢP ==========
    function updateDashboardStats() {
        document.getElementById('totalUsers').textContent = users.length.toLocaleString();
        document.getElementById('totalRestaurants').textContent = restaurants.length;
        // Đơn hàng, doanh thu: bạn có thể tự code thêm CRUD, hiện tại giữ số mẫu
    }

    // ========== KHỞI TẠO KHI LOAD ==========
    window.onload = function() {
        // Đăng nhập lưu localStorage
        const isLoggedIn = localStorage.getItem('adminLoggedIn');
        if (isLoggedIn) {
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('adminPanel').style.display = 'block';
            startRealTimeUpdates();
            setTimeout(initCharts, 400);
        }
        // Gán lại event cho login (giữ lại code của bạn)
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            localStorage.setItem('adminLoggedIn', 'true');
        });

        // Render ban đầu
        renderUsersTable();
        renderRestaurantsTable();
        updateDashboardStats();
        setTimeout(initCharts, 400); // Delay để canvas có mặt
    };

    // Khi chuyển tab, load lại bảng đúng tab
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            setTimeout(()=>{
                if(this.getAttribute('data-section')==='users') renderUsersTable();
                if(this.getAttribute('data-section')==='restaurants') renderRestaurantsTable();
                if(this.getAttribute('data-section')==='dashboard') updateDashboardStats();
                if(this.getAttribute('data-section')==='reports') setTimeout(initCharts,200);
                if(this.getAttribute('data-section')==='menu-planning') renderMenuPlans();
            },300);
        });
    });
        // Login functionality
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simple validation (in real app, this would be server-side)
            if (username === 'admin' && password === 'admin123') {
                document.getElementById('loginContainer').style.display = 'none';
                document.getElementById('adminPanel').style.display = 'block';
                startRealTimeUpdates();
            } else {
                alert('Tên đăng nhập hoặc mật khẩu không đúng!');
            }
        });

        // Sidebar toggle
        document.getElementById('toggleSidebar').addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('show');
            } else {
                sidebar.classList.toggle('hidden');
                mainContent.classList.toggle('expanded');
            }
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                // Remove active class from all links
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                this.classList.add('active');
                
                // Hide all sections
                document.querySelectorAll('.content-section').forEach(section => {
                    section.classList.remove('active');
                });
                
                // Show selected section
                const sectionId = this.getAttribute('data-section');
                document.getElementById(sectionId).classList.add('active');
                
                // Update page title
                const titles = {
                    'dashboard': 'Dashboard',
                    'users': 'Quản lý người dùng',
                    'restaurants': 'Quản lý nhà hàng',
                    'orders': 'Quản lý đơn hàng',
                    'reviews': 'Quản lý đánh giá',
                    'complaints': 'Quản lý khiếu nại',
                    'promotions': 'Quản lý khuyến mãi',
                    'reports': 'Báo cáo tổng hợp',
                    'group-orders': 'Đặt món theo nhóm',
                    'menu-planning': 'Lên thực đơn',
                    'ai-suggestions': 'Gợi ý AI'
                };
                document.getElementById('pageTitle').textContent = titles[sectionId];
                
                // Close sidebar on mobile after navigation
                if (window.innerWidth <= 768) {
                    document.getElementById('sidebar').classList.remove('show');
                }
            });
        });

        // Notification toggle
        document.getElementById('notificationBtn').addEventListener('click', function() {
            const panel = document.getElementById('notificationPanel');
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        });

        // Close notification panel when clicking outside
               // Close notification panel when clicking outside
        document.addEventListener('click', function(e) {
            const notificationBtn = document.getElementById('notificationBtn');
            const notificationPanel = document.getElementById('notificationPanel');
            
            if (e.target !== notificationBtn && !notificationBtn.contains(e.target)) {
                if (e.target !== notificationPanel && !notificationPanel.contains(e.target)) {
                    notificationPanel.style.display = 'none';
                }
            }
        });

        // Modal functions
        function openModal(modalId) {
            document.getElementById(modalId).style.display = 'block';
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        // Close modals when clicking outside
        window.onclick = function(e) {
            if (e.target.className === 'modal') {
                e.target.style.display = 'none';
            }
        }

        // Real-time data updates simulation
        function startRealTimeUpdates() {
            // Simulate real-time data changes
            setInterval(() => {
                // Update user count with random fluctuation
                const userCount = document.getElementById('totalUsers');
                const currentUsers = parseInt(userCount.textContent.replace(/,/g, ''));
                const newUsers = currentUsers + Math.floor(Math.random() * 3);
                userCount.textContent = newUsers.toLocaleString();
                userCount.parentElement.classList.add('real-time-update');
                
                // Update order count
                const orderCount = document.getElementById('totalOrders');
                const currentOrders = parseInt(orderCount.textContent.replace(/,/g, ''));
                const newOrders = currentOrders + Math.floor(Math.random() * 5);
                orderCount.textContent = newOrders.toLocaleString();
                orderCount.parentElement.classList.add('real-time-update');
                
                // Update revenue
                const revenue = document.getElementById('totalRevenue');
                const currentRevenue = parseFloat(revenue.textContent.replace(/[^\d.]/g, ''));
                const newRevenue = currentRevenue + (Math.random() * 0.2);
                revenue.textContent = '₫' + newRevenue.toFixed(1) + 'M';
                revenue.parentElement.classList.add('real-time-update');
                
                // Remove animation class after it completes
                setTimeout(() => {
                    userCount.parentElement.classList.remove('real-time-update');
                    orderCount.parentElement.classList.remove('real-time-update');
                    revenue.parentElement.classList.remove('real-time-update');
                }, 500);
                
                // Simulate new notifications
                if (Math.random() > 0.7) {
                    addRandomNotification();
                }
            }, 3000);
        }

        function addRandomNotification() {
            const notifications = [
                {
                    title: "Đơn hàng mới",
                    content: "Có đơn hàng mới từ nhà hàng ABC",
                    time: "Vừa xong"
                },
                {
                    title: "Đánh giá mới",
                    content: "Khách hàng Nguyễn Văn A đã đánh giá nhà hàng XYZ",
                    time: "5 phút trước"
                },
                {
                    title: "Khiếu nại",
                    content: "Khiếu nại mới về đơn hàng #ORD" + Math.floor(1000 + Math.random() * 9000),
                    time: "10 phút trước"
                },
                {
                    title: "Nhà hàng mới",
                    content: "Nhà hàng mới đăng ký tham gia hệ thống",
                    time: "30 phút trước"
                }
            ];
            
            const randomNotif = notifications[Math.floor(Math.random() * notifications.length)];
            const panel = document.getElementById('notificationPanel');
            const badge = document.querySelector('.notification-badge');
            
            // Create new notification item
            const newNotif = document.createElement('div');
            newNotif.className = 'notification-item unread';
            newNotif.innerHTML = `
                <strong>${randomNotif.title}</strong>
                <p>${randomNotif.content}</p>
                <small>${randomNotif.time}</small>
            `;
            
            // Insert at top of panel
            panel.insertBefore(newNotif, panel.children[1]);
            
            // Update badge count
            const currentCount = parseInt(badge.textContent);
            badge.textContent = currentCount + 1;
        }

        // Initialize charts (using Chart.js - you need to include the library)
        function initCharts() {
            // Revenue chart for dashboard
            const revenueCtx = document.getElementById('revenueCanvas').getContext('2d');
            const revenueChart = new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
                    datasets: [{
                        label: 'Doanh thu (triệu đồng)',
                        data: [12, 19, 15, 22, 18, 25, 28],
                        backgroundColor: 'rgba(102, 126, 234, 0.2)',
                        borderColor: 'rgba(102, 126, 234, 1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            
            // Monthly revenue chart for reports
            const monthlyCtx = document.getElementById('monthlyRevenueChart').getContext('2d');
            const monthlyChart = new Chart(monthlyCtx, {
                type: 'bar',
                data: {
                    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
                    datasets: [{
                        label: 'Doanh thu (triệu đồng)',
                        data: [120, 190, 150, 220, 180, 250],
                        backgroundColor: 'rgba(52, 152, 219, 0.7)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Initialize the dashboard when loaded
        window.onload = function() {
            // Check if user is already logged in (for demo purposes)
            const isLoggedIn = localStorage.getItem('adminLoggedIn');
            if (isLoggedIn) {
                document.getElementById('loginContainer').style.display = 'none';
                document.getElementById('adminPanel').style.display = 'block';
                startRealTimeUpdates();
                initCharts();
            }
            
            // For demo, we'll initialize charts after login
            document.getElementById('loginForm').addEventListener('submit', function(e) {
                e.preventDefault();
                localStorage.setItem('adminLoggedIn', 'true');
            });
        };

        // Responsive adjustments
        window.addEventListener('resize', function() {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            
            if (window.innerWidth > 768) {
                sidebar.classList.remove('show');
                sidebar.classList.remove('hidden');
                mainContent.classList.remove('expanded');
            }
        });

        // User menu dropdown (would need additional HTML/CSS)
        document.addEventListener('DOMContentLoaded', function() {
            const userMenu = document.getElementById('userMenu');
            const userDropdown = document.getElementById('userDropdown');

            userMenu.addEventListener('click', function(e) {
                e.stopPropagation();
                userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
            });

            // Ẩn dropdown khi click ra ngoài
            document.addEventListener('click', function() {
                userDropdown.style.display = 'none';
            });

            userDropdown.addEventListener('click', function(e) {
                e.stopPropagation(); // Không đóng khi click vào menu
            });

            // Xử lý các mục menu
            document.getElementById('changePassword').onclick = function() {
                alert('Chức năng Đổi mật khẩu!');
            };
            document.getElementById('viewAccount').onclick = function() {
                alert('Chức năng Xem tài khoản!');
            };
            document.getElementById('logout').onclick = function() {
                alert('Đăng xuất!');
                // Thêm logic đăng xuất ở đây nếu cần
            };
        });

        // Sample function to handle form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                // In real app, this would send data to server
                alert('Form submitted! In real app, this would save data.');
                // Close modal if form is in modal
                const modal = this.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });
         // Modal functions
    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }
    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
    window.onclick = function(e) {
        if (e.target.className === 'modal') {
            e.target.style.display = 'none';
        }
    }
    let orders = JSON.parse(localStorage.getItem('foodhub_orders')) || [
            {
                id: 'ORD001',
                customer: 'Nguyễn Văn A',
                restaurant: 'Nhà hàng ABC',
                items: 'Cơm sườn, Chả cá...',
                total: '₫250,000',
                status: 'Hoàn thành',
                time: '21/06/2025 14:30'
            },
            {
                id: 'ORD002',
                customer: 'Trần Thị B',
                restaurant: 'Quán cơm XYZ',
                items: 'Phở bò, Chả giò...',
                total: '₫180,000',
                status: 'Đang giao',
                time: '21/06/2025 15:15'
            }
        ];

        // Reset localStorage to ensure default orders
        localStorage.removeItem('foodhub_orders');
        localStorage.setItem('foodhub_orders', JSON.stringify(orders));
        console.log('Initialized orders:', orders.map(o => o.id));

        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'block';
                console.log(`Opened modal: ${modalId}`);
            } else {
                console.error(`Modal with ID ${modalId} not found`);
            }
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'none';
                console.log(`Closed modal: ${modalId}`);
            }
        }

        function renderOrdersTable(filteredOrders = orders) {
            const tbody = document.querySelector("#orders-table-body");
            if (!tbody) {
                console.error('Table body with id="orders-table-body" not found');
                return;
            }
            tbody.innerHTML = '';
            filteredOrders.forEach(order => {
                const statusClass = order.status === 'Hoàn thành' ? 'status-active' :
                  order.status === 'Đang giao' ? 'status-shipping' :
                  order.status === 'Đã hủy' ? 'status-inactive' :
                  order.status === 'Chuẩn bị' ? 'status-warning' :
                  'status-pending';

                const actions = `
    <button class="btn btn-primary btn-sm" onclick="openOrderDetailModal('${order.id}', 'detail')">Chi tiết</button>
    <button class="btn btn-warning btn-sm" onclick="openOrderDetailModal('${order.id}', 'process')">Xử lý</button>
`;

                tbody.innerHTML += `
                    <tr>
                        <td>${order.id}</td>
                        <td>${order.customer}</td>
                        <td>${order.restaurant}</td>
                        <td>${order.items}</td>
                        <td>${order.total}</td>
                        <td><span class="status-badge ${statusClass}">${order.status}</span></td>
                        <td>${order.time}</td>
                        <td>${actions}</td>
                    </tr>
                `;
            });
            console.log('Rendered orders:', filteredOrders.map(o => o.id));
        }

        function filterOrders() {
            const status = document.getElementById('orderStatusFilter').value;
            const filtered = status === 'all' ? orders : orders.filter(o => o.status === status);
            renderOrdersTable(filtered);
            console.log('Filtered by status:', status, 'Result:', filtered.map(o => o.id));
        }

        function searchOrders() {
            const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
            const filtered = orders.filter(o =>
                o.id.toLowerCase().includes(searchTerm) ||
                o.customer.toLowerCase().includes(searchTerm) ||
                o.restaurant.toLowerCase().includes(searchTerm)
            );
            renderOrdersTable(filtered);
            console.log('Searched for:', searchTerm, 'Result:', filtered.map(o => o.id));
        }

        function openOrderDetailModal(orderId, action) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    document.getElementById('orderId').value = orderId;
    document.getElementById('detailOrderId').textContent = order.id;
    document.getElementById('detailCustomer').textContent = order.customer;
    document.getElementById('detailRestaurant').textContent = order.restaurant;
    document.getElementById('detailItems').textContent = order.items;
    document.getElementById('detailTotal').textContent = order.total;
    document.getElementById('detailTime').textContent = order.time;
    document.getElementById('detailStatus').textContent = order.status;

    const isViewOnly = action === 'detail';

    // Ẩn hoặc hiện dropdown + nút submit theo chế độ
    document.getElementById('actionGroup').style.display = isViewOnly ? 'none' : 'block';
    document.querySelector('#orderDetailForm .btn-submit').style.display = isViewOnly ? 'none' : 'inline-block';

    // Nếu không phải "xem chi tiết" thì xử lý dropdown
    if (!isViewOnly) {
        const actionSelect = document.getElementById('orderAction');
        actionSelect.value = '';
        actionSelect.onchange = updateActionFields;

        document.getElementById('cancelReason').value = '';
        document.getElementById('reasonGroup').style.display = 'none';
    }

    openModal('orderDetailModal');
    console.log('Opened order detail modal for:', orderId, 'with action:', action);
}


        function updateActionFields() {
            const action = document.getElementById('orderAction').value;
            const reasonGroup = document.getElementById('reasonGroup');
            reasonGroup.style.display = action === 'cancel' ? 'block' : 'none';
        }

        function processOrder(e) {
            e.preventDefault();
            const orderId = document.getElementById('orderId').value;
            const action = document.getElementById('orderAction').value;
            const reason = document.getElementById('cancelReason').value;
            const order = orders.find(o => o.id === orderId);

            if (!order || !action) {
                alert('Thông tin không hợp lệ!');
                console.error('Invalid data:', { orderId, action });
                return;
            }

            if (action === 'cancel' && !reason.trim()) {
                alert('Vui lòng nhập lý do hủy!');
                console.error('Missing cancel reason for:', orderId);
                return;
            }

            switch (action) {
                case 'process':
                    order.status = 'Chuẩn bị';
                    break;
                case 'shipping': // ✅ THÊM VÀO
        order.status = 'Đang giao';
        break;
                case 'complete':
                    order.status = 'Hoàn thành';
                    break;
                case 'cancel':
                    order.status = 'Đã hủy';
                    order.cancelReason = reason;
                    break;
            }

            localStorage.setItem('foodhub_orders', JSON.stringify(orders));
            console.log('Processed order:', orderId, 'Action:', action, { reason });
            renderOrdersTable();
            closeModal('orderDetailModal');
        }

        // Initialize table
        document.addEventListener('DOMContentLoaded', () => {
            renderOrdersTable();
            console.log('Initialized orders table with:', orders.map(o => o.id));
        });
        renderOrdersTable(); // Load table immediately
let reviews = JSON.parse(localStorage.getItem('foodhub_reviews')) || [
            {
                id: 'RV001',
                customer: 'Nguyễn Văn A',
                restaurant: 'Nhà hàng ABC',
                rating: 5,
                comment: 'Đồ ăn ngon, giao hàng nhanh...',
                date: '21/06/2025',
                status: 'Chờ duyệt',
                rejectReason: ''
            },
            {
                id: 'RV002',
                customer: 'Trần Thị B',
                restaurant: 'Quán XYZ',
                rating: 3,
                comment: 'Đồ ăn ổn nhưng phục vụ hơi chậm',
                date: '22/06/2025',
                status: 'Chờ duyệt',
                rejectReason: ''
            }
        ];

        // Force reset localStorage to ensure both reviews are loaded
        localStorage.removeItem('foodhub_reviews'); // Remove old data
        reviews = [
            {
                id: 'RV001',
                customer: 'Nguyễn Văn A',
                restaurant: 'Nhà hàng ABC',
                rating: 5,
                comment: 'Đồ ăn ngon, giao hàng nhanh...',
                date: '21/06/2025',
                status: 'Chờ duyệt',
                rejectReason: ''
            },
            {
                id: 'RV002',
                customer: 'Trần Thị B',
                restaurant: 'Quán XYZ',
                rating: 3,
                comment: 'Đồ ăn ổn nhưng phục vụ hơi chậm',
                date: '22/06/2025',
                status: 'Chờ duyệt',
                rejectReason: ''
            }
        ];
        localStorage.setItem('foodhub_reviews', JSON.stringify(reviews));
        console.log('Initialized reviews from default:', reviews.map(r => r.id));

        function openModal(modalId) {
            try {
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('show');
                    modal.style.display = 'flex';
                    console.log(`Opened modal: ${modalId}`);
                } else {
                    console.error(`Modal with ID ${modalId} not found`);
                }
            } catch (error) {
                console.error('Error opening modal:', error);
            }
        }

        function closeModal(modalId) {
            try {
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.remove('show');
                    modal.style.display = 'none';
                    console.log(`Closed modal: ${modalId}`);
                }
            } catch (error) {
                console.error('Error closing modal:', error);
            }
        }

        function renderReviewsTable(filteredReviews = reviews) {
            try {
                const tbody = document.querySelector("#reviews-table-body");
                if (!tbody) {
                    console.error('Table body with id="reviews-table-body" not found in HTML');
                    return;
                }
                tbody.innerHTML = '';
                filteredReviews.forEach(review => {
                    const stars = '⭐'.repeat(review.rating);
                    const statusClass = review.status === 'Chờ duyệt' ? 'status-pending' : 
                                       review.status === 'Đã duyệt' ? 'status-active' : 'status-inactive';
                    let actionButtons = '';
                    if (review.status === 'Chờ duyệt') {
                        actionButtons = `
                            <button class="btn btn-success btn-sm" onclick="openProcessReviewModal('${review.id}', 'Đã duyệt')"><i class='fas fa-check'></i> Duyệt</button>
                            <button class="btn btn-danger btn-sm" onclick="openProcessReviewModal('${review.id}', 'Đã từ chối')"><i class='fas fa-times'></i> Từ chối</button>
                        `;
                    } else {
                        actionButtons = `
                            <button class="btn btn-warning btn-sm" onclick="openProcessReviewModal('${review.id}', '${review.status}')"><i class='fas fa-edit'></i> Chỉnh sửa</button>
                            <button class="btn btn-primary btn-sm" onclick="viewReviewDetail('${review.id}')"><i class='fas fa-eye'></i> Xem chi tiết</button>
                        `;
                    }
                    tbody.innerHTML += `
                        <tr>
                            <td>${review.customer}</td>
                            <td>${review.restaurant}</td>
                            <td>${stars}</td>
                            <td>${review.comment}</td>
                            <td>${review.date}</td>
                            <td><span class="status-badge ${statusClass}">${review.status}</span></td>
                            <td>
                                ${actionButtons}
                            </td>
                        </tr>
                    `;
                });
                console.log('Rendered reviews:', filteredReviews.map(r => r.id));
            } catch (error) {
                console.error('Error rendering reviews:', error);
            }
        }

        // Hàm xem chi tiết đánh giá
        function viewReviewDetail(id) {
            const review = reviews.find(r => r.id === id);
            if (!review) return alert('Không tìm thấy đánh giá!');
            alert(`Chi tiết đánh giá:\nKhách hàng: ${review.customer}\nNhà hàng: ${review.restaurant}\nSố sao: ${review.rating}\nBình luận: ${review.comment}\nNgày: ${review.date}\nTrạng thái: ${review.status}`);
        }

        function filterReviews() {
            try {
                const selectedStatus = document.getElementById('reviewStatusFilter')?.value;
                if (!selectedStatus) {
                    console.warn('Filter select with id="reviewStatusFilter" not found in HTML');
                    return;
                }
                const filtered = selectedStatus === 'all'
                    ? reviews
                    : reviews.filter(r => r.status === selectedStatus);
                renderReviewsTable(filtered);
                console.log('Filtered by status:', selectedStatus, 'Result:', filtered.map(r => r.id));
            } catch (error) {
                console.error('Error filtering reviews:', error);
            }
        }

        function openProcessReviewModal(id, action) {
    try {
        const review = reviews.find(r => r.id === id);
        if (!review) {
            console.error('Review not found:', id);
            return;
        }
        document.getElementById('processReviewId').value = id;
        document.getElementById('processReviewCustomer').textContent = review.customer;
        document.getElementById('processReviewRestaurant').textContent = review.restaurant;
        document.getElementById('processReviewRating').textContent = '⭐'.repeat(review.rating);
        document.getElementById('processReviewComment').textContent = review.comment;
        const actionSelect = document.getElementById('processReviewAction');
        actionSelect.value = action || '';
        const rejectReasonInput = document.getElementById('rejectReason');
        rejectReasonInput.value = review.rejectReason || '';

        // Thêm sự kiện onchange
        actionSelect.onchange = () => {
            updateRejectReasonDisplay(actionSelect.value);
        };

        openModal('processReviewModal');
        // GỌI LẠI cập nhật hiển thị sau khi modal đã mở (DOM chắc chắn đã render)
        setTimeout(() => {
            const actionSelect = document.getElementById('processReviewAction');
            if (actionSelect) updateRejectReasonDisplay(actionSelect.value);
        }, 100);
        console.log('Opened process modal for:', id, action);
    } catch (error) {
        console.error('Error opening process review modal:', error);
    }
}

// Hàm phụ để cập nhật hiển thị rejectReasonGroup
function updateRejectReasonDisplay(action) {
    const rejectReasonGroup = document.getElementById('rejectReasonGroup');
    rejectReasonGroup.style.display = action === 'Đã từ chối' ? 'block' : 'none';
}

        function processReview(e) {
    e.preventDefault();
    try {
        const id = document.getElementById('processReviewId').value;
        const actionSelect = document.getElementById('processReviewAction');
        const action = actionSelect.value.trim();
        const rejectReason = document.getElementById('rejectReason').value.trim();
        const review = reviews.find(r => r.id === id);

        if (!review || !action || !['Đã duyệt', 'Đã từ chối'].includes(action)) {
            alert('Thông tin không hợp lệ!');
            console.error('Invalid data:', { id, action });
            return;
        }

        // Cho phép từ chối mà không cần nhập lý do
        // if (action === 'Đã từ chối' && !rejectReason) {
        //     alert('Vui lòng nhập lý do từ chối!');
        //     console.error('Missing reject reason for:', id);
        //     return;
        // }

        review.status = action;
        review.rejectReason = action === 'Đã từ chối' ? rejectReason : '';
        localStorage.setItem('foodhub_reviews', JSON.stringify(reviews));
        console.log('Processed review:', id, action, { rejectReason });

        // Làm mới bảng và đóng modal
        renderReviewsTable();
        closeModal('processReviewModal');
        document.querySelector('.review-form').reset();
    } catch (error) {
        console.error('Error processing review:', error);
        alert('Có lỗi xảy ra khi xử lý đánh giá. Vui lòng thử lại.');
    }
}

        document.addEventListener('DOMContentLoaded', () => {
            try {
                renderReviewsTable();
                console.log('Initialized with reviews:', reviews.map(r => r.id));
            } catch (error) {
                console.error('Error initializing:', error);
            }
        });
        renderReviewsTable(); // Gọi ngay để load bảng lần đầu
let complaints = JSON.parse(localStorage.getItem('foodhub_complaints')) || [
    {
        id: 'CP001',
        user: 'Nguyễn Văn A',
        type: 'Chất lượng món ăn',
        content: 'Đồ ăn bị nguội, không đúng yêu cầu...',
        level: 'Cao',
        status: 'Đang xử lý',
        date: '21/06/2025',
        contactNotes: []
    }
];

function openModal(modalId) {
    try {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'flex';
            console.log(`Opened modal: ${modalId}`);
        } else {
            console.error(`Modal with ID ${modalId} not found`);
        }
    } catch (error) {
        console.error('Error opening modal:', error);
    }
}

function closeModal(modalId) {
    try {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
            console.log(`Closed modal: ${modalId}`);
        }
    } catch (error) {
        console.error('Error closing modal:', error);
    }
}

function renderComplaintsTable() {
    try {
        const tbody = document.querySelector("#complaints-table-body");
        if (!tbody) {
            console.error('Table body for complaints not found');
            return;
        }

        tbody.innerHTML = '';
        complaints.forEach(c => {
            const levelColor = c.level === 'Cao' ? '#ffebee' : c.level === 'Trung bình' ? '#fff3e0' : '#e8f5e9';
            const levelTextColor = c.level === 'Cao' ? '#c62828' : c.level === 'Trung bình' ? '#ef6c00' : '#2e7d32';
            tbody.innerHTML += `
                <tr>
                    <td>#${c.id}</td>
                    <td>${c.user}</td>
                    <td>${c.type}</td>
                    <td>${c.content}</td>
                    <td><span class="status-badge" style="background: ${levelColor}; color: ${levelTextColor};">${c.level}</span></td>
                    <td><span class="status-badge ${statusBadgeClass(c.status)}">${c.status}</span></td>
                    <td>${c.date}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="openProcessComplaintModal('${c.id}')"><i class='fas fa-tools'></i> Xử lý</button>
                        <button class="btn btn-warning btn-sm" onclick="openContactComplaintModal('${c.id}')"><i class='fas fa-phone'></i> Liên hệ</button>
                    </td>
                </tr>
            `;
        });
        console.log('Rendered complaints table with', complaints.length, 'complaints');
    } catch (error) {
        console.error('Error rendering complaints:', error);
    }
}

function statusBadgeClass(status) {
    switch(status) {
        case 'Mới': return 'status-warning';
        case 'Đang xử lý': return 'status-pending';
        case 'Đã giải quyết': return 'status-active';
        default: return '';
    }
}

function openProcessComplaintModal(id) {
    try {
        const complaint = complaints.find(c => c.id === id);
        if (!complaint) {
            console.error('Complaint not found:', id);
            return;
        }

        document.getElementById('processComplaintId').value = id;
        document.getElementById('processComplaintCode').textContent = `#${complaint.id}`;
        document.getElementById('processComplaintUser').textContent = complaint.user;
        const statusSelect = document.getElementById('processComplaintStatus');
        statusSelect.innerHTML = ['Mới', 'Đang xử lý', 'Đã giải quyết']
            .filter(s => s !== complaint.status)
            .map(s => `<option value="${s}">${s}</option>`).join('');
        
        openModal('processComplaintModal');
        console.log('Opened process modal for complaint:', id);
    } catch (error) {
        console.error('Error opening process complaint modal:', error);
    }
}

function processComplaint(e) {
    e.preventDefault();
    try {
        const id = document.getElementById('processComplaintId')?.value;
        const newStatus = document.getElementById('processComplaintStatus')?.value;
        const complaint = complaints.find(c => c.id === id);

        if (!complaint || !newStatus || !['Mới', 'Đang xử lý', 'Đã giải quyết'].includes(newStatus)) {
            alert('Thông tin không hợp lệ!');
            console.error('Invalid data:', { id, newStatus });
            return;
        }

        complaint.status = newStatus;
        localStorage.setItem('foodhub_complaints', JSON.stringify(complaints));
        console.log('Updated complaint status:', id, newStatus);

        renderComplaintsTable();
        closeModal('processComplaintModal');
    } catch (error) {
        console.error('Error processing complaint:', error);
        alert('Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại.');
    }
}

function openContactComplaintModal(id) {
    try {
        const complaint = complaints.find(c => c.id === id);
        if (!complaint) {
            console.error('Complaint not found:', id);
            return;
        }

        document.getElementById('contactComplaintId').value = id;
        document.getElementById('contactComplaintUser').textContent = complaint.user;
        document.getElementById('contactNotes').value = complaint.contactNotes?.join('\n') || '';

        openModal('contactComplaintModal');
        console.log('Opened contact modal for complaint:', id);
    } catch (error) {
        console.error('Error opening contact complaint modal:', error);
    }
}

function contactComplaint(e) {
    e.preventDefault();
    try {
        const id = document.getElementById('contactComplaintId')?.value;
        const notes = document.getElementById('contactNotes')?.value;
        const complaint = complaints.find(c => c.id === id);

        if (!complaint) {
            alert('Khiếu nại không tồn tại!');
            console.error('Complaint not found:', id);
            return;
        }

        if (!complaint.contactNotes) {
            complaint.contactNotes = [];
        }
        if (notes) {
            const timestamp = new Date().toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
            complaint.contactNotes.push(`${timestamp}: ${notes}`);
        }
        localStorage.setItem('foodhub_complaints', JSON.stringify(complaints));
        console.log('Added contact note for complaint:', id, notes);

        renderComplaintsTable();
        closeModal('contactComplaintModal');
        e.target.reset();
        alert('Đã lưu ghi chú liên hệ thành công!');
    } catch (error) {
        console.error('Error contacting complaint:', error);
        alert('Có lỗi xảy ra khi lưu ghi chú. Vui lòng thử lại.');
    }
}

function updateComplaintStats() {
    try {
        const newCount = complaints.filter(c => c.status === 'Mới').length;
        const processingCount = complaints.filter(c => c.status === 'Đang xử lý').length;
        const resolvedCount = complaints.filter(c => c.status === 'Đã giải quyết').length;

        document.querySelector('.stats-grid .stat-card:nth-child(1) .stat-number').textContent = newCount;
        document.querySelector('.stats-grid .stat-card:nth-child(2) .stat-number').textContent = processingCount;
        document.querySelector('.stats-grid .stat-card:nth-child(3) .stat-number').textContent = resolvedCount;
        console.log('Updated complaint stats:', { newCount, processingCount, resolvedCount });
    } catch (error) {
        console.error('Error updating complaint stats:', error);
    }
}

// Initialize table and stats on page load
document.addEventListener('DOMContentLoaded', () => {
    try {
        renderComplaintsTable();
        updateComplaintStats();
        console.log('Initialized complaints table and stats');
    } catch (error) {
        console.error('Error initializing complaints:', error);
    }
});
let promotions = JSON.parse(localStorage.getItem('foodhub_promotions')) || [
    {
        code: 'PROMO001',
        name: 'Giảm giá cuối tuần',
        type: 'Phần trăm',
        value: '20%',
        time: '22-23/06/2025',
        status: 'Đang chạy'
    }
];

function openModal(modalId) {
    try {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'flex';
            console.log(`Opened modal: ${modalId}`);
        } else {
            console.error(`Modal with ID ${modalId} not found`);
        }
    } catch (error) {
        console.error('Error opening modal:', error);
    }
}

function closeModal(modalId) {
    try {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
            console.log(`Closed modal: ${modalId}`);
        }
    } catch (error) {
        console.error('Error closing modal:', error);
    }
}

function renderPromotions() {
    try {
        const tbody = document.querySelector("#promotions-table-body");
        if (!tbody) {
            console.error('Table body for promotions not found');
            return;
        }

        tbody.innerHTML = '';
        promotions.forEach((promo, index) => {
            const statusClass = promo.status === 'Đang chạy' ? 'status-active' : 
                               promo.status === 'Sắp diễn ra' ? 'status-pending' : 'status-inactive';
            tbody.innerHTML += `
                <tr>
                    <td>${promo.code}</td>
                    <td>${promo.name}</td>
                    <td>${promo.type}</td>
                    <td>${promo.value}</td>
                    <td>${promo.time}</td>
                    <td><span class="status-badge ${statusClass}">${promo.status}</span></td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editPromotion(${index})"><i class='fas fa-pen'></i> Sửa</button>
                        <button class="btn btn-danger btn-sm" onclick="openStopPromotionModal(${index})"><i class='fas fa-flag'></i> Dừng</button>
                    </td>
                </tr>
            `;
        });
        console.log('Rendered promotions table with', promotions.length, 'promotions');
    } catch (error) {
        console.error('Error rendering promotions:', error);
    }
}

function addPromotion(e) {
    e.preventDefault();
    try {
        console.log('addPromotion called');
        const code = document.getElementById('promoCode')?.value;
        const name = document.getElementById('promoName')?.value;
        const type = document.getElementById('promoType')?.value;
        const value = document.getElementById('promoValue')?.value;
        const time = document.getElementById('promoTime')?.value;
        const status = document.getElementById('promoStatus')?.value;

        if (!code || !name || !type || !value || !time || !status) {
            alert('Vui lòng điền đầy đủ thông tin!');
            console.error('Missing form data:', { code, name, type, value, time, status });
            return;
        }

        const newPromo = { code, name, type, value, time, status };
        promotions.push(newPromo);
        localStorage.setItem('foodhub_promotions', JSON.stringify(promotions));
        console.log('Added new promotion:', newPromo);
        console.log('Saved to localStorage:', promotions);

        renderPromotions();
        closeModal('promotionModal');
        e.target.reset();
    } catch (error) {
        console.error('Error adding promotion:', error);
        alert('Có lỗi xảy ra khi thêm khuyến mãi. Vui lòng thử lại.');
    }
}

function editPromotion(index) {
    try {
        const promo = promotions[index];
        if (!promo) {
            console.error('Promotion not found at index:', index);
            return;
        }
        document.getElementById('editPromoIndex').value = index;
        document.getElementById('editPromoCode').value = promo.code;
        document.getElementById('editPromoName').value = promo.name;
        document.getElementById('editPromoType').value = promo.type;
        document.getElementById('editPromoValue').value = promo.value;
        document.getElementById('editPromoTime').value = promo.time;
        document.getElementById('editPromoStatus').value = promo.status;

        openModal('editPromotionModal');
        console.log('Opened edit modal for promotion at index:', index);
    } catch (error) {
        console.error('Error editing promotion:', error);
    }
}

function saveEditPromotion(e) {
    e.preventDefault();
    try {
        const index = parseInt(document.getElementById('editPromoIndex')?.value);
        if (isNaN(index) || index < 0 || index >= promotions.length) {
            console.error('Invalid edit index:', index);
            return;
        }

        const updatedPromo = {
            code: document.getElementById('editPromoCode')?.value,
            name: document.getElementById('editPromoName')?.value,
            type: document.getElementById('editPromoType')?.value,
            value: document.getElementById('editPromoValue')?.value,
            time: document.getElementById('editPromoTime')?.value,
            status: document.getElementById('editPromoStatus')?.value
        };

        if (!updatedPromo.code || !updatedPromo.name || !updatedPromo.type || !updatedPromo.value || !updatedPromo.time || !updatedPromo.status) {
            alert('Vui lòng điền đầy đủ thông tin!');
            console.error('Missing edit form data:', updatedPromo);
            return;
        }

        promotions[index] = updatedPromo;
        localStorage.setItem('foodhub_promotions', JSON.stringify(promotions));
        console.log('Updated promotion at index:', index, updatedPromo);

        renderPromotions();
        closeModal('editPromotionModal');
    } catch (error) {
        console.error('Error saving edited promotion:', error);
        alert('Có lỗi xảy ra khi lưu khuyến mãi. Vui lòng thử lại.');
    }
}

function openStopPromotionModal(index) {
    try {
        const promo = promotions[index];
        if (!promo) {
            console.error('Promotion not found at index:', index);
            return;
        }
        document.getElementById('stopPromoIndex').value = index;
        document.getElementById('stopPromoName').textContent = promo.name;

        openModal('stopPromotionModal');
        console.log('Opened stop modal for promotion at index:', index);
    } catch (error) {
        console.error('Error opening stop modal:', error);
    }
}

function stopPromotion(e) {
    e.preventDefault();
    try {
        const index = parseInt(document.getElementById('stopPromoIndex')?.value);
        if (isNaN(index) || index < 0 || index >= promotions.length) {
            console.error('Invalid stop index:', index);
            return;
        }

        promotions[index].status = 'Đã dừng';
        localStorage.setItem('foodhub_promotions', JSON.stringify(promotions));
        console.log('Stopped promotion at index:', index);

        renderPromotions();
        closeModal('stopPromotionModal');
    } catch (error) {
        console.error('Error stopping promotion:', error);
        alert('Có lỗi xảy ra khi dừng khuyến mãi. Vui lòng thử lại.');
    }
}

// Initialize table on page load
document.addEventListener('DOMContentLoaded', () => {
    try {
        renderPromotions();
        console.log('Initialized promotions table');
    } catch (error) {
        console.error('Error initializing promotions:', error);
    }
});
renderPromotionsTable();

function generateReport(type, from, to) {
    const random = () => Math.floor(Math.random() * 1000 + 500);
    switch (type) {
        case "Báo cáo doanh thu":
            return [
                ["Tháng", "Doanh thu (₫)"],
                ["01", random()],
                ["02", random()],
                ["03", random()],
                ["04", random()]
            ];
        case "Báo cáo đơn hàng":
            return [
                ["Ngày", "Tổng đơn"],
                ["21/06", 15],
                ["22/06", 22],
                ["23/06", 19]
            ];
        case "Báo cáo người dùng":
            return [
                ["Ngày", "Người dùng mới"],
                ["21/06", 3],
                ["22/06", 5],
                ["23/06", 2]
            ];
        case "Báo cáo nhà hàng":
            return [
                ["Nhà hàng", "Số đơn"],
                ["ABC", 50],
                ["XYZ", 35],
                ["123 Food", 40]
            ];
        default:
            return [];
    }
}

function renderReportTable(data) {
    const table = document.getElementById('reportTable');
    const thead = document.getElementById('reportTableHead');
    const tbody = document.getElementById('reportTableBody');
    if (!data || data.length === 0) {
        table.style.display = 'none';
        thead.innerHTML = '';
        tbody.innerHTML = '';
        window.currentReportData = [];
        return;
    }
    table.style.display = '';
    thead.innerHTML = '<tr>' + data[0].map(cell => `<th>${cell}</th>`).join('') + '</tr>';
    tbody.innerHTML = data.slice(1).map(row => '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>').join('');
    window.currentReportData = data;
}

document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generateReportBtn");
    const exportExcelBtn = document.getElementById("exportExcelBtn");
    const exportPdfBtn = document.getElementById("exportPdfBtn");
    if (generateBtn) {
        generateBtn.onclick = function () {
            const typeMap = {
                'doanh-thu': 'Báo cáo doanh thu',
                'don-hang': 'Báo cáo đơn hàng',
                'nguoi-dung': 'Báo cáo người dùng',
                'nha-hang': 'Báo cáo nhà hàng'
            };
            const type = typeMap[document.getElementById("reportType")?.value] || '';
            const from = document.getElementById("fromDate")?.value;
            const to = document.getElementById("toDate")?.value;

            if (!from || !to) {
                alert("Vui lòng chọn đầy đủ ngày!");
                return;
            }

            const reportData = generateReport(type, from, to);
            if (reportData.length === 0) {
                alert("Không có dữ liệu cho báo cáo này!");
                renderReportTable([]);
                return;
            }

            renderReportTable(reportData);
            console.log("✅ Report Generated:", reportData);
            alert(`Đã tạo báo cáo: ${type}\nTừ ${from} đến ${to}`);
        };
    }

    if (exportExcelBtn) {
        exportExcelBtn.onclick = function () {
            const data = window.currentReportData;
            if (!data || data.length === 0) {
                alert("Chưa có báo cáo để xuất!");
                return;
            }
            try {
                const ws = XLSX.utils.aoa_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Report");
                XLSX.writeFile(wb, "baocao_foodhub.xlsx");
            } catch (err) {
                alert('Lỗi khi xuất Excel: ' + err);
                console.error(err);
            }
        };
    }

    if (exportPdfBtn) {
        exportPdfBtn.onclick = function () {
            const data = window.currentReportData;
            if (!data || data.length === 0) {
                alert("Chưa có báo cáo để xuất!");
                return;
            }
            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                let y = 20;

                doc.setFontSize(14);
                doc.text("Báo cáo FoodHub", 14, y);
                y += 10;

                data.forEach(row => {
                    doc.text(row.join("    "), 14, y);
                    y += 10;
                });

                doc.save("baocao_foodhub.pdf");
            } catch (err) {
                alert('Lỗi khi xuất PDF: ' + err);
                console.error(err);
            }
        };
    }
});


// 
// Khởi tạo mặc định nếu localStorage trống
if (!localStorage.getItem('foodhub_menu_plans')) {
    const defaultPlans = [
        {
            type: "Thực đơn tuần",
            name: "Thực đơn tuần 25",
            time: "24-30/06/2025",
            dishes: 25,
            business: "12 doanh nghiệp",
            status: "Đang chạy"
        },
        {
            type: "Thực đơn đặc biệt",
            name: "Trung thu đặc biệt",
            time: "28/09/2025",
            dishes: 10,
            business: "8 doanh nghiệp",
            status: "Sắp diễn ra"
        }
    ];
    localStorage.setItem('foodhub_menu_plans', JSON.stringify(defaultPlans));
}

// Luôn đọc menuPlans từ localStorage
function getMenuPlans() {
    return JSON.parse(localStorage.getItem('foodhub_menu_plans')) || [];
}

// Mở và đóng modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

// Render bảng kế hoạch
function renderMenuPlans(plans = null) {
    const tbody = document.querySelector("#menu-planning tbody");
    if (!tbody) return;

    const data = plans || getMenuPlans();
    tbody.innerHTML = "";

    data.forEach((plan, index) => {
        let statusClass = 'status-pending';
if (plan.status === 'Đang chạy') statusClass = 'status-active';
else if (plan.status === 'Hoàn thành') statusClass = 'status-completed';

        tbody.innerHTML += `
            <tr>
                <td>${plan.name}</td>
                <td>${plan.time}</td>
                <td>${plan.dishes} món</td>
                <td>${plan.business}</td>
                <td><span class="status-badge ${statusClass}">${plan.status}</span></td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editPlan(${index})"><i class='fas fa-pen'></i> Sửa</button>
                    <button class="btn btn-primary btn-sm" onclick="viewPlan(${index})"><i class='fas fa-eye'></i> Xem</button>
                </td>
            </tr>
        `;
    });
}

// Lọc loại thực đơn
function filterMenuPlans() {
    const selectedType = document.getElementById("planTypeSelect")?.value;
    const allPlans = getMenuPlans();
    const filtered = selectedType === "all"
        ? allPlans
        : allPlans.filter(p => p.type === selectedType);
    renderMenuPlans(filtered);
}

// Thêm kế hoạch mới
function addMenuPlan(e) {
    e.preventDefault();
    const type = document.getElementById("createPlanType")?.value;
    const name = document.getElementById("planName")?.value;
    const time = document.getElementById("planTime")?.value;
    const dishes = parseInt(document.getElementById("planDishes")?.value);
    const business = document.getElementById("planBusiness")?.value;
    const status = document.getElementById("planStatus")?.value;

    if (!type || !name || !time || isNaN(dishes) || !business || !status) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    const newPlan = { type, name, time, dishes, business, status };
    const currentPlans = getMenuPlans();
    currentPlans.push(newPlan);
    localStorage.setItem('foodhub_menu_plans', JSON.stringify(currentPlans));

    renderMenuPlans();
    closeModal("createMenuPlanModal");
    e.target.reset();
}

// Xem kế hoạch
function viewPlan(index) {
    const plans = getMenuPlans();
    const plan = plans[index];
    if (!plan) return;

    document.getElementById('viewPlanName').textContent = plan.name;
    document.getElementById('viewPlanType').textContent = plan.type;
    document.getElementById('viewPlanTime').textContent = plan.time;
    document.getElementById('viewPlanDishes').textContent = `${plan.dishes} món`;
    document.getElementById('viewPlanBusiness').textContent = plan.business;
    const statusSpan = document.getElementById('viewPlanStatus');
    statusSpan.textContent = plan.status;
    let statusClass = 'status-pending';
if (plan.status === 'Đang chạy') statusClass = 'status-active';
else if (plan.status === 'Hoàn thành') statusClass = 'status-completed';
statusSpan.className = `status-badge ${statusClass}`;


    openModal("viewMenuPlanModal");
}

// Sửa kế hoạch
function editPlan(index) {
    const plans = getMenuPlans();
    const plan = plans[index];
    if (!plan) return;

    document.getElementById("editIndex").value = index;
    document.getElementById("editPlanName").value = plan.name;
    document.getElementById("editPlanTime").value = plan.time;
    document.getElementById("editPlanDishes").value = plan.dishes;
    document.getElementById("editPlanBusiness").value = plan.business;
    document.getElementById("editPlanStatus").value = plan.status;
    document.getElementById("editPlanType").value = plan.type;

    openModal("editMenuPlanModal");
}

// Lưu kế hoạch sau chỉnh sửa
function saveEditPlan(e) {
    e.preventDefault();
    const index = parseInt(document.getElementById("editIndex")?.value);
    const plans = getMenuPlans();
    if (isNaN(index) || index < 0 || index >= plans.length) return;

    const updatedPlan = {
        name: document.getElementById("editPlanName")?.value,
        time: document.getElementById("editPlanTime")?.value,
        dishes: parseInt(document.getElementById("editPlanDishes")?.value),
        business: document.getElementById("editPlanBusiness")?.value,
        status: document.getElementById("editPlanStatus")?.value,
        type: document.getElementById("editPlanType")?.value
    };

    plans[index] = updatedPlan;
    localStorage.setItem('foodhub_menu_plans', JSON.stringify(plans));
    renderMenuPlans();
    closeModal("editMenuPlanModal");
}

// Khởi tạo sau khi load trang
document.addEventListener('DOMContentLoaded', () => {
    renderMenuPlans();
});

