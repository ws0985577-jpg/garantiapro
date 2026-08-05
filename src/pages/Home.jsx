import { useState } from "react";
import { BadgeCheck, CalendarDays, Search, ShieldCheck, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();

  function consultar(event) {
    event.preventDefault();
    if (!codigo.trim()) {
      alert("Digite o código da garantia ou IMEI.");
      return;
    }
    navigate(`/consulta?codigo=${encodeURIComponent(codigo.trim())}`);
  }

  return (
    <div>
      <Navbar />

      <main>
        <section className="hero">
          <div className="heroContent">
            <span className="tag">
              <BadgeCheck size={18} />
              Garantia digital
            </span>

            <h1>Consulte a garantia do seu aparelho</h1>
            <p>
            Digite o IMEI do aparelho informado no comprovante entregue pela GarantiaPro.
             </p>

            <form className="searchBox" onSubmit={consultar}>
              <input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ex.: 865723045678912"
              />
              <button type="submit">
                <Search size={20} />
                Consultar
              </button>
            </form>
          </div>
        </section>

        <section className="features">
          <article>
            <ShieldCheck size={30} />
            <h3>Garantia segura</h3>
            <p>Dados registrados e disponíveis para consulta.</p>
          </article>
          <article>
            <Smartphone size={30} />
            <h3>Acesso pelo celular</h3>
            <p>Consulte sua garantia de qualquer lugar.</p>
          </article>
          <article>
            <CalendarDays size={30} />
            <h3>Validade automática</h3>
            <p>Veja rapidamente se está ativa ou vencida.</p>
          </article>
        </section>
      </main>

      <footer>© 2026 GarantiaPro Assistência Técnica</footer>
    </div>
  );
}

export default Home;
