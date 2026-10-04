let inventoryList = document.getElementById("inventory-list");
let startProduct = document.getElementById("start-product");
let endProduct = document.getElementById("end-product");
let checkButton = document.getElementById("check-btn");
let resetButton = document.getElementById("reset-btn");
let result = document.getElementById("result");


inventory.sort(function(a, b) {
    return a.name.localeCompare(b.name);
});



function displayProducts() {

    inventoryList.innerHTML = "";

    for (let i = 0; i < inventory.length; i++) {

        let product = document.createElement("div");

        product.className = "product";

        let warning = "";
        let stockClass = "";

        if (inventory[i].stock <= 15) {
            stockClass = "low-stock";
            warning = "<p class='low-stock'>⚠️ Low Stock</p>";
        }

        product.innerHTML =
            "<h3>" + inventory[i].name + "</h3>" +
            "<p class='" + stockClass + "'>Stock: " + inventory[i].stock + "</p>" +
            warning;

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

        result.textContent =
            "Start product must come before end product.";

        return;
    }


    let total;

    if (startIndex === 0) {
        total = prefixSum[endIndex];
    } else {
        total = prefixSum[endIndex] - prefixSum[startIndex - 1];
    }


    result.textContent =
        "Total inventory from " +
        startName +
        " to " +
        endName +
        " = " +
        total;
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