import { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  Clock3,
  Eye,
  MessageCircle,
  Package,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Wallet,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  excluirGarantia,
  formatarData,
  formatarValor,
  listarGarantias,
  statusGarantia,
} from "../services/garantias";

function Dashboard() {
  const [garantias, setGarantias] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregar() {
    try {
      setCarregando(true);
      setErro("");

      const dados = await listarGarantias();
      setGarantias(dados);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);
const filtradas = useMemo(() => {
  return garantias.filter((item) =>
    [
      item.codigo,
      item.cliente,
      item.telefone,
      item.aparelho,
      item.imei,
      item.servico,
    ]
      .join(" ")
      .toLowerCase()
      .includes(busca.toLowerCase())
  );
}, [garantias, busca]);

const hoje = new Date().toISOString().slice(0, 10);

const faturamentoHoje = garantias
  .filter((g) => g.dataServico === hoje)
  .reduce((total, g) => total + Number(g.valor || 0), 0);

const mesAtual = new Date().getMonth();
const anoAtual = new Date().getFullYear();

const faturamentoMes = garantias
  .filter((g) => {
    const data = new Date(`${g.dataServico}T12:00:00`);

    return (
      data.getMonth() === mesAtual &&
      data.getFullYear() === anoAtual
    );
  })
  .reduce((total, g) => total + Number(g.valor || 0), 0);

const totais = garantias.reduce(
  (resultado, item) => {
    const tipo = statusGarantia(item.validade).tipo;

    resultado[tipo] += 1;
    resultado.faturamento += Number(item.valor || 0);
    resultado.quantidade += 1;

    return resultado;
  },
  {
    ativa: 0,
    proxima: 0,
    vencida: 0,
    faturamento: 0,
    quantidade: 0,
    ticketMedio: 0,
  }
);

totais.ticketMedio =
  totais.quantidade > 0
    ? totais.faturamento / totais.quantidade
    : 0;

  async function remover(id) {
    const confirmar = window.confirm(
      "Deseja realmente excluir esta garantia?"
    );

    if (!confirmar) return;

    try {
      await excluirGarantia(id);
      await carregar();
    } catch (error) {
      alert(`Erro ao excluir: ${error.message}`);
    }
  }

  function abrirWhatsApp(item) {
    if (!item.telefone) {
      alert("Esta garantia não possui telefone cadastrado.");
      return;
    }

    const telefone = item.telefone.replace(/\D/g, "");

    const numeroCompleto = telefone.startsWith("55")
      ? telefone
      : `55${telefone}`;

    const linkGarantia =
      `${window.location.origin}/consulta?codigo=${encodeURIComponent(
        item.codigo
      )}`;

    const mensagem = encodeURIComponent(
      `Olá, ${item.cliente}! Segue o comprovante de garantia da W-Tech.\n\n` +
        `Aparelho: ${item.aparelho}\n` +
        `Serviço: ${item.servico}\n` +
        `Código: ${item.codigo}\n` +
        `Validade: ${formatarData(item.validade)}\n\n` +
        `Consultar garantia:\n${linkGarantia}`
    );

    window.open(
      `https://wa.me/${numeroCompleto}?text=${mensagem}`,
      "_blank"
    );
  }

  return (
    <main className="dashboardPage">
      <div className="pageHeader">
        <div>
          <span>Painel administrativo</span>
          <h1>Dashboard W-Tech</h1>
          <p>Gerencie todas as garantias da assistência técnica.</p>
        </div>

        <Link
          to="/admin/nova-garantia"
          className="btn btnPrimary"
        >
          <Plus size={20} />
          Nova garantia
        </Link>
      </div>

      <section className="statsGrid statsGridFour">
        <article>
          <span className="statIcon active">
            <ShieldCheck size={25} />
          </span>

          <div>
            <small>Garantias ativas</small>
            <strong>{totais.ativa}</strong>
          </div>
        </article>

        <article>
          <span className="statIcon warning">
            <Clock3 size={25} />
          </span>

          <div>
            <small>Próximas do vencimento</small>
            <strong>{totais.proxima}</strong>
          </div>
        </article>

        <article>
          <span className="statIcon expired">
            <XCircle size={25} />
          </span>

          <div>
            <small>Garantias vencidas</small>
            <strong>{totais.vencida}</strong>
          </div>
        </article>

        <article>
  <span className="statIcon money">
    <CalendarDays size={25} />
  </span>

  <div>
    <small>Faturamento hoje</small>
    <strong>{formatarValor(faturamentoHoje)}</strong>
  </div>
</article>

<article>
  <span className="statIcon money">
    <Wallet size={25} />
  </span>

  <div>
    <small>Faturamento do mês</small>
    <strong>{formatarValor(faturamentoMes)}</strong>
  </div>
</article>

<article>
  <span className="statIcon warning">
    <Package size={25} />
  </span>

  <div>
    <small>Estoque baixo</small>
    <strong>0</strong>
  </div>
</article>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Garantias cadastradas</h2>
            <p>{garantias.length} registro(s) no Supabase.</p>
          </div>

          <div className="smallSearch">
            <Search size={18} />

            <input
              type="text"
              placeholder="Buscar cliente, aparelho, IMEI..."
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />
          </div>
        </div>

        {carregando ? (
          <div className="emptyState">
            <p>Carregando garantias...</p>
          </div>
        ) : erro ? (
          <div className="errorMessage">{erro}</div>
        ) : filtradas.length === 0 ? (
          <div className="emptyState">
            <ShieldCheck size={45} />
            <h3>Nenhuma garantia encontrada</h3>
          </div>
        ) : (
          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Aparelho</th>
                  <th>Serviço</th>
                  <th>Valor</th>
                  <th>Validade</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {filtradas.map((item) => {
                  const status = statusGarantia(item.validade);

                  return (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.cliente}</strong>
                        <small className="tableSecondary">
                          {item.codigo}
                        </small>
                      </td>

                      <td>
                        {item.aparelho}

                        {item.imei && (
                          <small className="tableSecondary">
                            IMEI: {item.imei}
                          </small>
                        )}
                      </td>

                      <td>{item.servico}</td>

                      <td>
                        <strong>{formatarValor(item.valor)}</strong>
                      </td>

                      <td>{formatarData(item.validade)}</td>

                      <td>
                        <span className={`status ${status.tipo}`}>
                          {status.texto}
                        </span>
                      </td>

                      <td>
                        <div className="dashboardActions">
                          <Link
                            to={`/comprovante/${item.codigo}`}
                            target="_blank"
                            title="Abrir comprovante"
                          >
                            <Eye size={18} />
                          </Link>

                          <Link
                            to={`/admin/editar-garantia/${item.codigo}`}
                            title="Editar garantia"
                          >
                            <Pencil size={18} />
                          </Link>

                          <button
                            type="button"
                            className="whatsappAction"
                            onClick={() => abrirWhatsApp(item)}
                            title="Enviar pelo WhatsApp"
                          >
                            <MessageCircle size={18} />
                          </button>

                          <button
                            type="button"
                            className="deleteAction"
                            onClick={() => remover(item.id)}
                            title="Excluir garantia"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;