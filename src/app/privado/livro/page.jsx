import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import { getLivrosDB, deleteLivroDB } from '@/bd/usecases/livroUseCases';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Suspense } from 'react';
import Loading from '@/app/componentes/comuns/Loading';
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";

const deleteLivro = async (codigo) => {
    'use server'
    try {
        await deleteLivroDB(codigo);
    } catch (err) {
        console.log(err);
        throw new Error('Erro: ' + err);
    }
    revalidatePath('/privado/livro/');
    redirect('/privado/livro/');
};

export default async function Livro() {

    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    const livros = await getLivrosDB();

    return (
        <Suspense fallback={<Loading />}>
            <div style={{ padding: '20px' }}>
                <h1>Livros</h1>
                <Link href={`/privado/livro/${0}/formulario`}
                    className="btn btn-primary">
                    <i className="bi bi-file-earmark-plus"></i> Novo
                </Link>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>Ações</th>
                            <th>Código</th>
                            <th>Titulo</th>
                            <th>Ano</th>
                            <th>Autor</th>
                            <th>Genero</th>
                        </tr>
                    </thead>
                    <tbody>
                        {livros.map((livro) => (
                            <tr key={livro.codigo}>
                                <td align="center">
                                    <Link className="btn btn-info"
                                        href={`/privado/livro/${livro.codigo}/formulario`}>
                                        <i className="bi bi-pencil-square"></i>
                                    </Link>
                                    {
                                        session?.user?.tipo === 'A' &&
                                        <form action={deleteLivro.bind(null, livro.codigo)} className="d-inline">
                                            <Button variant="danger" type='submit'>
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </form>
                                    }
                                </td>
                                <td>{livro.codigo}</td>
                                <td>{livro.nome}</td>
                                <td>{livro.ano}</td>
                                <td>{livro.autor}</td>
                                <td>{livro.genero_nome}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Suspense>
    )
}
