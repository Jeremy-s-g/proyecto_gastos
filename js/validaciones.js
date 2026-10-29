function validarNombre(nombre) {
  return typeof nombre === "string" && /[A-Za-z]/.test(nombre.trim());
}

function validarMonto(monto) {
  return Number.isFinite(monto) && monto > 0;
}

function validarCantidadCuotas(cantidad) {
  return Number.isInteger(cantidad) && cantidad > 0;
}

function validarFecha(fecha) {
  return typeof fecha === "string" && /^\d{4}-\d{2}-\d{2}$/.test(fecha);
}

function obtenerArraySeguro(valor) {
  return Array.isArray(valor) ? valor : [];
}

if (typeof module !== "undefined") {
  module.exports = {
    obtenerArraySeguro,
    validarCantidadCuotas,
    validarFecha,
    validarMonto,
    validarNombre
  };
}
