<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>المنتجات - Soubai Shop</title>
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

        <div class="flex justify-between align-center items-center mb-6">
            <h1 class="text-center text-2xl font-bold text-gray-800 mb-4">
                <i class="fas fa-box text-yellow-400"></i> المنتجات
            </h1>
            <!-- Add Product Button -->
            <a href="NewProduct.html">
                <button
                    class="w-full md:w-auto bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 whitespace-nowrap">
                    <i class="fas fa-plus"></i> إضافة منتج
                </button>
            </a>
        </div>

        <!-- Products Table -->
        <div class="overflow-x-auto bg-white rounded-lg shadow">
            <div class="bg-white p-6 rounded-lg shadow-md">
                <!-- Controls -->
                <div class="flex flex-col sm:flex-row gap-4 mb-4">
                    <input type="text" id="productsTable-search" placeholder="ابحث عن طلب..."
                        class="w-full p-2 border rounded-lg">
                </div>
                <!-- Table -->
                <div class="overflow-x-auto rounded-lg border">
                    <table class="w-full border-collapse text-right" id="productsTable">
                        <thead>
                            <tr class="bg-gray-200">
                                <th class="px-4 py-2 text-center whitespace-nowrap">الصورة</th>
                                <th class="px-4 py-2 text-center whitespace-nowrap">رقم
                                    الباركود</th>
                                <th class="px-4 py-2 text-center whitespace-nowrap">اسم
                                    المنتج</th>
                                <th class="px-4 py-2 text-center whitespace-nowrap">السعر</th>
                                <th class="px-4 py-2 text-center whitespace-nowrap">الكمية
                                    المتاحة</th>
                                <th class="px-4 py-2 text-center whitespace-nowrap">الحالة</th>
                                <!-- <th class="px-4 py-2 text-center whitespace-nowrap">تاريخ
                            الإضافة</th> -->
                                <th class="px-4 py-2 text-center whitespace-nowrap">الفئة</th>
                                <th class="px-4 py-2 text-center whitespace-nowrap">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody id="products-table">
                            <!-- Product 1 -->
                            <tr>
                                <td colspan="7" class="text-center">
                                    <div id="loadingAnimation" class="text-blue-500 mt-8 mb-6 items-center" dir="rtl">
                                        <i class="fa-solid fa-spinner fa-spin fa-2x"></i>
                                        <span class="ml-2">تحميل...</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div id="customPagination" class="flex items-center justify-end gap-2 mt-2">
                    <button id="prevPage"
                        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
                        السابق
                    </button>
                    <span id="pageInfo" class="text-gray-800 font-semibold">
                        الصفحة 1
                    </span>
                    <button id="nextPage"
                        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
                        التالي
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Update Modal -->
    <div id="update-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden justify-center items-center">
        <div class="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-96">
            <h2 class="text-xl font-bold text-gray-800 mb-4">تحديث
                المنتج</h2>
            <form id="update-form" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Name -->
                <div class="col-span-1 md:col-span-2">
                    <label for="update-product-name" class="block text-gray-700 mb-2">اسم المنتج</label>
                    <input id="update-product-name" type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        readonly>
                </div>
                <!-- Price -->
                <div>
                    <label for="update-product-price" class="block text-gray-700 mb-2">السعر</label>
                    <input id="update-product-price" type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required>
                </div>
                <!-- Quantity -->
                <div>
                    <label for="update-product-quantity" class="block text-gray-700 mb-2">الكمية</label>
                    <input id="update-product-quantity" type="number"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required>
                </div>
                <!-- Status -->
                <div>
                    <label for="update-product-status" class="block text-gray-700 mb-2">الحالة</label>
                    <select id="update-product-status"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                        <option value="active">نشط</option>
                        <option value="inactive">غير نشط</option>
                        <option value="out_of_stock">غير متوفر</option>
                    </select>
                </div>
                <!-- Date -->
                <div>
                    <label for="update-product-date" class="block text-gray-700 mb-2">تاريخ
                        الإضافة</label>
                    <input id="update-product-date" type="date"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required>
                </div>
                <!-- Category -->
                <div>
                    <label for="update-product-category" class="block text-gray-700 mb-2">الفئة</label>
                    <input id="update-product-category" type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required>
                </div>
                <!-- Image -->
                <div class="col-span-1 md:col-span-2">
                    <label for="update-product-image" class="block text-gray-700 mb-2">صورة المنتج</label>
                    <input id="update-product-image" type="file"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                </div>
                <!-- Buttons -->
                <div class="col-span-1 md:col-span-2 flex justify-end gap-4">
                    <button type="button" onclick="closeUpdateModal()"
                        class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                        إلغاء
                    </button>
                    <button type="submit" class="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500">
                        حفظ
                    </button>
                </div>
            </form>
        </div>
    </div>
    <script>
    document.addEventListener("DOMContentLoaded", function() {
        sidebarhandeler("gererProducts");
    })
    </script>
    <!-- data table -->
    <script src="includes/jquery-3.7.0.js"></script>
    <script src="includes/jquery.dataTables.min.js"></script>
    <script src="includes/datatables.tailwind.js"></script>
    <script src="JS/products.js"></script>
</body>

</html>