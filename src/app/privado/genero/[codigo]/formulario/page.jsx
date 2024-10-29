import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getGeneroPorCodigoDB, updateGeneroDB, addGeneroDB } from '@/bd/usecases/generoUseCases';

const FormularioPage = async ({ params }) => {
    let genero = null;
    if (params.codigo == 0) {
        genero = { codigo: 0, nome: "" };
    } else {
        try {
            genero = await getGeneroPorCodigoDB(params.codigo);
        } catch (err) {
            return notFound();
        }
    }

    const salvarGenero = async (formData) => {
        'use server';
        const objeto = {
            codigo: formData.get('codigo'),
            nome: formData.get('nome')
        }
        try {
            if (objeto.codigo == 0) {
                await addGeneroDB(objeto)
            } else {
                await updateGeneroDB(objeto)
            }

        } catch (err) {
            throw new Error('Erro: ' + err);
        }
        revalidatePath('/privado/genero/');
        redirect('/privado/genero/');
    };

    return (
        <div>
            <div style={{ textAlign: 'center' }}>
                <h2>Genero</h2>
            </div>
            <form action={salvarGenero} >
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-6">
                            <div>
                                <label>Código</label>
                                <input type="number" defaultValue={genero.codigo}
                                    name="codigo" readOnly />
                            </div>
                            <div>
                                <label>Nome</label>
                                <input type="text" defaultValue={genero.nome}
                                    name="nome" required />
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
    )
};
export default FormularioPage;