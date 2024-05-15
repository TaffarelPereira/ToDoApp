    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const filterInput = document.getElementById('filterInput');
    const clearButton = document.getElementById('clearButton');
    
    let taskId = 1;
    
    // Carrega as tarefas do localStorage ao iniciar
    loadTasks();
    
    // Função para adicionar uma nova tarefa
    function addTask(event) {
        event.preventDefault();
        const taskText = taskInput.value.trim();
    
        if (taskText !== "") {
            const taskItem = document.createElement('li');
            taskItem.dataset.taskId = taskId;
    
            taskItem.innerHTML = `
                <input type="checkbox" class="complete-checkbox">
                <span>${taskText}</span>
                <button class='delete-btn'>Deletar</button>
                <button class='edit-btn'>Editar</button>
            `;
    
            taskList.append(taskItem);
            taskInput.value = "";
            taskId++;
    
            // Adiciona eventos para os botões
            const deleteBtn = taskItem.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', deleteTask);
    
            const editBtn = taskItem.querySelector('.edit-btn');
            editBtn.addEventListener('click', editTask);
    
            // Adiciona evento para o checkbox
            const checkbox = taskItem.querySelector('.complete-checkbox');
            checkbox.addEventListener('change', toggleComplete);
    
            // Atualiza a contagem de tarefas
            updateTaskCount();
    
            // Salva as tarefas no localStorage
            saveTasks();
        }
    }
    
    // Função para deletar uma tarefa
    function deleteTask(event) {
        const taskItem = event.target.parentElement;
        taskList.removeChild(taskItem);
    
        // Atualiza a contagem de tarefas
        updateTaskCount();
    
        // Salva as tarefas no localStorage
        saveTasks();
    }
    
    // Função para editar uma tarefa
    function editTask(event) {
        const taskItem = event.target.parentElement;
        const taskText = taskItem.querySelector('span');
        const newTaskText = prompt("Editar tarefa:", taskText.textContent);
        if (newTaskText !== null) {
            taskText.textContent = newTaskText;
    
            // Salva as tarefas no localStorage
            saveTasks();
        }
    }
    
    // Função para marcar/desmarcar uma tarefa como completa
    function toggleComplete(event) {
        const taskItem = event.target.parentElement;
        const taskText = taskItem.querySelector('span');
        if (event.target.checked) {
            taskText.style.textDecoration = 'line-through';
            taskText.style.color = 'gray';
        } else {
            taskText.style.textDecoration = 'none';
            taskText.style.color = 'black';
        }
    
        // Salva as tarefas no localStorage
        saveTasks();
    }
    
    // Função para filtrar as tarefas
    function filterTasks() {
        const filterText = filterInput.value.toLowerCase();
        const tasks = taskList.querySelectorAll('li');
    
        tasks.forEach(task => {
            const taskText = task.querySelector('span').textContent.toLowerCase();
            if (taskText.includes(filterText)) {
                task.style.display = "block";
            } else {
                task.style.display = "none";
            }
        });
    }
    
    // Função para limpar todas as tarefas
    function clearTasks() {
        taskList.innerHTML = '';
        localStorage.removeItem('tasks');
        updateTaskCount();
    }
    
    // Função para atualizar a contagem de tarefas
    function updateTaskCount() {
        const taskCount = taskList.children.length;
        document.getElementById("taskCount").textContent = taskCount;
    }
    
    // Função para salvar as tarefas no localStorage
    function saveTasks() {
        const tasks = [];
        const taskItems = taskList.querySelectorAll('li');
    
        taskItems.forEach(item => {
            const taskText = item.querySelector('span').textContent;
            const isCompleted = item.querySelector('.complete-checkbox').checked;
            tasks.push({ text: taskText, completed: isCompleted });
        });
    
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Função para carregar as tarefas do localStorage
    /* function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTask({ preventDefault: () => {} });
            const taskItem = taskList.lastChild;
            taskItem.querySelector('span').textContent = task.text;
            if (task.completed) {
                taskItem.querySelector('.complete-checkbox').checked = true;
                taskItem.querySelector('span').style.textDecoration = 'line-through';
                taskItem.querySelector('span').style.color = 'gray';
            }
        });
    } */
    
    function loadTasks() {
        try {
            // Tenta analisar o dado do localStorage
            const tasks = JSON.parse(localStorage.getItem('tasks'));
    
            // Verifica se 'tasks' é um array válido
            if (Array.isArray(tasks)) {
                tasks.forEach(task => {
                    addTask({ preventDefault: () => {} });
                    const taskItem = taskList.lastChild;
                    taskItem.querySelector('span').textContent = task.text;
                    if (task.completed) {
                        taskItem.querySelector('.complete-checkbox').checked = true;
                        taskItem.querySelector('span').style.textDecoration = 'line-through';
                        taskItem.querySelector('span').style.color = 'gray';
                    }
                });
            } else {
                // Se o dado não for um array válido, limpa o localStorage
                localStorage.removeItem('tasks');
                console.warn("Dados inválidos no localStorage. Limpando dados.");
            }
        } catch (error) {
            // Captura qualquer erro durante a análise do JSON
            localStorage.removeItem('tasks');
            console.error("Erro ao carregar tarefas do localStorage:", error);
        }
    }
    
    // Adiciona os event listeners
    taskForm.addEventListener('submit', addTask);
    filterInput.addEventListener("input", filterTasks);
    clearButton.addEventListener('click', clearTasks);
