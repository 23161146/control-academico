import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconEye } from "../components/Icons.jsx";
import foto from "../assets/login.jpg";

const correoValido = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [recordar, setRecordar] = useState(false);
  const [error, setError] = useState("");

  const enviar = (e) => {
    e.preventDefault();
    if (!correoValido(correo)) return setError("Ingresa un correo válido, por ejemplo nombre@correo.com.");
    if (clave.length < 4) return setError("La contraseña debe tener al menos 4 caracteres.");
    setError("");
    // TODO: reemplazar por la llamada real a tu API de autenticación
    onLogin(correo);
    navigate("/inicio", { replace: true });
  };

  return (
    <div className="login">
      <span className="login__blob login__blob--a" />
      <span className="login__blob login__blob--b" />

      <div className="login__card">
        <img className="login__photo" src={foto} alt="Estudiantes y docente trabajando en una biblioteca" />

        <form className="login__form" onSubmit={enviar} noValidate>
          <p className="login__brand">Control Académico</p>
          <h1>Iniciar sesión</h1>
          <p className="login__sub">Ingresa tus datos para continuar</p>

          <label htmlFor="correo">Correo</label>
          <input id="correo" type="email" autoComplete="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />

          <label htmlFor="clave">Contraseña</label>
          <div className="login__pass">
            <input id="clave" type={verClave ? "text" : "password"} autoComplete="current-password" value={clave} onChange={(e) => setClave(e.target.value)} />
            <button type="button" aria-label={verClave ? "Ocultar contraseña" : "Mostrar contraseña"} onClick={() => setVerClave((v) => !v)}>
              <IconEye off={verClave} />
            </button>
          </div>

          <div className="login__row">
            <label className="login__check">
              <input type="checkbox" checked={recordar} onChange={(e) => setRecordar(e.target.checked)} />
              Recordar inicio de sesión
            </label>
            <a href="#recuperar">¿Olvidaste tu contraseña?</a>
          </div>

          {error && <p className="login__error" role="alert">{error}</p>}

          <button className="login__submit" type="submit">Iniciar Sesión</button>
          <a className="login__register" href="#registro">¿No tienes cuenta? Regístrate</a>
        </form>
      </div>
    </div>
  );
}
