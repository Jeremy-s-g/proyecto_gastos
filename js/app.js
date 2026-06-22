const ingresos = ["Sueldo principal", "Sueldo secundario", "Ingreso adicional"];

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

console.log("Ingresos:", ingresos);
console.log("Gastos:", gastos);
console.log("Deudas:", deudas);
console.log("Total de gastos:", totalGastos);

// --- Renderizar ingresos ---
const listaIngresos = document.getElementById("lista-ingresos");

for (const ingreso of ingresos) {
  const li = document.createElement("li");
  li.textContent = ingreso;
  listaIngresos.appendChild(li);
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
