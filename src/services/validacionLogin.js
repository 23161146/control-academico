export async function iniciarSesion(username, password) {
  const response = await fetch(`https://dummyjson.com/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    if (data.message === "Invalid credentials" || response.status === 400 || response.status === 401) {
      throw new Error("Usuario o contraseña incorrectos.");
    }

    throw new Error(data.message || "Ocurrió un error al iniciar sesión.");
  }

  return data;
}
