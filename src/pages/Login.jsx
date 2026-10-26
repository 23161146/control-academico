import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconEye } from "../components/Icons.jsx";
import foto from "../assets/login.jpg";
import { iniciarSesion } from "../services/validacionLogin.js";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [recordar, setRecordar] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    if (cargando) return;
    if (!correo.trim()) return setError("Ingresa un nombre de usuario válido.");
    if (clave.length < 4) return setError("La contraseña debe tener al menos 4 caracteres.");
    setError("");
    setCargando(true);
    try {
      const data = await iniciarSesion(correo.trim(), clave);
      const storage = recordar ? localStorage : sessionStorage;
      const otroStorage = recordar ? sessionStorage : localStorage;
      otroStorage.removeItem("token");
      otroStorage.removeItem("user");
      storage.setItem("token", data.accessToken);
      storage.setItem("user", JSON.stringify(data));
      onLogin(data);
      navigate("/inicio", { replace: true });
    } catch (err) {
      setError(err.message || "No fue posible iniciar sesión. Comprueba tu conexión.");
    } finally {
      setCargando(false);
    }
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
          <label htmlFor="correo">Usuario</label>
          <input id="correo" type="text" autoComplete="username" placeholder="ej. emilys" value={correo}
            onChange={(e) => setCorreo(e.target.value)} disabled={cargando} />
          <label htmlFor="clave">Contraseña</label>
          <div className="login__pass">
            <input id="clave" type={verClave ? "text" : "password"} autoComplete="current-password"
              placeholder="••••••••" value={clave} onChange={(e) => setClave(e.target.value)} disabled={cargando} />
            <button type="button" aria-label={verClave ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={() => setVerClave((v) => !v)} disabled={cargando}>
              <IconEye off={verClave} />
            </button>
          </div>
          <div className="login__row">
            <label className="login__check">
              <input type="checkbox" checked={recordar} onChange={(e) => setRecordar(e.target.checked)} disabled={cargando} />
              Recordar inicio de sesión
            </label>
          </div>
          {error && <p className="login__error" role="alert">{error}</p>}
          <button className="login__submit" type="submit" disabled={cargando}>
            {cargando ? "Verificando…" : "Iniciar sesión"}
          </button>
          <p className="login__sub" style={{ marginTop: 14, fontSize: 12 }}>
            Cuenta de demostración: usuario <strong>emilys</strong>
          </p>
        </form>
      </div>
    </div>
  );
}
