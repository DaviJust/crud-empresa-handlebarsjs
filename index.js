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
app.post('/empresa/insertEmpresa', (req,res)=>{
    const { CNPJ, nome,email,telefone,local} = req.body
    
    const sql = `INSERT INTO empresa (CNPJ, nome, email, local, telefone) VALUES ( '${CNPJ}' ,'${nome}','${email}','${telefone}','${local}' )`
    conn.query(sql, function(err){
        if (err){
            console.log(err)
        }

        res.redirect('/')
        console.log("Cadastro com sucesso")
})
})

// consulta geral
app.get('/empresas', (req,res) => {
    const sql = 'SELECT * FROM empresa'

    conn.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }
        const listar = data

        console.log(listar)

        res.render('empresas', { layout: false, listar})
    })
})


// consuta um registro pelo id (empresa.handlebars)
app.get('/empresa/:CNPJ', (req,res) => {
    const CNPJ = req.params.CNPJ

    const sql = `SELECT * FROM empresa WHERE CNPJ = ${CNPJ}`

    conn.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }
        const listarEmpresa = data[0]
        res.render('empresa',{ layout:false, listarEmpresa })
    })
})

//ROTA PARA MOSTRAR OS DADOS QUE SERAO EDITADOS  NO  REGISTRO (SEM A VIEW)

app.get('/empresa/edit/:id', (req, res) =>{
    const id = req.params.id

    const sql = `SELECT * FROM empresa WHERE id = ${id}`

    conn.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }
    
        const empresa = data[0]
        res.render('edit', {layout: false, empresa})
    })
})

//ROTA QUE EDITA OS DADOS

app.post('/alterar/updateclient', (req,res) => {

    const id = req.body.id
    const nome = req.body.nome
    const email = req.body.email
    const telefone = req.body.telefone
    const idade = req.body.idade
    const sql = `UPDATE empresa SET nome = '${nome}', email = '${email}', telefone = '${telefone}', idade= '${idade}' WHERE id = '${id}' `

    conn.query(sql, function(err){
        if (err){
            console.log(err)
        }

        res.redirect(`/empresa/${id}`)
        console.log("Alterado com sucesso")
})
})

//Remover empresa

app.get('/empresa/remove/:id', (req,res) =>{
    const id =req.params.id

    const sql = `DELETE FROM empresa WHERE id = ${id} `

    conn.query(sql, function(err){
        if(err){
            console.log(err)
            return 
        }
        
        res.redirect('/empresas')
        console.log("excluido com sucesso")

    })
})

//rota de busca (busc) que enviar para view produto produto.handlebars
app.post('/busc/', (req, res) => {
    const id = req.body.id
    
    const sql = `SELECT * FROM empresa WHERE id = ${id}`

    conn.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }

        const listarempresa = data[0]
        res.render('empresa', {  layout: false, listarempresa } )

    })
})
    
    


// conexao banco de dados
const conn = mysql.createConnection({
    host: 'localhost',    
    port: '3306',
    user:'root',
    password: '',
    database: 'infancia_girassol'

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
