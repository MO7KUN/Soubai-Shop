<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>العملاء - Soubai Shop</title>
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

        <div class="flex justify-between align-center mb-6">
            <h1 class="text-center text-2xl font-bold text-gray-800 mb-4">
                <i class="fas fa-users text-yellow-400"></i> العملاء
            </h1>
            <!-- Add Client Button -->
            <a href="NewClient.php">
                <button
                    class="w-full md:w-auto bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 whitespace-nowrap">
                    <i class="fas fa-plus"></i> إضافة عميل
                </button>
            </a>
        </div>
        <!-- Error Message -->
        <!-- <div id="error-message"
                class="hidden border border-red-500 rounded-lg p-4 mb-4">
                <p class="text-red-500">
                    <i class="fas fa-exclamation-triangle"></i>
                    حدث خطأ ما. يرجى المحاولة مرة أخرى</p>
            </div> -->

        <!-- success Message -->
        <!-- <div id="success-message"
                class="hidden border border-green-500 rounded-lg p-4 mb-4">
                <p class="text-green-500">
                    <i class="fas fa-check-circle"></i> تمت العملية بنجاح</p>
            </div> -->

        <!-- Search Bar and Add Client Button -->
        <!-- <div
                class="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">                
                <div class="w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder="ابحث عن عميل..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                </div>
            </div> -->

        <!-- Clients Table -->
        <div class="overflow-x-auto bg-white rounded-lg shadow">
            <div class="bg-white p-6 rounded-lg shadow-md">
                <!-- Controls -->
                <div class="flex flex-col sm:flex-row gap-4 mb-4">
                    <input type="text" id="clientsTable-search" placeholder="ابحث عن طلب..."
                        class="w-full p-2 border rounded-lg">
                </div>
                <div class="overflow-x-auto bg-white rounded-lg shadow">
                    <table class="w-full border-collapse text-center" id="clientsTable">
                        <thead>
                            <tr class="bg-gray-200">
                                <th class="px-4 py-2 whitespace-nowrap">اسم
                                    العميل</th>
                                <th class="px-4 py-2 whitespace-nowrap">رقم
                                    الهاتف</th>
                                <th class="px-4 py-2 whitespace-nowrap">المدينة</th>
                                <th class="px-4 py-2 whitespace-nowrap">رصيد العميل</th>
                                <th class="px-4 py-2 whitespace-nowrap">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody id="clients-table">
                            <tr>
                                <td colspan="100%" class="text-center">
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

        <!-- Update Modal -->
        <div id="updateModal"
            class="fixed inset-0 bg-black bg-opacity-50 hidden place-items-center h-screen grid justify-center items-center z-50">
            <div class="bg-white rounded-lg shadow-lg w-96 p-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-bold text-gray-800 mb-4">تحديث
                        معلومات العميل</h2>
                    <button type="button" onclick="closeUpdateModal()"
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
                <div id="updateForm">
                    <div class="mb-4">
                        <label for="ClientName" class="block text-gray-700 mb-2">اسم العميل</label>
                        <input type="text" id="ClientName"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            required>
                        <p id="ClientNameError" class="text-red-500 mt-1"> </p>
                    </div>
                    <div class="mb-4">
                        <label for="ClientPhone" class="block text-gray-700 mb-2">رقم الهاتف</label>
                        <input type="text" id="ClientPhone"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            required>
                        <p id="ClientPhoneError" class="text-red-500 mt-1"> </p>
                    </div>
                    <div class="mb-4">
                        <label for="ClientCity" class="block text-gray-700 mb-2">المدينة</label>
                        <input type="text" id="ClientCity"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            required>
                        <p id="ClientCityError" class="text-red-500 mt-1"> </p>
                    </div>
                    <div class="mb-4">
                        <label for="ClientBalance" class="block text-gray-700 mb-2">رصيد العميل</label>
                        <input type="text" id="ClientBalance"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            required>
                        <p id="ClientBalanceError" class="text-red-500 mt-1"> </p>
                    </div>
                    <div class="flex justify-end gap-4">
                        <button type="submit" onclick="updateClient()"
                            class="bg-green-400 text-black px-4 py-2 rounded-lg hover:bg-green-500 transition duration-300"><i
                                class="fas fa-save"></i></button>
                    </div>
                </div>
            </div>
        </div>


        <!-- Delete Modal -->
        <div id="deleteModal"
            class="fixed inset-0 bg-black bg-opacity-50 hidden place-items-center h-screen grid justify-center items-center z-50">
            <div class="bg-white rounded-lg shadow-lg w-96 p-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-bold text-gray-800 mb-4">حذف
                        العميل</h2>
                    <button type="button" onclick="closeDeleteModal()"
                        class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"><i
                            class="fas fa-times"></i></button>
                </div>
                <p class="text-gray-700 mb-4">هل تريد حذف هذا العميل؟</p>
                <div class="flex justify-end gap-4">
                    <button type="submit" onclick="deleteClient()"
                        class="bg-red-400 text-black px-4 py-2 rounded-lg hover:bg-red-500 transition duration-300"><i
                            class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>

        <script>
            clientID = null;
            document.addEventListener('DOMContentLoaded', function() {
                sidebarHandler("gererClients");
                fetchClients();
            })

            function openUpdateModal(clientId, name, tel, city, balance) {
                // console.log(client)
                clientID = clientId;
                document.getElementById('ClientName').value = name;
                document.getElementById('ClientPhone').value = tel;
                document.getElementById('ClientCity').value = city;
                document.getElementById('ClientBalance').value = balance;
                document.getElementById('updateModal').classList.remove('hidden');

            }

            function openDeleteModal(client) {
                clientID = client.id;
                document.getElementById('deleteModal').classList.remove('hidden');
            }

            function closeDeleteModal() {
                document.getElementById('deleteModal').classList.add('hidden');
                clientID = null;
            }

            function closeUpdateModal() {
                document.getElementById('updateModal').classList.add('hidden');
                categoryID = null;
            }
        </script>
        <!-- data table -->
        <script src="includes/jquery-3.7.0.js"></script>
        <script src="includes/jquery.dataTables.min.js"></script>
        <script src="includes/datatables.tailwind.js"></script>
        <script src="JS/ClientsManagement.js"></script>
</body>

</html>