import React, {useRef, useState} from "react";
import {Toast} from "primereact/toast";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {Categoria, Producto} from "../types/interfaces";
import {InputText} from 'primereact/inputtext';
import {Dropdown} from 'primereact/dropdown';

interface ProductosProps {
    categorias: Categoria[];
    productos: Producto[];
    setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
}

export const Productos: React.FC<ProductosProps> = ({categorias, productos, setProductos}) => {
    const [producto, setProducto] = useState<Producto>({idProd: 0, nombre: "", precio: 0, stock: 0, idCat: 0});
    const [productoSel, setProductoSel] = useState<Producto | null>(null);
    const [dlgGuardar, setDlgGuardar] = useState<boolean>(false);
    const [dlgEliminar, setDlgEliminar] = useState<boolean>(false);
    const [guardando, setGuardando] = useState<boolean>(false);  // Estado para prevenir doble guardado
    const toast = useRef<Toast>(null);
    //funciones
    const guardar = () => {
        if (guardando) return;  // Previene múltiples guardados
        setGuardando(true);
        if (producto.idProd === 0) {
            setProductos([...productos, {...producto, idProd: productos.length + 1}]);
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Producto creado',
                life: 3000
            });
        } else {
            setProductos(productos.map(p => (p.idProd === producto.idProd ? producto : p)));
            toast.current?.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Producto editado',
                life: 3000
            });
        }
        setDlgGuardar(false);
        limpiarFormulario();
        setGuardando(false);  // Permite futuros guardados
    };
    const editarProducto = (p: Producto) => {
        setProducto(p);
        setDlgGuardar(true);
    };
    const confirmarEliminacion = (p: Producto) => {
        setProductoSel(p);
        setDlgEliminar(true);
    };
    const eliminar = () => {
        setProductos(productos.filter(p => p.idProd !== productoSel?.idProd));
        setDlgEliminar(false);
        toast.current?.show({severity: 'warn', summary: 'Warn', detail: 'Producto eliminado', life: 3000});
    };
    const limpiarFormulario = () => {
        setProducto({idProd: 0, nombre: "", precio: 0, stock: 0, idCat: 0});
    };
    return (
        <div>
            <h1>Gestión de Productos</h1>
            <Toast ref={toast}/>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Button label="Nuevo" icon="pi pi-plus-circle" onClick={() => {
                    limpiarFormulario();
                    setDlgGuardar(true);
                }}/>
            </div>
            <br/>
            <DataTable
                value={productos}
                selectionMode={"single"}
                tableStyle={{width: '80%', margin: '0 auto'}}
                onRowSelect={(e => editarProducto(e.data))}
            >
                <Column field="idProd" header="ID" sortable></Column>
                <Column field="nombre" header="Nombre" sortable></Column>
                <Column field="precio" header="Precio" sortable></Column>
                <Column field="stock" header="Stock" sortable></Column>
                <Column field="idCat" header="Categoría" sortable></Column>
                <Column bodyStyle={{textAlign: 'center'}} body={
                    (rowData: any) => {
                        return (
                            <div>
                                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger"
                                        onClick={() => confirmarEliminacion(rowData)}/>
                            </div>
                        );
                    }
                }/>
            </DataTable>
            <Dialog
                header="Ingresar un nuevo Producto"
                visible={dlgGuardar}
                style={{width: '450px'}}
                onHide={() => {
                    setDlgGuardar(false);
                    limpiarFormulario();
                }}
            >
                <div>
                    <div>
                        <label>Nombre: </label>
                        <InputText value={producto.nombre} onChange={(e) => setProducto({...producto, nombre: e.target.value})}/>
                    </div>
                    <div>
                        <label>Precio: </label>
                        <InputText value={producto.precio.toString()} onChange={(e) => setProducto({...producto, precio: parseFloat(e.target.value)})}/>
                    </div>
                    <div>
                        <label>Stock: </label>
                        <InputText value={producto.stock.toString()} onChange={(e) => setProducto({...producto, stock: parseInt(e.target.value)})}/>
                    </div>
                    <div>
                        <label>Categoría: </label>
                        <Dropdown value={producto.idCat} options={categorias.map(c => ({label: c.nombre, value: c.idCat}))}
                                  onChange={(e) => setProducto({...producto, idCat: e.value})} placeholder="Seleccione una categoría"/>
                    </div>
                    <br/>
                    <Button label="Guardar" icon="pi pi-save" onClick={guardar} disabled={guardando}/>
                </div>
            </Dialog>
            <Dialog
                header="Eliminar Producto"
                visible={dlgEliminar}
                style={{width: '450px'}}
                onHide={() => setDlgEliminar(false)}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}}/>
                    {productoSel && <span>¿Estás seguro que deseas eliminar el producto: <b>{productoSel.nombre}</b>?</span>}
                </div>
                <div className="p-d-flex p-jc-end">
                    <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setDlgEliminar(false)}/>
                    <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={eliminar}/>
                </div>
            </Dialog>

        </div>
    );
}