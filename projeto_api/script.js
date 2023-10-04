function puxardados (){
    
}

const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

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
app.get('/api/funcionarios', (req, res) => {
    const dados = fetchData();
    res.json(dados);
});


//API RestFul

//Busca por ID
app.get('/api/funcionarios/:id', (req, res) => {
    const dados = fetchData();
    const id = req.params.id;
    const dado = dados.find(item => item.id === parseInt(id));
    if (dado) {
        res.json(dado);
    } else {
        res.status(404).send('Dado não encontrado');
    }
});


// Inicia o servidor na porta especificada
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${3000}`);
});
