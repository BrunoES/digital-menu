import React, { useState, useEffect } from 'react';
import '../styles/Home.module.css';

const cartStyle = {
  color: "white",
  backgroundColor: "#ebc888",
  padding: "10px",
  fontFamily: "Arial",
  margin: "1.2rem",
  padding: "0.7rem",
  flexBasis: "45%",
  textAlign: "center",
  color: "#dd512e",
  textDecoration: "none",
  border: "2px solid #dd512e",
  borderRadius: "20px",
  transition: "color 0.15s ease",
  borderColor: "0.15s ease"
};

const App = () => {
  const [menuItems, setMenuItems] = useState([]);
  useEffect(() => {
     fetch('http://localhost:8080/menu-items')
        .then((response) => response.json())
        .then((data) => {
           console.log(data);
           setMenuItems(data);
        })
        .catch((err) => {
           console.log(err.message);
        });
  }, []);

  return (
    <div className="menuItems-container">
    {menuItems.map((menuItem) => {
       return (
          <div style={cartStyle} key={menuItem.id}>
             <h2 className="item-title">{menuItem.name}</h2>
             <p className="item-description">{menuItem.description}</p>
             <p className="item-price">R$ {menuItem.price}</p>
             <div className="button">
             <div className="add-btn"><a href="#">Adicionar</a></div>
             </div>
          </div>
       );
    })}
 </div>
  );
};

export default App;