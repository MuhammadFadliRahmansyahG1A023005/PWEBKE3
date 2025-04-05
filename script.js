document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const totalTasksEl = document.getElementById('totalTasks');
    const completedTasksEl = document.getElementById('completedTasks');
    const remainingTasksEl = document.getElementById('remainingTasks');

    // Load tasks from localStorage
    loadTasks();

    // Event listeners
    addBtn.addEventListener('click', addTaskFromInput);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTaskFromInput();
        }
    });

    function addTaskFromInput() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            taskInput.focus();
            return;
        }
        
        addTask(taskText);
        taskInput.value = '';
        taskInput.focus();
    }

    function addTask(taskText, isCompleted = false, id = null) {
        const taskId = id || Date.now();
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item' + (isCompleted ? ' completed' : '');
        taskItem.setAttribute('data-id', taskId);
        
        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${isCompleted ? 'checked' : ''}>
            <p class="task-text">${taskText}</p>
            <div class="task-actions">
                <button class="task-btn edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="task-btn delete-btn" title="Hapus"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        
        // Hide empty state if tasks exist
        if (emptyState.style.display !== 'none') {
            emptyState.style.display = 'none';
        }
        
        // Add to top of list
        if (taskList.firstChild && taskList.firstChild.id !== 'emptyState') {
            taskList.insertBefore(taskItem, taskList.firstChild);
        } else {
            taskList.appendChild(taskItem);
        }
        
        // Add event listeners
        const checkbox = taskItem.querySelector('.task-checkbox');
        const deleteBtn = taskItem.querySelector('.delete-btn');
        const editBtn = taskItem.querySelector('.edit-btn');
        
        checkbox.addEventListener('change', function() {
            taskItem.classList.toggle('completed', this.checked);
            updateStats();
            saveTasks();
        });
        
        deleteBtn.addEventListener('click', function() {
            taskItem.classList.add('fade-out');
            setTimeout(() => {
                taskItem.remove();
                checkEmptyState();
                updateStats();
                saveTasks();
            }, 300);
        });
        
        editBtn.addEventListener('click', function() {
            const currentText = taskItem.querySelector('.task-text').textContent;
            const newText = prompt('Edit tugas:', currentText);
            if (newText !== null && newText.trim() !== '') {
                taskItem.querySelector('.task-text').textContent = newText.trim();
                saveTasks();
            }
        });
        
        updateStats();
        saveTasks();
    }
    
    function checkEmptyState() {
        if (taskList.children.length === 0 || 
            (taskList.children.length === 1 && taskList.firstChild.id === 'emptyState')) {
            emptyState.style.display = 'block';
        }
    }
    
    function updateStats() {
        const totalTasks = document.querySelectorAll('.task-item').length;
        const completedTasks = document.querySelectorAll('.task-item.completed').length;
        const remainingTasks = totalTasks - completedTasks;
        
        totalTasksEl.textContent = totalTasks;
        completedTasksEl.textContent = completedTasks;
        remainingTasksEl.textContent = remainingTasks;
    }
    
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(taskItem => {
            tasks.push({
                id: taskItem.getAttribute('data-id'),
                text: taskItem.querySelector('.task-text').textContent,
                completed: taskItem.querySelector('.task-checkbox').checked
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            JSON.parse(savedTasks).forEach(task => {
                addTask(task.text, task.completed, task.id);
            });
            checkEmptyState();
            updateStats();
        }
    }
});