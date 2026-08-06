import { CreditCard, CheckCircle, Star, Zap } from "lucide-react";
import { criarPagamento } from "../services/mercadopago";

export default function Pagamento(){


async function assinar(plano){

try{


const link = await criarPagamento(plano);


window.location.href = link;


}catch(error){

alert(error.message);

}


}




return (

<div className="pagamentoPage">


<div className="pagamentoHeader">


<h1>
Escolha seu plano
</h1>


<p>
Tenha acesso completo ao GarantiaPro e gerencie sua assistência técnica de forma profissional.
</p>


</div>





<div className="planos">





<div className="planoCard">


<div className="planoIcon">

<Zap size={24}/>

</div>



<h2>
Plano Mensal
</h2>



<div className="preco">

<h1>
R$ 25,90
</h1>

<span>
/mês
</span>


</div>





<ul>


<li>
<CheckCircle size={18}/>
Garantias ilimitadas
</li>


<li>
<CheckCircle size={18}/>
Controle de clientes
</li>


<li>
<CheckCircle size={18}/>
Ordem de serviço
</li>


<li>
<CheckCircle size={18}/>
Suporte atualizado
</li>


</ul>





<button
onClick={()=>assinar("Mensal")}
>


<CreditCard size={18}/>

Assinar Mensal


</button>




</div>









<div className="planoCard destaque">



<div className="planoFavorito">


<Star size={16}/>


Melhor oferta


</div>






<div className="planoIcon">

<Zap size={24}/>

</div>





<h2>
Plano Anual
</h2>





<div className="preco">


<h1>
R$ 99,90
</h1>


<span>
/ano
</span>



</div>








<ul>


<li>
<CheckCircle size={18}/>
Economize mais de 67%
</li>


<li>
<CheckCircle size={18}/>
Todas funções liberadas
</li>


<li>
<CheckCircle size={18}/>
Atualizações futuras
</li>


<li>
<CheckCircle size={18}/>
Sem cobrança mensal
</li>



</ul>






<button
onClick={()=>assinar("Anual")}
>



<CreditCard size={18}/>


Assinar Anual



</button>




</div>






</div>


</div>


);


}