import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const [products, setProducts] = useState([]);

    // Load products from localStorage when the component mounts
    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {
        const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
        setProducts(storedProducts);
    };

    // Calculate total value of available stock
    const calculateTotalStockValue = () => {
        return products.reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0).toFixed(2);
    };

    return (
        <div>
            <h2>Stock Levels Available Currently</h2>
            <table id="stockTable">
                <thead>
                    <tr>
                        <th><b>Name</b></th>
                        <th><b>Description</b></th>
                        <th><b>Category</b></th>
                        <th><b>Price</b></th>
                        <th><b>Quantity</b></th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.category}</td>
                                <td>{product.price.toFixed(2)}</td>
                                <td>{product.quantity}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No products available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {products.length > 0 && (
                <div>
                    <h3>Total value of current stock is: ${calculateTotalStockValue()}</h3>
                </div>
            )}
        </div>
    );
};

export default Dashboard;