//Menu
const btnMenu = document.getElementById("boton-menu");
const listMenu = document.getElementById("list-menu");

btnMenu.addEventListener("click", () => {
  listMenu.classList.toggle("hidden");
});

//Generador de Emails
const form = document.getElementById("form");
  const mailto = document.getElementById("mailto");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name");
    const email = formData.get("email");
    const mensaje = formData.get("mensaje");

    // Construimos el cuerpo del mail
    const subject = `Consulta de ${name}`;
    const body = `Nombre: ${name}%0AEmail: ${email}%0A%0AMensaje:%0A${mensaje}`;

    mailto.setAttribute(
      "href",
      `mailto:alexis.r4995@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`
    );

    mailto.click();
  });

//fetch
const urls = [
  "./patrimonio/casas.json",
  "./patrimonio/alquileres.json",
  "./patrimonio/terrenos.json"
];

const contenedor = document.getElementById("contenedor-proyectos");
let todasPropiedades = []; // Array global para filtrar

// Función para renderizar cards
function renderCard(item) {
  const card = document.createElement("div");
  card.className = "bg-white rounded-xl shadow-lg overflow-hidden";

  card.innerHTML = `
  <div class="relative">
    <img src="${item.imagen}" alt="${item.titulo}" class="h-48 w-full object-cover">
    <span class="absolute top-2 left-2 bg-${item.operacion === 'venta' ? 'green' : 'blue'}-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
      ${item.operacion.toUpperCase()}
    </span>
  </div>
  <div class="p-6">
    <h4 class="font-semibold text-lg mb-2">${item.titulo}</h4>
    <p class="text-gray-600 mb-4">${item.descripcion}</p>
    <div class="text-sm text-gray-700 mb-3">
      ${Array.isArray(item.detalles)
      ? item.detalles.map(d => `<span class="mx-2">${d}</span>`).join(" | ")
      : Object.values(item.detalles).map(d => `<span class="mx-2">${d}</span>`).join(" | ")}
    </div>
    <div class="flex items-center justify-between">
      <span class="text-xl font-bold text-green-600">$ ${item.precio.toLocaleString()} ${item.moneda}</span>
      <a href="ventanaAparte.html?id=${item.id}" 
         class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
         Ver Más
      </a>
    </div>
  </div>
`;
  contenedor.appendChild(card);
}

// Renderizar lista completa
function renderizarPropiedades(lista) {
  contenedor.innerHTML = ""; // Limpiar antes de renderizar
  if (lista.length === 0) {
    contenedor.innerHTML = `<p class="col-span-3 text-center text-gray-600">No se encontraron propiedades</p>`;
    return;
  }
  lista.forEach(prop => renderCard(prop));
}

// Cargar los 3 JSON
Promise.all(urls.map(url => fetch(url).then(res => res.json())))
  .then(dataArrays => {
    dataArrays.forEach(data => {
      todasPropiedades = todasPropiedades.concat(data); // Guardar todas las propiedades
    });
    renderizarPropiedades(todasPropiedades); // Mostrar todas al inicio
  })
  .catch(err => console.error("Error cargando JSON:", err));

// FILTROS
document.getElementById("buscar").addEventListener("click", () => {
  const operacion = document.getElementById("operacion").value;
  const tipo = document.getElementById("tipo").value;
  const ubicacion = document.getElementById("ubicacion").value.toLowerCase();

  const filtradas = todasPropiedades.filter(p => {
    return (
      (operacion === "" || p.operacion === operacion) &&
      (tipo === "" || p.tipo === tipo) &&
      (ubicacion === "" || (p.ubicacion && p.ubicacion.toLowerCase().includes(ubicacion)))
    );
  });

  renderizarPropiedades(filtradas);
});
