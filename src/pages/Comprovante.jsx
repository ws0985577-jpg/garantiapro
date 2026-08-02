import { useEffect, useState } from "react";
import { MessageCircle, Printer } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  buscarGarantia,
  formatarData,
  formatarValor,
  statusGarantia,
} from "../services/garantias";

function Comprovante() {
  const { codigo } = useParams();

  const [garantia, setGarantia] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        setErro("");

        const dados = await buscarGarantia(codigo);
        setGarantia(dados);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [codigo]);

  if (carregando) {
    return (
      <main className="notFound">
        <h2>Carregando comprovante...</h2>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="notFound">
        <h2>Erro ao carregar</h2>
        <p>{erro}</p>
        <Link to="/">Voltar</Link>
      </main>
    );
  }

  if (!garantia) {
    return (
      <main className="notFound">
        <h1>Garantia não encontrada</h1>
        <Link to="/">Voltar</Link>
      </main>
    );
  }

  const status = statusGarantia(garantia.validade);

  const urlConsulta =
    `${window.location.origin}/consulta?codigo=${encodeURIComponent(
      garantia.codigo
    )}`;

  const fotos = Array.isArray(garantia.fotosUrl)
    ? garantia.fotosUrl.slice(0, 4)
    : [];

  function enviarWhatsApp() {
    if (!garantia.telefone) {
      alert("Esta garantia não possui telefone cadastrado.");
      return;
    }

    const telefoneLimpo = garantia.telefone.replace(/\D/g, "");

    const telefoneCompleto = telefoneLimpo.startsWith("55")
      ? telefoneLimpo
      : `55${telefoneLimpo}`;

    const mensagem = encodeURIComponent(
      `Olá, ${garantia.cliente}! Segue o comprovante de garantia da GarantiaPro.\n\n` +
        `Aparelho: ${garantia.aparelho}\n` +
        `Serviço: ${garantia.servico}\n` +
        `Valor: ${formatarValor(garantia.valor)}\n` +
        `Código: ${garantia.codigo}\n` +
        `Validade: ${formatarData(garantia.validade)}\n\n` +
        `Consultar garantia:\n${urlConsulta}`
    );

    window.open(
      `https://wa.me/${telefoneCompleto}?text=${mensagem}`,
      "_blank"
    );
  }

  return (
    <main className="receiptPage">
      <div className="receiptActions noPrint">
        <div className="receiptActionButtons">
          <button
            className="btn btnPrimary"
            type="button"
            onClick={() => window.print()}
          >
            <Printer size={20} />
            Imprimir / Salvar PDF
          </button>

          <button
            className="btn whatsappButton"
            type="button"
            onClick={enviarWhatsApp}
          >
            <MessageCircle size={20} />
            Enviar no WhatsApp
          </button>
        </div>

        <Link to="/admin">Voltar ao painel</Link>
      </div>

      <article className="receipt">
        <header>
          <div className="receiptBrand">
            <img
              src="/logo-garantiapro.png"
              alt="Logo GarantiaPro"
              className="receiptLogo"
            />

            <div>
              <h1>GarantiaPro</h1>
              <p>Assistência Técnica</p>
            </div>
          </div>

          <div className={`status ${status.tipo}`}>
            {status.texto}
          </div>
        </header>

        <section className="receiptTitle">
          <h2>Comprovante de Garantia</h2>

          <p>
            Código: <strong>{garantia.codigo}</strong>
          </p>
        </section>

        <section className="receiptGrid">
          <div>
            <span>Cliente</span>
            <strong>{garantia.cliente}</strong>
          </div>

          <div>
            <span>Telefone</span>
            <strong>{garantia.telefone || "-"}</strong>
          </div>

          <div>
            <span>Aparelho</span>
            <strong>{garantia.aparelho}</strong>
          </div>

          <div>
            <span>IMEI</span>
            <strong>{garantia.imei || "-"}</strong>
          </div>

          <div>
            <span>Serviço realizado</span>
            <strong>{garantia.servico}</strong>
          </div>

          <div>
            <span>Valor</span>
            <strong>{formatarValor(garantia.valor)}</strong>
          </div>

          <div>
            <span>Data do serviço</span>
            <strong>{formatarData(garantia.dataServico)}</strong>
          </div>

          <div>
            <span>Validade</span>
            <strong>{formatarData(garantia.validade)}</strong>
          </div>
        </section>

        {fotos.length > 0 && (
          <section className="receiptPhotosSection">
            <div className="receiptPhotosTitle">
              <h3>Fotos do aparelho</h3>
              <span>{fotos.length} foto(s)</span>
            </div>

            <div
              className={`receiptPhotosGrid receiptPhotosCount${fotos.length}`}
            >
              {fotos.map((foto, index) => (
                <figure
                  className="receiptPhotoItem"
                  key={`${foto}-${index}`}
                >
                  <img
                    src={foto}
                    alt={`Foto ${index + 1} do aparelho`}
                    loading="lazy"
                  />
                </figure>
              ))}
            </div>
          </section>
        )}

        {garantia.observacoes && (
          <section className="receiptNotes">
            <span>Observações</span>
            <p>{garantia.observacoes}</p>
          </section>
        )}

        <section className="warrantyTerms">
          <h3>Termos da garantia</h3>

          <p>
            Esta garantia cobre somente o serviço descrito neste comprovante.
            Danos por queda, umidade, mau uso, pressão, violação do aparelho ou
            reparo realizado por terceiros não são cobertos.
          </p>
        </section>

        <footer className="receiptFooter">
          <div>
            <QRCodeSVG value={urlConsulta} size={110} />
            <small>Escaneie para consultar</small>
          </div>

          <p>
            Guarde este comprovante. A consulta pode ser feita pelo código da
            garantia ou pelo IMEI.
          </p>
        </footer>
      </article>
    </main>
  );
}

export default Comprovante;