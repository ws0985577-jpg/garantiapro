import { useState } from "react";
import { LockKeyhole, LogIn, Mail, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { entrar } from "../services/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  function fazerLogin(event) {
    event.preventDefault();
    setErro("");

    const resultado = entrar(email, senha);
    if (!resultado.sucesso) {
      setErro(resultado.mensagem);
      return;
    }

    navigate("/admin");
  }

  return (
    <main className="loginPage">
      <form className="loginCard" onSubmit={fazerLogin}>
        <div className="loginLogo"><ShieldCheck size={34} /></div>
        <h1>Área administrativa</h1>
        <p>Entre para administrar as garantias da W-Tech.</p>

        <label>
          E-mail
          <div className="inputIcon">
            <Mail size={19} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu Gmail"
              required
            />
          </div>
        </label>

        <label>
          Senha
          <div className="inputIcon">
            <LockKeyhole size={19} />
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>
        </label>

        {erro && <div className="errorMessage">{erro}</div>}

        <button className="btn btnPrimary loginButton" type="submit">
          <LogIn size={20} />
          Entrar
        </button>

        <div className="demoAccess">
         
        </div>

        <Link to="/" className="backLink">Voltar ao site</Link>
      </form>
    </main>
  );
}

export default Login;
