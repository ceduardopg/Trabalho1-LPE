import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { getGenerosDB, deleteGeneroDB } from '@/bd/usecases/generoUseCases';
import { Suspense } from 'react';
import Loading from '@/app/componentes/comuns/Loading';
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";

const deleteGenero = async (codigo) => {
    'use server';
    try {
        await deleteGeneroDB(codigo);
    } catch (err) {
        console.log(err);
        throw new Error('Erro: ' + err);
    }
    revalidatePath('/privado/genero/');
    redirect('/privado/genero/');
};

export default async function Genero() {

    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    const generos = await getGenerosDB();

    return (
        <Suspense fallback={<Loading />}>
            <div style={{ padding: '20px' }}>
                <h1>Generos</h1>
                <Link href={`/privado/genero/${0}/formulario`}
                    className="btn btn-primary">
                    <i className="bi bi-file-earmark-plus"></i> Novo
                </Link>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>Ações</th>
                            <th>Código</th>
                            <th>Nome</th>
                        </tr>
                    </thead>
                    <tbody>
                        {generos.map((genero) => (
                            <tr key={genero.codigo}>
                                <td align="center">
                                    <Link className="btn btn-info"
                                        href={`/privado/genero/${genero.codigo}/formulario`}>
                                        <i className="bi bi-pencil-square"></i>
                                    </Link>
                                    {
                                        session?.user?.tipo === 'A' &&
                                        <form action={deleteGenero.bind(null, genero.codigo)} className="d-inline">
                                            <Button variant="danger" type='submit'>
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </form>
                                    }
                                </td>
                                <td>{genero.codigo}</td>
                                <td>{genero.nome}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Suspense>
    )
}