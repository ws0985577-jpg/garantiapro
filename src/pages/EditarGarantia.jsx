import { useEffect, useState } from "react";
import { Save, Smartphone, UserRound, Wrench } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  buscarGarantia,
  atualizarGarantia,
} from "../services/garantias";

function EditarGarantia() {
  const { codigo } = useParams();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    cliente: "",
    telefone: "",
    aparelho: "",
    imei: "",
    servico: "",
    valor: "",
    dataServico: "",
    validade: "",
    observacoes: "",
  });

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregarGarantia() {
      try {
        const garantia = await buscarGarantia(codigo);

        if (!garantia) {
          alert("Garantia não encontrada.");
          navigate("/admin");
          return;
        }

        setFormulario({
          cliente: garantia.cliente || "",
          telefone: garantia.telefone || "",
          aparelho: garantia.aparelho || "",
          imei: garantia.imei || "",
          servico: garantia.servico || "",
          valor: garantia.valor || "",
          dataServico: garantia.dataServico || "",
          validade: garantia.validade || "",
          observacoes: garantia.observacoes || "",
        });
      } catch (error) {
        alert(`Erro ao carregar garantia: ${error.message}`);
        navigate("/admin");
      } finally {
        setCarregando(false);
      }
    }

    carregarGarantia();
  }, [codigo, navigate]);

  function atualizarCampo(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  async function salvar(event) {
    event.preventDefault();

    try {
      setSalvando(true);

      await atualizarGarantia(codigo, formulario);

      alert("Garantia atualizada com sucesso!");

      navigate("/admin");
    } catch (error) {
      alert(`Erro ao atualizar garantia: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <main className="formPage">
        <p>Carregando garantia...</p>
      </main>
    );
  }

  return (
    <main className="formPage">
      <div className="pageHeader">
        <div>
          <span>Painel administrativo</span>
          <h1>Editar garantia</h1>
          <p>Atualize os dados da garantia cadastrada.</p>
        </div>
      </div>

      <form className="warrantyForm" onSubmit={salvar}>
        <section className="formSection">
          <div className="sectionTitle">
            <UserRound size={23} />

            <div>
              <h2>Dados do cliente</h2>
              <p>Informações de identificação e contato.</p>
            </div>
          </div>

          <div className="formGrid">
            <label>
              Nome do cliente
              <input
                name="cliente"
                value={formulario.cliente}
                onChange={atualizarCampo}
                required
              />
            </label>

            <label>
              Telefone
              <input
                name="telefone"
                value={formulario.telefone}
                onChange={atualizarCampo}
              />
            </label>
          </div>
        </section>

        <section className="formSection">
          <div className="sectionTitle">
            <Smartphone size={23} />

            <div>
              <h2>Dados do aparelho</h2>
              <p>Modelo e identificação do aparelho.</p>
            </div>
          </div>

          <div className="formGrid">
            <label>
              Aparelho
              <input
                name="aparelho"
                value={formulario.aparelho}
                onChange={atualizarCampo}
                required
              />
            </label>

            <label>
              IMEI
              <input
                name="imei"
                value={formulario.imei}
                onChange={atualizarCampo}
              />
            </label>
          </div>
        </section>

        <section className="formSection">
          <div className="sectionTitle">
            <Wrench size={23} />

            <div>
              <h2>Serviço e garantia</h2>
              <p>Informações do reparo realizado.</p>
            </div>
          </div>

          <div className="formGrid">
            <label>
              Serviço realizado
              <input
                name="servico"
                value={formulario.servico}
                onChange={atualizarCampo}
                required
              />
            </label>

            <label>
              Valor
              <input
                name="valor"
                type="number"
                min="0"
                step="0.01"
                value={formulario.valor}
                onChange={atualizarCampo}
              />
            </label>

            <label>
              Data do serviço
              <input
                name="dataServico"
                type="date"
                value={formulario.dataServico}
                onChange={atualizarCampo}
                required
              />
            </label>

            <label>
              Validade
              <input
                name="validade"
                type="date"
                value={formulario.validade}
                onChange={atualizarCampo}
                required
              />
            </label>

            <label className="fullField">
              Observações
              <textarea
                name="observacoes"
                rows="5"
                value={formulario.observacoes}
                onChange={atualizarCampo}
              />
            </label>
          </div>
        </section>

        <div className="formActions">
          <button
            className="btn btnPrimary"
            type="submit"
            disabled={salvando}
          >
            <Save size={20} />
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default EditarGarantia;