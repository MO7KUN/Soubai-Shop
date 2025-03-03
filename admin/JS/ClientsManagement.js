function fetchClients() {
  fetch("http://sbaishop.com/api/clients")
    .then((response) => response.json())
    .then((clients) => {
      const clientTable = document.getElementById("client-table");
      clients.forEach((client) => {
        const row = clientTable.insertRow();
        row.innerHTML = `
                    <td class="p-3 border-b whitespace-nowrap">${client.name}</td>
                    <td class="p-3 border-b whitespace-nowrap">${client.phone}</td>
                    <td class="p-3 border-b whitespace-nowrap">${client.city}</td>
                    <td class="p-3 border-b text-center flex flex-row gap-2">
                        <button class="bg-blue-500 text-white px-2 py-1 rounded-full hover:bg-blue-600">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="bg-green-500 text-white px-2 py-1 rounded-full hover:bg-green-600">
                            <i class="fas fa-phone"></i>
                        </button>
                        <button class="bg-green-700 text-white px-2 py-1 rounded-full hover:bg-green-800">
                            <i class="fa-brands fa-whatsapp"></i>
                        </button>
                    </td>
                `;
      });
    })
    .catch((response) => {
      if (response.status === 401) {
        logout();
      } else if (response.status === 500) {
        document.getElementById("error-message").classList.remove("hidden");
      } else {
        document.getElementById("error-message").classList.remove("hidden");
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
