const express = require('express');

const app = express(); 
const port = 3000; // define o valor para uma porta

app.use(express.json()); //permite utilizar json no body das requisições


//associa o express à porta para receber requisições na porta 3000
//arrow function
app.listen(port, () =>{
    const num1 = 45;
    const num2 = 7;
    console.log(`Iniciando o servidor na porta:${port}`);
})

app.get('/', (req, res) => {
    res.json({nome: "Gilmar", idade: 27})
})
app.get('/soma', (req, res) => {
    res.json({numeros: soma(num1,num2)})
})
app.get('/sub', (req, res) => {
    res.json({numeros: sub(num1,num2)})
})
app.get('/operacoes', (req, res) => {
    res.json({numeros: sub(num1,num2)})
})
function soma(a,b){
    a=3;
    b=1;
    const resultado = a+b;
    return resultado;
}
function sub(a,b){
    a=3;
    b=1;
    const resultado = a-b;
    return resultado;



    //requisicao do usuario
    app.get('/api', (req, res) =>{
        
        const { num1, num2} = req.query;
        //const num1 = Number(req.query.num1);
        //const num2 = Number(req.query.num2)
        res.json({
            soma: soma(Number(num1), Number(num2)),
            sub: num2
        })
    })
}