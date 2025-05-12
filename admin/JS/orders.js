let apiUrl = "https://sbaishop.com/api"

async function getOrders() {
    let allOrders = [];
    const tbody = document.getElementById('ordersTableBody');
    try {


        const response = await fetch(apiUrl + '/orders', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            }
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Try to parse error JSON, fallback to empty object
            throw { status: response.status, message: errorData.message || "حدث خطأ أثناء جلب المنتجات" };
        }
        allOrders = await response.json();
        if (allOrders.length > 0) {
            allOrders.forEach(order => {
                tbody.innerHTML += `
                        <tr class="hover:bg-gray-100">
                            <td class="px-6 py-4 text-center">${order.id || '---'}</td>
                            <td class="px-6 py-4 text-center">${order.client?.name || '---'}</td>
                            <td class="px-6 py-4 text-center">
                            <select id="orderStatusSelector" class="bg-gray-100 p-2 rounded-lg border border-gray-300 focus:outline-none            focus:ring-2 focus:ring-blue-300" onchange="changeOrderStatus(${order.id}, this)"
                            data-previous-value="${order.status}">
                                <option value="En attente" ${order.status == 'En attente' ? "selected" : ""}>قيد المعالجة</option>
                                <option value="Confirmé" ${order.status == 'Confirmé' ? "selected" : ""}>تم التأكيد</option>
                                <option value="Livré" ${order.status == 'Livré' ? "selected" : ""}>تم التوصيل</option>
                                <option value="Annulé" ${order.status == 'Annulé' ? "selected" : ""}>تم الالغاء</option>
                            </select>
                            </td>
                            <td class="px-6 py-4 text-center" dir="ltr">${order.total_price} DH</td>
                            <td class="px-6 py-4 text-center">${new Date(order.created_at).toLocaleDateString()}</td>
                            <td class="p-3 border-b text-center whitespace-nowrap">
                                <button onclick="window.open('newOrder.php?action=edit&order=${order.id}','_self')"
                                    class="bg-blue-500 text-white text-center px-2 py-1 rounded-full hover:bg-blue-600">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteOrder(${order.id})"
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
                order: [],
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
    } catch (error) {
        console.error("❌ Error fetching products:", error); // Log the full error for debugging
        errorsHandler(error.status || 500);
        tbody.innerHTML = `
          <tr>
            <td colspan="100%" class="py-6 text-center text-red-500 font-semibold bg-red-50 border border-red-200 rounded">
                ⚠️ هناك مشكلة في الخادم، يرجى المحاولة لاحقًا أو التواصل مع الدعم الفني.
            </td>
          </tr>
        `;
        throw new Error(`Error occurred while fetching products: ${error.message}`);
    }
}

document.addEventListener('DOMContentLoaded', getOrders)
async function changeOrderStatus(orderId, selectElement) {
    const previousValue = selectElement.dataset.previousValue || selectElement.value; // Store the initial value

    // Confirmation before proceeding
    const confirmChange = await Swal.fire({
        icon: "warning",
        title: "تأكيد التغيير",
        text: "هل تريد فعلاً تغيير حالة الطلب؟",
        showCancelButton: true,
        confirmButtonText: "نعم",
        cancelButtonText: "إلغاء",
    });

    if (!confirmChange.isConfirmed) {
        selectElement.value = previousValue; // Restore the previous value on cancel
        return;
    }

    try {
        const response = await fetch(apiUrl + `/order/${orderId}/edit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ status: selectElement.value }),
        });

        const data = await response.json().catch(() => ({})); // Handle potential invalid JSON response

        if (response.ok) {
            return Swal.fire({
                icon: "success",
                title: "تم التحديث",
                text: data.message || "تم تحديث حالة الطلب بنجاح",
                timer: 1500,
                showConfirmButton: false,
            });
        }

        // Handle specific error cases
        if (response.status === 404) {
            return Swal.fire({ icon: "error", title: "خطأ", text: "الطلب غير موجود" });
        }

        if (response.status === 403) {
            return Swal.fire({ icon: "error", title: "خطأ", text: "غير مصرح لك بتنفيذ هذا الإجراء" });
        }

        if (response.status === 422) {
            return Swal.fire({ icon: "error", title: "خطأ", text: data.message || "البيانات غير صحيحة" });
        }

        // Default error handling
        throw new Error(data.message || "فشل في تغيير حالة الطلب");

    } catch (error) {
        console.error("❌ حدث خطأ:", error);
        Swal.fire({
            icon: "error",
            title: "خطأ",
            text: error.message || "حدث خطأ غير متوقع، يرجى المحاولة لاحقًا",
        });
    }
}

async function deleteOrder(id) {
    // Show confirmation pop-up
    const confirmDelete = await Swal.fire({
        icon: "warning",
        title: "تأكيد الحذف",
        text: "هل أنت متأكد أنك تريد حذف هذا الطلب؟",
        showCancelButton: true,
        confirmButtonText: "نعم، احذف",
        cancelButtonText: "إلغاء",
    });

    if (!confirmDelete.isConfirmed) {
        return; // Exit if the user cancels
    }

    try {
        // Show loading pop-up
        Swal.fire({
            title: "جاري الحذف...",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        // Send delete request
        const response = await fetch(apiUrl + `/order/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json().catch(() => ({})); // Handle potential invalid JSON response

        if (response.ok) {
            // Show success pop-up
            Swal.fire({
                icon: "success",
                title: "تم الحذف",
                text: data.message || "تم حذف الطلب بنجاح",
                timer: 1500,
                showConfirmButton: false,
            });

            // Optionally refresh the orders list or remove the deleted row
            getOrders();
        } else {
            // Handle specific error cases
            if (response.status === 404) {
                return Swal.fire({ icon: "error", title: "خطأ", text: "الطلب غير موجود" });
            }

            if (response.status === 403) {
                return Swal.fire({ icon: "error", title: "خطأ", text: "غير مصرح لك بتنفيذ هذا الإجراء" });
            }

            // Default error handling
            throw new Error(data.message || "فشل في حذف الطلب");
        }
    } catch (error) {
        console.error("❌ حدث خطأ أثناء الحذف:", error);
        Swal.fire({
            icon: "error",
            title: "خطأ",
            text: error.message || "حدث خطأ غير متوقع، يرجى المحاولة لاحقًا",
        });
    }
}
