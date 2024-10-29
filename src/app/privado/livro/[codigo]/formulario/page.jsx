import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getGenerosDB } from '@/bd/usecases/generoUseCases';
import { getLivroPorCodigoDB, addLivroDB, updateLivroDB } from '@/bd/usecases/livroUseCases';
import Loading from '@/app/componentes/comuns/Loading';
import CampoEntradaFloating from '@/app/componentes/comuns/CamposEntradaFloating';
import CampoFormSelect from '@/app/componentes/comuns/CamposFormSelect';
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
                                    <CampoEntradaFloating id="txtCodigo"
                                        value={livro.codigo} tipo="text"
                                        label="Código" readOnly={true}
                                        name="codigo" />
                                </div>
                                <div>
                                    <CampoEntradaFloating id="txtNome"
                                        value={livro.nome} tipo="text"
                                        label="Nome" required={true} name="nome" />
                                </div>
                                <div>
                                    <CampoEntradaFloating id="txtAno"
                                        value={livro.ano} tipo="number"
                                        label="Ano" required={true} name="ano" />
                                </div>
                                <div>
                                    <CampoEntradaFloating id="txtAutor"
                                        value={livro.autor} tipo="text"
                                        label="Autor" required={true} name="autor" />
                                </div>
                                <div>
                                <CampoFormSelect id="selectGenero"
                                    value={livro.genero} label="Genero" required="true"
                                    name="genero">
                                    <option disabled="true" value="">
                                        Selecione a categoria
                                    </option>
                                    {
                                        generos.map((gen) => (
                                            <option key={gen.codigo}
                                                value={gen.codigo}>
                                                {gen.nome}
                                            </option>
                                        ))
                                    }
                                </CampoFormSelect>
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