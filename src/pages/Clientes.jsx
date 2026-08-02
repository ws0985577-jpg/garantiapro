import { useEffect, useMemo, useState } from "react";
import {
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import {
  cadastrarCliente,
  excluirCliente,
  listarClientes,
} from "../services/clientes";

const clienteInicial = {
  nome: "",
  telefone: "",
  email: "",
  cpf: "",
  endereco: "",
  cidade: "",
  estado: "",
  observacoes: "",
};

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [formulario, setFormulario] = useState(clienteInicial);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function carregarClientes() {
    try {
      setCarregando(true);
      setErro("");

      const dados = await listarClientes();
      setClientes(dados);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  function atualizarCampo(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  async function salvarCliente(event) {
    event.preventDefault();

    if (!formulario.nome.trim()) {
      alert("Digite o nome do cliente.");
      return;
    }

    try {
      setSalvando(true);

      await cadastrarCliente(formulario);

      setFormulario(clienteInicial);
      await carregarClientes();

      alert("Cliente cadastrado com sucesso!");
    } catch (error) {
      alert(`Erro ao cadastrar cliente: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  }

  async function removerCliente(id) {
    const confirmar = window.confirm(
      "Deseja realmente excluir este cliente?"
    );

    if (!confirmar) return;

    try {
      await excluirCliente(id);
      await carregarClientes();
    } catch (error) {
      alert(`Erro ao excluir cliente: ${error.message}`);
    }
  }

  const clientesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return clientes;

    return clientes.filter((cliente) =>
      [
        cliente.nome,
        cliente.telefone,
        cliente.email,
        cliente.cpf,
        cliente.cidade,
        cliente.estado,
      ]
        .join(" ")
        .toLowerCase()
        .includes(termo)
    );
  }, [clientes, busca]);

  return (
    <main className="clientesPage">
      <div className="pageHeader">
        <div>
          <span>Painel administrativo</span>
          <h1>Clientes</h1>
          <p>Cadastre e gerencie os clientes da GarantiaPro.</p>
        </div>
      </div>

      {erro && <div className="errorMessage">{erro}</div>}

      <section className="clientesStats">
        <article>
          <span className="clientesStatIcon">
            <Users size={25} />
          </span>

          <div>
            <small>Total de clientes</small>
            <strong>{clientes.length}</strong>
          </div>
        </article>
      </section>

      <section className="clientesGrid">
        <article className="panel">
          <div className="clientesPanelTitle">
            <div>
              <h2>Novo cliente</h2>
              <p>Preencha os dados para cadastrar.</p>
            </div>

            <Plus size={24} />
          </div>

          <form
            className="clientesForm"
            onSubmit={salvarCliente}
          >
            <label>
              Nome completo *
              <input
                name="nome"
                value={formulario.nome}
                onChange={atualizarCampo}
                placeholder="Nome do cliente"
                required
              />
            </label>

            <div className="clientesFormRow">
              <label>
                Telefone
                <input
                  name="telefone"
                  value={formulario.telefone}
                  onChange={atualizarCampo}
                  placeholder="(27) 99999-9999"
                />
              </label>

              <label>
                CPF
                <input
                  name="cpf"
                  value={formulario.cpf}
                  onChange={atualizarCampo}
                  placeholder="000.000.000-00"
                />
              </label>
            </div>

            <label>
              E-mail
              <input
                name="email"
                type="email"
                value={formulario.email}
                onChange={atualizarCampo}
                placeholder="cliente@email.com"
              />
            </label>

            <label>
              Endereço
              <input
                name="endereco"
                value={formulario.endereco}
                onChange={atualizarCampo}
                placeholder="Rua, número e bairro"
              />
            </label>

            <div className="clientesFormRow">
              <label>
                Cidade
                <input
                  name="cidade"
                  value={formulario.cidade}
                  onChange={atualizarCampo}
                  placeholder="Linhares"
                />
              </label>

              <label>
                Estado
                <input
                  name="estado"
                  value={formulario.estado}
                  onChange={atualizarCampo}
                  placeholder="ES"
                  maxLength="2"
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
              <UserRound size={20} />

              {salvando
                ? "Salvando..."
                : "Cadastrar cliente"}
            </button>
          </form>
        </article>

        <article className="panel">
          <div className="clientesPanelTitle clientesListHeader">
            <div>
              <h2>Clientes cadastrados</h2>
              <p>{clientes.length} cliente(s) no sistema.</p>
            </div>

            <div className="smallSearch">
              <Search size={18} />

              <input
                type="text"
                placeholder="Buscar cliente"
                value={busca}
                onChange={(event) =>
                  setBusca(event.target.value)
                }
              />
            </div>
          </div>

          {carregando ? (
            <div className="emptyState">
              <p>Carregando clientes...</p>
            </div>
          ) : clientesFiltrados.length === 0 ? (
            <div className="emptyState">
              <Users size={42} />
              <h3>Nenhum cliente encontrado</h3>
              <p>Cadastre o primeiro cliente da GarantiaPro.</p>
            </div>
          ) : (
            <div className="clientesList">
              {clientesFiltrados.map((cliente) => (
                <article
                  className="clienteCard"
                  key={cliente.id}
                >
                  <div className="clienteCardTop">
                    <span className="clienteAvatar">
                      <UserRound size={23} />
                    </span>

                    <div className="clienteMainInfo">
                      <h3>{cliente.nome}</h3>

                      {cliente.cpf && (
                        <small>CPF: {cliente.cpf}</small>
                      )}
                    </div>

                    <div className="clienteActions">
                      <button
                        type="button"
                        title="Editar cliente"
                        disabled
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        className="clienteDeleteButton"
                        title="Excluir cliente"
                        onClick={() =>
                          removerCliente(cliente.id)
                        }
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>

                  <div className="clienteDetails">
                    {cliente.telefone && (
                      <div>
                        <Phone size={17} />
                        <span>{cliente.telefone}</span>
                      </div>
                    )}

                    {cliente.email && (
                      <div>
                        <Mail size={17} />
                        <span>{cliente.email}</span>
                      </div>
                    )}

                    {(cliente.cidade ||
                      cliente.estado ||
                      cliente.endereco) && (
                      <div>
                        <MapPin size={17} />

                        <span>
                          {[
                            cliente.endereco,
                            cliente.cidade,
                            cliente.estado,
                          ]
                            .filter(Boolean)
                            .join(" - ")}
                        </span>
                      </div>
                    )}
                  </div>

                  {cliente.observacoes && (
                    <p className="clienteObservacoes">
                      {cliente.observacoes}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
}

export default Clientes;