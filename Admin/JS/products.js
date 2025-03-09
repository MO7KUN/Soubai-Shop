document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});

async function fetchProducts() {
    const tableBody = document.getElementById("products-table");

    if (!tableBody) {
        console.error("Error: Table body with ID 'products' not found.");
        return;
    }

    try {
        const response = await fetch("http://e_sahara.test/api/products",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const products = await response.json();

        // if (!Array.isArray(products)) {
        //     throw new Error("Unexpected API response format.");
        // }

        console.log(products)

        tableBody.innerHTML = ""; // Clear existing content

        products.data.forEach(product => {
            console.log(product)
            const row = document.createElement("tr");
            row.className = "hover:bg-gray-50 border-b";

            row.innerHTML = `
                <td class="p-3 text-center">
                    <img src="${product.image_url ? product.image_url : ''}" alt="${product.label}" class="w-16 h-16 rounded-lg object-cover shadow">
                </td>
                <td class="px-4 py-3 text-center whitespace-nowrap font-meduim">${product.ref || "---"}</td>
                <td class="px-4 py-3 text-center whitespace-nowrap font-medium">${product.label}</td>
                <td class="px-4 py-3 text-center whitespace-nowrap font-semibold" dir="ltr">${product.discount_price || product.selling_price} DH</td>
                <td class="px-4 py-3 text-center whitespace-nowrap">${product.qte || ''}</td>
                <td class="px-4 py-3 text-center">
                    <select id="productVisibilitySelector" class="bg-gray-100 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300" onchange="changeProductVisibility(${product.id})" >
                        <option value="1" ${product.is_visible == 1 ? "selected" : ""}>مرئي</option>
                        <option value="0" ${product.is_visible == 0 ? "selected" : ""}>غير مرئي</option>
                    </select>
                </td>
                <!--<td class="px-4 py-3 text-center whitespace-nowrap">${new Date(product.created_at).toLocaleDateString()}</td>-->
                <td class="px-4 py-3 text-center whitespace-nowrap">${product.category.label || "----"}</td>
                <td class="px-4 py-3 text-center">
                    <div class="flex items-center justify-center gap-2">
                        <a href="NewProduct.html?id=${product.id}&action=edit"
                            class="bg-blue-500 text-white px-3 py-1.5 rounded-full hover:bg-blue-600 transition">
                            <i class="fas fa-edit"></i>
                        </a>
                        <button onclick="deleteProduct(${product.id})" class="bg-red-500 text-white px-3 py-1.5 rounded-full hover:bg-red-600 transition">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-red-500 py-3">Failed to load products.</td></tr>`;
    }
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