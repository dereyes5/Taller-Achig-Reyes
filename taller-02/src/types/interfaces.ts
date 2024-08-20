export interface Categoria{
    idCat: number;
    nombre: string;
    descripcion: string;
}
export interface Producto{
    idProd: number;
    nombre: string;
    precio: number;
    stock: number;
    idCat: number;
}
export interface PedidoProducto {
    idProd: number;
    cantidad: number;
    precio: number;
}

export interface Pedido {
    idPed: number;
    productos: PedidoProducto[];
    fecha: Date;
}
