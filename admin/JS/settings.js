// public/JS/settings.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const freeShippingInput = document.querySelector('input[name="free_shipping_threshold"]');
    const shippingPriceInput = document.querySelector('input[name="shipping_price"]');

    // Fetch current settings
    const fetchSettings = async () => {
        try {
            const response = await fetch('https://sbaishop.com/api/settings', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Network response was not ok');

            const settings = await response.json();

            freeShippingInput.value = settings.free_shipping_threshold;
            shippingPriceInput.value = settings.shipping_cost;

        } catch (error) {
            console.error('Error fetching settings:', error);
            Swal.fire('خطأ', 'تعذر تحميل الإعدادات الحالية', 'error');
        }
    };

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            free_shipping_threshold: parseFloat(freeShippingInput.value),
            shipping_price: parseFloat(shippingPriceInput.value)
        };

        if (isNaN(formData.free_shipping_threshold)) {
            return Swal.fire('خطأ', 'يرجى إدخال قيمة صحيحة لحد الشحن المجاني', 'error');
        }

        if (isNaN(formData.shipping_price)) {
            return Swal.fire('خطأ', 'يرجى إدخال قيمة صحيحة لسعر الشحن', 'error');
        }

        updateSettings(formData);
    });

    // Initial load
    fetchSettings();
});

// Update settings
async function updateSettings(data) {
    // Show loading Swal popup
    Swal.fire({
        title: 'جاري الإرسال...',
        text: 'يرجى الانتظار قليلاً.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    try {
        const response = await fetch('https://sbaishop.com/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) throw new Error(result.error || 'فشل في التحديث');

        Swal.fire('نجاح', 'تم تحديث الإعدادات بنجاح', 'success').then(() => {
            window.location.reload();
        });

    } catch (error) {
        console.error('Update error:', error);
        Swal.fire('خطأ', error.message || 'حدث خطأ أثناء حفظ التغييرات', 'error');
    }
};