const semillas = {
  rubros: [
    { id: "ALM", nombre: "Almacén" },
    { id: "BEB", nombre: "Bebidas" },
  ],
  articulos: [
    {
      id: "779001",
      nombre: "Huevos Maple x30",
      idRubro: "ALM",
      precio: 3500,
      stock: 20,
    },
  ],
  clientes: [{ id: "C1", nombre: "Consumidor Final", telefono: "" }],
  vendedores: [{ id: "V1", nombre: "Marcelo Admin", comision: 5 }],
};

let db = {
  rubros: JSON.parse(localStorage.getItem("rubros")) || semillas.rubros,
  articulos:
    JSON.parse(localStorage.getItem("articulos")) || semillas.articulos,
  clientes: JSON.parse(localStorage.getItem("clientes")) || semillas.clientes,
  vendedores:
    JSON.parse(localStorage.getItem("vendedores")) || semillas.vendedores,
  ventasDia: JSON.parse(localStorage.getItem("ventasDia")) || [],
};

let carrito = [];
let filtrosRubros = [];
let dtCarrito, dtBusqueda;

$(document).ready(function () {
  dtCarrito = $("#tablaCarrito").DataTable({
    paging: false,
    info: false,
    searching: false,
  });
  dtBusqueda = $("#tablaBusqueda").DataTable({
    paging: true,
    pageLength: 5,
    info: false,
    lengthChange: false,
    dom: '<"float-start"f>tpi',
    language: { search: "🔍 Buscar:", zeroRecords: "No hay resultados" },
  });

  actualizarCombos();
  renderizarBotonesRubros();
  filtrarArticulos();

  $("#barcodeInput").on("keypress", function (e) {
    if (e.which == 13) {
      agregarAlCarrito($(this).val());
      $(this).val("").focus();
    }
  });
});

function renderizarBotonesRubros() {
  let html = db.rubros
    .map(
      (r) => `
        <button class="btn-rubro ${filtrosRubros.includes(r.id) ? "active" : ""}" onclick="toggleFiltro('${r.id}')">
            📁 ${r.nombre}
        </button>
    `,
    )
    .join("");
  $("#contenedorBotonesRubros").html(html);
}

function toggleFiltro(id) {
  if (filtrosRubros.includes(id)) {
    filtrosRubros = filtrosRubros.filter((f) => f !== id);
  } else {
    filtrosRubros.push(id);
  }
  renderizarBotonesRubros();
  filtrarArticulos();
}

function limpiarFiltros() {
  filtrosRubros = [];
  renderizarBotonesRubros();
  filtrarArticulos();
}

function filtrarArticulos() {
  dtBusqueda.clear();
  let lista =
    filtrosRubros.length === 0
      ? db.articulos
      : db.articulos.filter((a) => filtrosRubros.includes(a.idRubro));
  lista.forEach((a) => {
    dtBusqueda.row.add([
      `<strong>${a.nombre}</strong><br><small class="text-muted">$${a.precio}</small>`,
      `<span class="badge ${a.stock < 5 ? "bg-danger" : "bg-dark"}">${a.stock}</span>`,
      `<button class="btn btn-sm btn-success fw-bold" onclick="agregarAlCarrito('${a.id}')">+</button>`,
    ]);
  });
  dtBusqueda.draw();
}

function agregarAlCarrito(id) {
  let art = db.articulos.find((a) => a.id === id);
  if (art && art.stock > 0) {
    art.stock--;
    let enC = carrito.find((i) => i.id === id);
    if (enC) enC.cantidad++;
    else carrito.push({ ...art, cantidad: 1 });
    actualizarVista();
    filtrarArticulos();
  } else if (art) {
    alert("¡Sin stock!");
  }
}

function modCant(idx, val) {
  let item = carrito[idx];
  let art = db.articulos.find((a) => a.id === item.id);
  if (val > 0 && art.stock > 0) {
    item.cantidad++;
    art.stock--;
  } else if (val < 0 && item.cantidad > 1) {
    item.cantidad--;
    art.stock++;
  }
  actualizarVista();
  filtrarArticulos();
}

function eliminar(idx) {
  db.articulos.find((a) => a.id === carrito[idx].id).stock +=
    carrito[idx].cantidad;
  carrito.splice(idx, 1);
  actualizarVista();
  filtrarArticulos();
}

function actualizarVista() {
  dtCarrito.clear();
  let total = 0;
  carrito.forEach((i, idx) => {
    let sub = i.precio * i.cantidad;
    total += sub;
    dtCarrito.row.add([
      i.nombre,
      `$${i.precio}`,
      `<button class="btn btn-sm btn-light border" onclick="modCant(${idx},-1)">-</button> <span class="mx-2 fw-bold">${i.cantidad}</span> <button class="btn btn-sm btn-light border" onclick="modCant(${idx},1)">+</button>`,
      `$${sub.toLocaleString()}`,
      `<button class="btn btn-sm btn-outline-danger border-0" onclick="eliminar(${idx})">×</button>`,
    ]);
  });
  dtCarrito.draw();
  $("#txtTotal").text(total.toLocaleString("es-AR"));
  if (total >= 15000) $("#txtTotal").addClass("text-success-premium");
  else $("#txtTotal").removeClass("text-success-premium");
}

function guardarCliente() {
  db.clientes.push({
    id: "C" + Date.now(),
    nombre: $("#cNombre").val(),
    telefono: $("#cTelefono").val(),
  });
  localStorage.setItem("clientes", JSON.stringify(db.clientes));
  actualizarCombos();
  $("#modalCliente").modal("hide");
}

function guardarVendedor() {
  db.vendedores.push({
    id: "V" + Date.now(),
    nombre: $("#vNombre").val(),
    comision: $("#vComision").val(),
  });
  localStorage.setItem("vendedores", JSON.stringify(db.vendedores));
  actualizarCombos();
  $("#modalVendedor").modal("hide");
}

function guardarRubro() {
  db.rubros.push({
    id: $("#rId").val().toUpperCase(),
    nombre: $("#rNombre").val(),
  });
  localStorage.setItem("rubros", JSON.stringify(db.rubros));
  renderizarBotonesRubros();
  actualizarCombos();
  $("#modalRubro").modal("hide");
}

function guardarNuevoArticulo() {
  const art = {
    id: $("#pCodigo").val(),
    nombre: $("#pNombre").val(),
    idRubro: $("#pRubro").val(),
    precio: parseFloat($("#pPrecio").val()),
    stock: parseInt($("#pStock").val()),
  };
  db.articulos.push(art);
  localStorage.setItem("articulos", JSON.stringify(db.articulos));
  filtrarArticulos();
  $("#modalArticulo").modal("hide");
}

function actualizarCombos() {
  $("#pRubro")
    .empty()
    .append(
      db.rubros.map((r) => `<option value="${r.id}">${r.nombre}</option>`),
    );
  $("#selectCliente")
    .empty()
    .append(
      db.clientes.map((c) => `<option value="${c.id}">${c.nombre}</option>`),
    );
  $("#selectVendedor")
    .empty()
    .append(
      db.vendedores.map((v) => `<option value="${v.id}">${v.nombre}</option>`),
    );
}

function prepararCobro() {
  if (carrito.length === 0) return;
  const cli = db.clientes.find((c) => c.id === $("#selectCliente").val()) || {
    nombre: "C. Final",
    telefono: "",
  };
  $("#totalConfirmar").text($("#txtTotal").text());
  $("#infoNombreTicket").val(cli.nombre);
  $("#infoTelTicket").val(cli.telefono);
  $("#modalConfirmarCobro").modal("show");
}

function finalizarVenta(modo) {
  let total = parseFloat($("#txtTotal").text().replace(".", ""));
  let nombre = $("#infoNombreTicket").val();
  let tel = $("#infoTelTicket").val();
  let fecha = new Date().toLocaleString();
  db.ventasDia.push({ fecha, total, cliente: nombre });
  localStorage.setItem("ventasDia", JSON.stringify(db.ventasDia));
  localStorage.setItem("articulos", JSON.stringify(db.articulos));

  let t = `RAMOS GENERALES\n${fecha}\nCliente: ${nombre}\n----------------\n`;
  carrito.forEach(
    (i) => (t += `${i.nombre} x${i.cantidad}: $${i.precio * i.cantidad}\n`),
  );
  t += `----------------\nTOTAL: $${total}\n¡Gracias Marcelo!`;

  if (modo === "imprimir") {
    const w = window.open("", "", "width=300,height=500");
    w.document.write(`<pre>${t}</pre>`);
    w.print();
    w.close();
  } else {
    window.open(
      `https://api.whatsapp.com/send?phone=54${tel}&text=${encodeURIComponent(t)}`,
      "_blank",
    );
  }

  carrito = [];
  actualizarVista();
  $("#modalConfirmarCobro").modal("hide");
}

function realizarCierreCaja() {
  alert("Cierre: $" + db.ventasDia.reduce((a, b) => a + b.total, 0));
  db.ventasDia = [];
  localStorage.setItem("ventasDia", "[]");
}
function calcularVentasDia() {
  return db.ventasDia.reduce((a, b) => a + b.total, 0);
}
function confirmarVolver() {
  if (confirm("¿Seguro?")) $("#modalConfirmarCobro").modal("hide");
}
