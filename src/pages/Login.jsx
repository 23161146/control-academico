import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconEye } from "../components/Icons.jsx";
import foto from "../assets/login.jpg";
import { iniciarSesion } from "../services/validacionLogin.js";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [recordarSesion, setRecordarSesion] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const manejarInicioSesion = async (evento) => {
    evento.preventDefault();

    if (enviando) {
      return;
    }

    const usuarioLimpio = usuario.trim();

    if (!usuarioLimpio) {
      setMensajeError("Ingresa tu usuario.");
      return;
    }

    if (!contrasena) {
      setMensajeError("Ingresa tu contraseña.");
      return;
    }

    if (contrasena.length < 4) {
      setMensajeError("La contraseña debe tener al menos 4 caracteres.");
      return;
    }

    setMensajeError("");
    setEnviando(true);

    try {
      const datosUsuario = await iniciarSesion(usuarioLimpio, contrasena);
      const almacenamiento = recordarSesion ? localStorage : sessionStorage;
      const otroAlmacenamiento = recordarSesion
        ? sessionStorage
        : localStorage;

      otroAlmacenamiento.removeItem("token");
      otroAlmacenamiento.removeItem("user");
      almacenamiento.setItem("token", datosUsuario.accessToken);
      almacenamiento.setItem("user", JSON.stringify(datosUsuario));
      onLogin(datosUsuario);
      navigate("/inicio", { replace: true });
    } catch (error) {
      setMensajeError(
        error.message || "No fue posible iniciar sesión. Comprueba tu conexión."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="login">
      <span className="login__blob login__blob--a" />
      <span className="login__blob login__blob--b" />
      <div className="login__card">
        <img
          className="login__photo"
          src={foto}
          alt="Estudiantes y docente trabajando en una biblioteca"
        />
        <form
          className="login__form"
          onSubmit={manejarInicioSesion}
          noValidate
        >
          <p className="login__brand">SITUA</p>
          <h1>Iniciar sesión</h1>
          <p className="login__sub">Ingresa tus datos para continuar</p>
          <label htmlFor="usuario">Usuario</label>
          <input
            id="usuario"
            type="text"
            autoComplete="username"
            placeholder="Tu usuario"
            value={usuario}
            onChange={(evento) => {
              setUsuario(evento.target.value);
              if (mensajeError) {
                setMensajeError("");
              }
            }}
            disabled={enviando}
          />
          <label htmlFor="contrasena">Contraseña</label>
          <div className="login__pass">
            <input
              id="contrasena"
              type={mostrarContrasena ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={contrasena}
              onChange={(evento) => {
                setContrasena(evento.target.value);
                if (mensajeError) {
                  setMensajeError("");
                }
              }}
              disabled={enviando}
            />
            <button
              type="button"
              aria-label={
                mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              onClick={() => setMostrarContrasena((visible) => !visible)}
              disabled={enviando}
            >
              <IconEye off={mostrarContrasena} />
            </button>
          </div>
          <div className="login__row">
            <label className="login__check">
              <input
                type="checkbox"
                checked={recordarSesion}
                onChange={(evento) => setRecordarSesion(evento.target.checked)}
                disabled={enviando}
              />
              Recordar inicio de sesión
            </label>
          </div>
          {mensajeError && (
            <p className="login__error" role="alert">
              {mensajeError}
            </p>
          )}
          <button className="login__submit" type="submit" disabled={enviando}>
            {enviando ? "Verificando…" : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
