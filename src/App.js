import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./styles.css";
// Navbar Component
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">GroceryStore</div>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/inventory">Inventory List</Link>
        </li>
        <li>
          <Link to="/add-product">Add Product</Link>
        </li>
      </ul>
    </nav>
  );
};

// Inventory Form Component
const InventoryForm = ({ editItem, onSave, onUpdate }) => {
  const [formData, setFormData] = useState({
    productId: "",
    category: "Fruits",
    productName: "",
    quantity: "",
    mrp: "",
    sellingPrice: "",
  });

  useEffect(() => {
    if (editItem) {
      setFormData(editItem);
    }
  }, [editItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation
    if (
      !formData.productId ||
      !formData.productName ||
      !formData.quantity ||
      !formData.mrp ||
      !formData.sellingPrice
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editItem) {
      onUpdate(formData);
    } else {
      onSave(formData);
    }

    // Reset form
    setFormData({
      productId: "",
      category: "Fruits",
      productName: "",
      quantity: "",
      mrp: "",
      sellingPrice: "",
    });
  };

  const handleReset = () => {
    setFormData({
      productId: "",
      category: "Fruits",
      productName: "",
      quantity: "",
      mrp: "",
      sellingPrice: "",
    });
  };

  return (
    <div className="form-container">
      <h2>{editItem ? "Edit Product" : "Add New Product"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product ID</label>
          <input
            type="text"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Dairy">Dairy</option>
          </select>
        </div>

        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>MRP</label>
          <input
            type="number"
            name="mrp"
            value={formData.mrp}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Selling Price</label>
          <input
            type="number"
            name="sellingPrice"
            value={formData.sellingPrice}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit">{editItem ? "Update" : "Submit"}</button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

// Inventory List Component
const InventoryList = ({ items, onEdit, onDelete }) => {
  return (
    <div className="inventory-list">
      <h2>Inventory List</h2>
      {items.length === 0 ? (
        <p>No products in inventory</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Selling Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.productId}>
                <td>{item.productName}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>${item.sellingPrice}</td>
                <td>
                  <button onClick={() => onEdit(item)}>Edit</button>
                  <button onClick={() => onDelete(item.productId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Home Component
const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Grocery Inventory Management</h1>
      <p>Manage your store inventory efficiently</p>
    </div>
  );
};

// Main App Component
const App = () => {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedItems =
      JSON.parse(localStorage.getItem("groceryInventory")) || [];
    setItems(savedItems);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("groceryInventory", JSON.stringify(items));
  }, [items]);

  const handleAddItem = (newItem) => {
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (updatedItem) => {
    setItems(
      items.map((item) =>
        item.productId === updatedItem.productId ? updatedItem : item
      )
    );
    setEditItem(null);
  };

  const handleDeleteItem = (productId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter((item) => item.productId !== productId));
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
  };

  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/inventory"
            element={
              <InventoryList
                items={items}
                onEdit={handleEdit}
                onDelete={handleDeleteItem}
              />
            }
          />
          <Route
            path="/add-product"
            element={
              <InventoryForm
                editItem={editItem}
                onSave={handleAddItem}
                onUpdate={handleUpdateItem}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
