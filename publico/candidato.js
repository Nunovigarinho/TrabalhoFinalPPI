const formCandidato = document.getElementById('formCandidatos');
formCandidato.onsubmit = validarCampos;
const enderecoAPI = "http://localhost:5000/candidatos"
buscarTodosCandidatos();
var motivoAcao = "CADASTRAR";
function incluirCandidato(){
    const objetoCandidato={
        nome:              document.getElementById('nome').value,
        partido:           document.getElementById('partido').value,
        numerodocandidato: document.getElementById('numerodocandidato').value,
}
fetch(enderecoAPI, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(objetoCandidato)
}).then((resposta) => {
    return resposta.json();
}).then((respostaAPI) =>{
    if (respostaAPI.status == true){
        exibirMensagem(respostaAPI.mensagem, 'blue');
    }
    else {
        exibirMensagem(respostaAPI.mensagem, 'red');
    }

}).catch((erro) => {
    exibirMensagem(erro, 'orange');
});
}

function selecionarCandidato(nome, partido, numerodocandidato, motivo){
    document.getElementById('nome').value = nome;
    document.getElementById('partido').value = partido;
    document.getElementById('numerodocandidato').value = numerodocandidato;

    motivoAcao = motivo;
    const botaodeConfirmacao = document.getElementById('botaodeConfirmacao');
    if (motivoAcao == 'EDITAR'){
        botaodeConfirmacao.innerHTML = 'EDITAR';
    }
    else if (motivoAcao == 'EXCLUIR'){
        botaodeConfirmacao.innerHTML = 'EXCLUIR';
    }
}

function excluirCandidato(){
    fetch(enderecoAPI,{  
        method:'DELETE',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({nome: document.getElementById('nome').value})
    }).then((resposta)=>{
        return resposta.json();
    }).then((respostaAPI)=>{
        if (respostaAPI.status == true){
            exibirMensagem(respostaAPI.mensagem, 'blue');
        }
        else{
            exibirMensagem(respostaAPI.mensagem, 'red');
        }
    }).catch((erro)=>{
        exibirMensagem(erro, 'orange');
    });

}
function atualizarCandidato(){ 
    const objetoCandidato = {
    nome: document.getElementById('nome').value,
    partido: document.getElementById('partido').value,
    numerodocandidato: document.getElementById('numerodocandidato').value
}

fetch(enderecoAPI,{
    method:'PUT',
    headers:{
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(objetoCandidato)
}).then((resposta) =>{
    return resposta.json();
}).then((respostaAPI)=>{
    if (respostaAPI.status == true){
        exibirMensagem(respostaAPI.mensagem, 'blue');
    }
    else{
        exibirMensagem(respostaAPI.mensagem, 'red');
    }
}).catch((erro)=>{
    exibirMensagem(erro, 'orange');
});
}

function buscarTodosCandidatos(){
    fetch(enderecoAPI, {method:'GET'})
    .then((resposta) =>{
        return resposta.json();
    })
    .then((respostaAPI)=>{
        if (respostaAPI.status == true){
            exibirTabelaCandidatos(respostaAPI.listaCandidatos);
        }
        else{
            exibirMensagem(respostaAPI.mensagem, 'red');
        }
    })
    .catch((erro) =>{
        exibirMensagem(erro, 'orange');
    });
}
function validarCampos(evento){
    const nome             = document.getElementById('nome').value;                     
    const partido          = document.getElementById('partido').value;
    const numerodocandidato = document.getElementById('numerodocandidato').value;
    evento.stopPropagation();
    evento.preventDefault();
    if (nome && partido && numerodocandidato) {
        if (motivoAcao == "CADASTRAR"){
            incluirCandidato();
        }
        else if (motivoAcao == "EDITAR"){
            atualizarCandidato();
            motivoAcao = "CADASTRAR";
        }
        else if(motivoAcao =="EXCLUIR"){
            excluirCandidato();
            motivoAcao = "CADASTRAR";
        }
        formCandidato.reset();
        buscarTodosCandidatos();
        return true;
       
}
else{
    exibirMensagem("Por favor, preencha todos os campos do formulário.")
}
}
function exibirMensagem(mensagem, cor = 'black') {
    const divMensagem = document.getElementById('mensagem1');
    divMensagem.innerHTML = "<p style='color:" + cor + ";'>" + mensagem + "</p>";
    setTimeout(() => {
        divMensagem.innerHTML = "";
    }, 5000);
}

function exibirTabelaCandidatos(listaCandidatos){
    if(listaCandidatos.length>0){
        const espacoTabela = document.getElementById('containerTabela1');
        const tabela = document.createElement('table');
        const cabecalho = document.createElement('thead'); cabecalho.innerHTML = `
        <tr>
        <th>Nome</th>
        <th>Partido</th>
        <th>Numero do Candidato</th>
        <th>Ações</th>
        </tr>
        `;
        const corpo = document.createElement('tbody');
        for(const candidato of listaCandidatos){
            const linha = document.createElement('tr');
            linha.innerHTML = `
            <td>${candidato.nome}</td>
            <td>${candidato.partido}</td>
            <td>${candidato.numerodocandidato}</td>
            <td>
                    <button onclick="selecionarCandidato('${candidato.nome}','${candidato.partido}','${candidato.numerodocandidato}','EDITAR')">Alterar</button>
                    <button onclick="selecionarCandidato('${candidato.nome}','${candidato.partido}','${candidato.numerodocandidato}','EXCLUIR')">Excluir</button>
            </td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(cabecalho);
        tabela.appendChild(corpo);
        espacoTabela.innerHTML="";
        espacoTabela.appendChild(tabela);

    }else{
        exibirMensagem('Nenhum candidato foi encontrado.')
    }
}
