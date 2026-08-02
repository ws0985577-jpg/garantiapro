import { useEffect, useState } from "react";
import {
  AtSign,
  Building2,
  Mail,
  MapPin,
  MessageCircle,
  Save,
  Settings,
  ShieldCheck,
  Upload,
} from "lucide-react";

const CONFIG_KEY = "garantiapro_configuracoes";

const configuracaoInicial = {
  nomeEmpresa: "GarantiaPro",
  subtitulo: "Assistência Técnica",
  whatsapp: "",
  email: "",
  endereco: "",
  instagram: "",
  garantiaPadrao: "90",
  logoUrl: "/logo-garantiaPro.png",
};

function Configuracoes() {
  const [formulario, setFormulario] = useState(configuracaoInicial);
  const [salvando, setSalvando] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(
    configuracaoInicial.logoUrl
  );

  useEffect(() => {
    const configuracoesSalvas = localStorage.getItem(CONFIG_KEY);

    if (!configuracoesSalvas) return;

    try {
      const dados = JSON.parse(configuracoesSalvas);

      setFormulario({
        ...configuracaoInicial,
        ...dados,
      });

      setPreviewLogo(
        dados.logoUrl || configuracaoInicial.logoUrl
      );
    } catch (error) {
      console.error(
        "Erro ao carregar configurações:",
        error
      );
    }
  }, []);

  function atualizarCampo(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function selecionarLogo(event) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      alert("Escolha um arquivo de imagem.");
      event.target.value = "";
      return;
    }

    if (arquivo.size > 2 * 1024 * 1024) {
      alert("A logo deve ter no máximo 2 MB.");
      event.target.value = "";
      return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {
      const logoUrl = leitor.result;

      setPreviewLogo(logoUrl);

      setFormulario((anterior) => ({
        ...anterior,
        logoUrl,
      }));
    };

    leitor.readAsDataURL(arquivo);
  }

  function salvarConfiguracoes(event) {
    event.preventDefault();

    if (!formulario.nomeEmpresa.trim()) {
      alert("Digite o nome da assistência.");
      return;
    }

    try {
      setSalvando(true);

      localStorage.setItem(
        CONFIG_KEY,
        JSON.stringify(formulario)
      );

      alert("Configurações salvas com sucesso!");
    } catch (error) {
      alert(
        `Não foi possível salvar as configurações: ${
          error.message || "erro desconhecido"
        }`
      );
    } finally {
      setSalvando(false);
    }
  }

  function restaurarPadrao() {
    const confirmar = window.confirm(
      "Deseja restaurar as configurações padrão?"
    );

    if (!confirmar) return;

    localStorage.removeItem(CONFIG_KEY);
    setFormulario(configuracaoInicial);
    setPreviewLogo(configuracaoInicial.logoUrl);
  }

  return (
    <main className="configPage">
      <div className="pageHeader">
        <div>
          <span>Painel administrativo</span>
          <h1>Configurações</h1>
          <p>
            Personalize os dados e a identidade visual da GarantiaPro.
          </p>
        </div>
      </div>

      <section className="configGrid">
        <article className="panel configPreview">
          <div className="configPanelTitle">
            <div>
              <h2>Prévia da empresa</h2>
              <p>Veja como a marca será exibida.</p>
            </div>

            <Settings size={24} />
          </div>

          <div className="companyPreviewCard">
            <img
              src={previewLogo}
              alt="Logo da assistência"
              className="companyPreviewLogo"
            />

            <div>
              <h2>
                {formulario.nomeEmpresa || "Nome da empresa"}
              </h2>

              <p>
                {formulario.subtitulo ||
                  "Assistência Técnica"}
              </p>
            </div>
          </div>

          <div className="configPreviewDetails">
            {formulario.whatsapp && (
              <div>
                <MessageCircle size={18} />
                <span>{formulario.whatsapp}</span>
              </div>
            )}

            {formulario.email && (
              <div>
                <Mail size={18} />
                <span>{formulario.email}</span>
              </div>
            )}

            {formulario.endereco && (
              <div>
                <MapPin size={18} />
                <span>{formulario.endereco}</span>
              </div>
            )}

            {formulario.instagram && (
              <div>
                <AtSign size={18} />
                <span>{formulario.instagram}</span>
              </div>
            )}
          </div>
        </article>

        <article className="panel">
          <div className="configPanelTitle">
            <div>
              <h2>Dados da assistência</h2>
              <p>Atualize as informações principais.</p>
            </div>

            <Building2 size={24} />
          </div>

          <form
            className="configForm"
            onSubmit={salvarConfiguracoes}
          >
            <label>
              Nome da assistência *
              <input
                name="nomeEmpresa"
                value={formulario.nomeEmpresa}
                onChange={atualizarCampo}
                placeholder="GarantiaPro"
                required
              />
            </label>

            <label>
              Subtítulo
              <input
                name="subtitulo"
                value={formulario.subtitulo}
                onChange={atualizarCampo}
                placeholder="Assistência Técnica"
              />
            </label>

            <div className="configFormRow">
              <label>
                WhatsApp
                <input
                  name="whatsapp"
                  value={formulario.whatsapp}
                  onChange={atualizarCampo}
                  placeholder="(27) 99999-9999"
                />
              </label>

              <label>
                E-mail
                <input
                  type="email"
                  name="email"
                  value={formulario.email}
                  onChange={atualizarCampo}
                  placeholder="contato@garantiapro.com
                />
              </label>
            </div>

            <label>
              Endereço
              <input
                name="endereco"
                value={formulario.endereco}
                onChange={atualizarCampo}
                placeholder="Rua, número, bairro e cidade"
              />
            </label>

            <label>
              Instagram
              <input
                name="instagram"
                value={formulario.instagram}
                onChange={atualizarCampo}
                placeholder="@garantiapro
              />
            </label>

            <label>
              Garantia padrão
              <select
                name="garantiaPadrao"
                value={formulario.garantiaPadrao}
                onChange={atualizarCampo}
              >
                <option value="30">30 dias</option>
                <option value="60">60 dias</option>
                <option value="90">90 dias</option>
                <option value="180">180 dias</option>
                <option value="365">1 ano</option>
              </select>
            </label>

            <div className="configLogoField">
              <span>Logo da assistência</span>

              <div className="configLogoUpload">
                <img
                  src={previewLogo}
                  alt="Prévia da logo"
                />

                <label htmlFor="configLogo">
                  <Upload size={20} />
                  Escolher logo
                </label>

                <input
                  id="configLogo"
                  type="file"
                  accept="image/*"
                  onChange={selecionarLogo}
                  hidden
                />
              </div>

              <small>
                Use PNG ou JPG com no máximo 2 MB.
              </small>
            </div>

            <div className="configActions">
              <button
                className="btn btnPrimary"
                type="submit"
                disabled={salvando}
              >
                <Save size={20} />

                {salvando
                  ? "Salvando..."
                  : "Salvar configurações"}
              </button>

              <button
                className="btn configResetButton"
                type="button"
                onClick={restaurarPadrao}
              >
                <ShieldCheck size={20} />
                Restaurar padrão
              </button>
            </div>
          </form>
        </article>
      </section>
    </main>
  );
}

export default Configuracoes;