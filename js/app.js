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
