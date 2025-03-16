<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>الطلبات - Soubai Shop</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        body {
            font-family: 'Tajawal', sans-serif;
            padding-top: 64px;
        }

        #noResults td {
            background-color: #f8fafc;
            padding: 2rem;
            font-style: italic;
        }

        /* Add padding for navbar */
    </style>

</head>

<body class="bg-gray-100 text-black flex flex-col min-h-screen">
    <?php include 'components/header.html'; ?>

    <!-- Main Content -->
    <div class="p-6 md:mr-64">
        <!-- Add margin-top for navbar -->

        <div class="flex justify-between align-center mb-6">
            <h1 class="text-center text-2xl font-bold text-gray-800 mb-4">
                <i class="fas fa-shopping-cart text-yellow-400"></i> الطلبات
            </h1>
            <!-- Add Order Button -->
            <a href="NewOrder.html">
                <button
                    class="w-full md:w-auto bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 whitespace-nowrap">
                    <i class="fas fa-plus"></i> إضافة طلب
                </button>
            </a>
        </div>


        <!-- Orders Table -->
        <div class="overflow-x-auto bg-white rounded-lg shadow">
            <div class="bg-white p-6 rounded-lg shadow-md">
                <!-- Controls -->
                <div class="flex flex-col sm:flex-row gap-4 mb-4">
                    <input type="text" id="ordersTable-search" placeholder="ابحث عن طلب..." autocomplete="off"
                        class="w-full p-2 border rounded-lg">
                </div>

                <!-- Table -->
                <div class="overflow-x-auto rounded-lg border">
                    <table class="min-w-full divide-y divide-gray-200" id="ordersTable">
                        <thead class="bg-gray-200">
                            <tr>
                                <th class="px-6 py-3 cursor-pointer">
                                    رقم الطلب
                                </th>
                                <th class="px-6 py-3 cursor-pointer">
                                    العميل
                                </th>
                                <th class="px-6 py-3 cursor-pointer">
                                    الحالة
                                </th>
                                <th class="px-6 py-3 cursor-pointer">
                                    المبلغ الإجمالي
                                </th>
                                <th class="px-6 py-3 cursor-pointer">
                                    تاريخ الطلب
                                </th>
                                <th class="px-6 py-3">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody id="ordersTableBody">

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
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            sidebarhandeler("gererOrders");
        })
    </script>
    <script src="JS/orders.js"></script>
</body>

</html>