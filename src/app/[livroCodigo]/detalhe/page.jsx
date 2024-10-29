import { notFound } from 'next/navigation';
import { getLivroPorCodigoDB } from '@/bd/usecases/livroUseCases';
import Loading from '@/app/componentes/comuns/Loading';
import { Suspense } from 'react';
import Link from 'next/link';

const LivroDetalhePage = async ({ params }) => {

    let livro = null;
    try {
        livro = await getLivroPorCodigoDB(params.livroCodigo);
    } catch (err) {
        return notFound();
    }

    return (
        <Suspense fallback={<Loading />}>
            <div style={{ padding: '20px' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-sm-3" key={livro.codigo}>
                            <div className="card mb-3 text-center">
                                <div className="card-header">
                                    {livro.nome}
                                </div>
                                <div className="card-body ">
                                    <p className="card-text">{livro.nome}</p>
                                    <p className="card-text"><small className="text-muted">Ano: {livro.ano}</small></p>
                                    <p className="card-text"><small className="text-muted">Autor: {livro.autor}</small></p>
                                    <p className="card-text"><small className="text-muted">Genero: {livro.genero_nome}</small></p>
                                </div>
                                <div class="card-footer text-muted">
                                    <Link className="btn btn-success" href={'/'}> Voltar</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    )
};

export default LivroDetalhePage;