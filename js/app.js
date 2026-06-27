const ingresos = [
  { nombre: "Sueldo principal", monto: 800000 },
  { nombre: "Sueldo secundario", monto: 400000 },
  { nombre: "Ingreso adicional", monto: 100000 }
];

const gastos = [
  {
    nombre: "Arriendo",
    monto: 350000,
    categoria: "Vivienda"
  },
  {
    nombre: "Luz",
    monto: 25000,
    categoria: "Servicios"
  },
  {
    nombre: "Agua",
    monto: 18000,
    categoria: "Servicios"
  },
  {
    nombre: "Internet",
    monto: 30000,
    categoria: "Servicios"
  },
  {
    nombre: "Supermercado",
    monto: 180000,
    categoria: "Alimentacion"
  }
];

const deudas = [
  { nombre: "Tarjeta de credito", monto: 200000, estado: "Pagando" },
  { nombre: "Credito de consumo", monto: 500000, estado: "Atrasado" },
  { nombre: "Compra en cuotas", monto: 120000, estado: "Al dia" }
];

function renderAll() {
  // --- Calcular totales desde los arrays ---
  let totalGastos = 0;

  for (const gasto of gastos) {
    totalGastos = totalGastos + gasto.monto;
  }

  let totalIngresos = 0;

  for (const ingreso of ingresos) {
    totalIngresos = totalIngresos + ingreso.monto;
  }

  const balance = totalIngresos - totalGastos;

  let totalDeudas = 0;

  for (const deuda of deudas) {
    totalDeudas = totalDeudas + deuda.monto;
  }

  // --- Renderizar ingresos ---
  const listaIngresos = document.getElementById("lista-ingresos");
  listaIngresos.innerHTML = "";

  for (let i = 0; i < ingresos.length; i++) {
    const li = document.createElement("li");
    li.textContent = `${ingresos[i].nombre} - $${ingresos[i].monto.toLocaleString("es-CL")} `;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", function () {
      ingresos.splice(i, 1);
      renderAll();
    });

    li.appendChild(btnEliminar);
    listaIngresos.appendChild(li);
  }

  const totalIngresosEl = document.getElementById("total-ingresos");
  totalIngresosEl.textContent = `Total ingresos: $${totalIngresos.toLocaleString("es-CL")}`;

  // --- Balance ---
  const balanceEl = document.getElementById("balance");

  if (balance > 0) {
    balanceEl.textContent = `Balance: +$${balance.toLocaleString("es-CL")}`;
    balanceEl.className = "balance-positivo";
  } else if (balance < 0) {
    balanceEl.textContent = `Balance: -$${Math.abs(balance).toLocaleString("es-CL")}`;
    balanceEl.className = "balance-negativo";
  } else {
    balanceEl.textContent = `Balance: $0`;
    balanceEl.className = "balance-cero";
  }

  // --- Renderizar gastos ---
  const listaGastos = document.getElementById("lista-gastos");
  listaGastos.innerHTML = "";

  for (let i = 0; i < gastos.length; i++) {
    const li = document.createElement("li");
    li.textContent = `${gastos[i].nombre} - $${gastos[i].monto.toLocaleString("es-CL")} `;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", function () {
      gastos.splice(i, 1);
      renderAll();
    });

    li.appendChild(btnEliminar);
    listaGastos.appendChild(li);
  }

  const totalGastosEl = document.getElementById("total-gastos");
  totalGastosEl.textContent = `Total gastos: $${totalGastos.toLocaleString("es-CL")}`;

  // --- Renderizar deudas ---
  const listaDeudas = document.getElementById("lista-deudas");
  listaDeudas.innerHTML = "";

  for (let i = 0; i < deudas.length; i++) {
    const li = document.createElement("li");
    li.textContent = `${deudas[i].nombre} - $${deudas[i].monto.toLocaleString("es-CL")} (${deudas[i].estado}) `;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", function () {
      deudas.splice(i, 1);
      renderAll();
    });

    li.appendChild(btnEliminar);
    listaDeudas.appendChild(li);
  }

  const totalDeudasEl = document.getElementById("total-deudas");
  totalDeudasEl.textContent = `Total deudas: $${totalDeudas.toLocaleString("es-CL")}`;
}

document.getElementById("form-gasto").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("input-nombre-gasto").value.trim();
  const monto = Number(document.getElementById("input-monto-gasto").value);
  const categoria = document.getElementById("input-categoria-gasto").value;

  if (!nombre || !monto || !categoria) return;

  gastos.push({ nombre, monto, categoria });

  this.reset();
  renderAll();
});

renderAll();
