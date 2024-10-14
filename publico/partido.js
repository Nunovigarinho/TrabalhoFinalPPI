const formPartido = document.getElementById('formPartidos');
formPartido.onsubmit = validarCampos;
const enderecoAPI = "http://localhost:4000/partidos"
buscarTodosPartidos();
var motivoAcao = "CADASTRAR";


function incluirPartido(){
    const objetoPartido={
        nome:              document.getElementById('nome').value,
        sigla:             document.getElementById('sigla').value,
        numeroderegistro:  document.getElementById('numeroderegistro').value,
}
fetch(enderecoAPI, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(objetoPartido)
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

function selecionarPartido(nome, sigla, numeroderegistro, motivo){
    document.getElementById('nome').value = nome;
    document.getElementById('sigla').value = sigla;
    document.getElementById('numeroderegistro').value = numeroderegistro;

    motivoAcao = motivo;
    const botaoConfirmacao = document.getElementById('botaoConfirmacao');
    if (motivoAcao == 'EDITAR'){
        botaoConfirmacao.innerHTML = 'EDITAR';
    }
    else if (motivoAcao == 'EXCLUIR'){
        botaoConfirmacao.innerHTML = 'EXCLUIR';
    }
}
function excluirPartido(){
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
function atualizarPartidos(){
    const objetoPartido = {
        nome: document.getElementById('nome').value,
        sigla: document.getElementById('sigla').value,
        numeroderegistro: document.getElementById('numeroderegistro').value
    }

    fetch(enderecoAPI,{
        method:'PUT',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objetoPartido)
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

function buscarTodosPartidos(){
    fetch(enderecoAPI, {method:'GET'})
    .then((resposta) =>{
        return resposta.json();
    })
    .then((respostaAPI)=>{
        if (respostaAPI.status == true){
            exibirTabelaPartidos(respostaAPI.listaPartidos);
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
    const sigla            = document.getElementById('sigla').value;
    const numeroderegistro = document.getElementById('numeroderegistro').value;
    evento.stopPropagation();
    evento.preventDefault();
    if (nome && sigla && numeroderegistro) {
        if (motivoAcao == "CADASTRAR"){
            incluirPartido();
        }
        else if (motivoAcao == "EDITAR"){
            atualizarPartidos();
            motivoAcao = "CADASTRAR";
        }
        else if(motivoAcao =="EXCLUIR"){
            excluirPartido();
            motivoAcao = "CADASTRAR";
        }
        formPartido.reset();
        buscarTodosPartidos();
        return true;
}
else{
    exibirMensagem("Por favor, preencha todos os campos do formulário.")
}
}
function exibirMensagem(mensagem, cor = 'black') {
    const divMensagem = document.getElementById('mensagem');
    divMensagem.innerHTML = "<p style='color:" + cor + ";'>" + mensagem + "</p>";
    setTimeout(() => {
        divMensagem.innerHTML = "";
    }, 5000);
}
function exibirTabelaPartidos(listaPartidos){
    if(listaPartidos.length>0){
        const espacoTabela = document.getElementById('containerTabela');
        const tabela = document.createElement('table');
        const cabecalho = document.createElement('thead');
        cabecalho.innerHTML = `
        <tr>
        <th>Nome</th>
        <th>Sigla</th>
        <th>Numero de Registro</th>
        <th>Ações</th>
        </tr>
        `;
        const corpo = document.createElement('tbody');
        for(const partido of listaPartidos){
            const linha = document.createElement('tr');
            linha.innerHTML = `
            <td>${partido.nome}</td>
            <td>${partido.sigla}</td>
            <td>${partido.numeroderegistro}</td>
            <td>
                    <button onclick="selecionarPartido('${partido.nome}','${partido.sigla}','${partido.numeroderegistro}','EDITAR')">Alterar</button>
                    <button onclick="selecionarPartido('${partido.nome}','${partido.sigla}','${partido.numeroderegistro}','EXCLUIR')">Excluir</button
            </td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(cabecalho);
        tabela.appendChild(corpo);
        espacoTabela.innerHTML="";
        espacoTabela.appendChild(tabela);

    }else{
        exibirMensagem('Nenhum partido encontrado.')
    }

}
