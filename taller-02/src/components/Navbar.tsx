import React from "react";
import { Menubar } from 'primereact/menubar';
import 'primereact/resources/primereact.min.css';          // Core CSS
import 'primeicons/primeicons.css';                        // Icons

export const Navbar: React.FC = () => {
    const items = [
        {
            label: 'Gestion de Categorias',
            icon: 'pi pi-fw pi-calculator',
            command: () => { window.location.href = "/categorias" }
        },
        {
            label: 'Gestion de Productos',
            icon: 'pi pi-fw pi-list-check',
            command: () => { window.location.href = "/productos" }
        },
        {
            label: 'Gestion de Pedidos',
            icon: 'pi pi-fw pi-shopping-cart',
            command: () => { window.location.href = "/pedidos" }
        }
    ];

    return (
        <div>
            <Menubar model={items} />
        </div>
    );
}
