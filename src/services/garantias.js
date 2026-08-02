import { supabase } from "./supabase";

export async function enviarFotosAparelho(arquivos) {
  if (!arquivos || arquivos.length === 0) {
    return [];
  }

  const listaArquivos = Array.from(arquivos).slice(0, 4);
  const urls = [];

  for (const arquivo of listaArquivos) {
    const extensao =
      arquivo.name.split(".").pop()?.toLowerCase() || "jpg";

    const identificador =
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    const nomeArquivo =
      `${Date.now()}-${identificador}.${extensao}`;

    const { error } = await supabase.storage
      .from("fotos-aparelhos")
      .upload(nomeArquivo, arquivo, {
        cacheControl: "3600",
        upsert: false,
        contentType: arquivo.type,
      });

    if (error) {
      throw new Error(
        `Erro ao enviar ${arquivo.name}: ${error.message}`
      );
    }

    const { data } = supabase.storage
      .from("fotos-aparelhos")
      .getPublicUrl(nomeArquivo);

    urls.push(data.publicUrl);
  }

  return urls;
}

function converterGarantia(item) {
  return {
    id: item.id,
    codigo: item.codigo,
    cliente: item.cliente,
    telefone: item.telefone || "",
    aparelho: item.aparelho,
    imei: item.imei || "",
    servico: item.servico,
    valor: item.valor ?? "",
    dataServico: item.data_servico,
    validade: item.validade,
    observacoes: item.observacoes || "",
    fotosUrl: Array.isArray(item.fotos_url)
      ? item.fotos_url
      : [],
    criadoEm: item.created_at,
  };
}

function gerarCodigo() {
  const ano = new Date().getFullYear();
  const numero = String(Date.now()).slice(-6);

  return `GAR-${ano}-${numero}`;
}

export async function listarGarantias() {
  const { data, error } = await supabase
    .from("garantias")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map(converterGarantia);
}

export async function cadastrarGarantia(dados) {
  const dataServico = new Date(
    `${dados.dataServico}T12:00:00`
  );

  const validade = new Date(dataServico);

  validade.setDate(
    validade.getDate() + Number(dados.diasGarantia)
  );

  const pecaId = dados.pecaId || null;

  const quantidadePeca = pecaId
    ? Number(dados.quantidadePeca || 0)
    : 0;

  const custoPeca = pecaId
    ? Number(dados.custoPeca || 0)
    : 0;

  const novaGarantia = {
    codigo: gerarCodigo(),
    cliente: dados.cliente.trim(),
    telefone: dados.telefone.trim(),
    aparelho: dados.aparelho.trim(),
    imei: dados.imei.trim(),
    servico: dados.servico.trim(),
    valor: dados.valor ? Number(dados.valor) : null,
    data_servico: dados.dataServico,
    validade: validade.toISOString().slice(0, 10),
    observacoes: dados.observacoes.trim(),
    fotos_url: dados.fotosUrl || [],
    peca_id: pecaId,
    quantidade_peca: quantidadePeca,
    custo_peca: custoPeca,
  };

  const { data, error } = await supabase
    .from("garantias")
    .insert(novaGarantia)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (pecaId && quantidadePeca > 0) {
    const { error: erroEstoque } = await supabase.rpc(
      "baixar_estoque_garantia",
      {
        p_peca_id: pecaId,
        p_quantidade: quantidadePeca,
        p_garantia_id: data.id,
      }
    );

    if (erroEstoque) {
      await supabase
        .from("garantias")
        .delete()
        .eq("id", data.id);

      throw new Error(
        `Erro ao baixar estoque: ${erroEstoque.message}`
      );
    }
  }
return converterGarantia(data);
}

export async function buscarGarantia(termo) {
  const busca = termo.trim();

  const { data, error } = await supabase
    .from("garantias")
    .select("*")
    .or(`imei.eq.${busca}`)
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }

  return data?.[0]
    ? converterGarantia(data[0])
    : null;
}

export async function excluirGarantia(id) {
  const { error } = await supabase
    .from("garantias")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function atualizarGarantia(
  codigo,
  dados
) {
  const atualizacao = {
    cliente: dados.cliente.trim(),
    telefone: dados.telefone.trim(),
    aparelho: dados.aparelho.trim(),
    imei: dados.imei.trim(),
    servico: dados.servico.trim(),
    valor: dados.valor
      ? Number(dados.valor)
      : null,
    data_servico: dados.dataServico,
    validade: dados.validade,
    observacoes: dados.observacoes.trim(),
  };

  if (dados.fotosUrl !== undefined) {
    atualizacao.fotos_url = dados.fotosUrl || [];
  }

  const { data, error } = await supabase
    .from("garantias")
    .update(atualizacao)
    .eq("codigo", codigo)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return converterGarantia(data);
}

export function statusGarantia(validade) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const fim = new Date(`${validade}T12:00:00`);

  const diferenca = Math.ceil(
    (fim.getTime() - hoje.getTime()) / 86400000
  );

  if (diferenca < 0) {
    return {
      texto: "Vencida",
      tipo: "vencida",
      dias: diferenca,
    };
  }

  if (diferenca <= 15) {
    return {
      texto: "Próxima do vencimento",
      tipo: "proxima",
      dias: diferenca,
    };
  }

  return {
    texto: "Ativa",
    tipo: "ativa",
    dias: diferenca,
  };
}

export function formatarData(data) {
  if (!data) return "-";

  return new Date(
    `${data}T12:00:00`
  ).toLocaleDateString("pt-BR");
}

export function formatarValor(valor) {
  if (
    valor === "" ||
    valor === null ||
    valor === undefined
  ) {
    return "-";
  }

  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}