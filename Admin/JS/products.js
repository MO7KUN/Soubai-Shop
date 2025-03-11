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
        const response = await fetch("http://e_sahara.test/api/products",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const products = await response.json();

        // if (!Array.isArray(products)) {
        //     throw new Error("Unexpected API response format.");
        // }

        console.log(products)

        tableBody.innerHTML = ""; // Clear existing content
        if (products.data.length > 0) {
            products.data.forEach(product => {
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
                    <select id="productVisibilitySelector" class="bg-gray-100 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300" onchange="changeProductVisibility(${product.id})" >
                        <option value="1" ${product.is_visible == 1 ? "selected" : ""}>مرئي</option>
                        <option value="0" ${product.is_visible == 0 ? "selected" : ""}>غير مرئي</option>
                    </select>
                </td>
                <!--<td class="px-4 py-3 text-center whitespace-nowrap">${new Date(product.created_at).toLocaleDateString()}</td>-->
                <td class="px-4 py-3 text-center whitespace-nowrap">${product.category.label || "----"}</td>
                <td class="px-4 py-3 text-center">
                    <div class="flex items-center justify-center gap-2">
                        <a href="NewProduct.html?id=${product.id}&action=edit"
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
            // Initialize DataTable FIRST
            const table = $('#productsTable').DataTable({
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
            tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-3">لايوجد أي منتج حاليا</td></tr>`;
        }

    } catch (error) {
        console.error("Error fetching products:", error);
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-red-500 py-3">فشل تحميل المنتجات.</td></tr>`;
    }
}

function deleteProduct(id) {
    if (confirm("Voulez vous vraiment supprimé ce produit?")) {
        fetch(`http://e_sahara.test/api/product/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    fetchProducts();
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred. Please try again later.");
            });
    }
}

function changeProductVisibility(id) {
    console.log(id);
    if (confirm("الرؤية لهذا المنتج ستتغير، هل أنت متأكد؟")) {
        fetch(`http://e_sahara.test/api/product/${id}/edit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({
                is_visible: document.getElementById("productVisibilitySelector").value,
            }),
        })
            .then((response) => response.status)
        if (response.status == 200) {
            fetchProducts();
        } else {
            alert("Un erreur c'est produit, veuiillez réessayer plus tard.");
        }

        // .then((data) => {
        //     if (data.success) {
        //         fetchProducts();
        //     } else {
        //         alert(data.message);
        //     }
        // })
        // .catch((error) => {
        //     console.error("Error:", error);
        //     alert("An error occurred. Please try again later.");
        // });
    }
}