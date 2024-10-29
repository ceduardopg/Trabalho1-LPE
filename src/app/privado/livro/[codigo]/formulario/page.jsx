import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getGenerosDB } from '@/bd/usecases/generoUseCases';
import { getLivroPorCodigoDB, addLivroDB, updateLivroDB } from '@/bd/usecases/livroUseCases';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Loading from '@/app/componentes/comuns/Loading';
import { Suspense } from 'react';


const FormularioPage = async ({ params }) => {

    const generos = await getGenerosDB();

    let livro = null;
    if (params.codigo == 0) {
        livro = {
            codigo: 0,
            nome: "",
            ano: "",
            autor: "",
            genero: ""
        };
    } else {
        try {
            livro = await getLivroPorCodigoDB(params.codigo);
        } catch (err) {
            return notFound();
        }
    }

    const salvarLivro = async (formData) => {
        'use server';

        const objeto = {
            codigo: formData.get('codigo'),
            nome: formData.get('nome'),
            ano: formData.get('ano'),
            autor: formData.get('autor'),
            genero: formData.get('genero')
        }
        try {
            if (objeto.codigo == 0) {
                await addLivroDB(objeto)
            } else {
                await updateLivroDB(objeto)
            }

        } catch (err) {
            throw new Error('Erro: ' + err);
        }
        revalidatePath('/privado/livro/');
        redirect('/privado/livro/');

    };

    return (
        <Suspense fallback={<Loading />}>
            <div >
                <div style={{ textAlign: 'center' }}>
                    <h2>Livro</h2>
                </div>
                <form action={salvarLivro} >
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-12 col-md-6">
                                <div>
                                    <FloatingLabel controlId="campoCodigo"
                                        label="Código" className="mb-3">
                                        <Form.Control type="number"
                                            defaultValue={livro.codigo} readOnly
                                            name="codigo" />
                                    </FloatingLabel>
                                </div>
                                <div>
                                    <FloatingLabel controlId="campoNome"
                                        label="Nome" className="mb-3">
                                        <Form.Control type="text"
                                            defaultValue={livro.nome} required
                                            name="nome" />
                                    </FloatingLabel>
                                </div>
                                <div>
                                    <FloatingLabel controlId="campoAno"
                                        label="Ano" className="mb-3">
                                        <Form.Control type="number"
                                            defaultValue={livro.ano} required
                                            name="ano"/>
                                    </FloatingLabel>
                                </div>
                                <div>
                                    <FloatingLabel controlId="campoAutor"
                                        label="Autor" className="mb-3">
                                        <Form.Control type="text"
                                            defaultValue={livro.autor} required
                                            name="autor" />
                                    </FloatingLabel>
                                </div>
                                <div>
                                    <FloatingLabel controlId="selectGenero"
                                        label="Genero" className="mb-3">
                                        <Form.Select
                                            defaultValue={livro.genero} required
                                            name="genero">
                                            <option disabled="true" value="">
                                                Selecione o genero
                                            </option>
                                            {
                                                generos.map((gen) => (
                                                    <option key={gen.codigo}
                                                        value={gen.codigo}>
                                                        {gen.nome}
                                                    </option>
                                                ))
                                            }
                                        </Form.Select>
                                    </FloatingLabel>
                                </div>
                                <div className="form-group text-center mt-3">
                                    <button type="submit" className="btn btn-success">
                                        Salvar <i className="bi bi-save"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Suspense>
    )
}

export default FormularioPage;