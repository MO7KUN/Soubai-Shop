async function getOrders() {
    let allOrders = [];
    const tbody = document.getElementById('ordersTableBody');
    const response = await fetch('http://e_sahara.test/api/orders');
    allOrders = await response.json();
    if (allOrders.length > 0) {
        allOrders.forEach(order => {
            tbody.innerHTML += `
                        <tr class="hover:bg-gray-100">
                            <td class="px-6 py-4 text-center">${order.id || '---'}</td>
                            <td class="px-6 py-4 text-center">${order.client?.name || '---'}</td>
                            <td class="px-6 py-4 text-center">
                            <select id="orderStatusSelector" class="bg-gray-100 p-2 rounded-lg border border-gray-300 focus:outline-none            focus:ring-2 focus:ring-blue-300" onchange="changeOrderStatus(${order.id}, this.value)">
                                <option value="En attente" ${order.status == 'En attente' ? "selected" : ""}>En attente</option>
                                <option value="Confirmée" ${order.status == 'Confirmée' ? "selected" : ""}>Confirmée</option>
                                <option value="Livrée" ${order.status == 'Livrée' ? "selected" : ""}>Livrée</option>
                                <option value="Annulée" ${order.status == 'Annulée' ? "selected" : ""}>Annulée</option>
                            </select>
                            </td>
                            <td class="px-6 py-4 text-center" dir="ltr">${order.total_price} DH</td>
                            <td class="px-6 py-4 text-center">${new Date(order.created_at).toLocaleDateString()}</td>
                            <td class="p-3 border-b text-center whitespace-nowrap">
                                <button onclick="window.open('NewOrder.html?action=edit&order=${order.id}','_self')"
                                    class="bg-blue-500 text-white text-center px-2 py-1 rounded-full hover:bg-blue-600">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button
                                    class="bg-red-500 text-white text-center px-2 py-1 rounded-full hover:bg-red-600">
                                    <i class="fas fa-trash"></i>
                                </button>
                                <a href="tel:${order.client?.phone}"
                                    class="bg-cyan-400 text-white text-center ml-2 px-1 py-1 rounded-full hover:bg-cyan-600">
                                    <i class="fas fa-phone"></i>
                                </a>
                                <a href="https://wa.me/${order.client?.phone}" target="_blank"
                                    class="bg-green-500 text-white text-center  px-2 py-1 rounded-full hover:bg-green-600">
                                    <i class="fab fa-whatsapp"></i>
                                </a> 
                            </td>
                        </tr>
                    `;
        })

        // Initialize DataTable FIRST
        const table = $('#ordersTable').DataTable({
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
        $('#ordersTable-search').on('keyup', function () {
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

        // Initial page info update
        // const initialInfo = table.page.info();
        // $('#pageInfo').text(`Page ${initialInfo.page + 1} of ${initialInfo.pages}`);
    } else {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-3">لا توجد طلبات.</td></tr>`;
    }
}

document.addEventListener('DOMContentLoaded', getOrders)

async function changeOrderStatus(orderId, newStatus) {
    console.log(orderId, newStatus);
    if (!confirm("هل تريد فعلا تغيير حالة الطلب?")) return;
    try {
        const response = await fetch('http://e_sahara.test/api/order/' + orderId + '/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (response.status === 200) {
            const data = await response.json();
            alert(data.message || "Order status updated successfully");
        } else if (response.status === 404) {
            alert("Order not found");
        } else if (response.status === 403) {
            alert("Unauthorized action");
        } else if (response.status === 422) {
            const errorData = await response.json();
            alert(errorData.message || "Invalid data");
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to change order status");
        }
    } catch (error) {
        console.error("Error:", error.message);
        alert(error.message || "An error occurred. Please try again later.");
    }
}
