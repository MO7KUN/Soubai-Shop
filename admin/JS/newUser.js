let apiUrl = "https://sbaishop.com/api"

document.addEventListener("DOMContentLoaded", function () {
    sidebarHandler("gererUsers");
    loadPriviliges();
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    const action = urlParams.get('action');

    if (action === 'edit' && userId) {
        showUserInfos(userId);
        // Update page title and submit button
        document.title = "Edit Product";
        document.getElementById('submitButton').textContent = "تحديث المستخدم";
        document.getElementById('password-container').style.display = "none";
    }
});

const priviliges = [
    {
        forUser: "التحكم في المنتجات",
        forDB: "gererProducts"
    },
    {
        forUser: "التحكم في الطلبات",
        forDB: "gererOrders"
    },
    {
        forUser: "التحكم في الفئات",
        forDB: "gererCategorys"
    },
    {
        forUser: "التحكم في العملاء",
        forDB: "gererClients"
    },
    {
        forUser: "التحكم في المستخدمين",
        forDB: "gererUsers"
    },
    {
        forUser: "الاطلاع على لوحة التحكم",
        forDB: "vueDashboard"
    },
    {
        forUser: "التوصل بالإشعارات",
        forDB: "receiveNotifications"
    },
];

// document.addEventListener("DOMContentLoaded", loadPriviliges());
function loadPriviliges() {
    let content = ""
    for (let index = 0; index < priviliges.length; index++) {
        content += `
        <div class="flex items-center space-x-2" dir="rtl">
            <input name="permissions" value="${priviliges[index].forDB}" dir="ltr"
            class="inpt ml-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0_0_0_/_4%)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] bg-neutral-600 after:bg-neutral-400 checked:bg-blue-800 checked:after:bg-blue-500 focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                type="checkbox" role="switch" id="flexSwitchCheckBox${index}" />
            <label class="inline-block pl-[0.15rem] hover:cursor-pointer text-black font-semibold text-sm"
            for="flexSwitchChecked12">${priviliges[index].forUser}</label>
        </div>
        `;
    }
    document.getElementById("permissions").innerHTML = content;
}

// Handle form submission
async function submitForm() {

    // Get form values
    const fullName = document.getElementById('full-name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const permissions = Array.from(document.querySelectorAll('input[name="permissions"]:checked')).map(checkbox => checkbox.value);

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    const action = urlParams.get('action');

    let inputsValid = true;
    // Validate inputs
    if (fullName.value == "") {
        fullName.classList.add('border-red-500');
        fullName.focus();
        inputsValid = false;
    } else {
        fullName.classList.remove('border-red-500');
        inputsValid = true;
    }

    if (email.value == "") {
        email.classList.add('border-red-500');
        email.focus();
        inputsValid = false;
    } else {
        email.classList.remove('border-red-500');
        inputsValid = true;
    }

    if (action !== "edit") {
        if (password.value == "" || password.value.length < 8) {
            password.classList.add('border-red-500');
            Swal.fire({
                icon: "warning",
                title: "تنبيه",
                text: "الرجاء إدخال كلمة مرور صالحة (8 أحرف على الأقل)"
            });
            password.focus();
            inputsValid = false;
        } else {
            password.classList.remove('border-red-500');
            inputsValid = true;
        }
    }

    if (permissions.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "تنبيه",
            text: "الرجاء تحديد صلاحيات المستخدم"
        });
        inputsValid = false;
    }
    if (!inputsValid) {
        return;
    }

    try {
        // Create the user
        const userData = {
            name: fullName.value,
            email: email.value,
            password: password.value,
            priviliges: permissions.join('&'),
        };

        let url = action == 'edit' ? apiUrl + `/user/${userId}/edit` : apiUrl + '/user';
        // return;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw response
        }

        Swal.fire({
            icon: "success",
            title: "تم تسجيل المستخدم بنجاح",
            text: "تم تسجيل معلومات المستخدم بنجاح",
            showConfirmButton: false,
            timer: 1200, // The timer is 1200 ms (1.2 seconds)
        }).then(() => {
            // Redirect to the users page only after the Swal closes
            window.location.href = 'users.php';
        });
    } catch (response) {
        errorsHandler(response.status); // Pass only response.status
    }
};

async function showUserInfos(userId) {
    try {
        const response = await fetch(apiUrl + `/user/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Try to parse error JSON, fallback to empty object
            throw { status: response.status, message: errorData.message || "حدث خطأ أثناء جلب المنتجات" };
        }
        const user = await response.json();

        // Fill main product fields
        document.getElementById('full-name').value = user.name;
        document.getElementById('email').value = user.email;
        // Fill permissions
        selectFromArray(user.priviliges.split('&'));

    } catch (error) {
        console.error("❌ Error fetching user infos:", error); // Log the full error for debugging
        errorsHandler(error.status || 500);
        throw new Error(`Error occurred while fetching user infos: ${error.message}`);
    }
}

function selectFromArray(userPriviliges) {
    for (let i = 0; i < priviliges.length; i++) {
        if (userPriviliges.some(userPriviliges => userPriviliges === priviliges[i].forDB)) {
            let element = document.getElementById("flexSwitchCheckBox" + i);
            element.checked = true;
        } else {
            let element = document.getElementById("flexSwitchCheckBox" + i);
            element.checked = false;
        }
    }
}