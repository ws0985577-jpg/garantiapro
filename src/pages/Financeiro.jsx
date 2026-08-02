import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CircleDollarSign,
  Plus,
  ReceiptText,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  cadastrarGasto,
  excluirGasto,
  listarGastos,
} from "../services/financeiro";
import {
  formatarData,
  formatarValor,
  listarGarantias,
} from "../services/garantias";

const gastoInicial = {
  descricao: "",
  categoria: "Peças",
  valor: "",
  dataGasto: new Date().toISOString().slice(0, 10),
  observacoes: "",
};

function Financeiro() {
  const [garantias, setGarantias] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [formulario, setFormulario] = useState(gastoInicial);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro("");

      const [dadosGarantias, dadosGastos] = await Promise.all([
        listarGarantias(),
        listarGastos(),
      ]);

      setGarantias(dadosGarantias);
      setGastos(dadosGastos);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function atualizarCampo(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  async function salvarGasto(event) {
    event.preventDefault();

    if (
      !formulario.descricao.trim() ||
      !formulario.valor ||
      !formulario.dataGasto
    ) {
      alert("Preencha a descrição, o valor e a data.");
      return;
    }

    try {
      setSalvando(true);

      await cadastrarGasto(formulario);

      setFormulario(gastoInicial);
      await carregarDados();

      alert("Gasto cadastrado com sucesso!");
    } catch (error) {
      alert(`Erro ao cadastrar gasto: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  }

  async function removerGasto(id) {
    const confirmar = window.confirm(
      "Deseja realmente excluir este gasto?"
    );

    if (!confirmar) return;

    try {
      await excluirGasto(id);
      await carregarDados();
    } catch (error) {
      alert(`Erro ao excluir gasto: ${error.message}`);
    }
  }

  const resumo = useMemo(() => {
    const hoje = new Date();
    const hojeTexto = hoje.toISOString().slice(0, 10);
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    const faturamentoTotal = garantias.reduce(
      (total, item) => total + Number(item.valor || 0),
      0
    );

    const faturamentoHoje = garantias
      .filter((item) => item.dataServico === hojeTexto)
      .reduce(
        (total, item) => total + Number(item.valor || 0),
        0
      );

    const faturamentoMes = garantias
      .filter((item) => {
        const data = new Date(`${item.dataServico}T12:00:00`);

        return (
          data.getMonth() === mesAtual &&
          data.getFullYear() === anoAtual
        );
      })
      .reduce(
        (total, item) => total + Number(item.valor || 0),
        0
      );

    const gastosTotal = gastos.reduce(
      (total, item) => total + Number(item.valor || 0),
      0
    );

    const gastosMes = gastos
      .filter((item) => {
        const data = new Date(`${item.dataGasto}T12:00:00`);

        return (
          data.getMonth() === mesAtual &&
          data.getFullYear() === anoAtual
        );
      })
      .reduce(
        (total, item) => total + Number(item.valor || 0),
        0
      );

    return {
      faturamentoHoje,
      faturamentoMes,
      faturamentoTotal,
      gastosMes,
      gastosTotal,
      lucroMes: faturamentoMes - gastosMes,
      lucroTotal: faturamentoTotal - gastosTotal,
    };
  }, [garantias, gastos]);

  const movimentoMensal = useMemo(() => {
    const meses = [];

    for (let indice = 5; indice >= 0; indice -= 1) {
      const data = new Date();
      data.setMonth(data.getMonth() - indice);

      const mes = data.getMonth();
      const ano = data.getFullYear();

      const faturamento = garantias
        .filter((item) => {
          const dataItem = new Date(
            `${item.dataServico}T12:00:00`
          );

          return (
            dataItem.getMonth() === mes &&
            dataItem.getFullYear() === ano
          );
        })
        .reduce(
          (total, item) => total + Number(item.valor || 0),
          0
        );

      const despesas = gastos
        .filter((item) => {
          const dataItem = new Date(
            `${item.dataGasto}T12:00:00`
          );

          return (
            dataItem.getMonth() === mes &&
            dataItem.getFullYear() === ano
          );
        })
        .reduce(
          (total, item) => total + Number(item.valor || 0),
          0
        );

      meses.push({
        nome: data.toLocaleDateString("pt-BR", {
          month: "short",
        }),
        faturamento,
        despesas,
        lucro: faturamento - despesas,
      });
    }

    return meses;
  }, [garantias, gastos]);

  const maiorValorGrafico = Math.max(
    1,
    ...movimentoMensal.flatMap((item) => [
      item.faturamento,
      item.despesas,
    ])
  );

  return (
    <main className="financeiroPage">
      <div className="pageHeader">
        <div>
          <span>Painel administrativo</span>
          <h1>Controle financeiro</h1>
          <p>
            Acompanhe faturamento, gastos e lucro da W-Tech.
          </p>
        </div>
      </div>

      {erro && <div className="errorMessage">{erro}</div>}

      <section className="financialStats">
        <article>
          <span className="financialIcon today">
            <CalendarDays size={24} />
          </span>

          <div>
            <small>Faturamento hoje</small>
            <strong>
              {formatarValor(resumo.faturamentoHoje)}
            </strong>
          </div>
        </article>

        <article>
          <span className="financialIcon revenue">
            <TrendingUp size={24} />
          </span>

          <div>
            <small>Faturamento do mês</small>
            <strong>
              {formatarValor(resumo.faturamentoMes)}
            </strong>
          </div>
        </article>

        <article>
          <span className="financialIcon expense">
            <TrendingDown size={24} />
          </span>

          <div>
            <small>Gastos do mês</small>
            <strong>{formatarValor(resumo.gastosMes)}</strong>
          </div>
        </article>

        <article>
          <span className="financialIcon profit">
            <Wallet size={24} />
          </span>

          <div>
            <small>Lucro do mês</small>
            <strong>{formatarValor(resumo.lucroMes)}</strong>
          </div>
        </article>
      </section>

      <section className="financeiroGrid">
        <article className="panel">
          <div className="financialPanelTitle">
            <div>
              <h2>Novo gasto</h2>
              <p>Registre despesas da assistência.</p>
            </div>

            <Plus size={24} />
          </div>

          <form
            className="financialForm"
            onSubmit={salvarGasto}
          >
            <label>
              Descrição *
              <input
                name="descricao"
                value={formulario.descricao}
                onChange={atualizarCampo}
                placeholder="Ex.: Tela Samsung A06"
                required
              />
            </label>

            <label>
              Categoria
              <select
                name="categoria"
                value={formulario.categoria}
                onChange={atualizarCampo}
              >
                <option>Peças</option>
                <option>Ferramentas</option>
                <option>Aluguel</option>
                <option>Energia</option>
                <option>Internet</option>
                <option>Transporte</option>
                <option>Marketing</option>
                <option>Outros</option>
              </select>
            </label>

            <div className="financialFormRow">
              <label>
                Valor *
                <input
                  type="number"
                  name="valor"
                  min="0"
                  step="0.01"
                  value={formulario.valor}
                  onChange={atualizarCampo}
                  required
                />
              </label>

              <label>
                Data *
                <input
                  type="date"
                  name="dataGasto"
                  value={formulario.dataGasto}
                  onChange={atualizarCampo}
                  required
                />
              </label>
            </div>

            <label>
              Observações
              <textarea
                name="observacoes"
                rows="4"
                value={formulario.observacoes}
                onChange={atualizarCampo}
                placeholder="Informações adicionais"
              />
            </label>

            <button
              className="btn btnPrimary"
              type="submit"
              disabled={salvando}
            >
              <CircleDollarSign size={20} />

              {salvando
                ? "Salvando..."
                : "Registrar gasto"}
            </button>
          </form>
        </article>

        <article className="panel">
          <div className="financialPanelTitle">
            <div>
              <h2>Movimento dos últimos meses</h2>
              <p>Comparação entre faturamento e gastos.</p>
            </div>

            <TrendingUp size={24} />
          </div>

          <div className="financialChart">
            {movimentoMensal.map((item) => (
              <div
                className="financialChartMonth"
                key={`${item.nome}-${item.faturamento}`}
              >
                <div className="financialBars">
                  <div
                    className="financialBar revenueBar"
                    style={{
                      height: `${
                        (item.faturamento /
                          maiorValorGrafico) *
                        160
                      }px`,
                    }}
                    title={`Faturamento: ${formatarValor(
                      item.faturamento
                    )}`}
                  />

                  <div
                    className="financialBar expenseBar"
                    style={{
                      height: `${
                        (item.despesas /
                          maiorValorGrafico) *
                        160
                      }px`,
                    }}
                    title={`Gastos: ${formatarValor(
                      item.despesas
                    )}`}
                  />
                </div>

                <span>{item.nome}</span>
              </div>
            ))}
          </div>

          <div className="financialLegend">
            <span>
              <i className="legendRevenue" />
              Faturamento
            </span>

            <span>
              <i className="legendExpense" />
              Gastos
            </span>
          </div>

          <div className="financialTotals">
            <div>
              <small>Faturamento total</small>
              <strong>
                {formatarValor(resumo.faturamentoTotal)}
              </strong>
            </div>

            <div>
              <small>Gastos totais</small>
              <strong>
                {formatarValor(resumo.gastosTotal)}
              </strong>
            </div>

            <div>
              <small>Lucro total</small>
              <strong>
                {formatarValor(resumo.lucroTotal)}
              </strong>
            </div>
          </div>
        </article>
      </section>

      <section className="panel financialHistory">
        <div className="financialPanelTitle">
          <div>
            <h2>Histórico de gastos</h2>
            <p>{gastos.length} gasto(s) registrado(s).</p>
          </div>

          <ReceiptText size={24} />
        </div>

        {carregando ? (
          <div className="emptyState">
            <p>Carregando dados financeiros...</p>
          </div>
        ) : gastos.length === 0 ? (
          <div className="emptyState">
            <ReceiptText size={42} />
            <h3>Nenhum gasto cadastrado</h3>
            <p>Registre o primeiro gasto da W-Tech.</p>
          </div>
        ) : (
          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Data</th>
                  <th>Valor</th>
                  <th>Ação</th>
                </tr>
              </thead>

              <tbody>
                {gastos.map((gasto) => (
                  <tr key={gasto.id}>
                    <td>
                      <strong>{gasto.descricao}</strong>

                      {gasto.observacoes && (
                        <small className="tableSecondary">
                          {gasto.observacoes}
                        </small>
                      )}
                    </td>

                    <td>{gasto.categoria || "Outros"}</td>

                    <td>{formatarData(gasto.dataGasto)}</td>

                    <td>
                      <strong>
                        {formatarValor(gasto.valor)}
                      </strong>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="financialDeleteButton"
                        onClick={() =>
                          removerGasto(gasto.id)
                        }
                        title="Excluir gasto"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Financeiro;