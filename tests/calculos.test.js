const assert = require("node:assert/strict");
const {
  calcularCuotas,
  calcularFechaTermino,
  calcularTotal
} = require("../js/calculos.js");

const credito = {
  montoTotal: 100,
  cantidadCuotas: 3,
  fechaInicio: "2026-10-01",
  cuotasPagadas: 1
};

const cuotas = calcularCuotas(credito);

assert.deepEqual(cuotas.map((cuota) => cuota.monto), [33, 33, 34]);
assert.equal(calcularTotal(cuotas), 100);
assert.equal(cuotas[0].pagada, true);
assert.equal(cuotas[1].pagada, false);
assert.equal(calcularFechaTermino(credito.fechaInicio, credito.cantidadCuotas), "2026-12-01");

console.log("Pruebas de calculos: correctas");
