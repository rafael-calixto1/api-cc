const express = require('express');
const fs = require('fs');
const axios = require('axios'); 
const app = express();
const PORT = process.env.PORT || 3030;
app.use(express.json());

//Funcao para ler os dados de 'db.funcionarios.json'
function fetchDataFuncionarios() {
    try {
        const rawData = fs.readFileSync('db.funcionarios.json', 'utf8');
        return JSON.parse(rawData);
    } catch (err) {
        console.error('Erro durante a leitura ou na analise dos dados dos funcionarios ', err);
        return { funcionarios: [] };
    }
}

// Funcao para ler os dados de 'db.empresas.json'
function fetchDataEmpresas() {
    try {
        const rawData = fs.readFileSync('db.empresas.json', 'utf8');
        return JSON.parse(rawData);
    } catch (err) {
        console.error('Erro durante a leitura ou na analise dos dados das empresas ', err);
        return { empresas: [] };
    }
}

// Funcao para salvar os dados de 'db.funcionarios.json'
function saveDataFuncionarios(data) {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync('db.funcionarios.json', jsonData, 'utf8');
}
// Funcao para salvar os dados de 'db.empresas.json'
function saveDataEmpresas(data) {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync('db.empresas.json', jsonData, 'utf8');
}

// Rota para obter uma lista com todos os funcionarios
// Rota para obter a lista de funcionarios
app.get('/api/funcionarios', (req, res) => {
    try {
        const funcionarios = fetchDataFuncionarios().funcionarios;
        res.json(funcionarios);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao obter a lista de funcionarios.');
    }
});



// Rota para obter a lista de funcionarios desempregados
app.get('/api/funcionarios/desempregados', (req, res) => {
    try {
        const funcionarios = fetchDataFuncionarios().funcionarios;
        const desempregados = funcionarios.filter(funcionario => funcionario.idEmpresa === 0);
        res.json(desempregados);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao obter a lista de funcionarios desempregados.'); 
    }
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


// Rota para obter informacoes do endereco do funcionario atraves do ID e de uma consulta externa no VIACEP
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

// Rota para adicionar um novo funcionario
app.post('/api/funcionarios', express.json(), (req, res) => {
    try {
        const dados = fetchDataFuncionarios();
        const novoDado = {
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            cpf: req.body.cpf,
            cargo: req.body.cargo || 'desempregado',
            empresa: req.body.empresa,
            cep: req.body.cep,
            idEmpresa: req.body.idEmpresa || 0
        };

        if (!novoDado.nome || !novoDado.cpf || !novoDado.cep) {
            throw new Error('O nome, CPF e CEP do funcionario são obrigatórios.');
        }

        const funcionarios = dados.funcionarios;
        novoDado.id = funcionarios.length > 0 ? Math.max(...funcionarios.map(f => f.id)) + 1 : 1;

        funcionarios.push(novoDado);
        saveDataFuncionarios(dados);
        res.status(201).json(novoDado); //Funcionario criado com sucesso
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message); // Erro ao criar um novo funcionario
    }
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
// Rota para obter a lista de empresas
app.get('/api/empresas', (req, res) => {
    try {
        const empresas = fetchDataEmpresas().empresas;
        res.json(empresas);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao obter a lista de empresas.'); //Erro interno no servidor
    }
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

// Rota para adicionar uma nova empresa
app.post('/api/empresas', express.json(), (req, res) => {
    try {
        const dados = fetchDataEmpresas();
        const novaEmpresa = {
            nome: req.body.nome,
            cnpj: req.body.cnpj
        };

        if (!novaEmpresa.nome || !novaEmpresa.cnpj) {
            throw new Error('O nome e o CNPJ da empresa são obrigatórios.');
        }

        const empresas = dados.empresas;

         // Gerar id para a empresa
        novaEmpresa.id = empresas.length > 0 ? Math.max(...empresas.map(e => e.id)) + 1 : 1;

        empresas.push(novaEmpresa);
        saveDataEmpresas(dados);

        res.status(201).json(novaEmpresa); // Criado com sucesso
    } catch (error) {
        console.error(error);

        // Handle specific error cases
        if (error.message === 'O nome e o CNPJ da empresa são obrigatórios.') {
            res.status(400).send(error.message);  // Má requisição
        } else {
            res.status(500).send('Erro ao adicionar a nova empresa.'); // Erro interno do servidor
        }
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

        // Fazer uma requisicao ao CNPJA usando o CNPJ da empresa
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



//###################CONTABILIZADOR DE PASSAGENS################################
app.post('/api/calculo', async (req, res) => {
    try {
        // Checa se idempresa e idfuncionario estao no corpo de requisicao
        if (!req.body.idempresa || !req.body.idfuncionario) {
            res.status(400).send('idempresa e idfuncionario sao necessarios no corpo de requisicao.');
            return;
        }

        const dados = fetchDataEmpresas().empresas;
        const idEmpresa = req.body.idempresa;
        const idFuncionario = req.body.idfuncionario;

        const empresa = dados.find(item => item.id === parseInt(idEmpresa));

        if (!empresa || !empresa.cnpj) {
            res.status(404).send('Empresa não encontrada ou não possui CNPJ.');
            return;
        }

        // Extraitr o CEP do funcionario no banco de dados
        const funcionarioDatabase = fetchDataFuncionarios();
        const funcionario = funcionarioDatabase.funcionarios.find(item => item.id === parseInt(idFuncionario));

        if (!funcionario || !funcionario.cep) {
            res.status(404).send('Funcionario não encontrado ou não possui CEP.');
            return;
        }

        // Fazer uma requisicao ao CNPJA usando o CNPJ da empresa
        const cnpj = empresa.cnpj;
        const config = {
            method: 'get',
            url: `https://api.cnpja.com/office/${cnpj}`,
            headers: {
                'Authorization': apiKey
            }
        };
        const cnpjResponse = await axios(config);

        // Extrair a cidade da empresa
        const cidadeEmpresa = cnpjResponse.data.address.city;
        //Extrair estado da empresa 
        const estadoEmpresa = cnpjResponse.data.address.state;

        // Pega o CEP do funcionario e usa para fazer uma solicitação ao ViaCEP
        const cepFuncionario = funcionario.cep;
        const viaCepResponse = await axios.get(`http://viacep.com.br/ws/${cepFuncionario}/json/`);
        const cidadeFuncionario = viaCepResponse.data.localidade;

        // Pega o estado do funcionario
        const estadoFuncionario = viaCepResponse.data.uf;

        // Checa se as cidades sao a mesma
        const isSameCity = cidadeEmpresa === cidadeFuncionario;
        //Checa se sao os mesmos estados
       const isSameState = estadoEmpresa === estadoFuncionario;

        // Define uma mensagem baseado nas cidades da enpresa e do funcionario
        let message = 'Funcionario e empresa se situam em estados diferentes, logo a contratacao eh inviavel';
        if (isSameCity) {
            message = 'cidade do funcionario e empresa coincidem, logo devera pagar apenas uma passagem';
        }else if(isSameState){
            message = 'Estado do funcionario e da empresa coincidem, logo devera pagar pelo menos uma passagem';
        }
       

        res.json({
            cidadeDaEmpresa: cidadeEmpresa,
            cidadeDoFuncionario: cidadeFuncionario,
            message: message
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar informações da empresa ou funcionário.');
    }
});


// ligar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
