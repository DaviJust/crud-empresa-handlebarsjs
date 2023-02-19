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


app.use(
    express.urlencoded({
        extended: true
        
}) 
)


//rotas

//rota inicio
app.get('/', (req, res) => {
    res.render('home', { layout: false })

})

//rota para a busca

app.get('/busca', (req, res) => {
    res.render('busca', { layout: false })

})

//rota de busca (busc) que enviar para view produto produto.handlebars
app.post('/buscar/', (req, res) => {
    
    const {busca} = req.body
    
    const sql = `SELECT * FROM empresa WHERE CNPJ = '${busca}' OR nome LIKE '%${busca}%'`
 
    conn.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }

        const listarEmpresa = data[0]
        res.render('empresa', {  layout: false, listarEmpresa } )

    })
})

// inserir dados (rota)
app.post('/empresa/insertEmpresa', (req,res)=>{
    const { CNPJ, nome,email,telefone,local} = req.body
    
    const sql = `INSERT INTO empresa (CNPJ, nome, email, local, telefone) VALUES ( '${CNPJ}' ,'${nome}','${email}','${local}','${telefone}' )`
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
 

        res.render('empresas', { layout: false, listar})
    })
})


// consuta um registro pelo id (empresa.handlebars)
app.get('/empresa/:CNPJ', (req,res) => {
    const CNPJ = req.params.CNPJ

    const sql = `SELECT * FROM empresa WHERE CNPJ = '${CNPJ}'`

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

app.get('/empresa/edit/:CNPJ', (req, res) =>{
    const CNPJ = req.params.CNPJ 

    const sql = `SELECT * FROM empresa WHERE CNPJ = '${CNPJ}'`

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

app.post('/alterar/updateEmpresa', (req,res) => {

    
    const { CNPJ, nome,email,telefone,local} = req.body
    

    const sql = `UPDATE empresa SET nome = '${nome}', email = '${email}', telefone = '${telefone}', local= '${local}' WHERE CNPJ = '${CNPJ}' `

    
    conn.query(sql, function(err){
        if (err){
            console.log(err)
        }

        console.log("Alterado com sucesso")
        res.redirect(`/empresa/${CNPJ}`)
})
})

//Remover empresa

app.get('/empresa/remove/:CNPJ', (req,res) =>{
    const CNPJ =req.params.CNPJ

    const sql = `DELETE FROM empresa WHERE CNPJ = '${CNPJ}' `

    conn.query(sql, function(err){
        if(err){
            console.log(err)
            return 
        }
        
        res.redirect('/empresas')
        console.log("excluido com sucesso")

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
