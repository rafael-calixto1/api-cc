const express = require('express');
const fs = require('fs');
const axios = require('axios'); 
const app = express();
const port = 3000;

app.use(express.json());

//Funcao para ler os dados de 'db.funcionarios.json'
function fetchDataFuncionarios() {
    try {
        const rawData = fs.readFileSync('db.funcionarios.json', 'utf8');
        return JSON.parse(rawData);
    } catch (err) {
        return { funcionarios: [] };
    }
}

// Funcao para ler os dados de 'db.empresas.json'
function fetchDataEmpresas() {
    try {
        const rawData = fs.readFileSync('db.empresas.json', 'utf8');
        return JSON.parse(rawData);
    } catch (err) {
        return { empresas: [] };
    }
}

// Funcao para salvar os dados de 'db.funcionarios.json'
function saveDataFuncionarios(data) {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync('db.funcionarios.json', jsonData, 'utf8');
}
// Funcao para ler os dados de 'db.empresas.json'
function saveDataEmpresas(data) {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync('db.empresas.json', jsonData, 'utf8');
}

// Rota para obter uma lista com todos os funcionarios
app.get('/api/funcionarios', (req, res) => {
    const funcionarios = fetchDataFuncionarios().funcionarios;
    res.json(funcionarios);
});

// Rota para obter um funcionario especifico atraves do ID
app.get('/api/funcionarios/:idfuncionario', (req, res) => {
    const dados = fetchDataFuncionarios().funcionarios;
    const id = req.params.idfuncionario;
    const funcionario = dados.find(item => item.id === parseInt(id));
    if (funcionario) {
        res.json(funcionario);
    } else {
        res.status(404).send('Funcionario não encontrado');
    }
});

// Rota para obter informacoes do endereco do funcionario atraves do ID e ddde uma consulta externa no VIACEP
app.get('/api/funcionarios/:idfuncionario/endereco', async (req, res) => {
    try {
        const dados = fetchDataFuncionarios().funcionarios;
        const id = req.params.idfuncionario;
        const funcionario = dados.find(item => item.id === parseInt(id));

        if (!funcionario || !funcionario.cep) {
            res.status(404).send('Funcionario não encontrado ou não possui CEP.');
            return;
        }

        // Faz uma requisicao ao viacep.com usando o cep do funcionario 
        const cep = funcionario.cep;
        const viacepResponse = await axios.get(`http://viacep.com.br/ws/${cep}/json/`);
        res.json(viacepResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar o endereço do funcionario.');
    }
});

// rota para adicionar um novo funcionario
app.post('/api/funcionarios', express.json(), (req, res) => {
    const dados = fetchDataFuncionarios();
    const novoDado = req.body;
    const funcionarios = dados.funcionarios;
    novoDado.id = funcionarios.length > 0 ? Math.max(...funcionarios.map(f => f.id)) + 1 : 1;
    funcionarios.push(novoDado);
    saveDataFuncionarios(dados);
    res.json(novoDado);
});

// Atualizar funcionarios atraves de seu ID
app.put('/api/funcionarios/:id', express.json(), (req, res) => {
    const dados = fetchDataFuncionarios();
    const id = req.params.id;
    const funcionarios = dados.funcionarios;
    const index = funcionarios.findIndex(item => item.id === parseInt(id));

    if (index !== -1) {
        funcionarios[index] = req.body;
        saveDataFuncionarios(dados);
        res.json(funcionarios[index]);
    } else {
        res.status(404).send('Funcionario não encontrado');
    }
    
});

//############### EMPRESAS ###################

//obter empresas lista de empresas
app.get('/api/empresas', (req, res) => {
    const empresas = fetchDataEmpresas().empresas;
    res.json(empresas);
});

//Obter uma unica empresa
app.get('/api/empresas/:idempresa', (req, res) => {
    const dados = fetchDataEmpresas().empresas;
    const id = req.params.idempresa;
    const empresa = dados.find(item => item.id === parseInt(id));
    if (empresa) {
        res.json(empresa);
    } else {
        res.status(404).send('Empresa não encontrada');
    }
});


//obter funcionarios vinculados a empresa 
app.get('/api/empresas/:idEmpresa/funcionarios', (req, res) => {
    const idEmpresa = req.params.idEmpresa;
    const funcionarios = fetchDataFuncionarios().funcionarios;
    
    // filtrar funcionarios por idEmpresa
    const funcionariosDaEmpresa = funcionarios.filter(funcionario => funcionario.idEmpresa == idEmpresa);

    if (funcionariosDaEmpresa.length > 0) {
        res.json(funcionariosDaEmpresa);
    } else {
        res.status(404).send('Nenhum funcionario encontrado para esta empresa.');
    }
});


// CNPJ JA


const apiKey = 'e0a9cc03-3b9a-47f8-af1c-886b472dd1bd-b7d6e4a0-cb4f-41a1-a51d-14c277d58ace';

// Rota para obter a informacao sobre uma empresa através do ID
app.get('/api/empresas/:idempresa/informacoes', async (req, res) => {
    try {
        const dados = fetchDataEmpresas().empresas;
        const id = req.params.idempresa;
        const empresa = dados.find(item => item.id === parseInt(id));

        if (!empresa || !empresa.cnpj) {
            res.status(404).send('Empresa não encontrada ou não possui CNPJ.');
            return;
        }

        // Fazer uma requisicao ao CNPJ J zusando o CNPJ da empresa
        const cnpj = empresa.cnpj;
        const config = {
            method: 'get',
            url: `https://api.cnpja.com/office/${cnpj}`,
            headers: {
                'Authorization': apiKey
            }
        };

        const cnpjResponse = await axios(config);
        res.json(cnpjResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar informações da empresa.');
    }
});


// ligar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
