import Swal from "sweetalert2";

const AlertaExito = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2600,
  timerProgressBar: true,
});

export function mostrarAlertaExito(titulo, texto) {
  return AlertaExito.fire({
    icon: "success",
    title: titulo,
    text: texto,
  });
}

export async function confirmarEliminacion(nombre) {
  const resultado = await Swal.fire({
    title: "¿Eliminar estudiante?",
    text: `Se eliminará a ${nombre} de la tabla local.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#a32626",
    cancelButtonColor: "#6b7a7a",
    reverseButtons: true,
    focusCancel: true,
  });

  return resultado.isConfirmed;
}
