document.addEventListener("DOMContentLoaded", function () {
    fetchUsers();
})

// Fetch users from the API
async function fetchUsers() {
    try {
        const response = await fetch('http://e_sahara.test/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('فشل جلب بيانات المستخدمين');
        }

        const data = await response.json();
        displayUsers(data.users); // Assuming the API returns an array of users in `data.data`
    } catch (error) {
        console.error('حدث خطأ:', error);
        document.getElementById('error-message').classList.remove('hidden');
    }
}

// Display users in the table
function displayUsers(users) {
    console.log(users)
    const usersTableBody = document.getElementById('users-table');
    usersTableBody.innerHTML = ''; // Clear existing content

    users.forEach(user => {
        const row = document.createElement("tr");
        row.className = "hover:bg-gray-100 border-b";

        row.innerHTML = `
        <td class="px-4 py-3 text-center whitespace-nowrap font-medium">${user.name}</td>
        <td class="px-4 py-3 text-center whitespace-nowrap font-medium">${user.email}</td>
        <td class="px-4 py-3 text-center">
            <div class="flex items-center justify-center gap-2">
                <a href="newUser.php?action=edit&id=${user.id}" class="bg-yellow-400 text-black px-3 py-1.5 rounded-full hover:bg-yellow-500 transition">
                    <i class="fas fa-edit"></i>
                </a>
                <button onclick="openPopUp('pop-up-1',${user.id})" class="bg-red-500 text-white px-3 py-1.5 rounded-full hover:bg-red-600 transition">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
        `;
        usersTableBody.appendChild(row);
    });

    // Initialize DataTable FIRST
    const table = $('#usersTable').DataTable({
        dom: 't', // إخفاء عناصر التحكم الافتراضية
        paging: true,
        searching: true,
        info: true, // تفعيل معلومات العناصر
        lengthMenu: [10, 25, 50, 100], // خيارات عدد الصفوف
        lengthChange: true, // تفعيل تغيير عدد الصفوف
        pageLength: 10, // القيمة الافتراضية
        pagingType: 'full_numbers',
        language: {
            "paginate": {
                "previous": "السابق",
                "next": "التالي"
            },
            "search": "ابحث:",
            "emptyTable": "لا توجد بيانات متاحة",
            "zeroRecords": "لم يتم العثور على نتائج مطابقة",
            "info": "عرض _START_ إلى _END_ من إجمالي _TOTAL_ عنصر",
            "infoEmpty": "عرض 0 إلى 0 من 0 عنصر",
            "infoFiltered": "(تمت التصفية من إجمالي _MAX_ عنصر)",
            "lengthMenu": "عرض _MENU_ عنصر لكل صفحة"
        }
    });

    // إضافة عنصر اختيار عدد الصفوف المخصص
    $('#customPagination').prepend(`
    <div class="page-length-selector">
        <select id="rowCountSelect" class="your-select-style">
            <option value="10">10 عناصر/الصفحة</option>
            <option value="25">25 عناصر/الصفحة</option>
            <option value="50">50 عناصر/الصفحة</option>
            <option value="100">100 عناصر/الصفحة</option>
        </select>
    </div>
    `);

    // تحديث عدد الصفوف عند التغيير
    $('#rowCountSelect').on('change', function () {
        table.page.len(this.value).draw();
    });

    // تحديث المعلومات عند التغيير
    table.on('draw', function () {
        const info = table.page.info();
        $('#pageInfo').html(`
        عرض ${info.start + 1} إلى ${info.end} 
        من إجمالي ${info.recordsTotal} عنصر
    `);

        // تحديث القيمة المحددة في ال select
        $('#rowCountSelect').val(info.length);
    });

    // Now connect your custom elements AFTER initialization
    // Custom search
    $('#usersTable-search').on('keyup', function () {
        table.search(this.value).draw();
    });

    // Custom pagination controls
    $('#prevPage').on('click', function () {
        table.page('previous').draw('page');
    });

    $('#nextPage').on('click', function () {
        table.page('next').draw('page');
    });

    // Update page info on page change
    table.on('draw', function () {
        const info = table.page.info();
        $('#pageInfo').text(`الصفحة ${info.page + 1} من ${info.pages}`);
    });
}

async function deleteUser(userId) {
    try {
        const response = await fetch(`http://e_sahara.test/api/user/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            fetchUsers();
            closePopUp('pop-up-1');
        } else if (response.status === 404) {
            alert("User not found");
        } else if (response.status === 403) {
            alert("Unauthorized action");
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete user");
        }
    } catch (error) {
        console.error("Error:", error.message);
        alert(error.message || "An error occurred. Please try again later.");
    }
}

