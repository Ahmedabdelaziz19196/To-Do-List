let submitButton = document.querySelector(".submit");
let nameInput = document.querySelector(".name-input");
let theName = document.querySelector(".name");
let nameForm = document.querySelector(".intro-name");
let theMainPage = document.querySelector(".main-page");
let greeting = document.querySelector(".time");
let addButton = document.querySelector(".add-note");
let addButtonM = document.querySelector(".add-m");
let inputNote = document.querySelector(".toDo-input");
let noteArea = document.querySelector(".notes-area");
let logOut = document.querySelector(".log-out");

let createdElement = 0;
window.addEventListener("load", function () {
    nameInput.focus();
});

nameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        submitButton.click();
    }
});
inputNote.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addButton.click();
    }
});

//get name from local Storage
if (window.localStorage.getItem("name")) {
    theName.textContent = window.localStorage.getItem("name");
    greeting.textContent = window.localStorage.getItem("time");
    nameForm.style.opacity = "0";
    theMainPage.style.display = "flex";

    //initialize Event Listeners
    initializeEventListeners();
}

if (window.localStorage.getItem("the notes")) {
    let savedNotes = localStorage.getItem("the notes").split(",");
    savedNotes.forEach((noteText) => {
        if (noteText.trim() !== "") {
            displaySavedNote(noteText.trim());
        }
    });
}

submitButton.addEventListener("click", function () {
    if (nameInput.value !== "" && Number.isNaN(+nameInput.value)) {
        //set the name
        theName.innerHTML = nameInput.value.trim();
        nameForm.style.opacity = "0";
        theMainPage.style.display = "flex";
        inputNote.focus();
        //Set Greeting
        greeting.innerHTML = getGreeting();

        //initialize Event Listeners
        initializeEventListeners();

        //set local Storage
        setLocalStorage();
    }
});
//initialize Event Listeners
function initializeEventListeners() {
    // Add note
    addButton.addEventListener("click", checkNotes);
    addButtonM.addEventListener("click", checkNotes);

    //check the note
    noteArea.addEventListener("click", checkNote);

    // delete the note
    noteArea.addEventListener("click", deleteNote);

    //edit the Note
    noteArea.addEventListener("click", editNote);
}

//Set Greeting
function getGreeting() {
    let hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return " Good morning";
    } else if (hour >= 12 && hour < 17) {
        return " Good afternoon";
    } else if (hour >= 17 && hour < 21) {
        return " Good evening";
    } else {
        return " Good night";
    }
}

// Add note
function addNote() {
    if (inputNote.value !== "") {
        createdElement++;
        let note = document.createElement("div");
        note.classList.add("note");

        let checkNote = document.createElement("div");
        checkNote.classList.add("check-note");

        // let checkBox = document.createElement("input");
        // checkBox.type = "checkbox";
        // checkBox.id = `check${createdElement}`;
        // checkBox.classList.add("checkbox");

        let theNoteLabel = document.createElement("label");
        theNoteLabel.htmlFor = `check${createdElement}`;
        theNoteLabel.classList.add("the-label");

        let theNote = document.createTextNode(inputNote.value);

        theNoteLabel.appendChild(theNote);

        // checkNote.appendChild(checkBox);
        checkNote.appendChild(theNoteLabel);

        note.appendChild(checkNote);

        let editIcon = document.createElement("i");
        editIcon.className = "edit fas fa-edit";
        let trashIcon = document.createElement("i");
        trashIcon.className = "trash fa-solid fa-trash";

        note.appendChild(editIcon);
        note.appendChild(trashIcon);

        noteArea.appendChild(note);
        inputNote.value = "";
        setLocalNotes();
    }
}

//check the note
function checkNote(e) {
    if (e.target.classList.contains("check-note")) {
        let theLabel = e.target.querySelector(".the-label");
        if (theLabel) {
            theLabel.classList.toggle("finished");
            setLocalNotes();
        }
    }
}

//delete the note
function deleteNote(e) {
    if (e.target.classList.contains("trash")) {
        e.target.parentNode.remove();
        setLocalNotes();
    }
}

//check the note
function checkNotes() {
    if (noteArea.children.length === 0) {
        addNote();
    } else {
        let allNotes = document.querySelectorAll(".notes-area .the-label");
        let isFound = false;
        allNotes.forEach((ele) => {
            if (ele.textContent.trim() === inputNote.value.trim()) {
                isFound = true;
            }
        });
        if (isFound === true) {
            inputNote.value = "";
        } else {
            addNote();
        }
    }
}

//edit the note
function editNote(e) {
    if (e.target.classList.contains("edit")) {
        let theNote = e.target.parentNode.querySelector(".the-label");
        let checkNote = e.target.parentNode.querySelector(".check-note");
        checkNote.style.opacity = 0;
        let editIcon = e.target.parentNode.querySelector(".edit");
        editIcon.style.opacity = 0;
        let trashIson = e.target.parentNode.querySelector(".trash");
        trashIson.style.opacity = 0;

        let theEditArea = document.createElement("div");
        theEditArea.classList.add("edit-area");

        let updateInput = document.createElement("input");
        updateInput.classList.add("update-input");
        let updateButton = document.createElement("button");
        updateButton.classList.add("update-button");

        updateButton.textContent = "Update";

        theEditArea.appendChild(updateInput);
        theEditArea.appendChild(updateButton);

        e.target.parentNode.appendChild(theEditArea);

        updateInput.value = theNote.textContent;
        updateInput.focus();

        updateInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                updateButton.click();
            }
        });
        updateButton.onclick = () => {
            theNote.textContent = updateInput.value;
            theEditArea.style.display = "none";
            checkNote.style.opacity = 1;
            editIcon.style.opacity = 1;
            trashIson.style.opacity = 1;
            setLocalNotes();
        };
    }
}

//set name to local Storage
function setLocalStorage() {
    window.localStorage.setItem("name", nameInput.value);
    window.localStorage.setItem("time", getGreeting());
}

//set notes to local Storage
function setLocalNotes() {
    let notes = [];
    let allNotes = document.querySelectorAll(".notes-area .note");

    allNotes.forEach((note) => {
        let label = note.querySelector(".the-label");
        let isFinished = label.classList.contains("finished") ? "1" : "0";
        notes.push(label.textContent + "|" + isFinished);
    });

    window.localStorage.setItem("the notes", notes);
}

//display the saved notes
function displaySavedNote(noteText) {
    createdElement++;

    let parts = noteText.split("|");
    let actualText = parts[0];
    let isFinished = parts[1] === "1";

    let note = document.createElement("div");
    note.classList.add("note");

    let checkNoteDiv = document.createElement("div");
    checkNoteDiv.classList.add("check-note");

    let theNoteLabel = document.createElement("label");
    theNoteLabel.htmlFor = `check${createdElement}`;
    theNoteLabel.classList.add("the-label");
    theNoteLabel.textContent = actualText;

    if (isFinished) {
        theNoteLabel.classList.add("finished");
    }

    checkNoteDiv.appendChild(theNoteLabel);
    note.appendChild(checkNoteDiv);

    let editIcon = document.createElement("i");
    editIcon.className = "edit fas fa-edit";
    let trashIcon = document.createElement("i");
    trashIcon.className = "trash fa-solid fa-trash";

    note.appendChild(editIcon);
    note.appendChild(trashIcon);

    noteArea.appendChild(note);
}

logOut.addEventListener("click", function () {
    if (window.localStorage.getItem("name")) {
        window.localStorage.removeItem("name");
    }
    if (window.localStorage.getItem("time")) {
        window.localStorage.removeItem("time");
    }
    if (window.localStorage.getItem("the notes")) {
        window.localStorage.removeItem("the notes");
    }
    setTimeout(() => {
        window.alert("WARNING, You Will Lose All Your Data");
        window.location.reload();
    }, 500);
});
