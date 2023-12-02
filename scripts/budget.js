const categories = ["Utilities" ,
                    "Rent" ,
                    "Groceries" ,
                    "Outside Food" ,
                    "Gas & Car" ,
                    "Entertainment event" ,
                    "Entertainment item" ,
                    "Pet Food" ,
                    "Clothing" ,
                    "Bathroom supplies"];

const form = document.getElementById("budgetForm");
const dateElement = document.getElementById('purchaseDate');
const categoryElement = document.getElementById("category");
const dummy = document.getElementById("dummy");


function budgetSubmit() {
    let serializedInputValue = "";
    for (const inputElement of form.elements) {
        serializedInputValue += inputElement.value + "\t";
    }

    if (checkSerializedValue(serializedInputValue)) {
        dummy.innerHTML = serializedInputValue;
        resetForm();

        return serializedInputValue;
    }
};

function resetForm() {
    form.reset();
    dateElement.valueAsDate = new Date();
}

function addCategoryOption(categoryText) {
    const newOption = document.createElement("option");
    newOption.value = categoryText;
    newOption.innerHTML = categoryText;

    categoryElement.appendChild(newOption);
}

function checkSerializedValue(serializedValue) {
    //const regexPattern = /^.+,\d+(\.\d{0,2})?,\d{4}-\d{2}-\d{2},.+,$/; // comma seperated
    const regexPattern = /^.+\s\d+(\.\d{0,2})?\s\d{4}-\d{2}-\d{2}\s.+\s$/; // tab
    if (!regexPattern.test(serializedValue)) {
        alert("Please fill out form correctly");
        return false;
    }
    return true;
}

resetForm();
categories.forEach((category) => addCategoryOption(category));