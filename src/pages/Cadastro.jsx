import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { ShieldCheck } from "lucide-react";

function Cadastro() {
  const navigate = useNavigate();

  const [dados, setDados] = useState({
    empresa: "",
    email: "",
    senha: "",
  });

  const [erro, setErro] = useState("");

  function alterar(e) {
    setDados({
      ...dados,
      [e.target.name]: e.target.value,
    });
  }

  async function criarConta(e) {
    e.preventDefault();

    setErro("");

    const { error } = await supabase.auth.signUp({
      email: dados.email,
      password: dados.senha,
      options: {
        data: {
          empresa: dados.empresa,
        },
      },
    });

    if (error) {
      setErro(error.message);
      return;
    }

    alert("Conta criada com sucesso!");
    navigate("/login");
  }

  return (
    <main className="loginPage">

      <form className="loginCard" onSubmit={criarConta}>

        <div>
          <ShieldCheck size={45}/>
        </div>

        <h1>Criar conta</h1>

        <p>
          Cadastre sua assistência no GarantiaPro
        </p>


        <label>
          Empresa

          <input
            name="empresa"
            placeholder="Nome da empresa"
            value={dados.empresa}
            onChange={alterar}
          />

        </label>


        <label>
          Gmail

          <input
            type="email"
            name="email"
            placeholder="Digite seu Gmail"
            value={dados.email}
            onChange={alterar}
          />

        </label>


        <label>
          Senha

          <input
            type="password"
            name="senha"
            placeholder="Crie uma senha"
            value={dados.senha}
            onChange={alterar}
          />

        </label>


        {erro && (
          <div className="errorMessage">
            {erro}
          </div>
        )}


        <button className="btn btnPrimary">
          Criar conta
        </button>


        <Link to="/login">
          Já tenho conta
        </Link>


      </form>

    </main>
  );
}

export default Cadastro;