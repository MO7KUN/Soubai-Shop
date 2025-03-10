document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});

async function fetchProducts() {
    const tableBody = document.getElementById("products-table");

    if (!tableBody) {
        console.error("Error: Table body with ID 'products' not found.");
        return;
    }

    fetch("http://sbaishop.com/api/products", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data.data)) {
                tableBody.innerHTML = ""; // Clear existing content

                data.data.forEach(product => {
                    const row = document.createElement("tr");
                    row.className = "hover:bg-gray-50 border-b";

                    row.innerHTML = `
                        <td class="p-3 text-center">${product.id}</td>
                        <td class="px-4 py-3 text-center whitespace-nowrap font-meduim">${product.ref || "---"}</td>
                        <td class="px-4 py-3 text-center whitespace-nowrap font-medium">${product.label}</td>
                        <td class="px-4 py-3 text-center whitespace-nowrap font-medium">${product.price}</td>
                        <td class="px-4 py-3 text-center whitespace-nowrap">${product.qte || ''}</td>
                        <td class="px-4 py-3 text-center whitespace-nowrap">${product.is_visible == 1 ? "مرئي" : "غير مرئي"}</td>
                        <td class="px-4 py-3 text-center whitespace-nowrap">${product.category.label || "----"}</td>
                        <td class="px-4 py-3 text-center whitespace-nowrap">${new Date(product.created_at).toLocaleDateString()}</td>
                        <td class="px-4 py-3 text-center">
                            <button class="bg-blue-500 text-white px-2 py-1 rounded-full hover:bg-blue-600 transition duration-300">
                                <i class="fas fa-edit"></i> 
                            </button>
                            <button class="bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 transition duration-300">
                                <i class="fas fa-trash"></i> 
                            </button>
                        </td>
                    `;

                    tableBody.appendChild(row);
                })
            } else {
                console.error("Unexpected API response format.");
            }
        })
        .catch(error => {
            if (error.status === 401) {
                logout();
            } else if (error.status === 422) {
                const errors = error.json();
                console.error("Validation errors:", errors);
            } else {
                tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-red-500 py-3">حدث خطأ أثنام تحميل المنتجات.</td></tr>`;
            }
        });
}

function deleteProduct(id) {
    if (confirm("Voulez vous vraiment supprimé ce produit?")) {
        fetch(`http://e_sahara.test/api/product/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    fetchProducts();
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred. Please try again later.");
            });
    }
}

function changeProductVisibility(id) {
    console.log(id);
    if (confirm("الرؤية لهذا المنتج ستتغير، هل أنت متأكد؟")) {
        fetch(`http://e_sahara.test/api/product/${id}/edit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({
                is_visible: document.getElementById("productVisibilitySelector").value,
            }),
        })
            .then((response) => response.status)
        if (response.status == 200) {
            fetchProducts();
        } else {
            alert("Un erreur c'est produit, veuiillez réessayer plus tard.");
        }

        // .then((data) => {
        //     if (data.success) {
        //         fetchProducts();
        //     } else {
        //         alert(data.message);
        //     }
        // })
        // .catch((error) => {
        //     console.error("Error:", error);
        //     alert("An error occurred. Please try again later.");
        // });
    }
}