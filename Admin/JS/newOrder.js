document.addEventListener('DOMContentLoaded', function () {
    sidebarhandeler("gererOrders");
})

const clients = [];
const clientSearchInput = document.getElementById("clientSearchInput");
const clientList = document.getElementById("clientList");
// عند النقر، عرض القائمة
clientSearchInput.addEventListener("focus", () => {
    updateClientList(clients);
});

// عند الكتابة، تصفية العملاء
clientSearchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = clients.filter(client => client.toLowerCase().includes(query));
    updateClientList(filtered);
});

// إخفاء القائمة عند النقر خارجها
document.addEventListener("click", (e) => {
    if (!clientSearchInput.contains(e.target) && !clientList.contains(e.target)) {
        clientList.classList.add("hidden");
    }
});

// تحديث القائمة
function updateClientList(filteredClients) {
    clientList.innerHTML = "";
    filteredClients.forEach(client => {
        const li = document.createElement("li");
        li.textContent = client;
        li.className = "px-4 py-2 hover:bg-gray-200 cursor-pointer";
        li.addEventListener("click", () => {
            clientSearchInput.value = client;
            clientList.classList.add("hidden");
        });
        clientList.appendChild(li);
    });
    clientList.classList.toggle("hidden", filteredClients.length === 0);
}

async function getClients() {

}