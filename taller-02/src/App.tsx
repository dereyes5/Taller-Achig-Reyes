import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import 'primereact/resources/themes/lara-dark-indigo/theme.css';
import { Categoria, Producto, Pedido, PedidoProducto } from "./types/interfaces";
import { Categorias } from "./components/Categorias";
import { Productos } from "./components/Productos";
import { Pedidos } from "./components/Pedidos";

const App: React.FC = () => {
    const [productos, setProductos] = useState<Producto[]>([
        { idProd: 1, nombre: "Producto 1", precio: 100, stock: 10, idCat: 1 },
        { idProd: 2, nombre: "Producto 2", precio: 200, stock: 20, idCat: 2 },
        { idProd: 3, nombre: "Producto 3", precio: 300, stock: 30, idCat: 3 }
    ]);

    const [categorias, setCategorias] = useState<Categoria[]>([
        { idCat: 1, nombre: "Categoria 1", descripcion: "Descripcion 1" },
        { idCat: 2, nombre: "Categoria 2", descripcion: "Descripcion 2" },
        { idCat: 3, nombre: "Categoria 3", descripcion: "Descripcion 3" }
    ]);

    const [pedidos, setPedidos] = useState<Pedido[]>([
        {
            idPed: 1,
            productos: [
                { idProd: 1, cantidad: 5, precio: 100 },
                { idProd: 2, cantidad: 3, precio: 200 }
            ],
            fecha: new Date()
        },
        {
            idPed: 2,
            productos: [
                { idProd: 2, cantidad: 10, precio: 200 },
                { idProd: 3, cantidad: 2, precio: 300 }
            ],
            fecha: new Date()
        },
        {
            idPed: 3,
            productos: [
                { idProd: 3, cantidad: 15, precio: 300 }
            ],
            fecha: new Date()
        }
    ]);

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/categorias"
                       element={<Categorias categorias={categorias} setCategorias={setCategorias} />} />
                <Route path="/productos"
                       element={<Productos categorias={categorias} productos={productos} setProductos={setProductos} />} />
                <Route path="/pedidos"
                       element={<Pedidos productos={productos} pedidos={pedidos} setPedidos={setPedidos} />} />
            </Routes>
        </Router>
    );
}

export default App;
