import avatar from "../assets/avatar.jpg";

export default function Topbar({ usuario, onLogout }) {
  const nombreCompleto =
    usuario?.firstName && usuario?.lastName
      ? `${usuario.firstName} ${usuario.lastName}`
      : usuario?.username || "Usuario";

  const fotoPerfil = usuario?.image || avatar;

  return (
    <header className="topbar">
      <strong>SITUA</strong>
      <div className="topbar__user">
        <span>{nombreCompleto}</span>
        <img src={fotoPerfil} alt={`Foto de perfil de ${nombreCompleto}`} />
        <button type="button" className="topbar__logout" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
