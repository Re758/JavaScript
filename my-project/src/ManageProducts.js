import React, { useState, useEffect } from 'react';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [soldProducts, setSoldProducts] = useState([]);
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [sellProductId, setSellProductId] = useState('');
    const [sellQuantity, setSellQuantity] = useState('');

    useEffect(() => {
        loadProducts();
        loadSoldProducts();
    }, []);

    const loadProducts = () => {
        const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
        setProducts(storedProducts);
    };

    const loadSoldProducts = () => {
        const storedSoldProducts = JSON.parse(localStorage.getItem('soldProducts')) || [];
        setSoldProducts(storedSoldProducts);
    };

    const handleProductSubmit = (e) => {
        e.preventDefault();
        const product = {
            id: productId || Date.now().toString(),
            name: productName,
            description,
            category,
            price: parseFloat(price),
            quantity: parseInt(quantity),
        };

        const updatedProducts = productId
            ? products.map(p => (p.id === productId ? product : p))
            : [...products, product];

        localStorage.setItem('products', JSON.stringify(updatedProducts));
       
        loadProducts();
        resetForm();
    };

    const editProduct = (id) => {
        const product = products.find(p => p.id === id);
        if (product) {
            setProductId(product.id);
            setProductName(product.name);
            setDescription(product.description);
            setCategory(product.category);
            setPrice(product.price);
            setQuantity(product.quantity);
        }
    };

    const deleteProduct = (id) => {
        const updatedProducts = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
       
        loadProducts();
    };

    const resetForm = () => {
        setProductId('');
        setProductName('');
        setDescription('');
        setCategory('');
        setPrice('');
        setQuantity('');
    };

    const handleSellProduct = (e) => {
        e.preventDefault();
        const product = products.find(p => p.id === sellProductId);
        if (product) {
            const newQuantity = product.quantity - parseInt(sellQuantity);
            if (newQuantity < 0) {
                alert("Not enough stock to sell this quantity!");
                return;
            }
            const updatedProducts = products.map(p => 
                p.id === sellProductId ? { ...p, quantity: newQuantity } : p
            );

            // Prepare the sold product entry
            const soldProduct = {
                id: Date.now().toString(),
                name: product.name,
                quantity: parseInt(sellQuantity),
                time: new Date().toLocaleString()
            };

            const updatedSoldProducts = [...soldProducts, soldProduct];

            localStorage.setItem('products', JSON.stringify(updatedProducts));
            localStorage.setItem('soldProducts', JSON.stringify(updatedSoldProducts));

            
            loadProducts();
            loadSoldProducts(); // Update the sold products list
            setSellProductId('');
            setSellQuantity('');
        }
    };

    const deleteSoldProduct = (id) => {
        const updatedSoldProducts = soldProducts.filter(sp => sp.id !== id);
        localStorage.setItem('soldProducts', JSON.stringify(updatedSoldProducts));
       
        loadSoldProducts();
    };

    return (
        <div>
            <h2>Manage Products</h2>
            <h3>Add/Edit Product</h3>
            <form onSubmit={handleProductSubmit}>
                <input type="hidden" value={productId} />
                <label>Product Name:</label>
                <input type="text" value={productName} required onChange={e => setProductName(e.target.value)} />
                <label>Description:</label>
                <input type="text" value={description} required onChange={e => setDescription(e.target.value)} />
                <label>Category:</label>
                <input type="text" value={category} required onChange={e => setCategory(e.target.value)} />
                <label>Price:</label>
                <input type="number" value={price} required onChange={e => setPrice(e.target.value)} />
                <label>Initial Quantity:</label>
                <input type="number" value={quantity} required onChange={e => setQuantity(e.target.value)} />
                <button type="submit">{productId ? 'Update Product' : 'Add Product'}</button>
                <button type="button" onClick={resetForm}>Cancel</button>
            </form>

            <h3>Existing Products</h3>
            <table id="productTable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.category}</td>
                            <td>{product.price.toFixed(2)}</td>
                            <td>{product.quantity}</td>
                            <td>
                                <button onClick={() => editProduct(product.id)}>Edit</button>
                                <button onClick={() => deleteProduct(product.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Sell Product</h3>
            <form onSubmit={handleSellProduct}>
                <label>Select Product:</label>
                <select value={sellProductId} onChange={e => setSellProductId(e.target.value)} required>
                    <option value="">Select a product</option>
                    {products.map(product => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                </select>
                <label>Quantity to Sell:</label>
                <input type="number" value={sellQuantity} required onChange={e => setSellQuantity(e.target.value)} />
                <button type="submit">Sell Product</button>
            </form>

            <h3>Sold Products</h3>
            <table id="soldProductTable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity Sold</th>
                        <th>Time Sold</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {soldProducts.map(sold => (
                        <tr key={sold.id}>
                            <td>{sold.name}</td>
                            <td>{sold.quantity}</td>
                            <td>{sold.time}</td>
                            <td>
                                <button onClick={() => deleteSoldProduct(sold.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageProducts;