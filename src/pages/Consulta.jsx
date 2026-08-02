import { useEffect, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  Search,
  Smartphone,
  UserRound,
  Wrench,
  XCircle,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import {
  buscarGarantia,
  formatarData,
  statusGarantia,
} from "../services/garantias";
import Navbar from "../components/Navbar";

function Consulta() {
  const [params] = useSearchParams();
  const [codigo, setCodigo] = useState(params.get("codigo") || "");
  const [resultado, setResultado] = useState(null);
  const [procurou, setProcurou] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function consultar(event) {
    event?.preventDefault();
    if (!codigo.trim()) return;

    try {
      setCarregando(true);
      setErro("");
      setResultado(await buscarGarantia(codigo));
      setProcurou(true);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (params.get("codigo")) consultar();
  }, []);

  const status = resultado ? statusGarantia(resultado.validade) : null;

  return (
    <div>
      <Navbar />
      <main className="consultaPage">
        <section className="consultaBox">
          <span>Consulta pública</span>
          <h1>Consultar garantia</h1>
          <p>Digite o código da garantia ou o IMEI do aparelho.</p>

          <form className="consultaForm" onSubmit={consultar}>
            <input value={codigo} onChange={(e) => setCodigo(e.target.value)} />
            <button type="submit" disabled={carregando}>
              <Search size={20} />
              {carregando ? "Consultando..." : "Consultar"}
            </button>
          </form>
        </section>

        {erro && <div className="errorMessage">{erro}</div>}

        {procurou && !resultado && !carregando && (
          <section className="notFound">
            <XCircle size={42} />
            <h2>Garantia não encontrada</h2>
          </section>
        )}

        {resultado && (
          <section className="warrantyResult">
            <div className="resultTop">
              <div><span>Status da garantia</span><h2>{status.texto}</h2></div>
              <span className={`status ${status.tipo}`}>
                <BadgeCheck size={18} />{status.texto}
              </span>
            </div>

            <div className="resultGrid">
              <article><UserRound size={21} /><div><span>Cliente</span><strong>{resultado.cliente}</strong></div></article>
              <article><Smartphone size={21} /><div><span>Aparelho</span><strong>{resultado.aparelho}</strong></div></article>
              <article><Smartphone size={21} /><div><span>IMEI</span><strong>{resultado.imei || "-"}</strong></div></article>
              <article><Wrench size={21} /><div><span>Serviço</span><strong>{resultado.servico}</strong></div></article>
              <article><CalendarDays size={21} /><div><span>Data do serviço</span><strong>{formatarData(resultado.dataServico)}</strong></div></article>
              <article><CalendarDays size={21} /><div><span>Validade</span><strong>{formatarData(resultado.validade)}</strong></div></article>
            </div>

            <div className="codeBox">
              <span>Código da garantia</span>
              <strong>{resultado.codigo}</strong>
            </div>

            <Link className="btn btnPrimary" to={`/comprovante/${resultado.codigo}`}>
              Abrir comprovante
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}

export default Consulta;
