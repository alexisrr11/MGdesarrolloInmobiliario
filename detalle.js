// detalle.js
async function cargarDetalle() {
  try {
    // Obtener el ID desde la URL
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));

    // Rutas de tus JSON
    const urls = ["./patrimonio/casas.json", "./patrimonio/alquileres.json", "./patrimonio/terrenos.json"];

    // Cargar todos en paralelo
    const [casas, alquileres, terrenos] = await Promise.all(
      urls.map(url => fetch(url).then(res => res.json()))
    );

    // Unir todos los arrays en uno solo
    const todos = [...casas, ...alquileres, ...terrenos];

    // Buscar el item por ID
    const item = todos.find(p => p.id === id);

    if (!item) {
      document.getElementById("detalle-proyecto").innerHTML = "<p>Propiedad no encontrada</p>";
      return;
    }

    // Renderizar el detalle
    document.getElementById("detalle-proyecto").innerHTML = `
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="flex justify-between">
          <div class="flex flex-col py-3">
            <h2 class="text-2xl font-bold">${item.titulo}</h2>
            <p class="text-gray-600">${item.descripcion}</p>
          </div>
          <span class="inline-block my-5 p-3 rounded-xl text-white text-sm font-semibold 
            ${item.operacion === "venta" ? "bg-green-600" : "bg-blue-600"}">
            ${item.operacion.toUpperCase()}
          </span>
        </div>
        
        <img src="${item.imagen}" alt="${item.titulo}" class="w-full h-96 object-cover">
        <div class="p-6">
          
          
          
          <div class="text-sm text-gray-700 mb-6">
            ${Object.entries(item.detalles)
              .map(([k, v]) => `<span class="mr-3"><strong>${k}:</strong> ${Array.isArray(v) ? v.join(", ") : v}</span>`)
              .join(" | ")}
          </div>

          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold text-green-600">$ ${item.precio.toLocaleString()} ${item.moneda}</span>
            <a href="index.html#proyectos" class="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
              Volver
            </a>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Error cargando detalle:", error);
  }
}

cargarDetalle();
