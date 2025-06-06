<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>إضافة منتج - Soubai Shop</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
    body {
        font-family: 'Tajawal', sans-serif;
        padding-top: 64px;
    }

    /* Add padding for navbar */
    </style>
</head>

<body class="bg-gray-100 text-black flex flex-col min-h-screen">
    <?php include 'components/header.html'; ?>

    <!-- Main Content -->
    <div class="p-6 md:mr-64">
        <!-- Add margin-top for navbar -->
        <h1 class="text-center text-2xl font-bold text-gray-800 mb-4">
            <i class="fas fa-plus text-yellow-400"></i> إضافة منتج
        </h1>

        <!-- New Product Form -->
        <div class="bg-white rounded-lg shadow p-6">
            <div>
                <div class="flex flex-col sm:flex-row w-full gap-2">
                    <!-- Product Name -->
                    <div class="mb-4 sm:w-3/4">
                        <label for="label" class="block text-gray-700 mb-2">اسم المنتج<span
                                class="text-red-500 text-sm">*</span></label>
                        <input id="label" type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            placeholder="أدخل اسم المنتج" required>
                    </div>

                    <!-- Category (Dropdown Menu) -->
                    <div class="sm:w-1/4 mb-4">
                        <label for="category" class="block text-gray-700 mb-2">الفئة<span
                                class="text-red-500 text-sm">*</span></label>
                        <div class="flex flex-row gap-2 ">
                            <select id="category_id"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                required>
                                <option value>اختر الفئة</option>
                                <!-- Categorys here -->
                            </select>
                            <button onclick="openAddCategoryModal()" type="button"
                                class="px-2 py-1 leading-5 text-yellow-500 transition-colors duration-200 transform bg-transparent border-2 border-blue-500 rounded-lg hover:bg-yellow-500 hover:text-white focus:outline-none focus:bg-gray-600 font-semibold">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex flex-row w-full gap-2">
                    <!-- Status -->
                    <div class="mb-4 w-full">
                        <label for="is_visible" class="block text-gray-700 mb-2">الحالة <span
                                class="text-red-500 text-sm">*</span></label>
                        <select id="is_visible"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            required>
                            <option value="1" selected>مرئي</option>
                            <option value="0">غير مرئي</option>
                        </select>
                    </div>

                    <!-- Barcode Numbers -->
                    <div class="mb-4 w-full">
                        <label for="ref" class="block text-gray-700 mb-2">رقم
                            الباركود</label>
                        <input id="ref" type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            placeholder="أدخل أرقام الباركود" required>
                    </div>
                </div>

                <!-- prices -->
                <div class="flex flex-col sm:flex-row gap-2 w-full">
                    <!-- buying price -->
                    <div class="mb-4 w-full">
                        <label for="buying_price" class="block text-gray-700 mb-2">سعر الشراء</label>
                        <input id="buying_price" type="number"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            placeholder="أدخل السعر" required>
                    </div>
                    <!-- Price -->
                    <div class="mb-4 w-full">
                        <label for="selling_price" class="block text-gray-700 mb-2">سعر البيع<span
                                class="text-red-500 text-sm">*</span></label>
                        <input id="selling_price" type="number"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            placeholder="أدخل السعر" required>
                    </div>

                    <!-- Discount -->
                    <div class="mb-4 w-full">
                        <label for="discount_price" class="block text-gray-700 mb-2">سعر التخفيض</label>
                        <input id="discount_price" type="number"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            placeholder="أدخل السعر" required>
                    </div>
                </div>

                <!-- Quantity -->
                <div class="mb-4 w-full">
                    <label for="qte" class="block text-gray-700 mb-2">الكم</label>
                    <input id="qte" type="number"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="أدخل الكمية" required>
                </div>

                <!-- Picture -->
                <div class="mb-4">
                    <label class="block text-gray-700 mb-2">صورة المنتج</label>
                    <div id="dropZone"
                        class="w-full flex flex-col items-center justify-center px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer">
                        <svg class="w-12 h-12 text-gray-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 16V12m0 0V8m0 4h4m6 0V8m0 4v4m0-4h-4m0 4H7m4-8V4m0 0L3 12m8-8l8 8" />
                        </svg>
                        <p class="text-gray-500 text-sm">اسحب الصورة هنا أو انقر لاختيار ملف</p>
                        <input id="image" type="file" class="hidden" accept="image/*">
                    </div>
                    <div id="previewContainer" class="mt-4 hidden">
                        <img id="previewProductImage" class="w-full max-w-xs rounded-lg shadow-md">
                        <button id="removeImage" class="mt-2 text-red-500 text-sm">❌ إزالة الصورة</button>
                    </div>
                </div>

                <script>
                const dropZone = document.getElementById("dropZone");
                const fileInput = document.getElementById("image");
                const previewContainer = document.getElementById("previewContainer");
                const previewProductImage = document.getElementById("previewProductImage");
                const removeImage = document.getElementById("removeImage");

                dropZone.addEventListener("click", () => fileInput.click());

                fileInput.addEventListener("change", function() {
                    if (this.files.length > 0) {
                        previewFile(this.files[0]);
                    }
                });

                dropZone.addEventListener("dragover", (event) => {
                    event.preventDefault();
                    dropZone.classList.add("border-yellow-400", "bg-yellow-100");
                });

                dropZone.addEventListener("dragleave", () => {
                    dropZone.classList.remove("border-yellow-400", "bg-yellow-100");
                });

                dropZone.addEventListener("drop", (event) => {
                    event.preventDefault();
                    dropZone.classList.remove("border-yellow-400", "bg-yellow-100");

                    if (event.dataTransfer.files.length > 0) {
                        // Use DataTransfer to assign file properly
                        const dt = new DataTransfer();
                        dt.items.add(event.dataTransfer.files[0]);
                        fileInput.files = dt.files;

                        previewFile(event.dataTransfer.files[0]);
                    }
                });

                function previewFile(file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        previewProductImage.src = e.target.result; // ✅ Fixed variable name
                        previewContainer.classList.remove("hidden");
                        dropZone.classList.add("hidden");
                    };
                    reader.readAsDataURL(file);
                }

                removeImage.addEventListener("click", () => {
                    fileInput.value = "";
                    previewContainer.classList.add("hidden");
                    dropZone.classList.remove("hidden");
                });
                </script>


                <!-- description -->
                <div class="mb-4">
                    <label for="description" class="block text-gray-700 mb-2">الوصف</label>
                    <textarea id="description"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="أدخل وصف المنتج" required></textarea>
                </div>

                <!-- Variants -->
                <!-- <div class="bg-white p-5 rounded-lg shadow-md w-full mb-4">
                    <div class="flex items-center justify-between border-b pb-2 mb-4">
                        <h2 class="text-lg font-semibold">المتغيرات</h2>
                        <input dir="ltr"
                            class="inpt mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0_0_0_/_4%)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] bg-neutral-600 after:bg-neutral-400 checked:bg-blue-800 checked:after:bg-blue-500 focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                            type="checkbox" role="switch" id="toggleVariants" />
                    </div>

                    <div id="variantsSection" class="hidden space-y-4">
                        <div class="border p-4 rounded-lg">
                            <div class="flex flex-col space-y-2">
                                <input type="text" id="optionName" class="w-full p-2 border rounded-lg"
                                    placeholder="مثال: الحجم">

                                <div class="flex flex-wrap gap-2 border p-2 rounded-lg min-h-[42px]"
                                    id="valueContainer">
                                    <input type="text" id="optionValues"
                                        class="p-2 border rounded-lg flex-grow outline-none"
                                        placeholder="اكتب القيم واضغط ',' للإضافة">
                                </div>
                            </div>
                        </div>

                        <div id="variantsContainer" class="space-y-4"></div>
                    </div>
                </div>

                <script>
                    document.getElementById("toggleVariants").addEventListener("change", function () {
                        document.getElementById("variantsSection").classList.toggle("hidden", !this.checked);
                    });

                    let variantValues = [];

                    document.getElementById("optionValues").addEventListener("input", function (event) {
                        let inputValue = event.target.value.trim();
                        if (inputValue.endsWith(",")) {
                            let cleanValue = inputValue.slice(0, -1).trim();
                            if (cleanValue && !variantValues.includes(cleanValue)) {
                                addVariantValue(cleanValue);
                            }
                            event.target.value = "";
                        }
                    });

                    function addVariantValue(value) {
                        variantValues.push(value);
                        updateVariantValueDisplay();
                        updateVariantOptions();
                    }

                    function removeVariantValue(value) {
                        variantValues = variantValues.filter(v => v !== value);
                        updateVariantValueDisplay();
                        updateVariantOptions();
                    }

                    function updateVariantValueDisplay() {
                        let container = document.getElementById("valueContainer");
                        container.innerHTML = "";

                        variantValues.forEach(value => {
                            let span = document.createElement("span");
                            span.classList.add("bg-blue-500", "text-white", "px-2", "py-1", "rounded-full", "flex", "items-center", "gap-1", "cursor-pointer");
                            span.innerHTML = `${value} <span onclick="removeVariantValue('${value}')" class="text-sm font-bold">×</span>`;
                            container.appendChild(span);
                        });

                        let input = document.createElement("input");
                        input.type = "text";
                        input.id = "optionValues";
                        input.classList.add("p-2", "border", "rounded-lg", "flex-grow", "outline-none");
                        input.placeholder = "اكتب القيم واضغط ',' للإضافة";
                        input.addEventListener("input", function (event) {
                            let inputValue = event.target.value.trim();
                            if (inputValue.endsWith(",")) {
                                let cleanValue = inputValue.slice(0, -1).trim();
                                if (cleanValue && !variantValues.includes(cleanValue)) {
                                    addVariantValue(cleanValue);
                                }
                                event.target.value = "";
                            }
                        });

                        container.appendChild(input);
                    }

                    function updateVariantOptions() {
                        const optionName = document.getElementById("optionName").value.trim();
                        if (!optionName) return;

                        let container = document.getElementById("variantsContainer");
                        let existingSection = container.querySelector(`[data-option="${optionName}"]`);

                        // Create section if it doesn't exist
                        if (!existingSection) {
                            existingSection = document.createElement("div");
                            existingSection.classList.add("border", "p-4", "rounded-lg", "variant-option-group");
                            existingSection.setAttribute("data-option", optionName);
                            container.appendChild(existingSection);

                            // Add title
                            const title = document.createElement("h3");
                            title.className = "font-semibold mb-2";
                            title.textContent = optionName;
                            existingSection.appendChild(title);
                        }

                        // Get existing rows
                        const existingRows = existingSection.querySelectorAll('.variant-row');
                        const existingValues = Array.from(existingRows).map(row =>
                            row.getAttribute('data-value').trim()
                        );

                        // Remove deleted values
                        existingRows.forEach(row => {
                            const value = row.getAttribute('data-value').trim();
                            if (!variantValues.includes(value)) {
                                row.remove();
                            }
                        });

                        // Add new values
                        variantValues.forEach(value => {
                            if (!existingValues.includes(value)) {
                                const row = createVariantRow(value, optionName);
                                existingSection.appendChild(row);
                            }
                        });

                        // Update section title if changed
                        const title = existingSection.querySelector('h3');
                        if (title && title.textContent !== optionName) {
                            title.textContent = optionName;
                        }
                    }

                    function createVariantRow(value, optionName) {
                        const row = document.createElement("div");
                        row.classList.add("variant-row", "flex", "flex-col", "md:flex-row", "gap-2",
                            "items-center", "p-2", "border-b");
                        row.setAttribute("data-value", value.trim());
                        row.setAttribute("data-option-type", optionName.trim());

                        row.innerHTML = `
        <span class="w-full sm:w-1/6 font-semibold variant-label">${value}</span>
        <div class="w-full">
            <input type="file" class="variant-image file-input w-full" 
                accept="image/*" onchange="previewImage(event, this)">
            <img src="" class="hidden w-10 h-10 sm:w-12 sm:h-12 object-cover rounded" />
        </div>
        <input type="number" class="variant-qte w-full sm:w-1/6 p-2 border rounded-lg" 
            placeholder="الكمية" data-field="qte">
        <input type="number" class="variant-selling-price w-full sm:w-1/6 p-2 border rounded-lg" 
            placeholder="سعر البيع" data-field="selling_price" required>
        <input type="number" class="variant-discount-price w-full sm:w-1/6 p-2 border rounded-lg" 
            placeholder="سعر الخصم" data-field="discount_price">
        <div class="w-full sm:w-1/6 flex items-center gap-1">
            <input type="checkbox" class="variant-is-visible w-4 h-4" 
                data-field="is_visible" checked>
            <label class="text-sm">مرئي</label>
        </div>
    `;

                        return row;
                    }

                    function createVariantRow(value, optionName) {
                        const row = document.createElement("div");
                        row.classList.add("variant-row", "flex", "flex-col", "md:flex-row", "gap-2",
                            "items-center", "p-2", "border-b");

                        const tempId = `new_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                        row.setAttribute("data-variant-id", tempId);

                        row.setAttribute("data-value", value.trim());
                        row.setAttribute("data-option-type", optionName.trim());

                        row.innerHTML = `
        <span class="w-full sm:w-1/6 font-semibold variant-label">${value}</span>
        <div class="w-full">
            <input type="file" class="variant-image file-input w-full" 
                accept="image/*" onchange="previewImage(event, this)">
            <img src="" class="hidden w-10 h-10 sm:w-12 sm:h-12 object-cover rounded" />
        </div>
        <input type="number" class="variant-qte w-full sm:w-1/6 p-2 border rounded-lg" 
            placeholder="الكمية" data-field="qte">
        <input type="number" class="variant-selling-price w-full sm:w-1/6 p-2 border rounded-lg" 
            placeholder="سعر البيع" data-field="selling_price" required>
        <input type="number" class="variant-discount-price w-full sm:w-1/6 p-2 border rounded-lg" 
            placeholder="سعر الخصم" data-field="discount_price">
        <div class="w-full sm:w-1/6 flex items-center gap-1">
            <input type="checkbox" class="variant-is-visible w-4 h-4" 
                data-field="is_visible" checked>
            <label class="text-sm">مرئي</label>
        </div>
    `;

                        return row;
                    }

                    function previewImage(event, input) {
                        const img = input.nextElementSibling;
                        const file = event.target.files[0];

                        if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                                img.src = reader.result;
                                img.classList.remove("hidden");
                            };
                            reader.readAsDataURL(file);
                        }
                    }
                </script> -->


                <!-- Actions -->
                <div class="flex justify-end gap-4">
                    <button type="button"
                        class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300">
                        <i class="fas fa-times"></i> إلغاء
                    </button>
                    <button type="button" onclick="saveProduct()" id="submitButton"
                        class="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition duration-300">
                        <i class="fas fa-save"></i> حفظ المنتج
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div id="addCategoryModal"
        class="fixed inset-0 bg-black bg-opacity-50 hidden place-items-center h-screen grid justify-center items-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-96 p-6">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-gray-800 mb-4">تحديث
                    الفئة</h2>
                <button type="button" onclick="closeAddCategoryModal()"
                    class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"><i
                        class="fas fa-times"></i></button>
            </div>
            <!-- Error Message -->
            <div id="error-message1" class="hidden border border-red-500 rounded-lg p-4 mb-4">
                <p class="text-red-500">
                    <i class="fas fa-exclamation-triangle"></i>
                    حدث خطأ في الخادم، يرجى المحاولة مرة أخرى
                </p>
            </div>
            <div id="addCategoryForm">
                <div class="mb-4">
                    <label for="categoryName" class="block text-gray-700 mb-2">اسم الفئة</label>
                    <input type="text" id="categoryName"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required>
                    <p id="categoryNameError" class="text-red-500 mt-1"> </p>
                </div>
                <div class="mb-4">
                    <div class="relative w-full">
                        <label for="fileInput2"
                            class="cursor-pointer w-full h-full rounded-sm flex items-center justify-center bg-gray-100 ">
                            <img id="preview_img2" class="h-32 w-full object-contain rounded-sm p-0"
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Plus_symbol.svg/500px-Plus_symbol.svg.png"
                                alt />
                            <div
                                class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 rounded-sm opacity-0 hover:opacity-100 transition-opacity">
                                <span class="text-white text-3xl">+</span>
                            </div>
                        </label>
                        <button type="button" id="deleteButton2"
                            class="hidden absolute top-0 right-0 p-0 text-yellow-500 font-black shadow-lg"
                            onclick="deleteImage(2)">
                            <span class="sr-only">Delete</span>
                            <span class="text-lg">&times;</span>
                        </button>
                        <input id="fileInput2" name="fileInput2" type="file" accept="image/*"
                            onchange="loadFile(event, 2)" hidden>
                    </div>
                    <p id="categoryImageError" class="text-red-500 hidden mt-1"> الصورة لا يجب ان
                        تتخطى 2 ميغابايت </p>
                </div>
                <div class="flex justify-end gap-4">
                    <button type="submit" onclick="addCategory()"
                        class="bg-green-400 text-black px-4 py-2 rounded-lg hover:bg-green-500 transition duration-300"><i
                            class="fas fa-save"></i></button>
                </div>
            </div>
        </div>
    </div>


    <script>
    document.addEventListener('DOMContentLoaded', function() {
        sidebarHandler("gererProducts");
    })
    </script>
    <script src="JS/newProduct.js"></script>
</body>

</html>