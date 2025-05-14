<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>طلب جديد - Soubai Shop</title>
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

<body class="bg-gray-100">
    <?php include 'components/header.html'; ?>

    <!-- Main Content -->
    <div class="p-2 md:p-6 md:mr-64 max-h-screen overflo-y-auto">
        <!-- Add margin-top for navbar -->
        <h1 class="text-right text-2xl font-bold text-gray-800 mb-4">
            <i class="fas fa-plus"></i> طلب جديد
        </h1>

        <!-- New Order Form -->
        <div class="bg-gray-100 rounded-lg shadow p-2">
            <div class="flex flex-col md:flex-row gap-2 w-full">
                <!-- products list -->
                <div
                    class="order-2 md:order-1 rounded-md bg-white border border-gray-300 w-full md:w-3/5 p-2 max-h-auto">
                    <h2 class="font-semibold text-lg mb-2">ابحث عن منتج</h2>
                    <div class="relative">
                        <input type="text" id="productSearchInput" placeholder="🔍 ابحث عن منتج" autocomplete="off"
                            class="w-full px-4 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <ul id="productList"
                            class="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-md hidden">
                            <!-- سيتم إدراج العملاء هنا ديناميكيًا -->
                        </ul>
                    </div>
                    <!-- جدول المنتجات -->
                    <div class="mt-6 overflow-x-auto">
                        <table class="w-full bg-white border rounded-lg ">
                            <thead>
                                <tr class="bg-gray-200 text-gray-600 text-right">
                                    <th class="p-3 text-center">الاسم</th>
                                    <th class="p-3 text-center">السعر</th>
                                    <th class="p-3 text-center">الكمية</th>
                                    <th class="p-3 text-center">المجموع</th>
                                    <th class="p-3 text-center">المخزون</th>
                                    <th class="p-3 text-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                    <!-- sub totals -->
                    <div class="mt-6 flex justify-between items-center">
                        <h2 class="font-semibold text-lg">المجموع</h2>
                        <h2 class="font-semibold text-lg" id="order-subtotal" dir="ltr">0 DH</h2>
                    </div>
                    <!-- shipping fee -->
                    <!-- <div class="mt-2 flex justify-between items-center">
                        <h2 class="font-semibold text-lg">تكلفة الشحن</h2>
                        <h2 class="font-semibold text-lg" id="shipping-price" dir="ltr">0 DH</h2>
                    </div> -->
                    <!-- total -->
                    <!-- <div class="mt-4 flex justify-between items-center border-t pt-2">
                        <h2 class="font-bold text-xl">الإجمالي</h2>
                        <h2 class="font-bold text-xl text-blue-500" id="order-total" dir="ltr">0 DH</h2>
                    </div> -->
                </div>
                <!-- client list -->
                <div class="order-1 md:order-2 rounded-md bg-white border border-gray-300 w-full md:w-2/5 p-2">
                    <h2 class="font-semibold text-lg mb-2">ابحث عن عميل أو أضف واحدا جديدا</h2>
                    <div class="relative">
                        <div class="flex gap-2 ">
                            <input type="text" id="clientSearchInput" placeholder="🔍 ابحث عن عميل" autocomplete="off"
                                class="w-full px-4 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <button id="addClientButton" onclick="window.open('newClient.php', '_blank')"
                                class="bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white px-2 py-1 rounded-lg border-2 border-blue-500 font-extrabold text-xl focus:border-blue-500"><i
                                    class="fa-solid fa-plus"></i></button>

                        </div>
                        <ul id="clientList"
                            class="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-md hidden">
                            <!-- سيتم إدراج العملاء هنا ديناميكيًا -->
                        </ul>
                    </div>
                    <div id="clientInfoContainer"
                        class="max-w-md mx-auto bg-white shadow-md rounded-lg p-4 mt-4 border border-gray-300 hidden">
                        <div class="flex justify-between items-center">
                            <h2 class="text-lg font-semibold">العميل</h2>
                            <button id="editButton" class="bg-blue-500 text-white px-2 py-1 rounded-lg">
                                ✎
                            </button>
                        </div>
                        <div class="mt-2">
                            <h3 class="font-bold text-gray-700">معلومات العميل</h3>
                            <p id="clientNameDisplay" class="text-gray-600"></p>
                            <p id="clientPhoneDisplay" class="text-gray-600"></p>
                            <p id="clientCityDisplay" class="text-gray-600"></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-end ">
                <button id="submitOrder" onclick="saveOrder()"
                    class="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">إرسال الطلب</button>
            </div>
        </div>

        <!-- Edit client infos Modal -->
        <div id="editModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden">
            <div class="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 class="text-lg font-semibold mb-4">تعديل معلومات العميل</h2>
                <label class="block mb-1">الاسم</label>
                <input type="text" id="editName" class="w-full px-4 py-2 border rounded-lg mb-2">

                <label class="block mb-1">رقم الهاتف</label>
                <input type="text" id="editTel" class="w-full px-4 py-2 border rounded-lg mb-2">

                <label class="block mb-1">المدينة</label>
                <input type="text" id="editCity" class="w-full px-4 py-2 border rounded-lg mb-4">

                <div class="flex justify-end gap-2">
                    <button id="closeModal" class="bg-gray-400 text-white px-4 py-2 rounded-lg">إلغاء</button>
                    <button onclick="editClientInfos()" id="saveEdit"
                        class="bg-blue-500 text-white px-4 py-2 rounded-lg">تعديل المعلومات</button>
                </div>
            </div>
        </div>
        <script src="JS/newOrder.js"></script>

</body>

</html>