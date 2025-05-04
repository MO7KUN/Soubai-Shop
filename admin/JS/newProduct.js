let apiUrl = "https://sbaishop.com/api"

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const action = urlParams.get('action');

    if (action === 'edit' && productId) {
        await showProductInfos(productId);
        // Update page title and submit button
        document.title = "Edit Product";
        document.getElementById('submitButton').textContent = "تحديث المنتج";
    }
});

async function showProductInfos(productId) {
    try {
        const response = await fetch(apiUrl + `/product/${productId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': "Bearer " + token,
            },
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Try to parse error JSON, fallback to empty object
            throw { status: response.status, message: errorData.message || "حدث خطأ أثناء جلب المنتجات" };
        }
        const product = await response.json();

        // Fill main product fields
        document.getElementById('ref').value = product.ref || null;
        document.getElementById('label').value = product.label;
        if (product.category) {
            document.getElementById('category_id').value = product.category.id;
        }
        document.getElementById('buying_price').value = product.buying_price || null;
        document.getElementById('selling_price').value = product.selling_price;
        document.getElementById('discount_price').value = product.discount_price || null;
        document.getElementById('qte').value = product.qte || null;
        document.getElementById('description').value = product.description || null;
        document.getElementById('is_visible').checked = product.is_visible;

        // Handle product image preview
        if (product.image_url) {
            const imagePreview = document.createElement('img');
            imagePreview.src = product.image_url;
            imagePreview.classList.add('w-32', 'h-32', 'object-cover', 'mt-2');
            document.getElementById('image').parentNode.appendChild(imagePreview);
        }

        // Handle variants
        // if (product.variants_products.length > 0) {
        //     document.getElementById('toggleVariants').checked = true;
        //     document.getElementById('variantsSection').classList.remove('hidden');

        //     product.variants_products.forEach(variant => {
        //         // Set variant type (assuming single variant type for simplicity)
        //         document.getElementById('optionName').value = product.variants_type || 'Variant';



        //         // Add variant value
        //         addVariantValue(variant.libelle);
        //         updateVariantOptions();

        //         // Find the created variant row and fill details
        //         const rows = document.querySelectorAll('[data-value]');
        //         const lastRow = rows[rows.length - 1];

        //         lastRow.querySelector('input[placeholder="الكمية"]').value = variant.qte || '';
        //         lastRow.querySelector('input[placeholder="سعر البيع"]').value = variant.selling_price;
        //         lastRow.querySelector('input[placeholder="سعر الخصم"]').value = variant.discount_price || '';
        //         lastRow.querySelector('.variant-is-visible').checked = variant.is_visible;

        //         // Handle variant image preview
        //         if (variant.image_url) {
        //             const img = lastRow.querySelector('img');
        //             img.src = variant.image_url;
        //             img.classList.remove('hidden');
        //         }
        //     });
        // }
    } catch (error) {
        console.error("❌ Error fetching product infos:", error); // Log the full error for debugging
        errorsHandler(error.status || 500);
        throw new Error(`Error occurred while fetching product infos: ${error.message}`);
    }
}

// async function saveProduct() {

//     const urlParams = new URLSearchParams(window.location.search);
//     const productId = urlParams.get('id');
//     const isEditMode = urlParams.get('action') === 'edit';

//     // Select main inputs
//     const ref = document.getElementById('ref');
//     const label = document.getElementById('label');
//     const category_id = document.getElementById('category_id');
//     const buying_price = document.getElementById('buying_price');
//     const selling_price = document.getElementById('selling_price');
//     const discount_price = document.getElementById('discount_price');
//     const qte = document.getElementById('qte');
//     const image = document.getElementById('image');
//     const description = document.getElementById('description');
//     const is_visible = document.getElementById('is_visible');
//     const variantsContainer = document.getElementById('variantsContainer');

//     // Reset validation errors
//     document.querySelectorAll('.border-red-500').forEach(el => el.classList.remove('border-red-500'));

//     let isValid = true;

//     // Validate required fields
//     [label, category_id, selling_price, is_visible].forEach(input => {
//         if (!input.value.trim()) {
//             input.classList.add('border-red-500');
//             isValid = false;
//         }
//     });

//     // Prepare FormData
//     const formData = new FormData();

//     // Append main product data
//     formData.append('ref', ref.value.trim());
//     formData.append('label', label.value.trim());
//     formData.append('category_id', category_id.value);
//     formData.append('selling_price', selling_price.value);
//     formData.append('is_visible', is_visible.checked ? 1 : 0);

//     // Append optional fields
//     if (buying_price.value) formData.append('buying_price', buying_price.value);
//     if (discount_price.value) formData.append('discount_price', discount_price.value);
//     if (qte.value) formData.append('qte', qte.value);
//     if (description.value) formData.append('description', description.value);
//     if (image.files[0]) formData.append('image', image.files[0]);

//     // Handle variants
//     // Handle variants
//     const variantRows = document.querySelectorAll('.variant-row');
//     let variantIndex = 0;

//     variantRows.forEach(row => {
//         const libelle = row.getAttribute('data-value');
//         const optionType = row.getAttribute('data-option-type');

//         // Get all field values
//         const fields = {
//             qte: row.querySelector('.variant-qte')?.value || '',
//             selling_price: row.querySelector('.variant-selling-price')?.value || '',
//             discount_price: row.querySelector('.variant-discount-price')?.value || '',
//             is_visible: row.querySelector('.variant-is-visible')?.checked ? 1 : 0,
//             image: row.querySelector('.variant-image')?.files[0]
//         };

//         // Validate required fields
//         if (!libelle) {
//             row.classList.add('border-red-500');
//             isValid = false;
//             return;
//         }

//         // Append to FormData
//         formData.append(`variants[${variantIndex}][option_type]`, optionType);
//         formData.append(`variants[${variantIndex}][libelle]`, libelle);

//         Object.entries(fields).forEach(([key, value]) => {
//             if (key === 'image' && value) {
//                 formData.append(`variants[${variantIndex}][image]`, value);
//             } else if (key !== 'image') {
//                 formData.append(`variants[${variantIndex}][${key}]`, value);
//             }
//         });

//         variantIndex++;
//     });

//     if (!isValid) {
//         alert('الرجاء ملء جميع الحقول المطلوبة (المميزة باللون الأحمر)');
//         return;
//     }

//     try {
//         const url = isEditMode
//             ? apiUrl+`/product/${productId}/edit`
//             : apiUrl+'/product';
//         const response = await fetch(url, {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'Accept': 'application/json',
//             },
//         });

//         const result = await response.json();

//         if (response.ok) {
//             alert('تم حفظ المنتج بنجاح!');
//             // window.location.reload();
//         } else {
//             alert('خطأ في الحفظ: ' + (result.message || JSON.stringify(result.errors)));
//         }
//     } catch (error) {
//         alert('خطأ في الشبكة: ' + error.message);
//     }
// }

async function saveProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const isEditMode = urlParams.get('action') === 'edit';

    // Select main inputs
    const ref = document.getElementById('ref');
    const label = document.getElementById('label');
    const category_id = document.getElementById('category_id');
    const buying_price = document.getElementById('buying_price');
    const selling_price = document.getElementById('selling_price');
    const discount_price = document.getElementById('discount_price');
    const qte = document.getElementById('qte');
    const image = document.getElementById('image');
    const description = document.getElementById('description');
    const is_visible = document.getElementById('is_visible');
    const variantsContainer = document.getElementById('variantsContainer');

    // Reset validation errors
    document.querySelectorAll('.border-red-500').forEach(el => el.classList.remove('border-red-500'));

    let isValid = true;

    // Validate required fields
    [label, category_id, selling_price, is_visible].forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('border-red-500');
            isValid = false;
        }
    });

    // Prepare FormData
    const formData = new FormData();

    // Append main product data
    formData.append('ref', ref.value.trim());
    formData.append('label', label.value.trim());
    formData.append('category_id', category_id.value);
    formData.append('selling_price', selling_price.value);
    formData.append('is_visible', is_visible.checked ? 1 : 0);

    // Append optional fields
    if (buying_price.value) formData.append('buying_price', buying_price.value);
    if (discount_price.value) formData.append('discount_price', discount_price.value);
    if (qte.value) formData.append('qte', qte.value);
    if (description.value) formData.append('description', description.value);
    if (image.files[0]) formData.append('image', image.files[0]);

    // Handle variants
    // const variantRows = document.querySelectorAll('.variant-row');
    // let variantIndex = 0;

    // variantRows.forEach((row, index) => {
    //     const libelle = row.getAttribute('data-value');
    //     const optionType = row.getAttribute('data-option-type');
    //     const variantId = row.getAttribute('data-variant-id')

    //     // Get all field values
    //     const fields = {
    //         qte: row.querySelector('.variant-qte')?.value || '',
    //         selling_price: row.querySelector('.variant-selling-price')?.value || '',
    //         discount_price: row.querySelector('.variant-discount-price')?.value || '',
    //         is_visible: row.querySelector('.variant-is-visible')?.checked ? 1 : 0,
    //         image: row.querySelector('.variant-image')?.files[0]
    //     };

    //     // Validate required fields
    //     if (!libelle) {
    //         row.classList.add('border-red-500');
    //         isValid = false;
    //         return;
    //     }

    //     // Append to FormData
    //     // formData.append(`variants[${variantId}][id]`, variantId); // Include ID
    //     formData.append(`variants[${index}][id]`, variantId);
    //     formData.append(`variants[${variantId}][option_type]`, optionType);
    //     formData.append(`variants[${variantId}][libelle]`, libelle);

    //     Object.entries(fields).forEach(([key, value]) => {
    //         if (key === 'image' && value) {
    //             formData.append(`variants[${variantId}][image]`, value);
    //         } else if (key !== 'image') {
    //             formData.append(`variants[${variantId}][${key}]`, value);
    //         }
    //     });

    //     variantIndex++;
    // });

    if (!isValid) {
        alert('الرجاء ملء جميع الحقول المطلوبة (المميزة باللون الأحمر)');
        Swal.fire({
            icon: "error",
            title: "خطأ",
            text: 'الرجاء ملء جميع الحقول المطلوبة (المميزة باللون الأحمر)',
        });
        return;
    }

    try {
        const url = isEditMode
            ? apiUrl + `/product/${productId}/edit`
            : apiUrl + '/product';

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                // "Content-Type": "application/json",
                'Authorization': "Bearer " + token,
            },
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "تم تسجيل الطلب بنجاح",
                text: "تم تسجيل معلومات الطلب بنجاح",
                showConfirmButton: false,
                timer: 1200, // The timer is 1200 ms (1.2 seconds)
            }).then(() => {
                window.location.reload();
            })
        } else {
            const errorData = await response.json().catch(() => ({})); // Try to parse error JSON, fallback to empty object
            throw { status: response.status, message: errorData.message || "حدث خطأ أثناء جلب المنتجات" };
        }
    } catch (error) {
        console.error("❌ Error saving product:", error); // Log the full error for debugging
        errorsHandler(error.status || 500);
        throw new Error(`Error occurred while saving product: ${error.message}`);
    }
}

async function fetchCategorys() {

    fetch(apiUrl + '/categorys', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw response; // Throw the response to handle errors
            }
            return response.json();
        })
        .then(data => {
            console.log('API response:', data); // Log the response for debugging

            const categorysSelectElement = document.getElementById('category_id');
            categorysSelectElement.innerHTML = ''; // Clear previous options
            if (data.categories.length > 0) {
                data.categories.forEach(category => {
                    const categoryElement = document.createElement('option');
                    categoryElement.value = category.id;
                    categoryElement.textContent = category.label;
                    categorysSelectElement.appendChild(categoryElement);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.json) {
                // Handle API errors (e.g., 401, 403, 500)
                error.json().then(err => {
                    console.error('API error:', err);
                    // if (error.status === 401 || error.status === 403) {
                    //     window.location.href = "index.html"; // Redirect if unauthorized
                    // } else {
                    //     document.getElementById('error-message').classList.remove('hidden'); // Show error message
                    // }
                });
            } else {
                // Handle network errors (e.g., no internet connection)
                console.error('Network error:', error);
                document.getElementById('error-message').classList.remove('hidden'); // Show error message
            }
        });
}
document.addEventListener('DOMContentLoaded', () => {
    // Fetch categories from the API
    fetchCategorys();
})

async function addCategory() {
    const categoryNameInput = document.getElementById("categoryName");
    const categoryImageInput = document.getElementById("fileInput2");

    const categoryName = categoryNameInput.value.trim();
    const categoryImageFile = categoryImageInput.files[0];

    // Validate Category Name
    if (!categoryName) {
        return Swal.fire({
            icon: "error",
            title: "خطأ",
            text: "يرجى إدخال اسم الفئة",
        });
    }

    // Validate Image Size
    if (categoryImageFile && categoryImageFile.size > 2048 * 1024) {
        return Swal.fire({
            icon: "error",
            title: "خطأ",
            text: "صورة الفئة يجب أن تكون أقل من 2MB",
        });
    }

    try {
        // Prepare FormData
        const formData = new FormData();
        formData.append("label", categoryName);
        if (categoryImageFile) {
            formData.append("image", categoryImageFile, categoryName + ".jpg");
        }

        const response = await fetch(apiUrl + "/category", {
            method: "POST",
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });

        const data = await response.json().catch(() => ({})); // Handle invalid JSON response

        if (!response.ok) {
            if (response.status === 422) {
                if (data.errors?.label?.includes("has already been taken")) {
                    return Swal.fire({
                        icon: "error",
                        title: "خطأ",
                        text: "اسم الفئة مستخدم من قبل",
                    });
                } else {
                    return Swal.fire({
                        icon: "error",
                        title: "خطأ",
                        text: "البيانات غير صالحة، يرجى التحقق من المدخلات",
                    });
                }
            } else if (response.status === 500) {
                return Swal.fire({
                    icon: "error",
                    title: "خطأ داخلي",
                    text: "خطأ داخلي في الخادم، يرجى المحاولة لاحقًا",
                });
            } else {
                errorsHandler(response.status);
            }
        }

        // Success Message
        Swal.fire({
            icon: "success",
            title: "تم التسجيل",
            text: "تم تسجيل معلومات الفئة بنجاح",
            showConfirmButton: false,
            timer: 1200,
        }).then(() => {
            fetchCategorys()
            closeAddCategoryModal();
        });

    } catch (error) {
        console.error("❌ حدث خطأ:", error);
        Swal.fire({
            icon: "error",
            title: "خطأ",
            text: "تعذر تسجيل الفئة، يرجى المحاولة لاحقًا",
        });
    }
}

// Function to open the update modal
function openAddCategoryModal() {
    document.getElementById("addCategoryModal").classList.remove("hidden");
}

// Function to close the AddCategory modal
function closeAddCategoryModal() {
    document.getElementById("addCategoryModal").classList.add("hidden");
}

// Image upload and preview
var loadFile = function (event, uploaderId) {
    var input = event.target;
    var file = input.files[0];
    var output = document.getElementById("preview_img" + uploaderId);
    var deleteButton = document.getElementById("deleteButton" + uploaderId);

    if (file) {
        output.src = URL.createObjectURL(file);
        output.onload = function () {
            URL.revokeObjectURL(output.src); // Free memory
            deleteButton.classList.remove("hidden");
        };
    }
};