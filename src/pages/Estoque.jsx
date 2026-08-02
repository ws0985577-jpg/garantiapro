import { useEffect, useMemo, useState } from "react";
import {
  Package,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";

import {
  cadastrarPeca,
  excluirPeca,
  listarPecas,
} from "../services/estoque";

const inicial = {
  nome: "",
  categoria: "",
  codigo: "",
  quantidade: "",
  estoqueMinimo: "1",
  precoCompra: "",
  precoVenda: "",
  fornecedor: "",
};

function Estoque() {

  const [pecas, setPecas] = useState([]);

  const [formulario, setFormulario] =
    useState(inicial);

  const [busca, setBusca] =
    useState("");

  const [salvando, setSalvando] =
    useState(false);

  const [carregando, setCarregando] =
    useState(true);

  async function carregarPecas() {

    setCarregando(true);

    try {

      const dados =
        await listarPecas();

      setPecas(dados);

    } catch (e) {

      alert(e.message);

    } finally {

      setCarregando(false);

    }

  }

  useEffect(() => {

    carregarPecas();

  }, []);

  function atualizar(e){

    const {name,value}=e.target;

    setFormulario((anterior)=>({

      ...anterior,

      [name]:value,

    }));

  }

  async function salvar(e){

    e.preventDefault();

    if(!formulario.nome){

      alert("Digite o nome da peça.");

      return;

    }

    try{

      setSalvando(true);

      await cadastrarPeca(formulario);

      setFormulario(inicial);

      carregarPecas();

      alert("Peça cadastrada!");

    }catch(error){

      alert(error.message);

    }finally{

      setSalvando(false);

    }

  }

  async function excluir(id){

    if(!window.confirm("Excluir peça?")) return;

    await excluirPeca(id);

    carregarPecas();

  }

  const lista=useMemo(()=>{

    const termo=busca.toLowerCase();

    return pecas.filter((p)=>

      `${p.nome} ${p.categoria} ${p.codigo}`

      .toLowerCase()

      .includes(termo)

    );

  },[pecas,busca]);

  return (    <main className="clientesPage">
      <div className="pageHeader">
        <div>
          <span>Painel administrativo</span>
          <h1>Estoque</h1>
          <p>Gerencie todas as peças da GarantiaPro.</p>
        </div>
      </div>

      <section className="clientesStats">
        <article>
          <span className="clientesStatIcon">
            <Package size={25}/>
          </span>

          <div>
            <small>Total de peças</small>
            <strong>{pecas.length}</strong>
          </div>
        </article>
      </section>

      <section className="clientesGrid">

        <article className="panel">

          <div className="clientesPanelTitle">
            <div>
              <h2>Nova Peça</h2>
              <p>Cadastre uma peça.</p>
            </div>

            <PlusCircle size={24}/>
          </div>

          <form
            className="clientesForm"
            onSubmit={salvar}
          >

            <label>
              Nome
              <input
                name="nome"
                value={formulario.nome}
                onChange={atualizar}
              />
            </label>

            <div className="clientesFormRow">

              <label>
                Categoria
                <input
                  name="categoria"
                  value={formulario.categoria}
                  onChange={atualizar}
                />
              </label>

              <label>
                Código
                <input
                  name="codigo"
                  value={formulario.codigo}
                  onChange={atualizar}
                />
              </label>

            </div>

            <div className="clientesFormRow">

              <label>
                Quantidade
                <input
                  type="number"
                  name="quantidade"
                  value={formulario.quantidade}
                  onChange={atualizar}
                />
              </label>

              <label>
                Estoque mínimo
                <input
                  type="number"
                  name="estoqueMinimo"
                  value={formulario.estoqueMinimo}
                  onChange={atualizar}
                />
              </label>

            </div>

            <div className="clientesFormRow">

              <label>
                Compra
                <input
                  type="number"
                  name="precoCompra"
                  value={formulario.precoCompra}
                  onChange={atualizar}
                />
              </label>

              <label>
                Venda
                <input
                  type="number"
                  name="precoVenda"
                  value={formulario.precoVenda}
                  onChange={atualizar}
                />
              </label>

            </div>

            <label>
              Fornecedor
              <input
                name="fornecedor"
                value={formulario.fornecedor}
                onChange={atualizar}
              />
            </label>

            <button
              className="btn btnPrimary"
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Salvar peça"}
            </button>

          </form>

        </article>

        <article className="panel">

          <div className="clientesPanelTitle clientesListHeader">

            <div>

              <h2>Peças cadastradas</h2>

              <p>{lista.length} peça(s)</p>

            </div>

            <div className="smallSearch">

              <Search size={18}/>

              <input
                placeholder="Buscar peça"
                value={busca}
                onChange={(e)=>setBusca(e.target.value)}
              />

            </div>

          </div>

          {carregando ? (

            <div className="emptyState">
              Carregando...
            </div>

          ) : lista.length===0 ? (

            <div className="emptyState">

              <Package size={50}/>

              <h3>Nenhuma peça cadastrada</h3>

            </div>

          ) : (

            <div className="clientesList">

              {lista.map((peca)=>(

                <article
                  className="clienteCard"
                  key={peca.id}
                >

                  <div className="clienteCardTop">

                    <span className="clienteAvatar">

                      <Package size={22}/>

                    </span>

                    <div className="clienteMainInfo">

                      <h3>{peca.nome}</h3>

                      <small>
                        {peca.categoria}
                      </small>

                    </div>

                    <div className="clienteActions">

                      <button
                        className="clienteDeleteButton"
                        onClick={()=>excluir(peca.id)}
                      >

                        <Trash2 size={17}/>

                      </button>

                    </div>

                  </div>

                  <div className="clienteDetails">

                    <div>

                      Quantidade:
                      <strong>
                        {peca.quantidade}
                      </strong>

                    </div>

                    <div>

                      Compra:
                      <strong>
                        R$ {peca.precoCompra}
                      </strong>

                    </div>

                    <div>

                      Venda:
                      <strong>
                        R$ {peca.precoVenda}
                      </strong>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </article>

      </section>

    </main>

  );

}

export default Estoque;