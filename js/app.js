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

const deudas = ["Tarjeta de credito", "Credito de consumo", "Compra en cuotas"];

let totalGastos = 0;

for (const gasto of gastos) {
  totalGastos = totalGastos + gasto.monto;
}

let totalIngresos = 0;

for (const ingreso of ingresos) {
  totalIngresos = totalIngresos + ingreso.monto;
}

const balance = totalIngresos - totalGastos;

console.log("Ingresos:", ingresos);
console.log("Gastos:", gastos);
console.log("Deudas:", deudas);
console.log("Total de gastos:", totalGastos);
console.log("Total de ingresos:", totalIngresos);
console.log("Balance:", balance);

// --- Renderizar ingresos ---
const listaIngresos = document.getElementById("lista-ingresos");

for (const ingreso of ingresos) {
  const li = document.createElement("li");
  li.textContent = `${ingreso.nombre} - $${ingreso.monto.toLocaleString("es-CL")}`;
  listaIngresos.appendChild(li);
}

const totalIngresosEl = document.getElementById("total-ingresos");
totalIngresosEl.textContent = `Total ingresos: $${totalIngresos.toLocaleString("es-CL")}`;

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

for (const gasto of gastos) {
  const li = document.createElement("li");
  li.textContent = `${gasto.nombre} - $${gasto.monto.toLocaleString("es-CL")}`;
  listaGastos.appendChild(li);
}

// --- Mostrar total de gastos ---
const totalGastosEl = document.getElementById("total-gastos");
totalGastosEl.textContent = `Total gastos: $${totalGastos.toLocaleString("es-CL")}`;

// --- Renderizar deudas ---
const listaDeudas = document.getElementById("lista-deudas");

for (const deuda of deudas) {
  const li = document.createElement("li");
  li.textContent = deuda;
  listaDeudas.appendChild(li);
}
