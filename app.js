/* ===========================
   Lista de Tareas con Progreso
   app.js — Lógica principal
=========================== */

// ── Estado de la aplicación ──────────────────────────────────────────────────
let tasks = [];      // Array de objetos { id, text, completed }
let nextId = 1;      // ID autoincremental

// ── Referencias al DOM ───────────────────────────────────────────────────────
const taskInput    = document.getElementById('taskInput');
const addBtn       = document.getElementById('addBtn');
const taskList     = document.getElementById('taskList');
const errorMsg     = document.getElementById('errorMsg');
const emptyState   = document.getElementById('emptyState');

// Contadores
const totalEl      = document.getElementById('total');
const completedEl  = document.getElementById('completed');
const pendingEl    = document.getElementById('pending');

// Barra de progreso
const progressFill  = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');


// ── Funciones de utilidad ─────────────────────────────────────────────────────

/**
 * Muestra un mensaje de error debajo del formulario.
 * El mensaje desaparece automáticamente después de 2.5 s.
 */
function showError(msg) {
  errorMsg.textContent = msg;
  clearTimeout(showError._timer);
  showError._timer = setTimeout(() => { errorMsg.textContent = ''; }, 2500);
}


// ── Renderizado ───────────────────────────────────────────────────────────────

/**
 * Construye y renderiza el elemento <li> de una tarea.
 * Registra los event listeners directamente en los botones.
 */
function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task-item' + (task.completed ? ' task-item--done' : '');
  li.dataset.id = task.id;

  // Checkbox visual
  const check = document.createElement('span');
  check.className = 'task-item__check';
  check.setAttribute('aria-hidden', 'true');
  check.textContent = task.completed ? '✓' : '';

  // Texto
  const text = document.createElement('span');
  text.className = 'task-item__text';
  text.textContent = task.text;

  // Contenedor de botones
  const actions = document.createElement('div');
  actions.className = 'task-item__actions';

  // Botón Completar
  const completeBtn = document.createElement('button');
  completeBtn.className = 'task-item__btn task-item__btn--complete';
  completeBtn.textContent = '✓ Completar';
  completeBtn.addEventListener('click', () => completeTask(task.id));

  // Botón Eliminar
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'task-item__btn task-item__btn--delete';
  deleteBtn.textContent = '✕ Eliminar';
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  actions.appendChild(completeBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(check);
  li.appendChild(text);
  li.appendChild(actions);

  return li;
}

/**
 * Vuelve a renderizar la lista completa y actualiza contadores.
 * Se llama tras cualquier cambio en el estado.
 */
function render() {
  // Limpia la lista actual
  taskList.innerHTML = '';

  // Renderiza cada tarea
  tasks.forEach(task => {
    taskList.appendChild(createTaskElement(task));
  });

  // Estado vacío
  emptyState.classList.toggle('visible', tasks.length === 0);

  // Actualizar contadores
  updateStats();
}

/**
 * Recalcula y muestra los contadores de progreso.
 */
function updateStats() {
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending   = total - completed;
  const pct       = total === 0 ? 0 : Math.round((completed / total) * 100);

  totalEl.textContent     = total;
  completedEl.textContent = completed;
  pendingEl.textContent   = pending;

  progressFill.style.width  = pct + '%';
  progressLabel.textContent = pct + '%';
}


// ── Acciones ──────────────────────────────────────────────────────────────────

/**
 * Agrega una nueva tarea al array y re-renderiza.
 */
function addTask() {
  const text = taskInput.value.trim();

  if (!text) {
    showError('⚠ El campo no puede estar vacío.');
    taskInput.focus();
    return;
  }

  tasks.push({ id: nextId++, text, completed: false });
  taskInput.value = '';
  errorMsg.textContent = '';
  render();
  taskInput.focus();
}

/**
 * Marca una tarea como completada por su ID.
 */
function completeTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = true;
    render();
  }
}

/**
 * Elimina una tarea por su ID.
 */
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  render();
}


// ── Event Listeners ───────────────────────────────────────────────────────────

// Clic en botón "Agregar"
addBtn.addEventListener('click', addTask);

// Enter en el input también agrega la tarea
taskInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    addTask();
  }
});


// ── Inicio ────────────────────────────────────────────────────────────────────
render(); // Renderizado inicial (lista vacía)