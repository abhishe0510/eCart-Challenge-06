let inventoryList = document.getElementById("inventory-list");
let startProduct = document.getElementById("start-product");
let endProduct = document.getElementById("end-product");
let checkButton = document.getElementById("check-btn");
let resetButton = document.getElementById("reset-btn");
let result = document.getElementById("result");
let totalProducts = document.getElementById("total-products");
let totalStock = document.getElementById("total-stock");
let lowStockCount = document.getElementById("low-stock-count");

inventory.sort(function(a, b) {
    return a.name.localeCompare(b.name);
});



function displayProducts() {

    inventoryList.innerHTML = "";

    for (let i = 0; i < inventory.length; i++) {

        let product = document.createElement("div");

        product.className = "product";

        let status = "";
        let stockClass = "";

        if (inventory[i].stock === 0) {
            status = "Out of Stock";
            stockClass = "out-of-stock";
        }
        else if (inventory[i].stock <= 15) {
            status = "Low Stock";
            stockClass = "low-stock";
        }
        else {
            status = "In Stock";
            stockClass = "in-stock";
        }

        product.innerHTML =
            "<h3>" + inventory[i].name + "</h3>" +
            "<p class='" + stockClass + "'>Stock: " +
            inventory[i].stock + "</p>" +
            "<p class='" + stockClass + "'>" +
            status + "</p>";

        inventoryList.appendChild(product);
    }
}


function fillDropdowns() {

    for (let i = 0; i < inventory.length; i++) {

        let option1 = document.createElement("option");
        option1.value = inventory[i].name;
        option1.textContent = inventory[i].name;

        let option2 = document.createElement("option");
        option2.value = inventory[i].name;
        option2.textContent = inventory[i].name;

        startProduct.appendChild(option1);
        endProduct.appendChild(option2);
    }
}


let prefixSum = [];

function createPrefixSum() {

    let total = 0;

    for (let i = 0; i < inventory.length; i++) {

        total = total + inventory[i].stock;

        prefixSum[i] = total;
    }
}



function binarySearch(productName) {

    let left = 0;
    let right = inventory.length - 1;

    while (left <= right) {

        let middle = Math.floor((left + right) / 2);

        if (inventory[middle].name === productName) {
            return middle;
        }

        if (inventory[middle].name < productName) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }
    }

    return -1;
}



function checkInventory() {

    let startName = startProduct.value;
    let endName = endProduct.value;

    if (startName === "" || endName === "") {

        result.textContent = "Please select both products.";
        return;
    }

    let startIndex = binarySearch(startName);
    let endIndex = binarySearch(endName);

    if (startIndex === -1 || endIndex === -1) {

        result.textContent = "Product not found.";
        return;
    }

    if (startIndex > endIndex) {

        let temp = startIndex;
        startIndex = endIndex;
        endIndex = temp;

        let tempName = startName;
        startName = endName;
        endName = tempName;
    }

    let total;

    if (startIndex === 0) {
        total = prefixSum[endIndex];
    } else {
        total = prefixSum[endIndex] - prefixSum[startIndex - 1];
    }

    let productCount = endIndex - startIndex + 1;

    let productNames = "";

    for (let i = startIndex; i <= endIndex; i++) {
        productNames = productNames + inventory[i].name + "<br>";
    }

    result.innerHTML =
        "<strong>Products in Range:</strong><br>" +
        productNames +
        "<br>" +
        "Total Products: " + productCount +
        "<br>" +
        "Total Inventory: " + total;
}

function displaySummary() {

    let stock = 0;
    let lowStock = 0;

    for (let i = 0; i < inventory.length; i++) {

        stock = stock + inventory[i].stock;

        if (inventory[i].stock <= 15) {
            lowStock++;
        }
    }

    totalProducts.innerText = inventory.length;
    totalStock.innerText = stock;
    lowStockCount.innerText = lowStock;
}

function resetInventory() {

    startProduct.value = "";
    endProduct.value = "";

    result.textContent =
        "Select a range to see the total inventory.";
}

checkButton.addEventListener("click", checkInventory);
resetButton.addEventListener("click", resetInventory);

displayProducts();
fillDropdowns();
createPrefixSum();
displaySummary();