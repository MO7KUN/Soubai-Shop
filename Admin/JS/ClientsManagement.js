function fetchClients() {
  fetch("https://sbaishop.com/api/clients", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token, // Fixed typo
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw response; // Throw the response to handle errors
      }
      return response.json();
    })
    .then((data) => {
      // Ensure the response is an array
      if (!Array.isArray(data.data)) {
        throw new Error("Invalid data format: Expected an array of clients");
      }

      const clients = data.data; // Access the array of clients
      const clientTable = document.getElementById("clients-table");

      // Clear existing rows (if any)
      clientTable.innerHTML = "";

      // Add rows for each client
      clients.forEach(client => {
        const row = document.createElement("tr");
        row.className = "hover:bg-gray-100 border-b";

        row.innerHTML = `
            <td class="px-4 py-3 text-center whitespace-nowrap font-medium">${client.name}</td>
            <td class="px-4 py-3 text-center whitespace-nowrap font-medium">${client.tel}</td>
            <td class="px-4 py-3 text-center whitespace-nowrap font-medium">${client.city}</td>
            <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                    <button onclick="openUpdateModal(${client.id})" class="bg-blue-500 text-white px-3 py-1.5 rounded-full hover:bg-blue-600 transition">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteClient(${client.id})" class="bg-red-500 text-white px-3 py-1.5 rounded-full hover:bg-red-600 transition">
                        <i class="fas fa-trash"></i>
                    </button>
                    <a href="tel:${client.tel}" class="bg-green-500 text-white px-3 py-1.5 rounded-full hover:bg-green-600 transition">
                        <i class="fas fa-phone"></i>
                    </a>
                    <a href="https://wa.me/${client.tel}" target="_blank" class="bg-green-700 text-white px-3 py-1.5 rounded-full hover:bg-green-800 transition">
                        <i class="fa-brands fa-whatsapp"></i>
                    </a>
                </div>
            </td>
        `;

        clientTable.appendChild(row);
      });


      // Initialize DataTable FIRST
      const table = $('#clientsTable').DataTable({
        dom: 't', // إخفاء عناصر التحكم الافتراضية
        paging: true,
        searching: true,
        info: true, // تفعيل معلومات العناصر
        lengthMenu: [10, 25, 50, 100], // خيارات عدد الصفوف
        lengthChange: true, // تفعيل تغيير عدد الصفوف
        pageLength: 10, // القيمة الافتراضية
        pagingType: 'full_numbers',
        language: {
          "paginate": {
            "previous": "السابق",
            "next": "التالي"
          },
          "search": "ابحث:",
          "emptyTable": "لا توجد بيانات متاحة",
          "zeroRecords": "لم يتم العثور على نتائج مطابقة",
          "info": "عرض _START_ إلى _END_ من إجمالي _TOTAL_ عنصر",
          "infoEmpty": "عرض 0 إلى 0 من 0 عنصر",
          "infoFiltered": "(تمت التصفية من إجمالي _MAX_ عنصر)",
          "lengthMenu": "عرض _MENU_ عنصر لكل صفحة"
        }
      });

      // إضافة عنصر اختيار عدد الصفوف المخصص
      $('#customPagination').prepend(`
      <div class="page-length-selector">
        <select id="rowCountSelect" class="your-select-style">
            <option value="10">10 عناصر/الصفحة</option>
            <option value="25">25 عناصر/الصفحة</option>
            <option value="50">50 عناصر/الصفحة</option>
            <option value="100">100 عناصر/الصفحة</option>
        </select>
      </div>
      `);

      // تحديث عدد الصفوف عند التغيير
      $('#rowCountSelect').on('change', function () {
        table.page.len(this.value).draw();
      });

      // تحديث المعلومات عند التغيير
      table.on('draw', function () {
        const info = table.page.info();
        $('#pageInfo').html(`
          عرض ${info.start + 1} إلى ${info.end} 
          من إجمالي ${info.recordsTotal} عنصر
          `);

        // تحديث القيمة المحددة في ال select
        $('#rowCountSelect').val(info.length);
      });

      // Now connect your custom elements AFTER initialization
      // Custom search
      $('#clientsTable-search').on('keyup', function () {
        table.search(this.value).draw();
      });

      // Custom pagination controls
      $('#prevPage').on('click', function () {
        table.page('previous').draw('page');
      });

      $('#nextPage').on('click', function () {
        table.page('next').draw('page');
      });

      // Update page info on page change
      table.on('draw', function () {
        const info = table.page.info();
        $('#pageInfo').text(`الصفحة ${info.page + 1} من ${info.pages}`);
      });
    })
    .catch((error) => {
      if (error.status === 401) {
        logout();
      } else if (error.status === 500) {
        document.getElementById("error-message").classList.remove("hidden");
        console.error("Server error:", error);
      } else {
        document.getElementById("error-message").classList.remove("hidden");
        console.error("Error fetching clients:", error);
      }
    });
}

function addClient() {
  // Add client logic here
  fetch("https://sbaishop.com/api/client", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      name: document.getElementById("client-name").value,
      tel: document.getElementById("client-phone").value,
      city: document.getElementById("client-city").value,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw response; // Throw the response to handle errors
      }
      return response.json();
    })
    .then((data) => {
      // Log the response for debugging
      document.getElementById("success-message").classList.remove("hidden");
      // Handle success or error response
    })
    .catch((response) => {
      if (response.status === 401) {
        logout();
      } else if (response.status === 422) {
        const errors = response.json();
        errors.then((error) => {
          if (error.name) {
            document
              .getElementById("client-name-error")
              .classList.remove("hidden");
          }
          if (error.tel) {
            document
              .getElementById("client-phone-error")
              .classList.remove("hidden");
          }
          if (error.city) {
            document
              .getElementById("client-city-error")
              .classList.remove("hidden");
          }
        });
      } else {
        // Handle other errors
        document.getElementById("error-message").classList.remove("hidden");
      }
    });
}

function deleteClient(clientId) {
  // Delete client logic here
  fetch(`https://sbaishop.com/api/client/${clientId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw response; // Throw the response to handle errors
      }
      return response.json();
    })
    .then((data) => {
      // Log the response for debugging
      document.getElementById("success-message").classList.remove("hidden");
      // Handle success or error response
    })
    .catch((response) => {
      if (response.status === 401) {
        logout();
      } else {
        // Handle other errors
        document.getElementById("error-message1").classList.remove("hidden");
      }
    });
}

function updateClient() {
  const ClientName = document.getElementById("ClientName").value;
  const ClientPhone = document.getElementById("ClientPhone").value;
  const ClientCity = document.getElementById("ClientCity").value;

  if (!ClientName) {
    document.getElementById("ClientNameError").classList.remove("hidden");
    return;
  }

  if (!ClientPhone) {
    document.getElementById("ClientPhoneError").classList.remove("hidden");
    return;
  }

  if (!ClientCity) {
    document.getElementById("ClientCityError").classList.remove("hidden");
    return;
  }
  const formData = new FormData();
  formData.append("name", ClientName);
  formData.append("tel", ClientPhone);
  formData.append("city", ClientCity);
  // Update client logic here
  fetch(`https://sbaishop.com/api/client/${clientID}/edit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw response; // Throw the response to handle errors
      }
      return response.json();
    })
    .then((data) => {
      // Log the response for debugging
      closeUpdateModal();
      document.getElementById("success-message").classList.remove("hidden");
      // Handle success or error response
    })
    .catch((response) => {
      if (response.status === 401) {
        logout();
      } else if (response.status === 422) {
        const errors = response.json();
        errors.then((error) => {
          if (error.name) {
            document
              .getElementById("ClientNameError")
              .classList.remove("hidden");
          }
          if (error.tel) {
            document
              .getElementById("ClientPhoneError")
              .classList.remove("hidden");
          }
          if (error.city) {
            document
              .getElementById("ClientCityError")
              .classList.remove("hidden");
          }
        });
      } else {
        // Handle other errors
        document.getElementById("error-message1").classList.remove("hidden");
      }
    });
}
