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

const plusMinusInputStyle = {
   alignItems: "center",
   textAlign: "center",
   marginLeft: "0.5rem",
   marginRight: "0.5rem",
   padding: "1rem"
};

const App = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
     fetch('http://localhost:8080/menu-items')
        .then((response) => response.json())
        .then((data) => {
           console.log(data);

           var tempMenuItems = new Array();
           data.forEach(element => {
            tempMenuItems.push({
                  id: element.id,
                  name: element.name,
                  description: element.description,
                  price: element.price,
                  qtd: 0
               })
         });

         setMenuItems(tempMenuItems);
        })
        .catch((err) => {
           console.log(err.message);
        });
  }, []);

   function getQtdByItemId(menuItemId) {
      return menuItems.find(x => x.id === menuItemId).qtd;
   }

   function increaseQtd(menuItemId) {
      var index = menuItems.findIndex(x => x.id === menuItemId);
      menuItems[index].qtd++;
      console.log(menuItems[index].qtd);
      /*var tempMenuItems = menuItems;
      var qtd = tempMenuItems[index].qtd;
      qtd = qtd + 1;
      tempMenuItems[index].qtd = qtd;
      console.log(tempMenuItems[index].qtd)
      setMenuItems(tempMenuItems);*/
   }

   function decreaseQtd(menuItemId) {
      var index = menuItems.findIndex(x => x.id === menuItemId);
      menuItems[index].qtd--;
      console.log(menuItems[index].qtd);
      /*var index = menuItems.findIndex(x => x.id === menuItemId);
      var tempMenuItems = menuItems;
      var qtd = tempMenuItems[index].qtd;
      qtd = qtd - 1;
      tempMenuItems[index].qtd = qtd;
      console.log(tempMenuItems[index].qtd)
      setMenuItems(tempMenuItems);*/
   }

   function handleEventQtd(event) {
      console.dir(event)
   }

  return (
    <div className="menuItems-container">
    {menuItems.map((menuItem) => {
      let idQtd = `qtd${menuItem.id}`;
      var index = menuItems.findIndex(x => x.id === menuItem.id);
      console.log(menuItem.id);
      console.log(index);
       return (
         <div style={cartStyle} key={menuItem.id}>
            <h2 className="item-title">{menuItem.name}</h2>
            <p className="item-description">{menuItem.description}</p>
            <p className="item-price">R$ {menuItem.price}</p>

            <p>
               <button type="button" className="button hollow circle" data-quantity="minus" data-field="quantity" onClick={() => decreaseQtd(menuItem.id)}>
                  <i className="fa fa-minus" aria-hidden="true">-</i>
               </button>
               <input type='number' id={idQtd} value={menuItems[index].qtd} onChange={e => handleEventQtd(e)}/>
               <button type="button" className="button hollow circle" data-quantity="plus" data-field="quantity" onClick={() => increaseQtd(menuItem.id)}>
                  <i className="fa fa-plus" aria-hidden="true">+</i>
               </button>
            </p>  

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