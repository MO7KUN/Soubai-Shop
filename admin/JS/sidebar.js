const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
const permissions = localStorage.getItem("permissions") || sessionStorage.getItem("permissions");
const token = localStorage.getItem("token") || sessionStorage.getItem("token");

const permissionsArray = permissions ? permissions.split("&") : [];

function sidebarHandler(permission) {
  const isAuthenticated = userId && permissions && token;
  if (!isAuthenticated) {
    window.location.href = "index.html";
    return;
  }

  const elementsToRemove = {
    vueDashboard: "dashboard",
    gererCategorys: "categories",
    gererProducts: "products",
    gererClients: "clients",
    gererOrders: "orders",
    gererUsers: "users",
    gererSettings: "settings"
  };

  Object.entries(elementsToRemove).forEach(([perm, elementId]) => {
    if (!permissionsArray.includes(perm)) {
      const element = document.getElementById(elementId);
      if (element) element.remove();
    }
  });

  if (!permissionsArray.includes(permission)) {
    window.history.length > 1 ? window.history.back() : window.location.href = "index.html";
  }

  if (permissionsArray.includes("receiveNotifications")) {
    //add the path to the file responsilbe for handling notifications
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'JS/notificationHandler.js';

    // Append the script element to the document's body
    document.body.appendChild(script);
  }
}

function errorsHandler(responseStatus) {
  const errorMessages = {
    400: "طلب غير صالح، تحقق من البيانات المدخلة.",
    401: "أنت غير مسجل الدخول.",
    403: "ليس لديك الصلاحية للوصول إلى هذه الصفحة.",
    404: "البيانات غير موجودة.",
    408: "انتهت مهلة الطلب، حاول مرة أخرى.",
    429: "تم إرسال عدد كبير من الطلبات، حاول لاحقًا.",
    500: "حدث خطأ داخلي في الخادم.",
    502: "الخادم غير متوفر حاليًا، حاول مرة أخرى لاحقًا.",
    503: "الخدمة غير متاحة حاليًا، يرجى المحاولة لاحقًا.",
    504: "انتهت مهلة الاتصال بالخادم، حاول مرة أخرى."
  };

  const message = errorMessages[responseStatus] || "حدث خطأ غير متوقع، يرجى المحاولة لاحقًا.";

  Swal.fire({
    icon: 'error',
    title: 'حدث خطأ!',
    text: message,
  });

  // If 403, go back if possible, otherwise go to index.html
  if (responseStatus === 403) {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = 'index.html';
    }
  }

  if (responseStatus === 401) {
    // window.location.href = 'index.html';
  }
}