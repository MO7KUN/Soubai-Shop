<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>لوحة التحكم - Soubai Shop</title>
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
            <i class="fas fa-tachometer-alt text-yellow-400"></i> الصفحة
            الرئيسية
        </h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <!-- Total Orders -->
            <div class="bg-white p-6 rounded-lg shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500">إجمالي الطلبات</p>
                        <p class="text-2xl font-bold" id="totalOrders"></p>
                    </div>
                    <div class="bg-yellow-400 py-1.5 px-2 rounded-full">
                        <i class="fas fa-shopping-cart text-white rounded-full"></i>
                    </div>
                </div>
            </div>

            <!-- Total Revenue -->
            <div class="bg-white p-6 rounded-lg shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500">إجمالي الإيرادات</p>
                        <p class="text-2xl font-bold"><span id="totalRevenue" dir="ltr"></span></p>
                    </div>
                    <div class="bg-green-500 py-1.5 px-3 rounded-full">
                        <i class="fas fa-dollar-sign text-white rounded-full"></i>
                    </div>
                </div>
            </div>

            <!-- Total Customers -->
            <div class="bg-white p-6 rounded-lg shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500">إجمالي العملاء</p>
                        <p class="text-2xl font-bold" id="totalCustomers"></p>
                    </div>
                    <div class="bg-blue-500 py-1.5 px-2 rounded-full">
                        <i class="fas fa-users text-white rounded-full"></i>
                    </div>
                </div>
            </div>

            <!-- Pending Orders -->
            <div class="bg-white p-6 rounded-lg shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500">الطلبات المعلقة</p>
                        <p class="text-2xl font-bold" id="pendingOrders"></p>
                    </div>
                    <div class="bg-red-500 py-1.5 px-2.5 rounded-full">
                        <i class="fas fa-exclamation-circle text-white rounded-full"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Orders Table -->
        <div class="bg-white rounded-lg shadow">
            <h2 class="p-4 text-xl font-bold text-gray-800">الطلبات
                الأخيرة</h2>
            <div class="overflow-x-auto p-2">
                <table class="w-full border-collapse text-right">
                    <thead>
                        <tr class="bg-gray-200">
                            <th class="p-3 text-center border-b whitespace-nowrap">اسم
                                العميل</th>
                            <th class="p-3 text-center border-b whitespace-nowrap">رقم
                                الهاتف</th>
                            <th class="p-3 text-center border-b whitespace-nowrap">إجمالي
                                الطلب</th>
                            <th class="p-3 text-center border-b whitespace-nowrap">المدينة</th>
                            <th class="p-3 text-center border-b whitespace-nowrap">التاريخ</th>
                            <th class="p-3 text-center border-b whitespace-nowrap">حالة
                                الطلب</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id="recentOrders">
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
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <!-- best selling products -->
            <div class="bg-white p-6 rounded-lg shadow">
                <h1 class="text-xl font-bold mb-2 text-right text-gray-800">المنتجات الأكثر مبيعا</h1>
                <div class="overflow-x-auto rounded-lg border">
                    <table class="w-full border-collapse text-right" id="productsTable">
                        <thead>
                            <tr class="bg-gray-200">
                                <th class="px-4 py-2 text-center whitespace-nowrap">الصورة</th>
                                <th class="px-4 py-2 text-center whitespace-nowrap">اسم
                                    المنتج</th>
                                <th class="px-4 py-2 text-center whitespace-nowrap">الكمية
                                    المباعة</th>
                                <th class="px-4 py-2 text-center whitespace-nowrap">اجمالي الأرباح</th>
                            </tr>
                        </thead>
                        <tbody id="bestSoldProducts">
                            <!-- Product 1 -->
                            <tr>
                                <td colspan="4" class="text-center">
                                    <div id="loadingAnimation" class="text-blue-500 mt-8 mb-6 items-center" dir="rtl">
                                        <i class="fa-solid fa-spinner fa-spin fa-2x"></i>
                                        <span class="ml-2">تحميل...</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- items low on stock -->
            <div class="bg-white p-6 rounded-lg shadow">
                <h1 class="text-xl font-bold mb-2 text-right text-gray-800">
                    المنتجات القليلة في المخزن</h1>
                <div class="overflow-x-auto rounded-lg border">
                    <table class="w-full border-collapse text-center">
                        <thead>
                            <tr class="bg-gray-200">
                                <th class="px-4 py-2 text-center whitespace-nowrap">اسم
                                    المنتج</th>
                                <th class="px-4 py-2 text-center whitespace-nowrap">رقم
                                    الباركود</th>
                                <th class="px-4 py-2 text-center whitespace-nowrap">الكمية
                                    المتبقية</th>
                                <th class="px-4 py-2 text-center whitespace-nowrap">الحالة</th>
                                <th class="px-4 py-2 text-center whitespace-nowrap"></th>
                            </tr>
                        </thead>
                        <tbody id="lowStockProducts">
                            <!-- Product 2 -->
                            <tr>
                                <td colspan="5" class="text-center">
                                    <div id="loadingAnimation" class="text-blue-500 mt-8 mb-6 items-center" dir="rtl">
                                        <i class="fa-solid fa-spinner fa-spin fa-2x"></i>
                                        <span class="ml-2">تحميل...</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>

    <script>
    document.addEventListener("DOMContentLoaded", function() {
        sidebarHandler("vueDashboard");
    })
    </script>
    <script src="JS/dashboard.js"></script>
</body>

</html>