import {
  LayoutDashboard,
  LogOut,
  Package,
  PlusCircle,
  ShieldCheck,
  Users,
  Wallet,
  Building2,
} from "lucide-react";

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { sair } from "../services/auth";


function LayoutAdmin() {

  const navigate = useNavigate();


  function encerrarSessao() {

    sair();

    navigate("/login");

  }


  return (

    <div className="adminLayout">


      <aside className="sidebar">


        <div className="sidebarBrand">

          <span className="brandIcon">

            <ShieldCheck size={25} />

          </span>


          <div>

            <strong>GarantiaPro</strong>

            <small>Sistema de Gestão</small>

          </div>


        </div>




        <nav>


          <NavLink to="/admin" end>

            <LayoutDashboard size={20} />

            Dashboard

          </NavLink>




          <NavLink to="/admin/nova-garantia">

            <PlusCircle size={20} />

            Nova Garantia

          </NavLink>




          <NavLink to="/admin/clientes">

            <Users size={20} />

            Clientes

          </NavLink>




          <NavLink to="/admin/estoque">

            <Package size={20} />

            Estoque

          </NavLink>




          <NavLink to="/admin/financeiro">

            <Wallet size={20} />

            Financeiro

          </NavLink>




          <NavLink to="/admin/empresa">

            <Building2 size={20} />

            Minha Assistência

          </NavLink>



        </nav>





        <button
          className="logoutButton"
          type="button"
          onClick={encerrarSessao}
        >

          <LogOut size={19} />

          Sair

        </button>



      </aside>





      <section className="adminContent">

        <Outlet />

      </section>



    </div>

  );

}


export default LayoutAdmin;