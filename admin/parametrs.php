<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>الإعدادات - Soubai Shop</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
    body {
        font-family: 'Tajawal', sans-serif;
        padding-top: 64px;
    }

    .setting-card {
        transition: all 0.2s ease;
    }

    .setting-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    </style>
</head>

<body class="bg-gray-100 text-black flex flex-col min-h-screen">
    <?php include 'components/header.html'; ?>

    <!-- Main Content -->
    <div class="p-6 md:mr-64">
        <div class="flex justify-between align-center mb-6">
            <h1 class="text-center text-2xl font-bold text-gray-800 mb-4">
                <i class="fas fa-cog text-yellow-400"></i> إعدادات المتجر
            </h1>
        </div>

        <!-- Shipping Settings Card -->
        <div class="bg-white p-6 rounded-lg shadow-md setting-card mb-6">
            <h2 class="text-xl font-semibold mb-6 border-b pb-2">
                <i class="fas fa-shipping-fast text-gray-500 mr-2"></i>
                إعدادات الشحن
            </h2>

            <form class="space-y-4">
                <!-- Free Shipping Threshold -->
                <div class="mb-6">
                    <label class="block text-gray-700 font-medium mb-2">
                        حد الشحن المجاني (درهم)
                    </label>
                    <!-- Update form inputs with names -->
                    <input type="number" name="free_shipping_threshold"
                        class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                        placeholder="أدني مبلغ للشحن المجاني" min="0" step="1">


                    <p class="text-gray-500 text-sm mt-1">
                        سيتم تطبيق الشحن المجاني على الطلبات التي تتعدى هذا المبلغ
                    </p>
                </div>

                <!-- Shipping Price -->
                <div class="mb-6">
                    <label class="block text-gray-700 font-medium mb-2">
                        سعر الشحن الأساسي (درهم)
                    </label>
                    <input type="number" name="shipping_price"
                        class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                        placeholder="سعر الشحن الأساسي" min="0" step="0.5">
                    <p class="text-gray-500 text-sm mt-1">
                        سيتم تطبيق هذا السعر إذا لم يصل الطلب إلى حد الشحن المجاني
                    </p>
                </div>

                <!-- Save Button -->
                <div class="flex justify-end">
                    <button type="submit"
                        class="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors">
                        <i class="fas fa-save mr-2"></i>
                        حفظ التغييرات
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // sidebarHandler("gererSettings");
    })
    </script>
    <script src="JS/settings.js"></script>
</body>

</html>