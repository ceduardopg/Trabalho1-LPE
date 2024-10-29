const { pool } = require('../config');
const Livro = require('../entities/Livro')

const getLivrosDB = async () => {
    try {
        const { rows } = await pool.query(`select l.codigo as codigo, 
            l.nome as nome, l.ano as ano, 
            l.autor as autor,  
            l.genero as genero, g.nome as genero_nome
            from livros l
            join generos g on l.genero = g.codigo
            order by l.nome`);
        return rows.map((livro) =>
            new Livro(livro.codigo, livro.nome, livro.ano,
                livro.autor, livro.genero, livro.genero_nome));
    } catch (err) {
        throw "Erro : " + err;
    }
}

const addLivroDB = async (objeto) => {
    try {
        const { nome, ano, autor, genero} = objeto;
        await pool.query(`insert into livros (nome, ano, autor, genero)
        VALUES ($1, $2, $3, $4) `,
            [nome, ano, autor, genero]);
    } catch (err) {
        throw "Erro ao inserir o livro: " + err;
    }
}

const updateLivroDB = async (objeto) => {
    try {
        const { codigo, nome, ano, autor, genero} = objeto;
        const results = await pool.query(`UPDATE livros SET nome = $2,
                ano = $3, autor = $4, genero = $5 WHERE codigo = $1 `,
            [codigo, nome, ano, autor, genero]);
        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${codigo} para ser alterado`;
        }
    } catch (err) {
        throw "Erro ao alterar o livro: " + err;
    }
}

const deleteLivroDB = async (codigo) => {
    try {
        const results = await pool.query(`DELETE FROM livros where codigo = $1`,
            [codigo]);
        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${codigo} para ser removido`;
        } else {
            return "Livro removido com sucesso";
        }
    } catch (err) {
        throw "Erro ao remover o livro: " + err;
    }
}

const getLivroPorCodigoDB = async (codigo) => {
    try {
        const results = await pool.query(`select l.codigo as codigo, 
            l.nome as nome, l.ano as ano, 
            l.autor as autor,  
            l.genero as genero, g.nome as genero_nome
            from livros l
            join generos g on l.genero = g.codigo
            WHERE l.codigo = $1`, [codigo]);
        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${codigo}`;
        } else {
            const livro = results.rows[0];
            return new Livro(livro.codigo, livro.nome, livro.ano,
                livro.autor, livro.genero, livro.genero_nome);
        }
    } catch (err) {
        throw "Erro ao recuperar o livro: " + err;
    }
}

module.exports = {
    getLivrosDB, addLivroDB, updateLivroDB, deleteLivroDB, getLivroPorCodigoDB
}