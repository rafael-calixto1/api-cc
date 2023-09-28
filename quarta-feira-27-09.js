const express = require('express');

const app = express(); 
const port = 3000; // define o valor para uma porta

app.use(express.json()); //permite utilizar json no body das requisições

id 
//associa o express à porta para receber requisições na porta 3000

//arrow function

//expor uma lista de estudantes
app.get('/estudantes', (req, res) => {
    res.json({nome: "Gisele", idade: 27},
    {nome: "Rena", idade: 15})
})
//expoe um unico estudante
app.get(`estudantes/${id}`, (req, res) => {
    res.json({nome: "Gisele", idade: 27})
})
//apresenta o curso de um determinado estudante
app.get(`estudantes/${id}/curso`, (req, res) => {
    res.json({curso: "ADS", duracao: 8, instituicao: "Braz Cubas"});
})
app.post('api/user/create', (req, res) => {
    const {nome, idade} = req.body; //corpo de requisicao

    res.json({
        transacao : '12-48jr2oj32jr32'
    })
})

//craindo e acessando objeto
/* const user = {
    nome: "fjp",
    idade: 53,
    curso: "CC"
}
console.log('Nome', user.nome);
*/

//Eliminando erros como nulo ou inexistente
//craindo e acessando objeto
/* const user = {
    nome: "fjp",
    idade: 53,
    curso: "CC"
}
console.log('Nome', user?.nome);
*/

//validacao
console.log('idade ', user?.curso ?? "Nao foi recebido um valor valido");
console.log('idade ', user?.curso || "Nao foi recebido um valor valido");