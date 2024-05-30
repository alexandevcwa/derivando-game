// Listado de Derivadas de Todos los Niveles
let nivelesLista;

// DIALOGO DE ALERTA
const dialog_alerta = document.getElementById("game__dialog-alerta");
document.getElementById("game__dialog-button-alerta").addEventListener("click", function () {
  dialog_alerta.close();
});

// DIALOGO DE INFORMACIÓN
const dialog_informacion = document.getElementById("game__dialog-informacion");
document.getElementById("game__dialog-button-informacion").addEventListener("click", function () {
  dialog_informacion.close();
});


// Cargar Listado de Derivadas Del Archivo JSON
function cargarDerivadas(nivel) {
  const httpRequest = new XMLHttpRequest();
  httpRequest.open("GET", "../json/derivadas.json");
  httpRequest.send();
  httpRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      nivelesLista = JSON.parse(this.responseText);
      mostrarListadoDerivadasMenu(nivel);
    }
  };
};

// Mostrar listado de derivadas al hacer click en un nivel seleccionado
function mostrarListadoDerivadasMenu(nivel) {
  MathJax.typesetPromise()
    .then(() => {
      // Eliminar el contenido del contenedor con ID game-container del DOM
      document.getElementById("game-container").innerHTML = null;

      let derivadasLista = nivelesLista[nivel].derivadas;
      let derivadasHTML = `<h2 class="game__derivadas-titulo">DERIVADAS POR MÉTODO DE DIVISION </h2>
                           <ul class="derivadas__menu" id="derivadas-menu">`;

      derivadasLista.forEach((derivada) => {
        derivadasHTML += `
        <li class="derivadas__opcion">
        <p class="derivadas__derivada hvr-grow">${derivada.derivada}</p>
        <button class="derivadas__derivada-jugar" id="${derivada.tag}">JUGAR</button>
        </li>
        `;
      });

      derivadasHTML += `</ul>`;

      document.getElementById("game-container").innerHTML = derivadasHTML;

      MathJax.typesetPromise();

      configurarEventosClickNivelesMenu(derivadasLista);
    })
    .catch((err) => console.log(err.message));
}

// Evento click al seleccionar una derivada del listado del nivel seleccionado
function configurarEventosClickNivelesMenu(derivadasLista) {
  // Lista de botones para seleccionar una derivada HTML
  const buttons = document.querySelectorAll(".derivadas__derivada-jugar");

  // Asignar evento click para cargar en el DOM la derivada a resolver
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      let derivada = derivadasLista.find((fx) => fx.tag == button.id);
      cargarDerivadaDOM(derivada);
    });
  });
}
////////////////////////////////////////////
/// Cargar derivada a resolver en el DOM ///
////////////////////////////////////////////
function cargarDerivadaDOM(derivada, procedimientoID = 0) {

  document.getElementById("game-container").innerHTML = null;

  // Procedimiento Inicial para Resolver la Derivada
  let derivadaHTML = `<h2 class="game__derivadas-titulo">RESUELVE LA SIGUIENTE DERIVADA</h2>
        <div class="derivada__container">
        <p class="derivada__resolver">${derivada.derivada}</p>
        <ul class="derivada__procedimiento-container" id="derivada-procedimiento">
        `;

  derivadaHTML = cargarProcedimientoSecuencial(
    procedimientoID,
    derivada.procedimiento,
    derivadaHTML
  );

  derivadaHTML += `
        </ul>
        </div>`;

  // Renderizar Derivadas LaText en el HTML 
  MathJax.typesetPromise()
    .then(() => {
      document.getElementById("game-container").innerHTML = derivadaHTML;

      MathJax.typesetPromise();
      if (procedimientoID == 0) {

        derivada.procedimiento[0].soluciones.forEach((solucion) => {
          if (solucion.tag == true) {
            let button = document.getElementById(solucion.id);
            button.addEventListener("click", function () {
              procedimientoID++;
              cargarProcedimientoSecuencial(procedimientoID, derivada.procedimiento)
            }, true);
          } else {
            let button = document.getElementById(solucion.id);
            button.addEventListener("click", function () {
              dialog_alerta.showModal();
            }, true)
          }
        });
      }
    })
    .catch((err) => console.log(err.message));
}

function cargarProcedimientoSecuencial(
  procedimientoId,
  procedimientos,
  html = ""
) {
  if (procedimientoId == 0) {
    html += crearFormatoHTMLProcedimiento(procedimientos[procedimientoId]);
  } else {
    if (procedimientoId < procedimientos.length) {
      // Asignar evento click a las opciones de derivadas
      MathJax.typesetPromise().then(() => {
        let procedimiento = procedimientos[procedimientoId];

        let html = crearFormatoHTMLProcedimiento(procedimiento, false);
        let derivadaProcedimiento = document.getElementById("derivada-procedimiento");
        let child = document.createElement("li")
        child.className = "derivada__procedimiento";
        child.innerHTML = html;
        derivadaProcedimiento.appendChild(child);
        MathJax.typesetPromise();

        //let procedimientoCorrecto = procedimientos[procedimientoId].soluciones.find((proc) => proc.tag == true);

        //let procedimientoCorrectoButton = document.getElementById(procedimientoCorrecto.id);

        procedimientos[procedimientoId].soluciones.forEach((solucion) => {
          if (solucion.tag) {
            document.getElementById(solucion.id).addEventListener("click", function () {
              procedimientoId += 1;
              cargarProcedimientoSecuencial(procedimientoId, procedimientos);
            });
          } else {
            document.getElementById(solucion.id).addEventListener("click", function () {
              dialog_alerta.showModal();
            });
          }
        });
      });
    } else {
      dialog_informacion.showModal();
    }

  }
  return html;
}

function crearFormatoHTMLProcedimiento(procedimiento, childCompleto = true) {
  if (childCompleto) {
    return `
    <li class="derivada__procedimiento">
      <div class="derivada__ayudas">
        <h3 class="procedimiento__ayuda-titulo">AYUDAS PARA RESOLVER PROCEDIMIENTO #1</h2>
        <p class="derivada__ayuda">
        <spam class="derivada__ayuda-tip">
        💡 ${procedimiento.ayudas.tip}
        </spam>
        </p>
        <p class="derivada__ayuda">
          <a class="derivada__ayuda-link hvr-grow" target="_blank" href="${procedimiento.ayudas.video}">VER VIDEO DE AYUDA 📽️</a>
        </p>
        <p class="derivada__ayuda">
          <a class="derivada__ayuda-link hvr-grow" target="_blank" href="${procedimiento.ayudas.link}">VER LINK DE AYUDA 🔗</a>
        </p>
      </div>
      <div class="derivada__procedimiento-opciones">
        <h3 class="procedimiento__opciones-titutlo">ESCOGE EL PROCEDIMIENTO CORRECTO</h3>
        <ul class="procedimiento__opciones">
          <li class="procedimiento__nivel">
            <ul class="procedimiento__soluciones">
              <li class="procedimiento__opcion">
                <p class="procedimiento__opcion-derivada hvr-grow">${procedimiento.soluciones[0].solucion}</p>
                <spam style="display: none">${procedimiento.soluciones[0].tag}</spam>
                <button class="procedimiento__button" id="${procedimiento.soluciones[0].id}">ESCOGER PROCEDIMIENTO</button>
              </li>
              <li class="procedimiento__opcion">
                <p class="procedimiento__opcion-derivada hvr-grow">${procedimiento.soluciones[1].solucion}</p>
                <spam style="display: none">${procedimiento.soluciones[1].tag}</spam>
                <button class="procedimiento__button" id="${procedimiento.soluciones[1].id}">ESCOGER PROCEDIMIENTO</button>
              </li>
              <li class="procedimiento__opcion">
                <p class="procedimiento__opcion-derivada hvr-grow">${procedimiento.soluciones[2].solucion}</p>
                  <spam style="display: none">${procedimiento.soluciones[2].tag}</spam>
                  <button class="procedimiento__button" id="${procedimiento.soluciones[2].id}">ESCOGER PROCEDIMIENTO</button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </li>`;
  }

  return `
  <hr>
  <div class="derivada__ayudas">
        <h3 class="procedimiento__ayuda-titulo">AYUDAS PARA RESOLVER PROCEDIMIENTO #${procedimiento.id}</h3>
        <p class="derivada__ayuda">
        <spam class="derivada__ayuda-tip">
        💡 ${procedimiento.ayudas.tip}
        </spam>
        </p>
        <p class="derivada__ayuda">
          <a class="derivada__ayuda-link hvr-grow" target="_blank" href="${procedimiento.ayudas.video}">VER VIDEO DE AYUDA 📽️</a>
        </p>
        <p class="derivada__ayuda">
          <a class="derivada__ayuda-link hvr-grow" target="_blank" href="${procedimiento.ayudas.link}">VER LINK DE AYUDA 🔗</a>
        </p>
      </div>
      <div class="derivada__procedimiento-opciones">
        <h3 class="procedimiento__opciones-titutlo">ESCOGE EL PROCEDIMIENTO CORRECTO</h3>
        <ul class="procedimiento__opciones">
          <li class="procedimiento__nivel">
            <ul class="procedimiento__soluciones">
              <li class="procedimiento__opcion">
                <p class="procedimiento__opcion-derivada hvr-grow">${procedimiento.soluciones[0].solucion}</p>
                <spam style="display: none">${procedimiento.soluciones[0].tag}</spam>
                <button class="procedimiento__button" id="${procedimiento.soluciones[0].id}">ESCOGER PROCEDIMIENTO</button>
              </li>
              <li class="procedimiento__opcion">
                <p class="procedimiento__opcion-derivada hvr-grow">${procedimiento.soluciones[1].solucion}</p>
                <spam style="display: none">${procedimiento.soluciones[1].tag}</spam>
                <button class="procedimiento__button" id="${procedimiento.soluciones[1].id}">ESCOGER PROCEDIMIENTO</button>
              </li>
              <li class="procedimiento__opcion">
                <p class="procedimiento__opcion-derivada hvr-grow">${procedimiento.soluciones[2].solucion}</p>
                  <spam style="display: none">${procedimiento.soluciones[2].tag}</spam>
                  <button class="procedimiento__button" id="${procedimiento.soluciones[2].id}">ESCOGER PROCEDIMIENTO</button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
  `;

}

document
  .getElementById("nivel_1")
  .addEventListener("click", function () {
    cargarDerivadas(0);
  }, true);

document
  .getElementById("nivel_2")
  .addEventListener("click", function () {
    cargarDerivadas(1);
  }, true);


// FORMULARIO
const dialog__formulario = document.getElementById("dialog__formulario");
document.getElementById("formulario").addEventListener("click", function () {
  dialog__formulario.showModal();
});

document.getElementById("dialog__formulario-cerrar").addEventListener("click", function () {
  dialog__formulario.close();
})
