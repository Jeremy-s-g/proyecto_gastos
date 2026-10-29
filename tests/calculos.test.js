const assert = require("node:assert/strict");
const {
  calcularCuotas,
  calcularFechaTermino,
  calcularTotal
} = require("../js/calculos.js");
const {
  obtenerArraySeguro,
  validarCantidadCuotas,
  validarFecha,
  validarMonto,
  validarNombre
} = require("../js/validaciones.js");
const { leerDatosGuardados } = require("../js/almacenamiento.js");

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

assert.equal(validarNombre("Luz"), true);
assert.equal(validarNombre("123"), false);
assert.equal(validarMonto(25000), true);
assert.equal(validarMonto(0), false);
assert.equal(validarCantidadCuotas(6), true);
assert.equal(validarCantidadCuotas(2.5), false);
assert.equal(validarFecha("2026-10-28"), true);
assert.equal(validarFecha("28-10-2026"), false);
assert.deepEqual(obtenerArraySeguro(["dato"]), ["dato"]);
assert.deepEqual(obtenerArraySeguro({ nombre: "Luz" }), []);

const storageValido = {
  getItem: () => '{"gastos": []}'
};
const storageInvalido = {
  getItem: () => "{datos incorrectos"
};

assert.deepEqual(leerDatosGuardados(storageValido), { gastos: [] });
assert.equal(leerDatosGuardados(storageInvalido), null);

console.log("Pruebas de calculos: correctas");
