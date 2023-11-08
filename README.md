# API Documentation

Informacoes sobre os Endpoints

## Funcionarios

### `GET /api/funcionarios`

- Descricao: Traz uma lista com todos os funcionarios
- Parameters: nenhum.
- Request Body: nenhum.

### `POST /api/funcionarios`

- Descricao: Cria um novo funcionario
- Tipo de Requisicao
- Request Body Example:
```json
{
   "nome": "nome",
   "sobrenome": "sobrenome",
   "cpf": "cpf",
   "cargo": "cargo",
   "empresa": "empresa",
   "cep": 777777777,
   "idempresa": 7
}
```

### `PUT /api/funcionarios`

- Descricao: atualiza um funcionario
- Tipo de Requisicao
- Request Body Example:
```json
{
   “nome” : “nome”,
    “sobrenome” : “sobrenome”,
    “cpf” : “cpf”,
    “cargo” : “cargo”,
    “empresa” : “empresa”,
    “cep” : 777777777,
    “idempresa” : 7
}
```

### `GET /api/funcionarios/desempregados`
- Descricao: Traz uma lista com todas as pessoas que não possuem empresa vinculada
- Parameters: nenhum.
- Request Body: nenhum.



### `GET /api/funcionarios/:idfuncionario/endereco`
- Descricao: traz as informações do CEP da pessoa de acordo com o ID
- Requisicao por parametros

  
  ## Empresas

### `GET /api/empresas`
- Descricao: Cria uma lista com as empresas
- Parameters: nenhum.
- Request Body: nenhum.

### `GET /api/empresas/:idempresa`
- Descricao: Pega uma unica empresa





