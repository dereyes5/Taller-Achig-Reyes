import React, { useRef, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

interface Categoria {
    idCat: number;
    nombre: string;
    descripcion: string;
}

interface CategoriasProps {
    categorias: Categoria[];
    setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>;
}

export const Categorias: React.FC<CategoriasProps> = ({ categorias, setCategorias }) => {
    const [mostrarDialogoCrear, setMostrarDialogoCrear] = useState<boolean>(false);
    const [mostrarDialogoEditar, setMostrarDialogoEditar] = useState<boolean>(false);
    const [categoria, setCategoria] = useState<Categoria>({ idCat: 0, nombre: "", descripcion: "" });
    const [categoriaSel, setCategoriaSel] = useState<Categoria | null>(null);
    const toast = useRef<Toast>(null);
    const [mostrarDialogoEliminar, setMostrarDialogoEliminar] = useState<boolean>(false);

    const guardarNuevo = () => {
        setCategorias([...categorias, { ...categoria, idCat: categorias.length + 1 }]);
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Categoría creada', life: 3000 });
        setMostrarDialogoCrear(false);
        setCategoria({ idCat: 0, nombre: "", descripcion: "" });
    };

    const guardarEdicion = () => {
        setCategorias(categorias.map(c => (c.idCat === categoria.idCat ? categoria : c)));
        toast.current?.show({ severity: 'info', summary: 'Info', detail: 'Categoría editada', life: 3000 });
        setMostrarDialogoEditar(false);
        setCategoria({ idCat: 0, nombre: "", descripcion: "" });
    };

    const confirmarEliminar = (c: Categoria) => {
        setCategoriaSel(c);
        setMostrarDialogoEliminar(true);
    };

    const eliminarCategoria = () => {
        setCategorias(categorias.filter(c => c.idCat !== categoriaSel?.idCat));
        setMostrarDialogoEliminar(false);
        toast.current?.show({ severity: 'warn', summary: 'Warn', detail: 'Categoría eliminada', life: 3000 });
    };

    const editarCategoria = (c: Categoria) => {
        setCategoria(c);
        setMostrarDialogoEditar(true);
    };

    const limpiarFormulario = () => {
        setCategoria({ idCat: 0, nombre: "", descripcion: "" });
    };

    return (
        <div>
            <Toast ref={toast} />
            <h1>Gestión de Categorías</h1>
            <div className="card flex justify-content-center">
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button label="Nuevo" icon="pi pi-plus-circle" onClick={() => {
                        limpiarFormulario();
                        setMostrarDialogoCrear(true);
                    }} />
                </div>

                <Dialog header="Ingresar una nueva Categoría" visible={mostrarDialogoCrear}
                        onHide={() => {
                            setMostrarDialogoCrear(false);
                            limpiarFormulario();
                        }}>
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="txtNombre">Nombre: </label>
                            <InputText id="txtNombre" value={categoria.nombre}
                                       onChange={(e) => setCategoria({ ...categoria, nombre: e.target.value })} />
                        </div>
                        <div className="p-field">
                            <label htmlFor="txtDescripcion">Descripción: </label>
                            <InputText id="txtDescripcion" value={categoria.descripcion}
                                       onChange={(e) => setCategoria({ ...categoria, descripcion: e.target.value })} />
                        </div>
                        <Button label="Guardar" icon="pi pi-save" onClick={guardarNuevo} />
                    </div>
                </Dialog>

                <Dialog header="Editar Categoría" visible={mostrarDialogoEditar}
                        onHide={() => {
                            setMostrarDialogoEditar(false);
                            limpiarFormulario();
                        }}>
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="txtNombre">Nombre: </label>
                            <InputText id="txtNombre" value={categoria.nombre}
                                       onChange={(e) => setCategoria({ ...categoria, nombre: e.target.value })} />
                        </div>
                        <div className="p-field">
                            <label htmlFor="txtDescripcion">Descripción: </label>
                            <InputText id="txtDescripcion" value={categoria.descripcion}
                                       onChange={(e) => setCategoria({ ...categoria, descripcion: e.target.value })} />
                        </div>
                        <Button label="Guardar" icon="pi pi-save" onClick={guardarEdicion} />
                    </div>
                </Dialog>

                <Dialog header="Eliminar Categoría" visible={mostrarDialogoEliminar}
                        onHide={() => setMostrarDialogoEliminar(false)} style={{ width: '450px' }}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                        {categoriaSel && <span>Estas seguro que deseas eliminar la categoría: <b>{categoriaSel.nombre}</b>?</span>}
                    </div>
                    <div className="p-d-flex p-jc-end">
                        <Button label="No" icon="pi pi-times" className="p-button-text"
                                onClick={() => setMostrarDialogoEliminar(false)} />
                        <Button label="Si" icon="pi pi-check" className="p-button-text"
                                onClick={eliminarCategoria} />
                    </div>
                </Dialog>
            </div>
            <br />
            <DataTable value={categorias} tableStyle={{width: '80%', margin: '0 auto'}}
                       selectionMode="single" onRowSelect={(e) => editarCategoria(e.data)}>
                <Column field="idCat" header="ID" sortable/>
                <Column field="nombre" header="Nombre" sortable/>
                <Column field="descripcion" header="Descripción" sortable/>
                <Column bodyStyle={{textAlign: 'center'}} body={
                    (rowData: any) => {
                        return (
                            <div>
                                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger"
                                        onClick={() => confirmarEliminar(rowData)}/>
                            </div>
                        );
                    }
                }/>
            </DataTable>
        </div>
    );
};