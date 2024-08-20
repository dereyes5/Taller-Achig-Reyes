import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Producto, Pedido, PedidoProducto } from "../types/interfaces";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

interface PedidosProps {
    productos: Producto[];
    pedidos: Pedido[];
    setPedidos: React.Dispatch<React.SetStateAction<Pedido[]>>;
}

export const Pedidos: React.FC<PedidosProps> = ({ productos, pedidos, setPedidos }) => {
    const [pedido, setPedido] = useState<Pedido>({ idPed: 0, productos: [], fecha: new Date() });
    const [pedidoSel, setPedidoSel] = useState<Pedido | null>(null);
    const [productoSeleccionado, setProductoSeleccionado] = useState<PedidoProducto>({ idProd: 0, cantidad: 0, precio: 0 });
    const [dlgGuardar, setDlgGuardar] = useState<boolean>(false);
    const [dlgEliminar, setDlgEliminar] = useState<boolean>(false);
    const [guardando, setGuardando] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    //funciones
    const guardar = () => {
        if (guardando) return;
        setGuardando(true);
        if (pedido.idPed === 0) {
            setPedidos([...pedidos, { ...pedido, idPed: pedidos.length + 1 }]);
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Pedido creado',
                life: 3000
            });
        } else {
            setPedidos(pedidos.map(p => (p.idPed === pedido.idPed ? pedido : p)));
            toast.current?.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Pedido editado',
                life: 3000
            });
        }
        setDlgGuardar(false);
        limpiarFormulario();
        setGuardando(false);
    };

    const editarPedido = (p: Pedido) => {
        setPedido(p);
        setDlgGuardar(true);
    };

    const confirmarEliminacion = (p: Pedido) => {
        setPedidoSel(p);
        setDlgEliminar(true);
    };

    const eliminar = () => {
        setPedidos(pedidos.filter(p => p.idPed !== pedidoSel?.idPed));
        setDlgEliminar(false);
        toast.current?.show({ severity: 'warn', summary: 'Warn', detail: 'Pedido eliminado', life: 3000 });
    };

    const limpiarFormulario = () => {
        setPedido({ idPed: 0, productos: [], fecha: new Date() });
        setProductoSeleccionado({ idProd: 0, cantidad: 0, precio: 0 });
    };

    const agregarProducto = () => {
        const producto = productos.find(p => p.idProd === productoSeleccionado.idProd);
        if (producto) {
            const nuevoProducto = { ...productoSeleccionado, precio: producto.precio };
            setPedido({
                ...pedido,
                productos: [...pedido.productos, nuevoProducto]
            });
            setProductoSeleccionado({ idProd: 0, cantidad: 0, precio: 0 });
        }
    };

    return (
        <div>
            <h1>Gestión de Pedidos</h1>
            <Toast ref={toast} />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button label="Nuevo" icon="pi pi-plus-circle" onClick={() => {
                    limpiarFormulario();
                    setDlgGuardar(true);
                }} />
            </div>
            <br />
            <DataTable
                value={pedidos}
                selectionMode={"single"}
                tableStyle={{ width: '80%', margin: '0 auto' }}
                onRowSelect={(e => editarPedido(e.data))}
            >
                <Column field="fecha" header="Fecha" sortable body={(rowData) => new Date(rowData.fecha).toLocaleDateString()}></Column>
                <Column
                    header="Productos"
                    body={(rowData: Pedido) => {
                        return rowData.productos.map(p => {
                            const producto = productos.find(prod => prod.idProd === p.idProd);
                            return producto ? producto.nombre : 'N/A';
                        }).join(', ');
                    }}
                    sortable
                />
                <Column
                    header="Cantidad Total"
                    body={(rowData: Pedido) => {
                        return rowData.productos.reduce((total, p) => total + p.cantidad, 0);
                    }}
                    sortable
                />
                <Column
                    header="Precio Total"
                    body={(rowData: Pedido) => {
                        return rowData.productos.reduce((total, p) => total + p.cantidad * p.precio, 0).toFixed(2);
                    }}
                    sortable
                />
                <Column bodyStyle={{ textAlign: 'center' }} body={
                    (rowData: Pedido) => {
                        return (
                            <div>
                                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger"
                                        onClick={() => confirmarEliminacion(rowData)} />
                            </div>
                        );
                    }
                } />
            </DataTable>
            <Dialog header="Ingresar un nuevo Pedido" visible={dlgGuardar}
                    onHide={() => {
                        setDlgGuardar(false);
                        limpiarFormulario();
                    }}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="txtFecha">Fecha: </label>
                        <InputText id="txtFecha" value={pedido.fecha.toISOString().split('T')[0]}
                                   onChange={(e) => setPedido({ ...pedido, fecha: new Date(e.target.value) })} type="date" />
                    </div>
                    <div className="p-field">
                        <label htmlFor="cmbProducto">Producto: </label>
                        <Dropdown id="cmbProducto" value={productoSeleccionado.idProd}
                                  options={productos.map(p => ({ label: p.nombre, value: p.idProd }))}
                                  onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, idProd: e.value })} placeholder="Seleccione un producto" />
                    </div>
                    <div className="p-field">
                        <label htmlFor="txtCantidad">Cantidad: </label>
                        <InputText id="txtCantidad" value={productoSeleccionado.cantidad.toString()}
                                   onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, cantidad: parseInt(e.target.value) })} type="number" />
                    </div>
                    <Button label="Agregar Producto" icon="pi pi-plus" onClick={agregarProducto} />
                    <div className="p-field">
                        <h4>Productos seleccionados:</h4>
                        <ul>
                            {pedido.productos.map((p, index) => {
                                const producto = productos.find(prod => prod.idProd === p.idProd);
                                return (
                                    <li key={index}>
                                        {producto?.nombre} - Cantidad: {p.cantidad} - Precio: {p.precio}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <Button label="Guardar" icon="pi pi-save" onClick={guardar} />
                </div>
            </Dialog>
            <Dialog header="Eliminar Pedido" visible={dlgEliminar}
                    onHide={() => setDlgEliminar(false)}>
                <div>
                    <h4>¿Desea eliminar el pedido?</h4>
                    <p>Fecha: {pedidoSel?.fecha.toLocaleDateString()}</p>
                    <p>Productos: {pedidoSel?.productos.map(p => productos.find(prod => prod.idProd === p.idProd)?.nombre).join(', ')}</p>
                    <p>Cantidad Total: {pedidoSel?.productos.reduce((total, p) => total + p.cantidad, 0)}</p>
                    <Button label="Eliminar" icon="pi pi-trash" onClick={eliminar} className="p-button-danger" />
                </div>
            </Dialog>
        </div>
    );
}
