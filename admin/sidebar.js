const userId =
  localStorage.getItem("userId") || sessionStorage.getItem("userId");
const permissions =
  localStorage.getItem("permissions") || sessionStorage.getItem("permissions");
const token = localStorage.getItem("token") || sessionStorage.getItem("token");

function sidebarhandeler(permission) {
  if (!userId || !permissions || !token) {
    window.location.href = "index.html";
  } else {
    if (!PermissionsArray.includes(permission)) {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "index.html";
      }
    const PermissionsArray = permissions.split("&");
    if (!PermissionsArray.includes("gererDashboard"))
      document.getElementById("dashboard").remove();
    if (!PermissionsArray.includes("gererCategorys"))
      document.getElementById("categories").remove();
    if (!PermissionsArray.includes("gererProducts"))
      document.getElementById("products").remove();
    if (!PermissionsArray.includes("gererClients"))
      document.getElementById("clients").remove();
    if (!PermissionsArray.includes("gererOrders"))
      document.getElementById("orders").remove();
    // if (!PermissionsArray.includes('gererUsers')) document.getElementById('users').remove();
    if (!PermissionsArray.includes("gererSettings"))
      document.getElementById("settings").remove();
  }
}
}