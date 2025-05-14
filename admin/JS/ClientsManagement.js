let apiUrl = "https://sbaishop.com/api"

function fetchClients(retryCount = 0) {
  fetch(apiUrl + "/clients", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);

      const clientTable = document.getElementById("clients-table");
      clientTable.innerHTML = ""; // Clear existing rows

      if (data.length > 0) {
        data.forEach((client) => {
          const row = document.createElement("tr");
          row.className = "hover:bg-gray-100 border-b";
          row.innerHTML = `
            <td class="px-4 py-3 text-center whitespace-nowrap font-medium">${client.name}</td>
            <td class="px-4 py-3 text-center whitespace-nowrap font-medium">${client.tel}</td>
            <td class="px-4 py-3 text-center whitespace-nowrap font-medium">${client.city}</td>
            <td class="px-4 py-3 text-center whitespace-nowrap font-medium">${client.balance}</td>
            <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                    <button onclick="openUpdateModal(${client.id},'${client.name}','${client.tel}','${client.city}',${client.balance})" class="bg-blue-500 text-white px-3 py-1.5 rounded-full hover:bg-blue-600 transition">
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
      } else {
        clientTable.innerHTML = `
          <tr>
            <td colspan="100%" class="py-6 text-center text-orange-500 font-semibold bg-orange-50 border border-orange-200 rounded">
                🚀 ليس لديك أي عملاء مسجلين بعد
            </td>
          </tr>
        `;
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);

      if (retryCount < 3) {
        // Retry with a random delay (50ms - 200ms)
        const retryDelay = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
        console.warn(`Retrying in ${retryDelay}ms...`);
        setTimeout(() => fetchClients(retryCount + 1), retryDelay);
      } else {
        // Show error message after retries fail
        Swal.fire({
          icon: "error",
          title: "خطأ في الخادم",
          text: "هناك مشكلة في الخادم، يرجى المحاولة لاحقًا أو التواصل مع الدعم الفني.",
          confirmButtonText: "حسنًا",
        });

        // Show error message in the table
        const clientTable = document.getElementById("clients-table");
        clientTable.innerHTML = `
          <tr>
            <td colspan="100%" class="py-6 text-center text-red-500 font-semibold bg-red-50 border border-red-200 rounded">
                ⚠️ هناك مشكلة في الخادم، يرجى المحاولة لاحقًا أو التواصل مع الدعم الفني.
            </td>
          </tr>
        `;
      }
    });
}


async function addClient() {
  const clientData = {
    name: document.getElementById("client-name").value,
    tel: document.getElementById("client-phone").value,
    city: document.getElementById("client-city").value,
    balance: document.getElementById("client-balance").value,
  };

  if (clientData.name == "") {
    Swal.fire({
      icon: "warning",
      title: "تنبيه",
      text: "الرجاء إدخال اسم العميل",
    });
    return;
  }

  fetch(apiUrl + apiUrl + "/client", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(clientData),
  })
    .then((response) => {
      if (!response.ok) {
        errorsHandler(response.status); // Pass only response.status
        return Promise.reject(); // Prevent further execution
      }
      return response.json();
    })
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "تم تسجيل العميل بنجاح",
        text: "تم تسجيل معلومات العميل بنجاح",
        showConfirmButton: false,
        timer: 1200,
      }).then(() => {
        window.location.href = "clients.php"
      });
    })
    .catch(() => {
      // Do nothing since errorsHandler is already called in the .then block
    });
}


async function deleteClient(clientId) {
  if (!confirm('هل أنت متأكد أنك تريد حذف هذا العميل؟')) return
  // Delete client logic here
  fetch(apiUrl + `/client/${clientId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        errorsHandler(response.status); // Pass only response.status
        return Promise.reject(); // Prevent further execution
      }
      return response.json();
    })
    .then((data) => {
      Swal.fire({
        icon: 'success',
        title: 'تم حذف العميل',
        text: 'تم حذف معلومات العميل بنجاح',
        showConfirmButton: false,
        timer: 2000  // Closes after 2 seconds
      }).then(() => {
        fetchClients()
      });
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

async function updateClient() {
  const ClientName = document.getElementById("ClientName").value;
  const ClientPhone = document.getElementById("ClientPhone").value;
  const ClientCity = document.getElementById("ClientCity").value;
  const clientBalance = document.getElementById("ClientBalance").value;

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
  formData.append("balance", clientBalance);
  // Update client logic here
  fetch(apiUrl + `/client/${clientID}/edit`, {
    method: "POST",
    headers: {
      // "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        errorsHandler(response.status); // Pass only response.status
        return Promise.reject(); // Prevent further execution
      }
      return response.json();
    })
    .then((data) => {
      // Log the response for debugging
      closeUpdateModal();
      Swal.fire({
        icon: 'success',
        title: 'تم تحديث العميل بنجاح',
        text: 'تم تحديث معلومات العميل بنجاح',
        showConfirmButton: false,
        timer: 2000  // Closes after 2 seconds
      }).then(() => {
        fetchClients()
      });
    })
}
