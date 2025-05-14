<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إضافة مستخدم جديد - Soubai Shop</title>
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
        <!-- <h1 class="text-center text-2xl font-bold text-black md:text-800 mb-4">
            <i class="fas fa-user-plus text-yellow-400"></i> إضافة مستخدم جديد
        </h1> -->

        <!-- Error Message -->
        <!-- <div id="error-message" class="hidden border border-red-500 rounded-lg p-4 mb-4">
            <p class="text-red-500">حدث خطأ ما. يرجى المحاولة مرة أخرى</p>
        </div> -->

        <!-- New User Form -->
        <div id="new-user-form" class="bg-white rounded-lg shadow-lg p-6">
            <!-- Full Name -->
            <div class="mb-4">
                <label for="full-name" class="block text-gray-700 mb-2">الاسم الكامل</label>
                <input type="text" id="full-name"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none focus:ring"
                    required>
            </div>

            <!-- Email -->
            <div class="mb-4">
                <label for="email" class="block text-gray-700 mb-2">البريد الإلكتروني</label>
                <input type="email" id="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none focus:ring"
                    required>
            </div>

            <!-- Password -->
            <div class="mb-4" id="password-container">
                <label for="password" class="block text-gray-700 mb-2">كلمة المرور</label>
                <input type="password" id="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none focus:ring"
                    required>
            </div>

            <!-- Permissions -->
            <div class="mb-4">
                <label class="block text-gray-700 mb-2">الصلاحيات</label>
                <div class="space-y-2 p-2" id="permissions">

                </div>
            </div>

            <!-- Buttons -->
            <div class="flex justify-end gap-4">
                <button type="button" onclick="window.location.href = 'users.php'"
                    class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300">إلغاء</button>
                <button type="button" onclick="submitForm()" id="submitButton"
                    class="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition duration-300">
                    <i class="fas fa-save mr-2"></i> حفظ
                </button>
            </div>
        </div>
    </div>
    <script src="JS/newUser.js"></script>
</body>

</html>