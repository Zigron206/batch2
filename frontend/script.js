const API_URL = "http://127.0.0.1:8000";

const tbody = document.getElementById("students-body");
const message = document.getElementById("message");

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

        const actionCell = document.createElement("td");
        const btn = document.createElement("button");
        btn.textContent = "Delete";
        btn.className = "delete-btn";
        btn.dataset.id = s.id;
        actionCell.appendChild(btn);
        row.appendChild(actionCell);

        tbody.appendChild(row);
    }
}

async function loadStudents() {

    try {
        const response = await fetch(`${API_URL}/students`);
        
        if (!response.ok) {
            throw new Error("there is an error on server");
        }

        const students = await response.json();

        renderStudents(students)
    } catch(error){
        console.error("can not load the students",error)
        message.style.color='red'
    }
    
}

loadStudents()