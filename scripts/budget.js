let categories = [];

const form = document.getElementById("budgetForm");
const dateElement = document.getElementById('purchaseDate');
const categoryElement = document.getElementById("category");
const newCategoryElement = document.getElementById("newCategory");
const newCategoryButtonElement = document.getElementById("newCategoryButton");
const deleteModeElement = document.getElementById("deleteMode");
const budgetTable = document.getElementById("budgetTable");
const budgetTableBody = document.getElementById("budgetTable").tBodies[0];


async function budgetSubmit() {
    let serializedInputValue = "";
    for (const inputElement of form.elements) {
        if (!inputElement.className.includes("form_ignore")) {
            serializedInputValue += inputElement.value + "\t";
        }
    }
    serializedInputValue = serializedInputValue.trim();
    if (checkSerializedValue(serializedInputValue)) {
        await fetch_post_helper("/budget", serializedInputValue);

        resetForm();
        await buildTable();
        return serializedInputValue;
    }
};

function resetForm() {
    form.reset();
    refreshCategories();
    dateElement.valueAsDate = new Date();
}

function addCategoryOptionElement(categoryText) {
    const newOption = document.createElement("option");
    newOption.value = categoryText;
    newOption.innerHTML = categoryText;

    categoryElement.appendChild(newOption);
}

function checkSerializedValue(serializedValue) {
    const regexPattern = /^\w+\t\d+(\.\d{0,2})?\t[^\t]+\t\d{4}-\d{2}-\d{2}$/; // tab separated
    if (!regexPattern.test(serializedValue)) {
        alert("Please fill out form correctly");
        return false;
    }
    return true;
}

async function refreshCategories() {
    categoryElement.innerHTML = "(<option value=\"\">-- Select --</option>)";

    const categoriesFetch = await fetch("/budget/categories.list");
    categories = await categoriesFetch.text();
    categories = categories.trim().split(/\r?\n/);
    categories.forEach((category) => addCategoryOptionElement(category));
}

function addNewCategory() {
    let newCategory = newCategoryElement.value.trim();
    newCategory = newCategory.charAt(0).toUpperCase() + newCategory.slice(1);

    if (categories.includes(newCategory)) {
        alert("Category already exists!");
    } else if (newCategory !== "" && window.confirm(`Add new category ${newCategory}?`)) {
        fetch_post_helper("/budget/addcategory", newCategory);
        newCategoryElement.value = "";
        resetForm();
    }
}

async function fetch_post_helper(url, body) {
    await fetch(url, {
        method: "POST",
        body: JSON.stringify({data:body}),
        headers: {'Content-type': 'application/json; charset=UTF-8'},
    });
}

async function buildTable() {
    let data = await fetch("/budget/data");
    data = await data.text();
    budgetTableBody.replaceChildren();
    if (!data) {return false;}
    data = data.trim().split(/\r?\n/);
    data = data.map((entry) => entry.split("\t"));

    for (entry of data) {
        console.log(entry)
        const newRow = document.createElement("tr");
        newRow.onclick = dataRowOnClick;
        for (elem of entry) {
            const newEntry = document.createElement("td");
            newEntry.innerHTML = elem;
            newRow.appendChild(newEntry);
        }
        budgetTableBody.appendChild(newRow);
    }

    for (row of budgetTableBody.rows) { // format cost values to look better
        const costCell = row.cells[1];
        costValue = costCell.innerText;
        let decimalIndex = costValue.indexOf(".");
        if (decimalIndex >= 0) {
            costCell.innerText = costValue.concat("0".repeat(decimalIndex-costValue.length+3));
        } else {
            costCell.innerText = costValue.concat(".00");
        }
    }
}

async function dataRowOnClick(event) {
    const entryToRemove = event.currentTarget.innerText;
    if (deleteModeElement.checked && confirm(`Delete entry ${entryToRemove}`)) {
        await fetch_post_helper("/budget/remove", entryToRemove);
        await buildTable();
    }
}

function main() {
    newCategoryButtonElement.onclick = (e) => {
        addNewCategory(e);
        return false; // stop propagating
    };
    resetForm();
    buildTable();
}

main();
