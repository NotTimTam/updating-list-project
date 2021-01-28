"use strict";

// The general user template.
class User {
    constructor (fullName, id, dob, origin, destination, dateLeaving, dateReturning, bagCount, mealType, legroom, windowSeat, headphones, extraFood) {
        this.fullName = fullName;
        this.id = id;
        this.dob = dob;
        this.origin = origin;
        this.destination = destination;
        this.dateLeaving = dateLeaving;
        this.dateReturning = dateReturning;
        this.bagCount = bagCount;
        this.mealType = mealType;
        this.legroom = legroom;
        this.windowSeat = windowSeat;
        this.headphones = headphones;
        this.extraFood = extraFood;
    }
}

// User list and ID tracking.
let userList = [];
let userID = 1;

// Time and date information.
let date = new Date();
let year = date.getFullYear();

// Add the inputted data, as a user, to the list.
function addToList() {
    // General Inputs
    let fullName = document.getElementById("fullName").value;
    let dob = document.getElementById("dob").value;
    let origin = document.getElementById("origin").value;
    let destination = document.getElementById("destination").value;
    let dateLeaving = document.getElementById("leave").value;
    let dateReturning = document.getElementById("return").value;
    let bagCount = document.getElementById("bagCount").value;
    
    // Radios (sets mealType to output)
    let radios = document.getElementsByName('meal');
    let mealType = "Chicken";
    for (let i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            mealType = radios[i].value;
            break;
        }
    }

    // Checkboxes
    let legroom = document.getElementById("legroom").checked;
    let windowSeat = document.getElementById("windowSeat").checked;
    let headphones = document.getElementById("headphones").checked;
    let extraFood = document.getElementById("extraFood").checked;

    if (fullName != "" && dob != "" && origin != "" && destination != "" && dateLeaving != "" && dateReturning != "") {
        // Check if the user already exists.
        let foundUser = false;
        let userIDFound = null;
        for(let i = 0; i < userList.length; i++) {
            if (userList[i].fullName == fullName) {
                foundUser = true;
                userIDFound = i;
                break;
            }
        }
let user = {}
        console.log(foundUser);

        if (foundUser) {
            console.log("editing a user.")
            user = userList[userIDFound];

            user.fullName = fullName;
            user.userID = userID;
            user.dob = dob;
            user.origin = origin;
            user.destination = destination;
            user.dateLeaving = dateLeaving;
            user.dateReturning = dateReturning;
            user.bagCount = bagCount;
            user.mealType = mealType;
            user.legroom = legroom;
            user.windowSeat = windowSeat;
            user.headphones = headphones;
            user.extraFood = extraFood;
        } else {
            console.log("creating a user.")
            user = new User (fullName, userID, dob, origin, destination, dateLeaving, dateReturning, bagCount, mealType, legroom, windowSeat, headphones, extraFood);
        }

        console.log(user);
        
        // Can they drink.
        let birthYear = user.dob.split('-')[0];
        if (year-birthYear >= 21) {
            user.canDrink = true;
        } else {
            user.canDrink = false;
        }

        // Extra costs.
        user.extraCost = 0;
        user.extraCost += (20 * user.bagCount);
        if (legroom) {
            user.extraCost += 10;
        }
        if (windowSeat) {
            user.extraCost += 10;
        }
        if (headphones) {
            user.extraCost += 10;
        }
        if (extraFood) {
            user.extraCost += 10;
        }

        // Duration of trip.
        let start = new Date(dateLeaving);
        let end = new Date(dateReturning);

        let timeDuration = end.getTime() - start.getTime(); 
        let dateDuration = timeDuration / (1000 * 3600 * 24);

        user.tripDuration = dateDuration;
        
        if (!foundUser) {    
            userID++;
            userList.push(user);
        }

        // Clear inputs.
        document.getElementById("fullName").value = "";
        document.getElementById("dob").value = "";
        document.getElementById("origin").value = "";
        document.getElementById("destination").value = "";
        document.getElementById("leave").value = "";
        document.getElementById("return").value = "";
        document.getElementById("bagCount").value = "";
        document.getElementById("error").innerHTML = `<div style="color: green;">Form submitted.</div>`;
    } else {
        document.getElementById("error").innerHTML = `<div style="color: red;">Not all information filled out!</div>`;
    }

    updateUserList();
}

// Print out all users.
function print(list) {
    let printSpace = document.getElementById("dataOutput");

    printSpace.innerHTML = "";
    for (let i = 0; i < list.length; i++) {
        printSpace.innerHTML += `<button class="user-button" onclick="displayUser('${list[i].fullName}');">${list[i].id}: ${list[i].fullName} | Click to View </button>`;
    }
}

// Print out users by sorted array.
function printSorted(key) {
    // Copy the array, sort, and print.
    let sortedList = JSON.parse(JSON.stringify(userList));
    sortedList.sort(sortArray(key));
    print(sortedList);
}

function sortArray(key) {
    return function(a, b) {
        a = a[key];
        b = b[key];

        let type = null;
        // MR PECK DOES NOT LIKE >:| (typeof(a) === 'string' || typeof(b) === 'string') ? 'string' : 'number';
        
        if (typeof(a) === 'string' || typeof(b) === 'string') {
            type = 'string';
        } else {
            type = 'number';
        }
        
        let result = null;
        if (type === 'string')  {
            result = a.localeCompare(b);
        } else {
            result = a - b;
        }
        return result;
    }
}

// Update list of available users.
function updateUserList() {
    let listing = document.getElementById("userList");
    listing.innerHTML = `<option value="">Choose a Name</option></select>`;

    // Else we run through normally.
    for(let i = 0; i < userList.length; i++) {
        listing.innerHTML += `<option value="${userList[i].fullName}">${userList[i].fullName}</option>`;
    }
}

// Print out specific user data.
function displayUser(name) {
    let printSpace = document.getElementById("dataOutput");

    printSpace.innerHTML = "";

    // If the name is blank we just return at this point.
    if (name == "") {
        return;
    }

    // Get the user we want to display.
    let activeUser = "Error: Data Mismatch.";
    for(let i = 0; i < userList.length; i++) {
        if (userList[i].fullName == name) {
            activeUser = userList[i];
            break;
        }
    }

    // Display that User.
    printSpace.innerHTML = `
    <h4>${activeUser.fullName}</h4>
    <h5>Personal Info</h5>
    <p>Account ID: ${activeUser.id}</p>
    <p>Date of Birth: ${activeUser.dob}</p>
    <h5>Flight Info</h5>
    <p>Trip Origin: ${activeUser.origin}</p>
    <p>Trip Destination: ${activeUser.destination}</p>
    <p>Leaving Flight Date: ${activeUser.dateLeaving}</p>
    <p>Returning Flight Date: ${activeUser.dateReturning}</p>
    <h5>Extra Info</h5>
    <p>Bags: ${activeUser.bagCount}</p>
    <p>Meal Choice: ${activeUser.mealType}</p>
    <hr>
    <p>${((activeUser.legroom == true) ? 'Extra legroom requested.' : 'No need for extra legroom...')}</p>
    <hr>
    <p>${((activeUser.windowSeat == true) ? 'Window seat requested.' : 'No need for window seat...')}</p>
    <hr>
    <p>${((activeUser.headphones == true) ? 'Headphones requested.' : 'No need for headphones...')}</p>
    <hr>
    <p>${((activeUser.extraFood == true) ? 'Extra food requested.' : 'No need for extra food...')}</p>
    <hr>
    <button class="inlineButton" onclick="editUser('${activeUser.fullName}'); location.href = '#top';">Edit User</button>`;

    document.getElementById("userList").value = "";
}

// Re-add user data.
function editUser(name) {
    // Get the user we want to display.
    let activeUser = "Error: Data Mismatch.";
    for(let i = 0; i < userList.length; i++) {
        if (userList[i].fullName == name) {
            activeUser = userList[i];
            break;
        }
    }

    // General Inputs
    document.getElementById("fullName").value = activeUser.fullName;
    document.getElementById("dob").value = activeUser.dob;
    document.getElementById("origin").value = activeUser.origin;
    document.getElementById("destination").value = activeUser.destination;
    document.getElementById("leave").value = activeUser.dateLeaving;
    document.getElementById("return").value = activeUser.dateReturning;
    document.getElementById("bagCount").value = activeUser.bagCount;
    
    // Radios (sets mealType to output)
    document.getElementById(activeUser.mealType).checked = true;

    // Checkboxes
    (activeUser.legroom == true) ? document.getElementById("legroom").checked = true : document.getElementById("legroom").checked = false;
    (activeUser.windowSeat == true) ? document.getElementById("windowSeat").checked = true : document.getElementById("windowSeat").checked = false;
    (activeUser.headphones == true) ? document.getElementById("headphones").checked = true : document.getElementById("headphones").checked = false;
    (activeUser.extraFood == true) ? document.getElementById("extraFood").checked = true : document.getElementById("extraFood").checked = false;

    let printSpace = document.getElementById("dataOutput");
    printSpace.innerHTML = "";
}