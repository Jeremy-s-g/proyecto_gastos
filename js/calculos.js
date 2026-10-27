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

if (typeof module !== "undefined") {
  module.exports = {
    calcularCuotas,
    calcularFechaCuota,
    calcularFechaTermino,
    calcularTotal,
    formatearFecha,
    formatearMoneda
  };
}
