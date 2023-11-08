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
