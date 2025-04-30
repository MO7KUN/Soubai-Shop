<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>المستخدمين - Soubai Shop</title>
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

        <div class="flex justify-between align-center mb-6">
            <h1 class="text-center text-2xl font-bold text-black md:text-800 mb-4">
                <i class="fas fa-user-cog text-yellow-400"></i> المستخدمين
            </h1>
            <a href="newUser.php"
                class="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition duration-300">
                <i class="fas fa-plus"></i> إضافة مستخدم
            </a>
        </div>


        <!-- Error Message -->
        <!-- <div id="error-message" class="hidden border border-red-500 rounded-lg p-4 mb-4">
            <p class="text-red-500">حدث خطأ ما. يرجى المحاولة مرة أخرى</p>
        </div> -->

        <!-- Users Table -->
        <div class="overflow-x-auto bg-white rounded-lg shadow-lg">
            <div class="bg-white p-6 rounded-lg shadow-md">
                <!-- Controls -->
                <div class="flex flex-col sm:flex-row gap-4 mb-4">
                    <input type="text" id="usersTable-search" placeholder="ابحث عن طلب..."
                        class="w-full p-2 border rounded-lg">
                </div>
                <div class="overflow-x-auto bg-white rounded-lg shadow">
                    <table class="w-full border-collapse text-center" id="usersTable">
                        <thead>
                            <tr class="bg-gray-200">
                                <th class="px-4 py-2">الاسم الكامل</th>
                                <th class="px-4 py-2">البريد الإلكتروني</th>
                                <th class="px-4 py-2">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody id="users-table">
                            <!-- Users will be dynamically inserted here -->
                            <tr>
                                <td colspan="3" class="text-center">
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

    <div class="hidden" id="pop-up-1">
        <div
            class="fixed inset-0 items-center grid h-screen place-items-center justify-center bg-gray-800 bg-opacity-75">
            <div class="bg-white p-6 rounded-lg shadow-lg w-96">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Confirmation </h2>
                    <button type="button" onclick="closePopUp('pop-up-1')"
                        class="text-gray-500 text-xl font-black hover:text-red-600 close-button"
                        data-popup-id="pop-up-4">&times;</button>
                </div>
                <hr class="mb-4">
                <h3 class="font-semibold text-base mb-4">هل أنت متأكد أنك تريد حذف هذا المستخدم؟</h3>
                </h3>
                <div class="flex justify-end">
                    <button type="button"
                        class="ml-2 px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-gray-800"
                        onclick="closePopUp('pop-up-1')" data-popup-id="pop-up-4">الغاء</button>
                    <button type="button" id="deleteContratButton"
                        class="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">نعم</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", function() {
            sidebarHandler("gererProducts");
        });
    </script>
    <!-- data table -->
    <script src="includes/jquery-3.7.0.js"></script>
    <script src="includes/jquery.dataTables.min.js"></script>
    <script src="includes/datatables.tailwind.js"></script>
    <script src="JS/users.js"></script>

    <script>
        function openPopUp(popupId, userId) {
            const popUp = document.getElementById(popupId);
            if (popUp) {
                popUp.style.display = 'block';
            }
            document.getElementById('deleteContratButton').addEventListener('click', function() {
                deleteUser(userId);
            });
        }

        // Function to close a specific pop-up
        function closePopUp(popupId) {
            const popUp = document.getElementById(popupId);
            if (popUp) {
                popUp.style.display = 'none';
            }
        }
    </script>
</body>

</html>