import { getLivrosDB } from '@/bd/usecases/livroUseCases';
import Link from 'next/link';

export const revalidate = 60; // revalida a cada 60 segundos

export default async function Home() {

  const livros = await getLivrosDB();
  return (
    <div style={{ padding: '20px' }}>
      <div className="row">

        {livros.length > 0 && (

        livros.map(objeto => (

            <div className="col-sm-3" key={objeto.codigo}>
              <div className="card mb-3 text-center">
                <div className="card-header">
                  {objeto.nome}
                </div>
                <div className="card-body ">
                  <h5 className="card-title">{objeto.nome}</h5>              
                  <p className="card-text"><small className="text-muted">Ano: {objeto.ano}</small></p>
                  <p className="card-text"><small className="text-muted">Genero: {objeto.genero_nome}</small></p>  
                </div>
                <div class="card-footer text-muted">                  
                  <Link type="button" className="btn btn-secondary" href={`/${objeto.codigo}/detalhe`}>Detalhes</Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}