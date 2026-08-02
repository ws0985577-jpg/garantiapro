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

import { listarPecas } from "../services/estoque";


function Dashboard() {
  const [garantias, setGarantias] = useState([]);
  const [estoqueBaixo, setEstoqueBaixo] = useState(0);

  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");


  async function carregar() {
    try {
      setCarregando(true);
      setErro("");

      const dados = await listarGarantias();
      setGarantias(dados);


      const pecas = await listarPecas();

      const baixo = pecas.filter(
        (p) => p.quantidade <= p.estoqueMinimo
      );

      setEstoqueBaixo(baixo.length);


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



  const hoje = new Date().toISOString().slice(0,10);


  const faturamentoHoje = garantias
    .filter((g)=>g.dataServico === hoje)
    .reduce(
      (total,g)=> total + Number(g.valor || 0),
      0
    );


  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();


  const faturamentoMes = garantias
    .filter((g)=>{

      const data = new Date(
        `${g.dataServico}T12:00:00`
      );

      return (
        data.getMonth() === mesAtual &&
        data.getFullYear() === anoAtual
      );

    })
    .reduce(
      (total,g)=> total + Number(g.valor || 0),
      0
    );



  const totais = garantias.reduce(
    (resultado,item)=>{

      const tipo = statusGarantia(
        item.validade
      ).tipo;


      resultado[tipo] += 1;

      resultado.faturamento +=
        Number(item.valor || 0);

      resultado.quantidade += 1;


      return resultado;

    },
    {
      ativa:0,
      proxima:0,
      vencida:0,
      faturamento:0,
      quantidade:0,
      ticketMedio:0
    }
  );



  totais.ticketMedio =
    totais.quantidade > 0
      ? totais.faturamento /
        totais.quantidade
      : 0;



  async function remover(id){

    const confirmar =
      window.confirm(
        "Deseja realmente excluir esta garantia?"
      );


    if(!confirmar) return;


    try{

      await excluirGarantia(id);

      await carregar();

    }catch(error){

      alert(
        `Erro ao excluir: ${error.message}`
      );

    }

  }



  function abrirWhatsApp(item){

    if(!item.telefone){

      alert(
        "Esta garantia não possui telefone cadastrado."
      );

      return;
    }


    const telefone =
      item.telefone.replace(/\D/g,"");


    const numeroCompleto =
      telefone.startsWith("55")
      ? telefone
      : `55${telefone}`;



    const mensagem =
      encodeURIComponent(
        `Olá, ${item.cliente}! Segue o comprovante de garantia da GarantiaPro.\n\n`+
        `Aparelho: ${item.aparelho}\n`+
        `Serviço: ${item.servico}\n`+
        `Código: ${item.codigo}\n`+
        `Validade: ${formatarData(item.validade)}`
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

          <h1>
            Dashboard GarantiaPro
          </h1>

          <p>
            Gerencie todas as garantias da assistência técnica.
          </p>

        </div>


        <Link
          to="/admin/nova-garantia"
          className="btn btnPrimary"
        >

          <Plus size={20}/>

          Nova garantia

        </Link>

      </div>



      <section className="statsGrid statsGridFour">


        <article>
          <ShieldCheck size={25}/>
          <div>
            <small>Garantias ativas</small>
            <strong>{totais.ativa}</strong>
          </div>
        </article>



        <article>
          <Clock3 size={25}/>
          <div>
            <small>Próximas do vencimento</small>
            <strong>{totais.proxima}</strong>
          </div>
        </article>



        <article>
          <XCircle size={25}/>
          <div>
            <small>Garantias vencidas</small>
            <strong>{totais.vencida}</strong>
          </div>
        </article>



        <article>
          <CalendarDays size={25}/>
          <div>
            <small>Faturamento hoje</small>
            <strong>
              {formatarValor(faturamentoHoje)}
            </strong>
          </div>
        </article>



        <article>
          <Wallet size={25}/>
          <div>
            <small>Faturamento do mês</small>
            <strong>
              {formatarValor(faturamentoMes)}
            </strong>
          </div>
        </article>



        <article>
          <Package size={25}/>
          <div>
            <small>Estoque baixo</small>
            <strong>
              {estoqueBaixo}
            </strong>
          </div>
        </article>


      </section>



      <section className="panel">

        <div className="panelHeader">

          <div>

            <h2>
              Garantias cadastradas
            </h2>

            <p>
              {garantias.length}
              {" "}registro(s) no Supabase.
            </p>

          </div>



          <div className="smallSearch">

            <Search size={18}/>

            <input
              placeholder="Buscar cliente, aparelho, IMEI..."
              value={busca}
              onChange={
                e=>setBusca(e.target.value)
              }
            />

          </div>


        </div>


        {carregando ? (

          <p>Carregando...</p>

        ) : erro ? (

          <p>{erro}</p>

        ) : (

          <table>

            <tbody>

            {filtradas.map(item=>{

              const status =
                statusGarantia(
                  item.validade
                );


              return (

              <tr key={item.id}>

                <td>
                  <strong>
                    {item.cliente}
                  </strong>
                  <br/>
                  {item.codigo}
                </td>


                <td>
                  {item.aparelho}
                </td>


                <td>
                  {item.servico}
                </td>


                <td>
                  {formatarValor(item.valor)}
                </td>


                <td>
                  {formatarData(item.validade)}
                </td>


                <td>
                  {status.texto}
                </td>


                <td>

                  <Link to={`/comprovante/${item.codigo}`}>
                    <Eye size={18}/>
                  </Link>


                  <button
                    onClick={()=>abrirWhatsApp(item)}
                  >
                    <MessageCircle size={18}/>
                  </button>


                  <button
                    onClick={()=>remover(item.id)}
                  >
                    <Trash2 size={18}/>
                  </button>

                </td>


              </tr>

              )

            })}

            </tbody>

          </table>

        )}

      </section>


    </main>
  );
}


export default Dashboard;