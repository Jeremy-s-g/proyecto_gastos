function leerDatosGuardados(storage) {
  const textoGuardado = storage.getItem("datos");

  if (!textoGuardado) {
    return null;
  }

  try {
    return JSON.parse(textoGuardado);
  } catch (error) {
    return null;
  }
}

if (typeof module !== "undefined") {
  module.exports = { leerDatosGuardados };
}
