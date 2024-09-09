const weeklyTasks = {
    'Tuesday 09/03/2024': [
        {'subject': 'Algebra 1 (H)', 'details': 'Agenda:\nDMR\nCompound Inequality Problem Solving\nCompound Inequality Additional Practice'},
        {'subject': 'Geography 7', 'details': 'Different Types of Maps, GPS, Map Projections'},
        {'subject': 'Life Science 7', 'details': 'Agenda: Continue classification of life notes. Discussed Archaebacteria, Eubacteria & protists (end at movement of protists)'},
        {'subject': 'Spanish 2-NH2', 'details': 'En la clase: Berto Chapters 1 and 2'}
    ],
    // ... (include the rest of the week's tasks)
};

function createTodoList() {
    const todoList = document.getElementById("todoList");
    
    for (const [day, tasks] of Object.entries(weeklyTasks)) {
        const dayDiv = document.createElement("div");
        dayDiv.className = "day";
        dayDiv.innerHTML = `<h2>${day}</h2>`;
        
        tasks.forEach(task => {
            const taskDiv = document.createElement("div");
            taskDiv.className = "task";
            const taskId = `${day}-${task.subject.replace(/\s+/g, '-')}`;
            taskDiv.innerHTML = `
                <input type="checkbox" id="${taskId}" name="${taskId}">
                <label for="${taskId}">
                    <strong>${task.subject}</strong><br>
                    ${task.details}
                </label>
            `;
            dayDiv.appendChild(taskDiv);
        });

        const dayActionsDiv = document.createElement("div");
        dayActionsDiv.className = "day-actions";
        dayActionsDiv.innerHTML = `
            <textarea id="${day}-notes" placeholder="Add your notes for ${day} here. If you didn't complete all assignments, please explain why."></textarea>
            <button onclick="sendDailyReport('${day}')">Send ${day}'s Report</button>
        `;
        dayDiv.appendChild(dayActionsDiv);
        
        todoList.appendChild(dayDiv);
    }
    loadSavedState();
}

function saveState() {
    const state = {};
    document.querySelectorAll('.task input[type="checkbox"], textarea').forEach(el => {
        state[el.id] = el.type === 'checkbox' ? el.checked : el.value;
    });
    localStorage.setItem('todoListState', JSON.stringify(state));
}

function loadSavedState() {
    const savedState = JSON.parse(localStorage.getItem('todoListState')) || {};
    Object.entries(savedState).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = value;
            } else if (element.tagName === 'TEXTAREA') {
                element.value = value;
            }
        }
    });
}

function sendDailyReport(day) {
    const report = generateDailyReport(day);
    document.getElementById('reportText').value = report;
    document.getElementById('reportModal').style.display = 'block';
}

function generateDailyReport(day) {
    const dayDiv = document.querySelector(`.day:has(h2:contains('${day}'))`);
    const completedTasks = [];
    const incompleteTasks = [];

    dayDiv.querySelectorAll('.task').forEach(task => {
        const checkbox = task.querySelector('input[type="checkbox"]');
        const label = task.querySelector('label');
        
        if (checkbox.checked) {
            completedTasks.push(label.textContent.trim());
        } else {
            incompleteTasks.push(label.textContent.trim());
        }
    });

    const notes = document.getElementById(`${day}-notes`).value;

    return `
Daily Status Report for ${day}

Completed Tasks:
${completedTasks.join('\n')}

Incomplete Tasks:
${incompleteTasks.join('\n')}

Notes:
${notes}
    `.trim();
}

// Close modal when clicking on <span> (x)
document.querySelector('.close').onclick = function() {
    document.getElementById('reportModal').style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    if (event.target == document.getElementById('reportModal')) {
        document.getElementById('reportModal').style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', createTodoList);

// Add event listeners to save state when checkboxes or textareas change
document.addEventListener('change', function(e) {
    if (e.target.type === 'checkbox' || e.target.tagName === 'TEXTAREA') {
        saveState();
    }
});
