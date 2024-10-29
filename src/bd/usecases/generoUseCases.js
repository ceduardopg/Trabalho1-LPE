const { pool } = require('../config');
const Genero = require('../entities/Genero');

const getGenerosDB = async () => {
    try {
        const { rows } = await pool.query(`SELECT * FROM generos ORDER BY nome`);
        return rows.map((genero) => new Genero(genero.codigo, genero.nome));
    } catch (err) {
        throw "Erro: " + err;
    }
}

const deleteGeneroDB = async (codigo) => {
    try {
        const results = await pool.query(`DELETE FROM generos
        WHERE codigo = $1`, [codigo]);
        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${codigo} para ser removido`;
        } else {
            return `Genero de código ${codigo} removida com sucesso!`;
        }
    } catch (err) {
        throw "Erro ao remover o genero: " + err;
    }
}

const addGeneroDB = async (objeto) => {
    try {
        const { nome } = objeto;
        await pool.query(`INSERT INTO generos (nome) VALUES ($1)`, [nome]);        
    } catch (err) {
        throw "Erro ao inserir o genero: " + err;
    }
}

const updateGeneroDB = async (objeto) => {
    try {
        const { codigo, nome } = objeto;        
        const results = await pool.query(`UPDATE generos set nome = $2
        WHERE codigo = $1`, [codigo, nome]);
        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${codigo} para ser alterado`;
        }
    } catch (err) {
        throw "Erro ao alterar o genero: " + err;
    }
}

const getGeneroPorCodigoDB = async (codigo) => {
    try {
        const results = await pool.query(`SELECT * FROM generos
        WHERE codigo = $1`, [codigo]);
        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${codigo}`;
        } else {
            const genero = results.rows[0];
            return new Genero(genero.codigo, genero.nome);
        }
    } catch (err) {
        throw "Erro ao recuperar o genero: " + err;
    }
}

module.exports = {
    getGenerosDB, deleteGeneroDB, addGeneroDB, updateGeneroDB, 
    getGeneroPorCodigoDB
}