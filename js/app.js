let ingresos = [];
let gastos = [];
let creditos = [];
let creditoEditandoId = null;
let registroEditando = { tipo: null, id: null };
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

  creditos = [
    {
      id: generarId("credito"),
      nombre: "Tarjeta de credito",
      tipo: "Credito",
      montoTotal: 600000,
      cantidadCuotas: 12,
      fechaInicio: "2026-08-03",
      cuotasPagadas: 2
    },
    {
      id: generarId("credito"),
      nombre: "Credito de consumo",
      tipo: "Credito",
      montoTotal: 500000,
      cantidadCuotas: 10,
      fechaInicio: "2026-08-06",
      cuotasPagadas: 1
    },
    {
      id: generarId("credito"),
      nombre: "Refrigerador",
      tipo: "Compra en cuota",
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
      ingresos = obtenerArraySeguro(datos.ingresos);
      gastos = obtenerArraySeguro(datos.gastos);
      creditos = Array.isArray(datos.creditos)
        ? datos.creditos
        : migrarCreditos(datos.deudas, datos.comprasCuotas);
    } catch (error) {
      cargarDatosIniciales();
    }
  } else {
    cargarDatosIniciales();
  }
}

function obtenerArraySeguro(valor) {
  return Array.isArray(valor) ? valor : [];
}

function guardarDatos() {
  localStorage.setItem("datos", JSON.stringify({ ingresos, gastos, creditos }));
}

function migrarCreditos(deudasGuardadas = [], comprasGuardadas = []) {
  const creditosMigrados = deudasGuardadas.map((deuda) => ({
    id: deuda.id || generarId("credito"),
    nombre: deuda.nombre,
    tipo: "Credito",
    montoTotal: deuda.monto || deuda.montoTotal,
    cantidadCuotas: 1,
    fechaInicio: deuda.fecha || deuda.fechaInicio,
    cuotasPagadas: 0
  }));

  return creditosMigrados.concat(
    comprasGuardadas.map((compra) => ({
      ...compra,
      tipo: compra.tipo || "Compra en cuota"
    }))
  );
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

function calcularTotalCuotasPendientes() {
  let total = 0;

  for (const credito of creditos) {
    const cuotas = calcularCuotas(credito);

    for (const cuota of cuotas) {
      if (cuota.numero > credito.cuotasPagadas) {
        total = total + cuota.monto;
      }
    }
  }

  return total;
}

function calcularCuotas(credito) {
  const cuotas = [];
  const montoBase = Math.floor(credito.montoTotal / credito.cantidadCuotas);
  let montoAcumulado = 0;

  for (let numero = 1; numero <= credito.cantidadCuotas; numero++) {
    const monto = numero === credito.cantidadCuotas
      ? credito.montoTotal - montoAcumulado
      : montoBase;

    cuotas.push({
      numero,
      fecha: calcularFechaCuota(credito.fechaInicio, numero),
      monto,
      pagada: numero <= credito.cuotasPagadas
    });
    montoAcumulado = montoAcumulado + monto;
  }

  return cuotas;
}

function formatearFecha(fecha) {
  const partes = fecha.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function calcularFechaCuota(fechaInicio, numeroCuota) {
  const fechaCuota = new Date(`${fechaInicio}T12:00:00`);
  fechaCuota.setMonth(fechaCuota.getMonth() + numeroCuota - 1);

  const anio = fechaCuota.getFullYear();
  const mes = String(fechaCuota.getMonth() + 1).padStart(2, "0");
  const dia = String(fechaCuota.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

function calcularFechaTermino(fechaInicio, cantidadCuotas) {
  return calcularFechaCuota(fechaInicio, cantidadCuotas);
}

function generarId(tipo) {
  return `${tipo}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function limpiarErrores(formId) {
  document.getElementById(formId).querySelectorAll(".input-error").forEach((campo) => {
    campo.classList.remove("input-error");
  });
}

function mostrarError(id, mensaje, campoId) {
  document.getElementById(id).textContent = mensaje;

  if (campoId) {
    document.getElementById(campoId).classList.add("input-error");
  }
}

function iniciarEdicionCredito(credito) {
  creditoEditandoId = credito.id;
  document.getElementById("input-nombre-credito").value = credito.nombre;
  document.getElementById("input-monto-credito").value = credito.montoTotal;
  document.getElementById("input-cantidad-cuotas-credito").value = credito.cantidadCuotas;
  document.getElementById("input-fecha-credito").value = credito.fechaInicio;
  document.getElementById("input-tipo-credito").value = credito.tipo;
  document.getElementById("btn-submit-credito").textContent = "Guardar cambios";
  document.getElementById("btn-cancelar-credito").hidden = false;
  document.getElementById("form-credito").scrollIntoView({ behavior: "smooth", block: "center" });
}

function cancelarEdicionCredito() {
  creditoEditandoId = null;
  document.getElementById("form-credito").reset();
  document.getElementById("btn-submit-credito").textContent = "Agregar";
  document.getElementById("btn-cancelar-credito").hidden = true;
  limpiarErrores("form-credito");
  mostrarError("error-credito", "");
}

function iniciarEdicionRegistro(tipo, registro) {
  registroEditando = { tipo, id: registro.id };

  const campos = {
    ingreso: {
      nombre: "input-nombre-ingreso",
      monto: "input-monto-ingreso",
      fecha: "input-fecha-ingreso"
    },
    gasto: {
      nombre: "input-nombre-gasto",
      monto: "input-monto-gasto",
      categoria: "input-categoria-gasto",
      fecha: "input-fecha-gasto"
    },
    deuda: {
      nombre: "input-nombre-deuda",
      monto: "input-monto-deuda",
      estado: "input-estado-deuda",
      fecha: "input-fecha-deuda"
    }
  }[tipo];

  document.getElementById(campos.nombre).value = registro.nombre;
  document.getElementById(campos.monto).value = registro.monto;
  document.getElementById(campos.fecha).value = registro.fecha;

  if (campos.categoria) {
    document.getElementById(campos.categoria).value = registro.categoria;
  }

  if (campos.estado) {
    document.getElementById(campos.estado).value = registro.estado;
  }

  document.getElementById(`btn-submit-${tipo}`).textContent = "Guardar cambios";
  document.getElementById(`btn-cancelar-${tipo}`).hidden = false;
}

function cancelarEdicionRegistro(tipo) {
  registroEditando = { tipo: null, id: null };
  document.getElementById(`form-${tipo}`).reset();
  document.getElementById(`btn-submit-${tipo}`).textContent = tipo === "gasto" ? "OK" : "Agregar";
  document.getElementById(`btn-cancelar-${tipo}`).hidden = true;
  limpiarErrores(`form-${tipo}`);
  mostrarError(`error-${tipo}`, "");
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
  const busqueda = document.getElementById("busqueda-ingresos").value.trim().toLowerCase();
  const filtroMes = document.getElementById("filtro-mes-ingresos").value;
  const ingresosVisibles = ingresos.filter((ingreso) => {
    const coincideNombre = ingreso.nombre.toLowerCase().includes(busqueda);
    const coincideMes = !filtroMes || (ingreso.fecha && ingreso.fecha.startsWith(filtroMes));
    return coincideNombre && coincideMes;
  });

  if (ingresos.length === 0) {
    renderEmptyState(listaIngresos, "Sin ingresos registrados.");
    return;
  }

  if (ingresosVisibles.length === 0) {
    renderEmptyState(listaIngresos, "No se encontraron ingresos.");
    return;
  }

  listaIngresos.innerHTML = "";

  for (const ingreso of ingresosVisibles) {
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
    const botonEditar = crearElemento("button", "edit-button", "Editar");
    botonEditar.type = "button";
    botonEditar.addEventListener("click", function () {
      iniciarEdicionRegistro("ingreso", ingreso);
    });
    actions.appendChild(botonEditar);
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
  const busqueda = document.getElementById("busqueda-gastos").value.trim().toLowerCase();
  const filtroMes = document.getElementById("filtro-mes-gastos").value;
  const gastosPorCategoria = filtroCategoria === "Todas"
    ? gastos
    : gastos.filter((gasto) => gasto.categoria === filtroCategoria);
  const gastosVisibles = gastosPorCategoria.filter((gasto) => {
    const coincideNombre = gasto.nombre.toLowerCase().includes(busqueda);
    const coincideMes = !filtroMes || (gasto.fecha && gasto.fecha.startsWith(filtroMes));
    return coincideNombre && coincideMes;
  });

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
    const botonEditar = crearElemento("button", "edit-button", "Editar");
    botonEditar.type = "button";
    botonEditar.addEventListener("click", function () {
      iniciarEdicionRegistro("gasto", gasto);
    });
    actions.appendChild(botonEditar);
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

function renderCreditos() {
  const listaCreditos = document.getElementById("lista-creditos");
  const filtroMes = document.getElementById("filtro-mes-creditos").value;
  const busqueda = document.getElementById("busqueda-creditos").value.trim().toLowerCase();
  const creditosVisibles = creditos.filter((credito) => credito.nombre.toLowerCase().includes(busqueda));
  let cuotasMostradas = 0;

  if (creditos.length === 0) {
    renderEmptyState(listaCreditos, "Sin creditos registrados.");
    return;
  }

  if (creditosVisibles.length === 0) {
    renderEmptyState(listaCreditos, "No se encontraron creditos o compras.");
    return;
  }

  listaCreditos.innerHTML = "";

  for (const tipo of ["Credito", "Compra en cuota"]) {
    const grupo = crearElemento("div", "credit-group");
    const creditosGrupo = creditosVisibles.filter((credito) => credito.tipo === tipo);
    let grupoMostrado = false;

    for (const credito of creditosGrupo) {
      const historial = calcularCuotas(credito);
      const valorCuota = historial.length > 0 ? historial[0].monto : 0;
      const cuotasRestantes = Math.max(credito.cantidadCuotas - credito.cuotasPagadas, 0);
      const fechaTermino = calcularFechaTermino(credito.fechaInicio, credito.cantidadCuotas);

      const cuotasVisibles = filtroMes
        ? historial.filter((cuota) => cuota.fecha.startsWith(filtroMes))
        : historial;

      if (cuotasVisibles.length === 0) {
        continue;
      }

      if (!grupoMostrado) {
        grupo.appendChild(crearElemento("h3", "credit-group-title", tipo));
        grupoMostrado = true;
      }

      const fila = crearElemento("div", "finance-item credit-item");
      const encabezado = crearElemento("div", "credit-item-header");
      const main = crearElemento("div", "item-main");
      const copy = crearElemento("div", "item-copy");
      const actions = crearElemento("div", "item-actions credit-actions");
      const botonPago = crearElemento("button", "payment-button", "Pagar cuota");
      const botonDeshacer = crearElemento("button", "undo-payment-button", "Deshacer pago");
      const botonEditar = crearElemento("button", "edit-button", "Editar");

      botonPago.type = "button";
      botonPago.disabled = credito.cuotasPagadas >= credito.cantidadCuotas;
      botonPago.addEventListener("click", function () {
        credito.cuotasPagadas += 1;
        renderAll();
        showToast();
      });

      botonDeshacer.type = "button";
      botonDeshacer.disabled = credito.cuotasPagadas === 0;
      botonDeshacer.addEventListener("click", function () {
        if (credito.cuotasPagadas === 0) {
          return;
        }

        credito.cuotasPagadas -= 1;
        renderAll();
        showToast();
      });

      botonEditar.type = "button";
      botonEditar.addEventListener("click", function () {
        iniciarEdicionCredito(credito);
      });

      copy.appendChild(crearElemento("strong", "", credito.nombre));
      copy.appendChild(crearElemento("span", "", `Tipo de gasto: Cuota`));
      copy.appendChild(crearElemento("span", "", `Categoria: ${credito.tipo}`));
      copy.appendChild(crearElemento("span", "", `Fecha: ${formatearFecha(credito.fechaInicio)}`));

      main.appendChild(copy);

      const historialElement = crearElemento("div", "installment-history");
      for (const cuota of cuotasVisibles) {
        const estado = cuota.pagada ? "paid" : "pending";
        const texto = `Cuota ${cuota.numero} - ${formatearFecha(cuota.fecha)} - ${formatearMoneda(cuota.monto)} - ${cuota.pagada ? "Pagada" : "Pendiente"}`;
        historialElement.appendChild(crearElemento("span", estado, texto));
      }

      cuotasMostradas += cuotasVisibles.length;
      const detalle = document.createElement("details");
      detalle.className = "installment-details";
      const resumenDetalle = document.createElement("summary");
      resumenDetalle.textContent = `Ver detalle de cuotas (${cuotasVisibles.length})`;
      detalle.appendChild(resumenDetalle);
      detalle.appendChild(crearElemento("span", "", `Inicio: ${formatearFecha(credito.fechaInicio)}`));
      detalle.appendChild(crearElemento("span", "", `Termina: ${formatearFecha(fechaTermino)}`));
      detalle.appendChild(historialElement);
      actions.appendChild(crearElemento("strong", "positive", formatearMoneda(credito.montoTotal)));
      actions.appendChild(botonEditar);
      actions.appendChild(botonPago);
      actions.appendChild(botonDeshacer);
      actions.appendChild(crearBotonEliminar(`Eliminar ${credito.nombre}`, function () {
        creditos = creditos.filter((item) => item.id !== credito.id);
      }));
      encabezado.appendChild(main);
      encabezado.appendChild(actions);
      fila.appendChild(encabezado);
      fila.appendChild(detalle);
      grupo.appendChild(fila);
    }

    if (grupoMostrado) {
      listaCreditos.appendChild(grupo);
    }
  }

  if (cuotasMostradas === 0) {
    renderEmptyState(listaCreditos, "No hay cuotas para el mes seleccionado.");
  }
}

function actualizarResumen(totalIngresos, totalGastos, totalCreditos, balance) {
  const balanceTotalEl = document.getElementById("balance-total");
  const balanceLineEl = balanceTotalEl.closest(".balance-line");
  const balanceIconEl = document.getElementById("balance-icon");
  const trendEl = document.getElementById("balance-trend");
  const goalEl = document.getElementById("balance-goal");
  const installmentsEl = document.getElementById("balance-installments");
  const ahorroObjetivo = Math.max(totalIngresos * 0.2, 1);
  const ahorroActual = Math.max(balance, 0);
  const metaAhorro = Math.min(Math.round((ahorroActual / ahorroObjetivo) * 100), 100);
  const usoIngresos = totalIngresos === 0 ? 0 : Math.round((totalGastos / totalIngresos) * 100);
  const totalCuotasPendientes = calcularTotalCuotasPendientes();

  balanceTotalEl.textContent = formatearMoneda(Math.abs(balance));
  balanceLineEl.classList.toggle("negative", balance < 0);
  balanceIconEl.textContent = balance > 0 ? "trending_up" : balance < 0 ? "trending_down" : "trending_flat";
  trendEl.textContent = `${usoIngresos}%`;
  goalEl.textContent = `${metaAhorro}%`;
  installmentsEl.textContent = formatearMoneda(totalCuotasPendientes);

  document.getElementById("total-ingresos").textContent = formatearMoneda(totalIngresos);
  document.getElementById("total-gastos").textContent = formatearMoneda(totalGastos);
  document.getElementById("total-creditos").textContent = formatearMoneda(totalCreditos);
}

function renderAll() {
  const totalGastos = calcularTotal(gastos);
  const totalIngresos = calcularTotal(ingresos);
  const totalCreditos = calcularTotalCuotasPendientes();
  const balance = totalIngresos - totalGastos;

  actualizarResumen(totalIngresos, totalGastos, totalCreditos, balance);
  renderIngresos();
  renderGastos();
  renderCreditos();
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

  limpiarErrores("form-gasto");
  mostrarError("error-gasto", "");

  const nombre = document.getElementById("input-nombre-gasto").value.trim();
  const monto = Number(document.getElementById("input-monto-gasto").value);
  const categoria = document.getElementById("input-categoria-gasto").value;
  const fecha = document.getElementById("input-fecha-gasto").value;

  if (!nombre) {
    mostrarError("error-gasto", "El nombre del gasto es obligatorio.", "input-nombre-gasto");
    return;
  }

  if (Number.isNaN(monto) || monto <= 0) {
    mostrarError("error-gasto", "El monto debe ser mayor que cero.", "input-monto-gasto");
    return;
  }

  if (!categoria) {
    mostrarError("error-gasto", "La categoria es obligatoria.", "input-categoria-gasto");
    return;
  }

  if (!fecha) {
    mostrarError("error-gasto", "La fecha es obligatoria.", "input-fecha-gasto");
    return;
  }

  if (registroEditando.tipo === "gasto") {
    const gasto = gastos.find((item) => item.id === registroEditando.id);
    gasto.nombre = nombre;
    gasto.monto = monto;
    gasto.categoria = categoria;
    gasto.fecha = fecha;
  } else {
    gastos.push({ id: generarId("gasto"), nombre, monto, categoria, fecha });
  }

  cancelarEdicionRegistro("gasto");
  renderAll();
  showToast();
});

document.getElementById("form-ingreso").addEventListener("submit", function (e) {
  e.preventDefault();

  limpiarErrores("form-ingreso");
  mostrarError("error-ingreso", "");

  const nombre = document.getElementById("input-nombre-ingreso").value.trim();
  const monto = Number(document.getElementById("input-monto-ingreso").value);
  const fecha = document.getElementById("input-fecha-ingreso").value;

  if (!nombre) {
    mostrarError("error-ingreso", "El nombre del ingreso es obligatorio.", "input-nombre-ingreso");
    return;
  }

  if (Number.isNaN(monto) || monto <= 0) {
    mostrarError("error-ingreso", "El monto debe ser mayor que cero.", "input-monto-ingreso");
    return;
  }

  if (!fecha) {
    mostrarError("error-ingreso", "La fecha es obligatoria.", "input-fecha-ingreso");
    return;
  }

  if (registroEditando.tipo === "ingreso") {
    const ingreso = ingresos.find((item) => item.id === registroEditando.id);
    ingreso.nombre = nombre;
    ingreso.monto = monto;
    ingreso.fecha = fecha;
  } else {
    ingresos.push({ id: generarId("ingreso"), nombre, monto, fecha });
  }

  cancelarEdicionRegistro("ingreso");
  renderAll();
  showToast();
});

document.getElementById("form-credito").addEventListener("submit", function (e) {
  e.preventDefault();

  limpiarErrores("form-credito");
  mostrarError("error-credito", "");

  const nombre = document.getElementById("input-nombre-credito").value.trim();
  const montoTotal = Number(document.getElementById("input-monto-credito").value);
  const cantidadCuotas = Number(document.getElementById("input-cantidad-cuotas-credito").value);
  const fechaInicio = document.getElementById("input-fecha-credito").value;
  const tipo = document.getElementById("input-tipo-credito").value;

  if (!nombre || !/[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(nombre)) {
    mostrarError("error-credito", "El nombre debe contener al menos una letra.", "input-nombre-credito");
    return;
  }

  if (Number.isNaN(montoTotal) || montoTotal <= 0) {
    mostrarError("error-credito", "El monto debe ser mayor que cero.", "input-monto-credito");
    return;
  }

  if (!Number.isInteger(cantidadCuotas) || cantidadCuotas <= 0) {
    mostrarError("error-credito", "La cantidad de cuotas debe ser un numero entero mayor que cero.", "input-cantidad-cuotas-credito");
    return;
  }

  if (!fechaInicio) {
    mostrarError("error-credito", "La fecha de inicio es obligatoria.", "input-fecha-credito");
    return;
  }

  if (!tipo) {
    mostrarError("error-credito", "La categoria es obligatoria.", "input-tipo-credito");
    return;
  }

  if (creditoEditandoId) {
    const credito = creditos.find((item) => item.id === creditoEditandoId);
    credito.nombre = nombre;
    credito.montoTotal = montoTotal;
    credito.cantidadCuotas = cantidadCuotas;
    credito.fechaInicio = fechaInicio;
    credito.tipo = tipo;
    credito.cuotasPagadas = Math.min(credito.cuotasPagadas, cantidadCuotas);
  } else {
    creditos.push({
      id: generarId("credito"),
      nombre,
      tipo,
      montoTotal,
      cantidadCuotas,
      fechaInicio,
      cuotasPagadas: 0
    });
  }

  cancelarEdicionCredito();
  renderAll();
  showToast();
});

document.getElementById("btn-reiniciar-datos").addEventListener("click", reiniciarDatos);
document.getElementById("filtro-categoria-gastos").addEventListener("change", renderGastos);
document.getElementById("filtro-mes-ingresos").addEventListener("change", renderIngresos);
document.getElementById("filtro-mes-gastos").addEventListener("change", renderGastos);
document.getElementById("filtro-mes-creditos").addEventListener("change", renderCreditos);
document.getElementById("busqueda-ingresos").addEventListener("input", renderIngresos);
document.getElementById("busqueda-gastos").addEventListener("input", renderGastos);
document.getElementById("busqueda-creditos").addEventListener("input", renderCreditos);
document.getElementById("btn-cancelar-credito").addEventListener("click", cancelarEdicionCredito);
document.getElementById("btn-cancelar-ingreso").addEventListener("click", function () {
  cancelarEdicionRegistro("ingreso");
});
document.getElementById("btn-cancelar-gasto").addEventListener("click", function () {
  cancelarEdicionRegistro("gasto");
});

cargarDatos();
renderAll();
