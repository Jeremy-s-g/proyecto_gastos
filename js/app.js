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
  },
  {
    nombre: "Seguro medico",
    monto: 45000,
    categoria: "Otros"
  }
];

const deudas = [
  { nombre: "Tarjeta de credito", monto: 200000, estado: "Pagando" },
  { nombre: "Credito de consumo", monto: 500000, estado: "Atrasado" },
  { nombre: "Compra en cuotas", monto: 120000, estado: "Al dia" }
];

function formatearMoneda(monto) {
  return `$${monto.toLocaleString("es-CL")}`;
}

function calcularTotal(array) {
  let suma = 0;
  for (const item of array) {
    suma = suma + item.monto;
  }
  return suma;
}

function renderAll() {
  const totalGastos = calcularTotal(gastos);
  const totalIngresos = calcularTotal(ingresos);
  const totalDeudas = calcularTotal(deudas);
  const balance = totalIngresos - totalGastos;

  // --- Renderizar ingresos ---
  const listaIngresos = document.getElementById("lista-ingresos");
  listaIngresos.innerHTML = "";

  for (let i = 0; i < ingresos.length; i++) {
    const li = document.createElement("li");
    li.textContent = `${ingresos[i].nombre} - ${formatearMoneda(ingresos[i].monto)} `;

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
  totalIngresosEl.textContent = `Total ingresos: ${formatearMoneda(totalIngresos)}`;

  // --- Balance ---
  const balanceEl = document.getElementById("balance");

  if (balance > 0) {
    balanceEl.textContent = `Balance: +${formatearMoneda(balance)}`;
    balanceEl.className = "balance-positivo";
  } else if (balance < 0) {
    balanceEl.textContent = `Balance: -${formatearMoneda(Math.abs(balance))}`;
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
    li.textContent = `${gastos[i].nombre} - ${formatearMoneda(gastos[i].monto)} `;

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
  totalGastosEl.textContent = `Total gastos: ${formatearMoneda(totalGastos)}`;

  // --- Renderizar deudas ---
  const listaDeudas = document.getElementById("lista-deudas");
  listaDeudas.innerHTML = "";

  for (let i = 0; i < deudas.length; i++) {
    const li = document.createElement("li");
    li.textContent = `${deudas[i].nombre} - ${formatearMoneda(deudas[i].monto)} (${deudas[i].estado}) `;

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
  totalDeudasEl.textContent = `Total deudas: ${formatearMoneda(totalDeudas)}`;
}

document.getElementById("form-gasto").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("input-nombre-gasto").value.trim();
  const monto = Number(document.getElementById("input-monto-gasto").value);
  const categoria = document.getElementById("input-categoria-gasto").value;

  if (!nombre) {
    console.log("El nombre del gasto es obligatorio.");
    return;
  }

  if (monto <= 0) {
    console.log("El monto debe ser mayor que cero.");
    return;
  }

  if (!categoria) {
    console.log("La categoria es obligatoria.");
    return;
  }

  gastos.push({ nombre, monto, categoria });

  this.reset();
  renderAll();
});

document.getElementById("form-ingreso").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("input-nombre-ingreso").value.trim();
  const monto = Number(document.getElementById("input-monto-ingreso").value);

  if (!nombre) {
    console.log("El nombre del ingreso es obligatorio.");
    return;
  }

  if (monto <= 0) {
    console.log("El monto debe ser mayor que cero.");
    return;
  }

  ingresos.push({ nombre, monto });

  this.reset();
  renderAll();
});

renderAll();
