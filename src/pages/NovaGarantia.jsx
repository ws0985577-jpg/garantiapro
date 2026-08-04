import { supabase } from "../services/supabase";
import { useEffect, useMemo, useState } from "react";
import {
  ImagePlus,
  Package,
  Save,
  Smartphone,
  Trash2,
  UserRound,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { criarOuAtualizarCliente } from "../services/clientes";
import {
  cadastrarGarantia,
  enviarFotosAparelho,
} from "../services/garantias";
import { listarPecas } from "../services/estoque";

function criarFormularioInicial() {
  let garantiaPadrao = "90";

  try {
    const configuracoes = JSON.parse(
      localStorage.getItem("garantiapro_configuracoes") || "{}"
    );

    garantiaPadrao = String(configuracoes.garantiaPadrao || "90");
  } catch {
    garantiaPadrao = "90";
  }

  return {
    cliente: "",
    telefone: "",
    aparelho: "",
    imei: "",
    servico: "",
    valor: "",
    dataServico: new Date().toISOString().slice(0, 10),
    diasGarantia: garantiaPadrao,
    observacoes: "",
    fotosUrl: [],
    pecaId: "",
    quantidadePeca: "0",
  };
}

function NovaGarantia() {
  const [formulario, setFormulario] = useState(criarFormularioInicial);
  const [arquivosFotos, setArquivosFotos] = useState([]);
  const [previewsFotos, setPreviewsFotos] = useState([]);
  const [pecas, setPecas] = useState([]);
  const [carregandoPecas, setCarregandoPecas] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function carregarEstoque() {
      try {
        setCarregandoPecas(true);
        const dados = await listarPecas();
        setPecas(dados);
      } catch (error) {
        console.error("Erro ao carregar estoque:", error);
      } finally {
        setCarregandoPecas(false);
      }
    }

    carregarEstoque();
  }, []);

  useEffect(() => {
    return () => {
      previewsFotos.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewsFotos]);

  const pecaSelecionada = useMemo(
    () => pecas.find((peca) => peca.id === formulario.pecaId) || null,
    [pecas, formulario.pecaId]
  );

  function atualizar(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => {
      const atualizado = {
        ...anterior,
        [name]: value,
      };

      if (name === "pecaId" && !value) {
        atualizado.quantidadePeca = "0";
      }

      if (
        name === "pecaId" &&
        value &&
        Number(anterior.quantidadePeca || 0) <= 0
      ) {
        atualizado.quantidadePeca = "1";
      }

      return atualizado;
    });
  }

  function selecionarFotos(event) {
    const novosArquivos = Array.from(event.target.files || []);

    if (novosArquivos.length === 0) return;

    if (arquivosFotos.length + novosArquivos.length > 4) {
      alert("Você pode selecionar no máximo 4 fotos.");
      event.target.value = "";
      return;
    }

    const arquivoInvalido = novosArquivos.find(
      (arquivo) => !arquivo.type.startsWith("image/")
    );

    if (arquivoInvalido) {
      alert("Escolha somente arquivos de imagem.");
      event.target.value = "";
      return;
    }

    const arquivoGrande = novosArquivos.find(
      (arquivo) => arquivo.size > 5 * 1024 * 1024
    );

    if (arquivoGrande) {
      alert("Cada foto deve ter no máximo 5 MB.");
      event.target.value = "";
      return;
    }

    const novosPreviews = novosArquivos.map((arquivo) =>
      URL.createObjectURL(arquivo)
    );

    setArquivosFotos((anteriores) => [
      ...anteriores,
      ...novosArquivos,
    ]);

    setPreviewsFotos((anteriores) => [
      ...anteriores,
      ...novosPreviews,
    ]);

    event.target.value = "";
  }

  function removerFoto(index) {
    URL.revokeObjectURL(previewsFotos[index]);

    setArquivosFotos((anteriores) =>
      anteriores.filter((_, indice) => indice !== index)
    );

    setPreviewsFotos((anteriores) =>
      anteriores.filter((_, indice) => indice !== index)
    );
  }

  async function salvar(event) {
    event.preventDefault();

    if (
      !formulario.cliente.trim() ||
      !formulario.aparelho.trim() ||
      !formulario.servico.trim() ||
      !formulario.dataServico
    ) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    const quantidadePeca = Number(formulario.quantidadePeca || 0);

    if (formulario.pecaId && quantidadePeca <= 0) {
      alert("Informe a quantidade da peça utilizada.");
      return;
    }

    if (
      pecaSelecionada &&
      quantidadePeca > Number(pecaSelecionada.quantidade || 0)
    ) {
      alert(
        `Estoque insuficiente. Disponível: ${pecaSelecionada.quantidade}.`
      );
      return;
    }

    try {
      setSalvando(true);

      let fotosUrl = [];

      if (arquivosFotos.length > 0) {
        fotosUrl = await enviarFotosAparelho(arquivosFotos);
      }

      await criarOuAtualizarCliente({
        nome: formulario.cliente.trim(),
        telefone: formulario.telefone.trim(),
      });

      const {
  data: { user },
} = await supabase.auth.getUser();


const { data: empresa } = await supabase
  .from("empresas")
  .select("id")
  .eq("user_id", user.id)
  .single();


if (!empresa) {
  throw new Error("Nenhuma assistência cadastrada para este usuário.");
}

const garantia = await cadastrarGarantia({
  ...formulario,
  fotosUrl,
  pecaId: formulario.pecaId,
  quantidadePeca,
  empresa_id: empresa.id,
  custoPeca: pecaSelecionada
    ? Number(pecaSelecionada.precoCompra || 0) * quantidadePeca
    : 0,
});

      alert(
        pecaSelecionada
          ? `Garantia ${garantia.codigo} cadastrada e estoque atualizado!`
          : `Garantia ${garantia.codigo} cadastrada com sucesso!`
      );

      navigate(`/comprovante/${garantia.codigo}`);
    } catch (error) {
      console.error("Erro ao cadastrar garantia:", error);

      alert(
        `Não foi possível cadastrar a garantia: ${
          error.message || "erro desconhecido"
        }`
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="formPage">
      <div className="pageHeader">
        <div>
          <span>Painel administrativo</span>
          <h1>Nova garantia</h1>
          <p>Cadastre o cliente, aparelho, serviço e a peça utilizada.</p>
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
              Nome do cliente *
              <input
                name="cliente"
                value={formulario.cliente}
                onChange={atualizar}
                required
              />
            </label>

            <label>
              Telefone
              <input
                name="telefone"
                value={formulario.telefone}
                onChange={atualizar}
                placeholder="(27) 99999-9999"
              />
            </label>
          </div>
        </section>

        <section className="formSection">
          <div className="sectionTitle">
            <Smartphone size={23} />
            <div>
              <h2>Dados do aparelho</h2>
              <p>Modelo, IMEI e fotos do aparelho.</p>
            </div>
          </div>

          <div className="formGrid">
            <label>
              Aparelho *
              <input
                name="aparelho"
                value={formulario.aparelho}
                onChange={atualizar}
                placeholder="Samsung Galaxy A06"
                required
              />
            </label>

            <label>
              IMEI
              <input
                name="imei"
                value={formulario.imei}
                onChange={atualizar}
              />
            </label>

            <div className="fullField">
              <span className="photosFieldTitle">
                Fotos do aparelho — máximo 4
              </span>

              <div className="photoUpload">
                <label
                  htmlFor="fotosAparelho"
                  className="photoUploadButton"
                >
                  <ImagePlus size={22} />
                  Escolher fotos
                </label>

                <input
                  id="fotosAparelho"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={selecionarFotos}
                  hidden
                  disabled={arquivosFotos.length >= 4}
                />

                <span>
                  {arquivosFotos.length > 0
                    ? `${arquivosFotos.length} de 4 foto(s) selecionada(s)`
                    : "Nenhuma foto selecionada"}
                </span>
              </div>
            </div>

            {previewsFotos.length > 0 && (
              <div className="photosPreviewGrid fullField">
                {previewsFotos.map((url, index) => (
                  <div className="photoPreviewItem" key={url}>
                    <img src={url} alt={`Prévia ${index + 1}`} />

                    <button
                      type="button"
                      onClick={() => removerFoto(index)}
                      title="Remover foto"
                    >
                      <Trash2 size={17} />
                    </button>

                    <span>Foto {index + 1}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="formSection">
          <div className="sectionTitle">
            <Package size={23} />
            <div>
              <h2>Peça utilizada</h2>
              <p>Selecione uma peça para dar baixa automática no estoque.</p>
            </div>
          </div>

          <div className="formGrid">
            <label>
              Peça do estoque
              <select
                name="pecaId"
                value={formulario.pecaId}
                onChange={atualizar}
                disabled={carregandoPecas}
              >
                <option value="">
                  {carregandoPecas
                    ? "Carregando estoque..."
                    : "Nenhuma peça utilizada"}
                </option>

                {pecas.map((peca) => (
                  <option key={peca.id} value={peca.id}>
                    {peca.nome} — estoque: {peca.quantidade}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Quantidade utilizada
              <input
                type="number"
                min="0"
                step="1"
                name="quantidadePeca"
                value={formulario.quantidadePeca}
                onChange={atualizar}
                disabled={!formulario.pecaId}
              />
            </label>

            {pecaSelecionada && (
              <div className="fullField stockSelectionInfo">
                <strong>{pecaSelecionada.nome}</strong>
                <span>Disponível: {pecaSelecionada.quantidade}</span>
                <span>
                  Custo unitário: R$ {Number(
                    pecaSelecionada.precoCompra || 0
                  ).toFixed(2)}
                </span>

                {Number(pecaSelecionada.quantidade) <=
                  Number(pecaSelecionada.estoqueMinimo) && (
                  <small>⚠️ Esta peça está com estoque baixo.</small>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="formSection">
          <div className="sectionTitle">
            <Wrench size={23} />
            <div>
              <h2>Serviço e garantia</h2>
              <p>Detalhes do reparo realizado.</p>
            </div>
          </div>

          <div className="formGrid">
            <label>
              Serviço realizado *
              <input
                name="servico"
                value={formulario.servico}
                onChange={atualizar}
                placeholder="Troca de tela"
                required
              />
            </label>

            <label>
              Valor cobrado
              <input
                type="number"
                min="0"
                step="0.01"
                name="valor"
                value={formulario.valor}
                onChange={atualizar}
              />
            </label>

            <label>
              Data do serviço *
              <input
                type="date"
                name="dataServico"
                value={formulario.dataServico}
                onChange={atualizar}
                required
              />
            </label>

            <label>
              Prazo da garantia
              <select
                name="diasGarantia"
                value={formulario.diasGarantia}
                onChange={atualizar}
              >
                <option value="30">30 dias</option>
                <option value="60">60 dias</option>
                <option value="90">90 dias</option>
                <option value="180">180 dias</option>
                <option value="365">1 ano</option>
              </select>
            </label>

            <label className="fullField">
              Observações
              <textarea
                rows="5"
                name="observacoes"
                value={formulario.observacoes}
                onChange={atualizar}
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
            {salvando
              ? arquivosFotos.length > 0
                ? "Enviando fotos e salvando..."
                : "Salvando..."
              : "Salvar garantia"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default NovaGarantia;