<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>إضافة عميل - Soubai Shop</title>
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
            <i class="fas fa-user-plus text-yellow-400"></i> إضافة عميل
        </h1>
        <div id="error-message" class="hidden border border-red-500 rounded-lg p-4 mb-4">
            <p class="text-red-500">حدث خطأ ما. يرجى المحاولة مرة أخرى</p>
        </div>
        <div id="success-message" class="hidden border border-green-500 rounded-lg p-4 mb-4">
            <p class="text-green-500">تمت العملية بنجاح</p>
        </div>

        <!-- New Client Form -->
        <div class="bg-white rounded-lg shadow p-6">
            <div>
                <!-- Client Information -->
                <div class="mb-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-user text-yellow-400"></i> معلومات العميل
                    </h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label for="client-name" class="block text-gray-700 mb-2">اسم العميل</label>
                            <input id="client-name" type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="أدخل اسم العميل" required>
                            <p id="client-name-error" class="hidden text-red-500 text-xs mt-1">
                                اسم العميل مطلوب
                            </p>
                        </div>
                        <div>
                            <label for="client-phone" class="block text-gray-700 mb-2">رقم الهاتف</label>
                            <input id="client-phone" type="tel"
                                class="w-full px-3 py-2 border border-gray-300 placeholder:text-right rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="أدخل رقم الهاتف" required>
                            <p id="client-phone-error" class="hidden text-red-500 text-xs mt-1">
                                رقم الهاتف مطلوب
                            </p>
                        </div>
                        <div>
                            <label for="client-city" class="block text-gray-700 mb-2">المدينة</label>
                            <input id="client-city" type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="أدخل المدينة" required>
                            <p id="client-city-error" class="hidden text-red-500 text-xs mt-1">
                                المدينة مطلوبة
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-4">
                    <button onclick="window.location.href = 'Clients.html'" type="button"
                        class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300">
                        <i class="fas fa-times"></i> إلغاء
                    </button>
                    <button onclick="addClient()" type="submit"
                        class="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition duration-300">
                        <i class="fas fa-save"></i> حفظ العميل
                    </button>
                </div>
            </div>
        </div>
    </div>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        sidebarhandeler("gererClients");
    })
    </script>
    <script src="JS/ClientsManagement.js"></script>
</body>

</html>