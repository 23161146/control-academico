export async function iniciarSesion(username, password) {
  let response;

  try {
    response = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
      }),
    });
  } catch {
    throw new Error("No se pudo conectar con el servicio de autenticación.");
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (
      data?.message === "Invalid credentials" ||
      response.status === 400 ||
      response.status === 401
    ) {
      throw new Error("Usuario o contraseña incorrectos.");
    }

    throw new Error(data?.message || "Ocurrió un error al iniciar sesión.");
  }

  if (!data) {
    throw new Error(
      "El servicio de autenticación devolvió una respuesta no válida."
    );
  }

  if (!data.accessToken) {
    throw new Error("El servicio de autenticación no devolvió una sesión válida.");
  }

  return data;
}
