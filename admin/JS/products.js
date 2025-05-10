let apiUrl = "https://sbaishop.com/api"

document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});

async function fetchProducts() {
    const tableBody = document.getElementById("products-table");

    if (!tableBody) {
        console.error("Error: Table body with ID 'products' not found.");
        return;
    }

    try {
        const response = await fetch(apiUrl + "/products",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw response;
        }

        const products = await response.json();

        // if (!Array.isArray(products)) {
        //     throw new Error("Unexpected API response format.");
        // }

        console.log(products)

        tableBody.innerHTML = ""; // Clear existing content
        if (products.length > 0) {
            products.forEach(product => {
                const row = document.createElement("tr");
                row.className = "hover:bg-gray-100 border-b";

                row.innerHTML = `
                <td class="p-3 text-center">
                    <img src="${product.image_url ? product.image_url : ''}" alt="${product.label}" class="w-16 h-16 rounded-lg object-cover shadow">
                </td>
                <td class="px-4 py-3 text-center whitespace-nowrap font-meduim">${product.ref || "---"}</td>
                <td class="px-4 py-3 text-center whitespace-nowrap font-medium">${product.label}</td>
                <td class="px-4 py-3 text-center whitespace-nowrap font-semibold" dir="ltr">${product.discount_price || product.selling_price} DH</td>
                <td class="px-4 py-3 text-center whitespace-nowrap">${product.qte || ''}</td>
                <td class="px-4 py-3 text-center">
                    <select id="productVisibilitySelector"
                        class="bg-gray-100 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        onchange="changeProductVisibility(${product.id}, this)"
                        data-previous-value="${product.is_visible}">
                        <option value="1" ${product.is_visible == 1 ? "selected" : ""}>مرئي</option>
                        <option value="0" ${product.is_visible == 0 ? "selected" : ""}>غير مرئي</option>
                    </select>
                </td>
                <!--<td class="px-4 py-3 text-center whitespace-nowrap">${new Date(product.created_at).toLocaleDateString()}</td>-->
                <td class="px-4 py-3 text-center whitespace-nowrap">${product.category.label || "----"}</td>
                <td class="px-4 py-3 text-center">
                    <div class="flex items-center justify-center gap-2">
                        <a href="newProduct.php?id=${product.id}&action=edit"
                            class="bg-blue-500 text-white px-3 py-1.5 rounded-full hover:bg-blue-600 transition">
                            <i class="fas fa-edit"></i>
                        </a>
                        <button onclick="deleteProduct(${product.id})" class="bg-red-500 text-white px-3 py-1.5 rounded-full hover:bg-red-600 transition">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

                tableBody.appendChild(row);
            });
            $('#productsTable').DataTable().destroy();
            // Initialize DataTable FIRST
            const table = $('#productsTable').DataTable({
                dom: 't', // إخفاء عناصر التحكم الافتراضية
                paging: true,
                searching: true,
                info: false, // تفعيل معلومات العناصر
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
            $('#productsTable-search').on('keyup', function () {
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
        } else {
            tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-orange-500 font-semibold bg-orange-50 border border-orange-200">لايوجد أي منتج حاليا</td></tr>`;
        }

    } catch (response) {
        errorsHandler(response.status)
        tableBody.innerHTML = `
          <tr>
            <td colspan="100%" class="py-6 text-center text-red-500 font-semibold bg-red-50 border border-red-200 rounded">
                ⚠️ هناك مشكلة في الخادم، يرجى المحاولة لاحقًا أو التواصل مع الدعم الفني.
            </td>
          </tr>
        `;
    }
}

async function deleteProduct(id) {
    const confirmDelete = await Swal.fire({
        icon: "warning",
        title: "تأكيد الحذف",
        text: "هل أنت متأكد أنك تريد حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء!",
        showCancelButton: true,
        confirmButtonText: "نعم، احذف",
        cancelButtonText: "إلغاء",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
        const response = await fetch(apiUrl + `/product/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        });

        if (!response.ok) {
            throw response;
        }

        await Swal.fire({
            icon: "success",
            title: "تم حذف المنتج",
            text: "تم حذف المنتج بنجاح",
            showConfirmButton: false,
            timer: 1200,
        });

        // Destroy the DataTable instance before fetching products
        const dataTableInstance = $('#productsTable').DataTable();
        if (dataTableInstance) {
            dataTableInstance.destroy();
        }
        fetchProducts(); // Refresh product list after successful deletion

    } catch (response) {
        errorsHandler(response.status || 500);
    }
}

async function changeProductVisibility(id, selectElement) {
    const previousValue = selectElement.dataset.previousValue || selectElement.value; // Store the initial value

    const confirmChange = await Swal.fire({
        icon: "warning",
        title: "تأكيد التغيير",
        text: "الرؤية لهذا المنتج ستتغير، هل أنت متأكد؟",
        showCancelButton: true,
        confirmButtonText: "نعم",
        cancelButtonText: "إلغاء",
    });

    if (!confirmChange.isConfirmed) {
        selectElement.value = previousValue; // Restore the previous value on cancel
        return;
    }

    try {
        const response = await fetch(apiUrl + `/product/${id}/edit`, {
            method: "POST", // Use PUT for updates
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({ is_visible: selectElement.value }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw { status: response.status, message: errorData.message || "حدث خطأ" };
        }

        await Swal.fire({
            icon: "success",
            title: "تغيرت حالة المنتج",
            text: "تم تغيير حالة المنتج بنجاح",
            showConfirmButton: false,
            timer: 1200,
        });

        selectElement.dataset.previousValue = selectElement.value; // Update previous value after success

    } catch (error) {
        errorsHandler(error.status || 500);
        selectElement.value = previousValue; // Restore previous value on error
    }
}