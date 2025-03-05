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
      clients.forEach((client) => {
        const row = clientTable.insertRow();
        row.classList.add("border-b", "border-gray-200");

        const nameCell = row.insertCell();
        nameCell.classList.add("p-3", "border-b", "whitespace-nowrap");
        nameCell.textContent = client.name;

        const telCell = row.insertCell();
        telCell.classList.add("p-3", "border-b", "whitespace-nowrap");
        telCell.textContent = client.tel;

        const cityCell = row.insertCell();
        cityCell.classList.add("p-3", "border-b", "whitespace-nowrap");
        cityCell.textContent = client.city;

        const actionsCell = row.insertCell();
        actionsCell.classList.add(
          "p-3",
          "border-b",
          "text-center",
          "flex",
          "flex-row",
          "items-center",
          "justify-center",
          "gap-2"
        );

        const editButton = document.createElement("button");
        editButton.classList.add(
          "bg-blue-500",
          "text-white",
          "px-2",
          "py-1",
          "rounded-full",
          "hover:bg-blue-600"
        );
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.addEventListener("click", () => {
          openUpdateModal(client);
        });

        const deleteButton = document.createElement("button");
        deleteButton.classList.add(
          "bg-red-500",
          "text-white",
          "px-2",
          "py-1",
          "rounded-full",
          "hover:bg-red-600"
        );
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener("click", () => {
          // Handle delete button click
        });

        const callButton = document.createElement("button");
        callButton.classList.add(
          "bg-green-500",
          "text-white",
          "px-2",
          "py-1",
          "rounded-full",
          "hover:bg-green-600"
        );
        callButton.innerHTML = '<i class="fas fa-phone"></i>';
        callButton.addEventListener("click", () => {
          // Handle call button click
        });

        const whatsappButton = document.createElement("button");
        whatsappButton.classList.add(
          "bg-green-700",
          "text-white",
          "px-2",
          "py-1",
          "rounded-full",
          "hover:bg-green-800"
        );
        whatsappButton.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
        whatsappButton.addEventListener("click", () => {
          // Handle WhatsApp button click
        });

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        actionsCell.appendChild(callButton);
        actionsCell.appendChild(whatsappButton);
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