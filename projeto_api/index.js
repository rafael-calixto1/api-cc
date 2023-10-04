const express = require('express');
const fs = require('fs');
const app = express(); 
const port = 3000; // define o valor para uma porta


app.use(express.json()); //permite utilizar json no body das requisições


// Função para puxar dados do db.json
function fetchData() {
    const rawData = fs.readFileSync('db.json');
    return JSON.parse(rawData);
}
function saveData(data){
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync('db.json', jsonData);
} 

// Rota GET para obter dados
app.get('/api/dados', (req, res) => {
    const dados = fetchData();
    res.json(dados);
});


//API RestFul

//Busca por ID
app.get('/api/dados/:id', (req, res) => {
    const dados = fetchData();
    const id = req.params.id;
    const dado = dados.find(item => item.id === parseInt(id));
    if (dado) {
        res.json(dado);
    } else {
        res.status(404).send('Dado não encontrado');
    }
});
// Rota POST para adicionar novo dado
app.post('/api/dados', express.json(), (req, res) => {
    const dados = fetchData();
    const novoDado = req.body;
    dados.push(novoDado);
    saveData(dados);
    res.json(novoDado);
});

// Rota PUT para atualizar dado existente por ID
app.put('/api/dados/:id', express.json(), (req, res) => {
    const dados = fetchData();
    const id = req.params.id;
    const index = dados.findIndex(item => item.id === parseInt(id));

    if (index !== -1) {
        dados[index] = req.body;
        saveData(dados);
        res.json(dados[index]);
    } else {
        res.status(404).send('Dado não encontrado');
    }
});

// Rota DELETE para excluir dado por ID
app.delete('/api/dados/:id', (req, res) => {
    const dados = fetchData();
    const id = req.params.id;
    const index = dados.findIndex(item => item.id === parseInt(id));

    if (index !== -1) {
        const deletedData = dados.splice(index, 1);
        saveData(dados);
        res.json(deletedData[0]);
    } else {
        res.status(404).send('Dado não encontrado');
    }
});


// Inicia o servidor na porta especificada
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${3000}`);
});
