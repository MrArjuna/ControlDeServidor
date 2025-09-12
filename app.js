// Configuración del Check-in
const CONFIG = {
  scriptUrl: 'https://script.google.com/macros/s/AKfycbwz35vUShpFPB8gZ9-47JbgLZY5lLcSCxO8tiolI33thH8bIgMs4RLvQ1aRMapcnorg/exec',
  empresas: [
    "Tatuus 5", "Tatuus Archivo", "Server 1", "Server 2", "Server 3", "Server 4",
    "EALegal", "RRB", "Floyd", "Royal Assets", "Mallory", "Quatro", "Zeitten"
  ],
  categorias: {
    "Servidor": ["Realizar actualizaciones", "Reiniciar", "Reinicio Automatico Habilitado"],
    "RDSG": ["Se actualizaron certificados"],
    "TS PLUS": ["Se realizo actualización"],
  },
  categoriasEmpresa: {
    "Tatuus 3": ["TS PLUS"],
    "Zeitten": ["TS PLUS"],
  }
};

// Datos de los temporizadores
const vencimientosOriginales = [
  { empresa: "EALegal RSDG", fecha: "2025-07-18T14:00:00", nota: "" },
  { empresa: "EALegal Contabilidad", fecha: "2025-12-13T14:00:00", nota: "" },
  { empresa: "EALegal Facturacion", fecha: "2025-12-13T14:00:00", nota: "" },
  { empresa: "EALegal Nominas", fecha: "2025-12-13T14:00:00", nota: "" },
  { empresa: "Floyd RSDG", fecha: "2025-08-13T10:00:00", nota: "" },
  { empresa: "Floyd Facturacion", fecha: "2026-08-04T10:00:00", nota: "" },
  { empresa: "Floyd Bancos", fecha: "2026-02-19T10:00:00", nota: "" },
  { empresa: "Floyd Nominas", fecha: "2026-08-04T10:00:00", nota: "" },
  { empresa: "Floyd XML en Linea", fecha: "2026-10-02T10:00:00", nota: "" },
  { empresa: "Kepler RSDG", fecha: "2025-08-15T15:00:00", nota: "" },
  { empresa: "Mallory RSDG", fecha: "2025-09-05T09:00:00", nota: "" },
  { empresa: "Quatro RSDG", fecha: "2025-08-13T17:00:00", nota: "" },
  { empresa: "Quatro Facturacion", fecha: "2025-12-26T17:00:00", nota: "" },
  { empresa: "Royal Assets RSDG", fecha: "2025-09-05T13:45:00", nota: "" },
  { empresa: "RRB RSDG", fecha: "2025-08-13T11:00:00", nota: "" },
  { empresa: "Tatuus Archivo RSDG", fecha: "2025-09-17T08:30:00", nota: "" },
  { empresa: "Tatuus Archivo Contabilidad", fecha: "2025-07-12T08:30:00", nota: "" },
  { empresa: "Server 4 RSDG", fecha: "2025-11-05T23:59:59", nota: "" },
  { empresa: "Server 4 Conta Y Bancos", fecha: "2026-08-10T23:59:59", nota: "" },
  { empresa: "Tatuus 5 Contabilidad", fecha: "2025-11-25T12:00:00", nota: "" },
  { empresa: "Tatuus 5 Bancos", fecha: "2026-05-01T12:00:00", nota: "" },
  { empresa: "Tatuus 5 Nominas", fecha: "2026-01-04T12:00:00", nota: "" },
  { empresa: "Tatuus 5 TS PLUS", fecha: "2026-02-12T12:00:00", nota: "" },
  { empresa: "Tatuus 5 RSDG", fecha: "2025-09-05T09:00:00", nota: ""},
  { empresa: "Zeitten RSDG", fecha: "2025-08-13T19:00:00", nota: "" },
  { empresa: "Server 1 Tatuus RSDG", fecha: "2025-10-20T19:00:00", nota: "" },
  { empresa: "Server 1 Tatuus Contabilidad", fecha: "2026-07-03T19:00:00", nota: "" },
  { empresa: "Server 1 Tatuus Bancos", fecha: "2026-07-04T19:00:00", nota: "" },
  { empresa: "Server 2 Tatuus Bancos", fecha: "2026-07-12T19:00:00", nota: "" },
  { empresa: "Server 2 Tatuus Conta", fecha: "2026-07-12T19:00:00", nota: "" },
  { empresa: "Server 2 Tatuus RSDG", fecha: "2025-11-05T19:00:00", nota: "" },
  { empresa: "Server 3 Tatuus RSDG", fecha: "2025-11-22T19:00:00", nota: "" },
  { empresa: "Server 3 Tatuus Conta y Bancos", fecha: "2026-08-14T19:00:00", nota: "" }

];

// Cargar datos guardados de los temporizadores
const vencimientos = vencimientosOriginales.map(item => {
  const fechaGuardada = localStorage.getItem(`fecha_${item.empresa}`);
  const observacionGuardada = localStorage.getItem(`observacion_${item.empresa}`);
  return {
    ...item,
    fecha: fechaGuardada || item.fecha,
    observacion: observacionGuardada || ""
  };
});

// Variables para los modales
let empresaSeleccionada = "";
let empresaParaReiniciar = "";
let diasParaReiniciar = 0;

// Elementos del DOM
const modal = document.getElementById("observacionModal");
const confirmacionModal = document.getElementById("confirmacionModal");
const span = document.getElementsByClassName("close")[0];
const closeConfirm = document.getElementsByClassName("close-confirm")[0];
const observacionInput = document.getElementById("observacionInput");
const guardarObservacionBtn = document.getElementById("guardarObservacion");
const eliminarObservacionBtn = document.getElementById("eliminarObservacion");
const cancelarEdicionBtn = document.getElementById("cancelarEdicion");
const cancelarReinicioBtn = document.getElementById("cancelarReinicio");
const confirmarReinicioBtn = document.getElementById("confirmarReinicio");
const mensajeConfirmacion = document.getElementById("mensajeConfirmacion");

// Función de búsqueda corregida
function buscarTermino(termino) {
  termino = termino.toLowerCase().trim();
  
  // Mostrar todos los elementos primero
  document.querySelectorAll('.empresa, .categoria, .tarea').forEach(el => {
    el.classList.remove('no-match', 'highlight');
  });
  
  if (!termino) {
    document.getElementById('clearSearch').style.display = 'none';
    return;
  }
  
  document.getElementById('clearSearch').style.display = 'inline-block';
  
  // Buscar coincidencias
  let encontrados = false;
  
  // Buscar en empresas (modificado)
  document.querySelectorAll('.empresa').forEach(empresa => {
    const nombreEmpresa = empresa.dataset.empresa.toLowerCase();
    const headerText = empresa.querySelector('.empresa-header span').textContent.toLowerCase();
    
    if (nombreEmpresa.includes(termino) || headerText.includes(termino)) {
      empresa.classList.remove('no-match');
      empresa.querySelector('.empresa-header').classList.add('highlight');
      encontrados = true;
    } else {
      empresa.classList.add('no-match');
    }
  });
  
  // Buscar en categorías (modificado)
  document.querySelectorAll('.categoria').forEach(categoria => {
    const nombreCategoria = categoria.dataset.categoria.toLowerCase();
    const titulo = categoria.querySelector('h3').textContent.toLowerCase();
    
    if (nombreCategoria.includes(termino) || titulo.includes(termino)) {
      categoria.classList.remove('no-match');
      categoria.querySelector('h3').classList.add('highlight');
      // Mostrar también los padres
      let parent = categoria.closest('.empresa');
      while (parent) {
        parent.classList.remove('no-match');
        parent = parent.parentElement.closest('.empresa');
      }
      encontrados = true;
    } else if (!termino) {
      categoria.classList.remove('no-match');
    }
  });
  
  // Buscar en tareas (modificado)
  document.querySelectorAll('.tarea').forEach(tarea => {
    const textoTarea = tarea.textContent.toLowerCase();
    
    if (textoTarea.includes(termino)) {
      tarea.classList.remove('no-match');
      tarea.classList.add('highlight');
      // Mostrar también los padres
      let parent = tarea.closest('.categoria, .empresa');
      while (parent) {
        parent.classList.remove('no-match');
        parent = parent.parentElement.closest('.categoria, .empresa');
      }
      encontrados = true;
    } else if (!termino) {
      tarea.classList.remove('no-match');
    }
  });
  
  if (!encontrados && termino) {
    mostrarEstado({ status: 'error', message: 'No se encontraron coincidencias' });
  }
}

// Funciones del Check-in
function generarInterfaz() {
  const contenedor = document.getElementById('empresas');
  contenedor.innerHTML = ''; // Limpiar contenedor antes de regenerar
  
  CONFIG.empresas.forEach(empresa => {
    const empresaDiv = document.createElement('div');
    empresaDiv.className = 'empresa';
    empresaDiv.dataset.empresa = empresa.toLowerCase();
    
    const header = document.createElement('div');
    header.className = 'empresa-header';
    
    const headerText = document.createElement('span');
    headerText.textContent = empresa;
    header.appendChild(headerText);
    
    // Mostrar tiempo restante si existe para esta empresa
   /*const tiempoEmpresa = vencimientos.find(v => v.empresa.startsWith(empresa));
    if (tiempoEmpresa) {
      const tiempoRestante = new Date(tiempoEmpresa.fecha) - new Date();
      if (tiempoRestante > 0) {
        const dias = Math.floor(tiempoRestante / (1000 * 60 * 60 * 24));
        const horas = Math.floor((tiempoRestante / (1000 * 60 * 60)) % 24);
        const tiempoSpan = document.createElement('span');
        tiempoSpan.className = 'empresa-tiempo';
        tiempoSpan.textContent = `${dias}d ${horas}h`;
        tiempoSpan.title = `Tiempo restante para ${tiempoEmpresa.empresa.split(' ')[1] || 'servicio'}`;
        header.appendChild(tiempoSpan);
      }
    }*/
    
    empresaDiv.appendChild(header);
    
    const content = document.createElement('div');
    content.className = 'empresa-content';
    
    // Categorías base
    Object.entries(CONFIG.categorias).forEach(([categoria, tareas]) => {
      if (categoria === "TS PLUS") return;
      
      const categoriaDiv = document.createElement('div');
      categoriaDiv.className = 'categoria';
      categoriaDiv.dataset.categoria = categoria.toLowerCase();
      
      const titulo = document.createElement('h3');
      titulo.textContent = categoria;
      categoriaDiv.appendChild(titulo);
      
      tareas.forEach(tarea => {
        crearCheckbox(categoriaDiv, empresa, `${categoria}: ${tarea}`);
      });
      
      content.appendChild(categoriaDiv);
    });
    
    // Categorías adicionales
    if (CONFIG.categoriasEmpresa[empresa]) {
      CONFIG.categoriasEmpresa[empresa].forEach(categoria => {
        const categoriaDiv = document.createElement('div');
        categoriaDiv.className = 'categoria';
        categoriaDiv.dataset.categoria = categoria.toLowerCase();
        
        const titulo = document.createElement('h3');
        titulo.textContent = categoria;
        categoriaDiv.appendChild(titulo);
        
        CONFIG.categorias[categoria].forEach(tarea => {
          crearCheckbox(categoriaDiv, empresa, `${categoria}: ${tarea}`);
        });
        
        content.appendChild(categoriaDiv);
      });
    }
    
    empresaDiv.appendChild(content);
    contenedor.appendChild(empresaDiv);
    
    // Acordeón
    header.addEventListener('click', () => {
      content.style.display = content.style.display === 'none' ? 'block' : 'none';
    });
    content.style.display = 'none';
  });
}

function crearCheckbox(contenedor, empresa, tarea) {
  const id = `chk-${empresa}-${tarea}`.replace(/\s+/g, '-');
  
  const label = document.createElement('label');
  label.className = 'tarea';
  label.dataset.tarea = tarea.toLowerCase();
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = id;
  checkbox.dataset.empresa = empresa;
  checkbox.dataset.tarea = tarea;
  
  // Estado persistente
  checkbox.checked = localStorage.getItem(id) === 'true';
  checkbox.addEventListener('change', () => {
    localStorage.setItem(id, checkbox.checked);
    enviarDatos(empresa, tarea, checkbox.checked);
  });
  
  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(tarea));
  contenedor.appendChild(label);
}

// Enviar datos via JSONP
function enviarDatos(empresa, tarea, estado) {
  const callbackName = `jsonp_${Date.now()}`;
  const url = `${CONFIG.scriptUrl}?empresa=${encodeURIComponent(empresa)}&tarea=${encodeURIComponent(tarea)}&estado=${estado ? '1' : '0'}&callback=${callbackName}`;
  
  window[callbackName] = function(response) {
    mostrarEstado(response);
    delete window[callbackName];
  };
  
  const script = document.createElement('script');
  script.src = url;
  script.onerror = () => {
    mostrarEstado({ status: 'error', message: 'Error de conexión' });
    delete window[callbackName];
  };
  
  document.body.appendChild(script);
  setTimeout(() => script.remove(), 1000);
  mostrarEstado({ status: 'loading', message: 'Guardando...' });
}

// Mostrar estado
function mostrarEstado(res) {
  const statusDiv = document.getElementById('status');
  
  if (res.status === 'success') {
    statusDiv.textContent = `✅ ${res.data.empresa}: ${res.data.tarea} guardado`;
    statusDiv.className = 'success';
  } else if (res.status === 'error') {
    statusDiv.textContent = `❌ ${res.message || 'Error desconocido'}`;
    statusDiv.className = 'error';
  } else {
    statusDiv.textContent = res.message;
    statusDiv.className = 'loading';
  }
  
  statusDiv.style.display = 'block';
  if (res.status !== 'loading') {
    setTimeout(() => statusDiv.style.display = 'none', 5000);
  }
}

// Funciones de los Temporizadores
function abrirModalEdicion(empresa, observacionActual) {
  empresaSeleccionada = empresa;
  observacionInput.value = observacionActual || "";
  modal.style.display = "block";
  observacionInput.focus();
  eliminarObservacionBtn.style.display = observacionActual ? "block" : "none";
}

function reiniciarTiempo(empresa, dias) {
  empresaParaReiniciar = empresa;
  diasParaReiniciar = dias;
  
  const tipoReinicio = empresa.includes("RSDG") ? "119 días" : "365 días";
  mensajeConfirmacion.textContent = `¿Estás seguro que deseas reiniciar el temporizador de ${empresa} por ${tipoReinicio}?`;
  
  confirmacionModal.style.display = "block";
}

// Modificar la función actualizarTiempos()
function actualizarTiempos() {
  const ahora = new Date();

  const vencimientosOrdenados = vencimientos.map(v => {
    const tiempoRestante = new Date(v.fecha) - ahora;
    return { ...v, tiempoRestante };
  }).sort((a, b) => a.tiempoRestante - b.tiempoRestante);

  const lista = document.getElementById("listaEmpresas");
  lista.innerHTML = "";

  vencimientosOrdenados.forEach(({ empresa, nota, fecha, tiempoRestante, observacion }) => {
    const li = document.createElement("li");
    li.className = "tiempo-item";

    const empresaSpan = document.createElement("span");
    empresaSpan.className = "tiempo-empresa";
    empresaSpan.textContent = empresa;

    const observacionContainer = document.createElement("div");
    observacionContainer.style.display = "flex";
    observacionContainer.style.alignItems = "center";
    
    const observacionSpan = document.createElement("span");
    observacionSpan.className = "tiempo-observacion";
    observacionSpan.textContent = observacion || "";
    observacionSpan.title = observacion || "Agregar observación";
    
    const editarBtn = document.createElement("button");
    editarBtn.className = "btn-editar";
    editarBtn.textContent = "✏️";
    editarBtn.onclick = () => abrirModalEdicion(empresa, observacion);
    
    observacionContainer.appendChild(observacionSpan);
    observacionContainer.appendChild(editarBtn);

    const tiempoSpan = document.createElement("span");
    tiempoSpan.className = "tiempo-contador";

    const dias = Math.floor(tiempoRestante / (1000 * 60 * 60 * 24));
    const horas = Math.floor((tiempoRestante / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((tiempoRestante / (1000 * 60)) % 60);
    const segundos = Math.floor((tiempoRestante / 1000) % 60);

    if (tiempoRestante <= 0) {
      tiempoSpan.innerHTML = `<span class="tiempo-vencido">¡VENCIDO!</span>`;
    } else {
      tiempoSpan.textContent = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
      if (dias < 15) {
        tiempoSpan.classList.add("tiempo-urgente");
      }
    }

    const notaSpan = document.createElement("div");
    notaSpan.className = "tiempo-nota";
    notaSpan.textContent = nota || "";

    const botonesContainer = document.createElement("div");
    botonesContainer.className = "tiempo-botones";
    
    // Solo mostrar botones si tiene 15 días o menos o está vencido
    if (dias <= 15 || tiempoRestante <= 0) {
      const boton119 = document.createElement("button");
      boton119.className = "btn-reiniciar";
      boton119.textContent = "Reiniciar";
      boton119.onclick = () => reiniciarTiempo(empresa, 119);

      const boton365 = document.createElement("button");
      boton365.className = "btn-reiniciar btn-reiniciar-365";
      boton365.textContent = "Reiniciar";
      boton365.onclick = () => reiniciarTiempo(empresa, 365);

      if (empresa.includes("RSDG")) {
        botonesContainer.appendChild(boton119);
      } else {
        botonesContainer.appendChild(boton365);
      }
    } else {
      const mensajeNoDisponible = document.createElement("span");
      mensajeNoDisponible.textContent = "Reinicio no Disponible";
      mensajeNoDisponible.style.color = "#7f8c8d";
      mensajeNoDisponible.style.fontStyle = "italic";
      botonesContainer.appendChild(mensajeNoDisponible);
    }

    li.appendChild(empresaSpan);
    li.appendChild(observacionContainer);
    li.appendChild(tiempoSpan);
    li.appendChild(botonesContainer);
    li.appendChild(notaSpan);
    lista.appendChild(li);
  });
}
// Event listeners para los modales
span.onclick = function() {
  modal.style.display = "none";
}

guardarObservacionBtn.onclick = function() {
  const observacion = observacionInput.value;
  localStorage.setItem(`observacion_${empresaSeleccionada}`, observacion);
  
  const item = vencimientos.find(e => e.empresa === empresaSeleccionada);
  if (item) {
    item.observacion = observacion;
  }
  
  modal.style.display = "none";
  actualizarTiempos();
}

eliminarObservacionBtn.onclick = function() {
  localStorage.removeItem(`observacion_${empresaSeleccionada}`);
  
  const item = vencimientos.find(e => e.empresa === empresaSeleccionada);
  if (item) {
    item.observacion = "";
  }
  
  modal.style.display = "none";
  actualizarTiempos();
}

cancelarEdicionBtn.onclick = function() {
  modal.style.display = "none";
}

closeConfirm.onclick = function() {
  confirmacionModal.style.display = "none";
}

confirmarReinicioBtn.onclick = function() {
  const nuevaFecha = new Date();
  nuevaFecha.setDate(nuevaFecha.getDate() + diasParaReiniciar);
  localStorage.setItem(`fecha_${empresaParaReiniciar}`, nuevaFecha.toISOString());

  const item = vencimientos.find(e => e.empresa === empresaParaReiniciar);
  if (item) {
    item.fecha = nuevaFecha.toISOString();
  }
  
  confirmacionModal.style.display = "none";
  actualizarTiempos();
  generarInterfaz(); // Actualizar también los tiempos en el check-in
}

cancelarReinicioBtn.onclick = function() {
  confirmacionModal.style.display = "none";
}

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if (event.target == confirmacionModal) {
    confirmacionModal.style.display = "none";
  }
}

// Tabs functionality
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  generarInterfaz();
  actualizarTiempos();
  setInterval(actualizarTiempos, 1000);
  
  // Event listeners para búsqueda
  document.getElementById('searchButton').addEventListener('click', () => {
    const termino = document.getElementById('searchInput').value;
    buscarTermino(termino);
  });
  
  document.getElementById('searchInput').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      const termino = document.getElementById('searchInput').value;
      buscarTermino(termino);
    }
  });
  
  document.getElementById('clearSearch').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    buscarTermino('');
  });
});

// Funciones globales para JSONP
window.handleResponse = mostrarEstado;
window.handleError = (err) => mostrarEstado({
  status: 'error',
  message: err.message || 'Error en el servidor'
});







