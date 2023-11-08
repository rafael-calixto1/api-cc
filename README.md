**ENDPOINT localhost:3000/api/funcionarios**

GET

**SEM PARAMETROS NEM CORPO DE REQUISIÇÃO

POST

**REQUSIÇÃO POR CORPO DE REQUISIÇÃO

Exemplo:

{
   “nome” : “nome”,
    “sobrenome” : “sobrenome”,
    “cpf” : “cpf”,
    “cargo” : “cargo”,
    “empresa” : “empresa”,
    “cep” : 777777777
    “idempresa” : 7
}

PUT

**REQUSIÇÃO POR PARAMETROS E POR CORPO DE REQUISIÇÃO

{
   “nome” : “nome”,
    “sobrenome” : “sobrenome”,
    “cpf” : “cpf”,
    “cargo” : “cargo”,
    “empresa” : “empresa”,
    “cep” : 777777777,
    “idempresa” : 7
}

**ENDPOINT localhost:3000/api/funcionarios/:idfuncionario**

GET

**REQUSIÇÃO POR PARAMETROS

**ENDPOINT localhost:3000/api/funcionarios/:idfuncionario/endereco**

GET

**REQUSIÇÃO POR PARAMETROS

**ENDPOINT localhost:3000/api/funcionarios/desempregados**

GET

**REQUSIÇÃO POR PARAMETROS

**ENDPOINT localhost:3000/api/empresas**

GET

**SEM PARAMETROS NEM CORPO DE REQUISIÇÃO

POST

**REQUISIÇÃO POR CORPO DE REQUISIÇÃO

Exemplo:

{
     "nome" : "BRAZ CUBAS",
    "cnpj" : "52556412000106"
}

**ENDPOINT localhost:3000/api/empresas/:idempresa**

GET

**REQUISIÇÃO POR PARAMETROS

**ENDPOINT localhost:3000/api/empresas/:idempresa/funcionarios**

GET

**REQUISIÇÃO POR PARAMETROS

**ENDPOINT localhost:3000/api/empresas/:idempresa/informacoes**

GET

**REQUISIÇÃO POR PARAMETROS

**ENDPOINT localhost:3000/api/calculo**

GET

**REQUISIÇÃO POR CORPO DE REQUISIÇÃO

Ecemplo: 

{
     "nome" : "BRAZ CUBAS",
    "cnpj" : "52556412000106"
}
