const API_URL = "http://127.0.0.1:8000";

const tbody = document.getElementById("students-body");
const message = document.getElementById("message");
const form = document.getElementById("student-form");

function makeCell(text) {
    const td = document.createElement("td");
    td.textContent = text;
    return td;
}

function renderStudents(list) {
    tbody.innerHTML = "";
    if (list.length === 0) {
        const row = document.createElement("tr");
        const cell = makeCell("No students yet.");
        cell.colSpan = 5;
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    for (const s of list) {
        const row = document.createElement("tr");

        row.appendChild(makeCell(s.id));
        row.appendChild(makeCell(s.name));
        row.appendChild(makeCell(s.age));
        row.appendChild(makeCell(s.city));

        // The last cell holds the Delete button (it will work in Part 6)
        const actionCell = document.createElement("td");
        const btn = document.createElement("button");
        btn.textContent = "Delete";
        btn.className = "delete-btn";
        btn.dataset.id = s.id;


        btn.addEventListener("click", () => {
            deleteStudent(s.id,s.name);
        })


        actionCell.appendChild(btn);
        row.appendChild(actionCell);

        tbody.appendChild(row);
    }
}

async function loadStudents() {
    try {
        const response = await fetch(`${API_URL}/students`);
        if (!response.ok) {
            throw new Error(`Server replied with status ${response.status}`);
        }

        const students = await response.json();
        renderStudents(students);
    } catch (error) {
        console.error("Could not load students:", error);
        message.textContent = "Could not load students. Check the console.";
        message.style.color = "red";
    }
}

async function addStudent(newStudent) {
    try {
        const response = await fetch(`${API_URL}/students`, {
            method: "POST",
            headers: {"content-Type": "application/json"},
            body: JSON.stringify(newStudent),
        });


        if (!response.ok) {
            throw new Error(`Server replied ${response.status}`)
        }

        const saved = await response.json()

        message.textContent = `Added ${saved.name}`;
        message.style.color = "green";

        form.reset();
        await loadStudents()
    } catch (error) {
        console.error("could not add the student", error);
        message.textContent = "Could not add the student";
        message.style.color = "red";
    }
}

async function deleteStudent(id,name) {
    const sure = confirm(`Delete ${name}?`);
    if (!sure) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/students/${id}`, { method: "DELETE"});

        if (response.status===404){
            message.textContent = `${name} not found / check server as well`;
            message.style.color = 'orange';
            await loadStudents();
            return;
        }

        if (!response.ok) {
            throw new Error(`server replied with ${response.status}`);
        }

        message.textContent = `Deleted ${name}.`
        message.style.color = "green";
        await loadStudents();
    } catch (error) {
        console.error("could not delete the student: ",error);
        message.textContent="Could not delete the student"
        message.style.color="red";
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const age = Number(document.getElementById("age").value);
    const city = document.getElementById("city").value.trim();

    addStudent({ name, age, city });
});

loadStudents()