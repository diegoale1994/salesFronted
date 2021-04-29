import React from 'react';
import Swal from 'sweetalert2';
import { useMutation, gql } from '@apollo/client';

const ELIMINAR_CLIENTE = gql`
mutation eliminarCliente($id: ID!) {
    eliminarCliente(id: $id)
}`;

const OBTENER_CLIENTES_USUARIO = gql`
query obtenerClientesVendedor {
  obtenerClientesVendedor{
    id
    nombre
    apellido
    empresa
    email
  }
}`;


const Cliente = ({ cliente }) => {

    const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
        update(cache) {
            const { obtenerClientesVendedor } = cache.readQuery({
                query: OBTENER_CLIENTES_USUARIO
            });

            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: { obtenerClientesVendedor: obtenerClientesVendedor.filter(cliente => cliente.id !== id) }
            })
        }
    });

    const { nombre, empresa, email, id } = cliente;

    const handleDeleteClient = idCliente => {
        Swal.fire({
            title: '¿Esta seguro que desea eliminar ese cliente?',
            text: 'Esta accion no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {

                try {
                    const { data } = await (eliminarCliente({
                        variables: {
                            id: idCliente
                        }
                    }))
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarCliente,
                        'success'
                    )
                } catch (error) {
                    console.log(error);
                }

            }
        })
    }

    return (
        <tr>
            <td className="border px-4 py2">{nombre}</td>
            <td className="border px-4 py2">{empresa}</td>
            <td className="border px-4 py2">{email}</td>
            <td className="border px-4 py2">
                <button onClick={() => handleDeleteClient(id)} type="button" className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold">
                    Eliminar
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </td>
        </tr>
    );
}

export default Cliente;