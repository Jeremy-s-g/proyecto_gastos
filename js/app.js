let ingresos = [];
let gastos = [];
let deudas = [];
let comprasCuotas = [];
let toastTimer = null;

function cargarDatosIniciales() {
  ingresos = [
    { id: generarId("ingreso"), nombre: "Sueldo principal", monto: 800000, fecha: "2026-08-01" },
    { id: generarId("ingreso"), nombre: "Sueldo secundario", monto: 400000, fecha: "2026-08-01" },
    { id: generarId("ingreso"), nombre: "Ingreso adicional", monto: 100000, fecha: "2026-08-05" }
  ];

  gastos = [
    { id: generarId("gasto"), nombre: "Arriendo", monto: 350000, categoria: "Vivienda", fecha: "2026-08-02" },
    { id: generarId("gasto"), nombre: "Luz", monto: 25000, categoria: "Servicios", fecha: "2026-08-08" },
    { id: generarId("gasto"), nombre: "Agua", monto: 18000, categoria: "Servicios", fecha: "2026-08-09" },
    { id: generarId("gasto"), nombre: "Internet", monto: 30000, categoria: "Servicios", fecha: "2026-08-10" },
    { id: generarId("gasto"), nombre: "Supermercado", monto: 180000, categoria: "Alimentacion", fecha: "2026-08-12" },
    { id: generarId("gasto"), nombre: "Seguro medico", monto: 45000, categoria: "Otros", fecha: "2026-08-15" }
  ];

  deudas = [
    { id: generarId("deuda"), nombre: "Tarjeta de credito", monto: 200000, estado: "Pagando", fecha: "2026-08-03" },
    { id: generarId("deuda"), nombre: "Credito de consumo", monto: 500000, estado: "Atrasado", fecha: "2026-08-06" },
    { id: generarId("deuda"), nombre: "Compra en cuotas", monto: 120000, estado: "Al dia", fecha: "2026-08-11" }
  ];

  comprasCuotas = [
    {
      id: generarId("compra"),
      nombre: "Refrigerador",
      montoTotal: 600000,
      cantidadCuotas: 6,
      fechaInicio: "2026-09-01",
      cuotasPagadas: 0
    }
  ];
}

function cargarDatos() {
  const datosGuardados = localStorage.getItem("datos");

  if (datosGuardados) {
    try {
      const datos = JSON.parse(datosGuardados);
      ingresos = datos.ingresos || [];
      gastos = datos.gastos || [];
      deudas = datos.deudas || [];
      comprasCuotas = datos.comprasCuotas || [];
    } catch (error) {
      cargarDatosIniciales();
    }
  } else {
    cargarDatosIniciales();
  }
}

function guardarDatos() {
  localStorage.setItem("datos", JSON.stringify({ ingresos, gastos, deudas, comprasCuotas }));
}

function formatearMoneda(monto) {
  return `$ ${monto.toLocaleString("es-CL")}`;
}

function calcularTotal(array) {
  let suma = 0;
  for (const item of array) {
    suma = suma + item.monto;
  }
  return suma;
}

function formatearFecha(fecha) {
  const partes = fecha.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function generarId(tipo) {
  return `${tipo}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function mostrarError(id, mensaje) {
  document.getElementById(id).textContent = mensaje;
}

function showToast() {
  const toast = document.getElementById("interaction-overlay");
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove("visible");
  }, 1800);
}

function crearElemento(tag, className, textContent) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (textContent !== undefined) {
    element.textContent = textContent;
  }

  return element;
}

function categoriaIcono(categoria) {
  const iconos = {
    Vivienda: "home",
    Servicios: "bolt",
    Alimentacion: "local_grocery_store",
    Transporte: "directions_car",
    Otros: "receipt_long"
  };

  return iconos[categoria] || "receipt_long";
}

function crearBotonEliminar(label, onDelete) {
  const boton = crearElemento("button", "delete-button");
  boton.type = "button";
  boton.setAttribute("aria-label", label);
  boton.innerHTML = '<span class="material-symbols-outlined">delete</span>';

  boton.addEventListener("click", function () {
    const fila = boton.closest(".finance-item");
    fila.classList.add("removing");
    setTimeout(function () {
      onDelete();
      renderAll();
      showToast();
    }, 180);
  });

  return boton;
}

function renderEmptyState(container, mensaje) {
  container.innerHTML = "";
  container.appendChild(crearElemento("p", "empty-state", mensaje));
}

function renderIngresos() {
  const listaIngresos = document.getElementById("lista-ingresos");

  if (ingresos.length === 0) {
    renderEmptyState(listaIngresos, "Sin ingresos registrados.");
    return;
  }

  listaIngresos.innerHTML = "";

  for (let i = 0; i < ingresos.length; i++) {
    const ingreso = ingresos[i];
    const fila = crearElemento("div", "finance-item");
    const main = crearElemento("div", "item-main");
    const copy = crearElemento("div", "item-copy");
    const actions = crearElemento("div", "item-actions");

    copy.appendChild(crearElemento("strong", "", ingreso.nombre));
    copy.appendChild(crearElemento("span", "", "Ingreso familiar"));

    if (ingreso.fecha) {
      copy.appendChild(crearElemento("span", "", `Fecha: ${formatearFecha(ingreso.fecha)}`));
    }

    main.appendChild(copy);

    actions.appendChild(crearElemento("strong", "positive", formatearMoneda(ingreso.monto)));
    actions.appendChild(crearBotonEliminar(`Eliminar ${ingreso.nombre}`, function () {
      ingresos = ingreso.id
        ? ingresos.filter((item) => item.id !== ingreso.id)
        : ingresos.filter((item, index) => index !== i);
    }));

    fila.appendChild(main);
    fila.appendChild(actions);
    listaIngresos.appendChild(fila);
  }
}

function renderGastos() {
  const listaGastos = document.getElementById("lista-gastos");
  const filtroCategoria = document.getElementById("filtro-categoria-gastos").value;
  const gastosVisibles = filtroCategoria === "Todas"
    ? gastos
    : gastos.filter((gasto) => gasto.categoria === filtroCategoria);

  if (gastos.length === 0) {
    renderEmptyState(listaGastos, "Sin gastos registrados.");
    return;
  }

  if (gastosVisibles.length === 0) {
    renderEmptyState(listaGastos, "No hay gastos en esta categoria.");
    return;
  }

  listaGastos.innerHTML = "";

  for (let i = 0; i < gastosVisibles.length; i++) {
    const gasto = gastosVisibles[i];
    const indiceOriginal = gastos.indexOf(gasto);
    const fila = crearElemento("div", "finance-item");
    const main = crearElemento("div", "item-main");
    const icon = crearElemento("div", "item-icon");
    const copy = crearElemento("div", "item-copy");
    const actions = crearElemento("div", "item-actions");

    icon.innerHTML = `<span class="material-symbols-outlined">${categoriaIcono(gasto.categoria)}</span>`;
    copy.appendChild(crearElemento("strong", "", gasto.nombre));
    copy.appendChild(crearElemento("span", "", gasto.categoria));

    if (gasto.fecha) {
      copy.appendChild(crearElemento("span", "", `Fecha: ${formatearFecha(gasto.fecha)}`));
    }

    main.appendChild(icon);
    main.appendChild(copy);

    actions.appendChild(crearElemento("strong", "negative", formatearMoneda(gasto.monto)));
    actions.appendChild(crearBotonEliminar(`Eliminar ${gasto.nombre}`, function () {
      gastos = gasto.id
        ? gastos.filter((item) => item.id !== gasto.id)
        : gastos.filter((item, index) => index !== indiceOriginal);
    }));

    fila.appendChild(main);
    fila.appendChild(actions);
    listaGastos.appendChild(fila);
  }
}

function estadoClase(estado) {
  if (estado === "Al dia") {
    return "status-positive";
  }

  if (estado === "Atrasado") {
    return "status-negative";
  }

  return "";
}

function renderDeudas() {
  const listaDeudas = document.getElementById("lista-deudas");

  if (deudas.length === 0) {
    renderEmptyState(listaDeudas, "Sin deudas pendientes.");
    return;
  }

  listaDeudas.innerHTML = "";

  for (let i = 0; i < deudas.length; i++) {
    const deuda = deudas[i];
    const estadoVisual = deuda.estado === "Atrasado" ? "debt-late" : "debt-ok";
    const fila = crearElemento("div", `finance-item ${estadoVisual}`);
    const main = crearElemento("div", "item-main");
    const copy = crearElemento("div", "item-copy");
    const actions = crearElemento("div", "item-actions");

    copy.appendChild(crearElemento("strong", "", deuda.nombre));
    copy.appendChild(crearElemento("span", estadoClase(deuda.estado), deuda.estado));

    if (deuda.fecha) {
      copy.appendChild(crearElemento("span", "", `Fecha: ${formatearFecha(deuda.fecha)}`));
    }

    main.appendChild(copy);

    actions.appendChild(crearElemento("strong", "", formatearMoneda(deuda.monto)));
    actions.appendChild(crearBotonEliminar(`Eliminar ${deuda.nombre}`, function () {
      deudas = deuda.id
        ? deudas.filter((item) => item.id !== deuda.id)
        : deudas.filter((item, index) => index !== i);
    }));

    fila.appendChild(main);
    fila.appendChild(actions);
    listaDeudas.appendChild(fila);
  }
}

function renderComprasCuotas() {
  const listaCompras = document.getElementById("lista-compras-cuotas");

  if (comprasCuotas.length === 0) {
    renderEmptyState(listaCompras, "Sin compras en cuotas.");
    return;
  }

  listaCompras.innerHTML = "";

  for (const compra of comprasCuotas) {
    const valorCuota = Math.round(compra.montoTotal / compra.cantidadCuotas);
    const fila = crearElemento("div", "finance-item");
    const copy = crearElemento("div", "item-copy");

    copy.appendChild(crearElemento("strong", "", compra.nombre));
    copy.appendChild(crearElemento("span", "", `Cuota mensual: ${formatearMoneda(valorCuota)}`));
    copy.appendChild(crearElemento("span", "", `Cuotas pagadas: ${compra.cuotasPagadas} de ${compra.cantidadCuotas}`));
    copy.appendChild(crearElemento("span", "", `Inicio: ${formatearFecha(compra.fechaInicio)}`));

    fila.appendChild(copy);
    listaCompras.appendChild(fila);
  }
}

function actualizarResumen(totalIngresos, totalGastos, totalDeudas, balance) {
  const balanceTotalEl = document.getElementById("balance-total");
  const balanceLineEl = balanceTotalEl.closest(".balance-line");
  const balanceIconEl = document.getElementById("balance-icon");
  const trendEl = document.getElementById("balance-trend");
  const goalEl = document.getElementById("balance-goal");
  const ahorroObjetivo = Math.max(totalIngresos * 0.2, 1);
  const ahorroActual = Math.max(balance, 0);
  const metaAhorro = Math.min(Math.round((ahorroActual / ahorroObjetivo) * 100), 100);
  const usoIngresos = totalIngresos === 0 ? 0 : Math.round((totalGastos / totalIngresos) * 100);

  balanceTotalEl.textContent = formatearMoneda(Math.abs(balance));
  balanceLineEl.classList.toggle("negative", balance < 0);
  balanceIconEl.textContent = balance > 0 ? "trending_up" : balance < 0 ? "trending_down" : "trending_flat";
  trendEl.textContent = `${usoIngresos}%`;
  goalEl.textContent = `${metaAhorro}%`;

  document.getElementById("total-ingresos").textContent = formatearMoneda(totalIngresos);
  document.getElementById("total-gastos").textContent = formatearMoneda(totalGastos);
  document.getElementById("total-deudas").textContent = formatearMoneda(totalDeudas);
}

function renderAll() {
  const totalGastos = calcularTotal(gastos);
  const totalIngresos = calcularTotal(ingresos);
  const totalDeudas = calcularTotal(deudas);
  const balance = totalIngresos - totalGastos;

  actualizarResumen(totalIngresos, totalGastos, totalDeudas, balance);
  renderIngresos();
  renderGastos();
  renderDeudas();
  renderComprasCuotas();
  guardarDatos();
}

function reiniciarDatos() {
  const confirmar = confirm("Se reemplazaran los datos actuales por los datos de ejemplo. ¿Continuar?");

  if (!confirmar) {
    return;
  }

  cargarDatosIniciales();
  renderAll();
  showToast();
}

document.getElementById("form-gasto").addEventListener("submit", function (e) {
  e.preventDefault();

  mostrarError("error-gasto", "");

  const nombre = document.getElementById("input-nombre-gasto").value.trim();
  const monto = Number(document.getElementById("input-monto-gasto").value);
  const categoria = document.getElementById("input-categoria-gasto").value;
  const fecha = document.getElementById("input-fecha-gasto").value;

  if (!nombre) {
    mostrarError("error-gasto", "El nombre del gasto es obligatorio.");
    return;
  }

  if (Number.isNaN(monto) || monto <= 0) {
    mostrarError("error-gasto", "El monto debe ser mayor que cero.");
    return;
  }

  if (!categoria) {
    mostrarError("error-gasto", "La categoria es obligatoria.");
    return;
  }

  if (!fecha) {
    mostrarError("error-gasto", "La fecha es obligatoria.");
    return;
  }

  gastos.push({ id: generarId("gasto"), nombre, monto, categoria, fecha });

  this.reset();
  renderAll();
  showToast();
});

document.getElementById("form-ingreso").addEventListener("submit", function (e) {
  e.preventDefault();

  mostrarError("error-ingreso", "");

  const nombre = document.getElementById("input-nombre-ingreso").value.trim();
  const monto = Number(document.getElementById("input-monto-ingreso").value);
  const fecha = document.getElementById("input-fecha-ingreso").value;

  if (!nombre) {
    mostrarError("error-ingreso", "El nombre del ingreso es obligatorio.");
    return;
  }

  if (Number.isNaN(monto) || monto <= 0) {
    mostrarError("error-ingreso", "El monto debe ser mayor que cero.");
    return;
  }

  if (!fecha) {
    mostrarError("error-ingreso", "La fecha es obligatoria.");
    return;
  }

  ingresos.push({ id: generarId("ingreso"), nombre, monto, fecha });

  this.reset();
  renderAll();
  showToast();
});

document.getElementById("form-deuda").addEventListener("submit", function (e) {
  e.preventDefault();

  mostrarError("error-deuda", "");

  const nombre = document.getElementById("input-nombre-deuda").value.trim();
  const monto = Number(document.getElementById("input-monto-deuda").value);
  const estado = document.getElementById("input-estado-deuda").value;
  const fecha = document.getElementById("input-fecha-deuda").value;

  if (!nombre) {
    mostrarError("error-deuda", "El nombre de la deuda es obligatorio.");
    return;
  }

  if (Number.isNaN(monto) || monto <= 0) {
    mostrarError("error-deuda", "El monto debe ser mayor que cero.");
    return;
  }

  if (!estado) {
    mostrarError("error-deuda", "El estado es obligatorio.");
    return;
  }

  if (!fecha) {
    mostrarError("error-deuda", "La fecha es obligatoria.");
    return;
  }

  deudas.push({ id: generarId("deuda"), nombre, monto, estado, fecha });

  this.reset();
  renderAll();
  showToast();
});

document.getElementById("btn-reiniciar-datos").addEventListener("click", reiniciarDatos);
document.getElementById("filtro-categoria-gastos").addEventListener("change", renderGastos);

cargarDatos();
renderAll();
