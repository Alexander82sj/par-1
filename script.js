// Referencias a los elementos del HTML.
const nombre = document.getElementById("nombre");
const formulario = document.getElementById("formulario");
const btnAgregar = document.getElementById("btnAgregar");
const btnCancelar = document.getElementById("btnCancelar");
const btnLimpiar = document.getElementById("btnLimpiar");
const lista = document.getElementById("lista");
const mensaje = document.getElementById("mensaje");
const contador = document.getElementById("contador");
const vacio = document.getElementById("vacio");
const tituloFormulario = document.getElementById("tituloFormulario");

// Conserva la referencia al registro que se está editando.
let estudianteEditando = null;

function mostrarMensaje(texto, esError = false) {
    mensaje.textContent = texto;
    mensaje.classList.toggle("error", esError);
}

function actualizarLista() {
    const cantidad = lista.children.length;
    contador.textContent = cantidad + (cantidad === 1 ? " estudiante" : " estudiantes");
    vacio.hidden = cantidad > 0;
}

function restablecerFormulario() {
    if (estudianteEditando !== null) {
        estudianteEditando.classList.remove("editando");
    }
    estudianteEditando = null;
    btnAgregar.textContent = "Agregar";
    tituloFormulario.textContent = "Registrar estudiante";
    btnCancelar.hidden = true;
    nombre.value = "";
    nombre.removeAttribute("aria-invalid");
    nombre.focus();
}

// CREATE / UPDATE: el evento submit permite usar el botón o la tecla Enter.
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const nombreIngresado = nombre.value.trim();

    if (nombreIngresado === "") {
        mostrarMensaje("Debe escribir un nombre. No se permiten campos vacíos.", true);
        nombre.setAttribute("aria-invalid", "true");
        nombre.focus();
        return;
    }

    // UPDATE: modifica el elemento existente sin crear otro registro.
    if (estudianteEditando !== null) {
        estudianteEditando.querySelector(".texto").textContent = nombreIngresado;
        restablecerFormulario();
        mostrarMensaje("Estudiante actualizado correctamente.");
        return;
    }

    // CREATE: construye un registro y sus botones mediante el DOM.
    const estudiante = document.createElement("li");
    const texto = document.createElement("span");
    texto.classList.add("texto");
    texto.textContent = nombreIngresado;

    const acciones = document.createElement("div");
    acciones.classList.add("acciones");
    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.textContent = "Editar";
    btnEditar.classList.add("editar");

    btnEditar.addEventListener("click", function () {
        // Quita la selección anterior si se cambia de estudiante.
        if (estudianteEditando !== null) {
            estudianteEditando.classList.remove("editando");
        }
        estudianteEditando = estudiante;
        estudiante.classList.add("editando");
        nombre.value = texto.textContent;
        nombre.removeAttribute("aria-invalid");
        btnAgregar.textContent = "Actualizar";
        tituloFormulario.textContent = "Editar estudiante";
        btnCancelar.hidden = false;
        mostrarMensaje("Modifica el nombre y presiona Actualizar.");
        nombre.focus();
    });

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.classList.add("eliminar");

    // DELETE: solicita confirmación antes de eliminar un solo estudiante.
    btnEliminar.addEventListener("click", function () {
        const confirmar = confirm('¿Está seguro de eliminar a "' + texto.textContent + '"?');
        if (confirmar) {
            // Evita conservar una referencia a un registro eliminado.
            if (estudianteEditando === estudiante) {
                restablecerFormulario();
            }
            estudiante.remove();
            actualizarLista();
            mostrarMensaje("Estudiante eliminado correctamente.");
        }
    });

    acciones.appendChild(btnEditar);
    acciones.appendChild(btnEliminar);
    estudiante.appendChild(texto);
    estudiante.appendChild(acciones);
    // READ: muestra el registro en la lista visible.
    lista.appendChild(estudiante);
    actualizarLista();
    restablecerFormulario();
    mostrarMensaje("Estudiante agregado correctamente.");
});

btnCancelar.addEventListener("click", function () {
    restablecerFormulario();
    mostrarMensaje("Edición cancelada. El nombre original se conserva.");
});

// DELETE: elimina todos los registros después de confirmar.
btnLimpiar.addEventListener("click", function () {
    if (lista.children.length === 0) {
        mostrarMensaje("La lista ya está vacía.", true);
        return;
    }
    const confirmar = confirm("¿Está seguro de eliminar todos los estudiantes?");
    if (confirmar) {
        restablecerFormulario();
        // querySelectorAll devuelve una lista estática de los registros.
        lista.querySelectorAll("li").forEach(function (estudiante) {
            estudiante.remove();
        });
        actualizarLista();
        mostrarMensaje("Todos los estudiantes fueron eliminados.");
    }
});
