//imports
const express = require('express')
const exphbs = require('express-handlebars')
const mysql = require('mysql')
const port = 3000

//express
const app = express()

//configurar o handlebars
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

//rotas

//rota inicio
app.get('/', (req, res) => {
    res.render('home', { layout: false })

})

//rota para a busca

app.get('/busca', (req, res) => {
    res.render('busca', { layout: false })

})

app.use(
    express.urlencoded({
        extended: true
        
}) 
)

// inserir dados (rota)
app.post('/client/insertclient', (req,res)=>{
    const nome = req.body.nome
    const email = req.body.email
    const telefone = req.body.telefone
    const idade = req.body.idade
    const sql = `INSERT INTO cliente (nome, email, telefone, idade) VALUES ( '${nome}','${email}','${telefone}','${idade}' )`
    conn.query(sql, function(err){
        if (err){
            console.log(err)
        }

        res.redirect('/')
        console.log("Cadastro com sucesso")
})
})

// consulta geral
app.get('/clientes', (req,res) => {
    const sql = 'SELECT * FROM cliente'

    conn.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }
        const listar = data

        console.log(listar)

        res.render('clientes', { layout: false, listar})
    })
})


// consuta um registro pelo id (cliente.handlebars)
app.get('/cliente/:id', (req,res) => {
    const id = req.params.id

    const sql = `SELECT * FROM cliente WHERE id = ${id}`

    conn.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }
        const listarCliente = data[0]
        res.render('cliente',{ layout:false, listarCliente })
    })
})

//ROTA PARA MOSTRAR OS DADOS QUE SERAO EDITADOS  NO  REGISTRO (SEM A VIEW)

app.get('/cliente/edit/:id', (req, res) =>{
    const id = req.params.id

    const sql = `SELECT * FROM cliente WHERE id = ${id}`

    conn.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }
    
        const cliente = data[0]
        res.render('edit', {layout: false, cliente})
    })
})

//ROTA QUE EDITA OS DADOS

app.post('/alterar/updateclient', (req,res) => {

    const id = req.body.id
    const nome = req.body.nome
    const email = req.body.email
    const telefone = req.body.telefone
    const idade = req.body.idade
    const sql = `UPDATE cliente SET nome = '${nome}', email = '${email}', telefone = '${telefone}', idade= '${idade}' WHERE id = '${id}' `

    conn.query(sql, function(err){
        if (err){
            console.log(err)
        }

        res.redirect(`/cliente/${id}`)
        console.log("Alterado com sucesso")
})
})

//Remover cliente

app.get('/cliente/remove/:id', (req,res) =>{
    const id =req.params.id

    const sql = `DELETE FROM cliente WHERE id = ${id} `

    conn.query(sql, function(err){
        if(err){
            console.log(err)
            return 
        }
        
        res.redirect('/clientes')
        console.log("excluido com sucesso")

    })
})

//rota de busca (busc) que enviar para view produto produto.handlebars
app.post('/busc/', (req, res) => {
    const id = req.body.id
    
    const sql = `SELECT * FROM cliente WHERE id = ${id}`

    conn.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }

        const listarCliente = data[0]
        res.render('cliente', {  layout: false, listarCliente } )

    })
})
    
    


// conexao banco de dados
const conn = mysql.createConnection({
    host: 'localhost',    
    port: '3307',
    user:'root',
    password: '',
    database: 'projnode1'

})

conn.connect(function(err) {
    if(err){
        console.log(err)
    }

    console.log('Conectado com sucesso!')
    
})

// servidor
app.listen(port, () => {
    console.log(`App rodando ma porta ${port}`)
})
