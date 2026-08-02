import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brandIcon"><ShieldCheck size={27} /></span>
        <span>
          <strong>GarantiaPro</strong>
          <small>Assistência Técnica</small>
        </span>
      </Link>

      <Link to="/login" className="btn btnOutline">
        Área administrativa
      </Link>
    </header>
  );
}

export default Navbar;
