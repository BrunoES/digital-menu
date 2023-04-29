import React, { useState, useEffect } from 'react';
import Card from '../src/components/card/card.js';
import Footer from '../src/components/footer/footer.js';
import styles from "../styles/Home.module.css";

const App = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});

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
   }

   function decreaseQtd(menuItemId) {
      var index = menuItems.findIndex(x => x.id === menuItemId);
      menuItems[index].qtd--;
      console.log(menuItems[index].qtd);
   }

   const changeSelectedItem = (menuItem) => {
      console.log("changeSelectedItem")
      console.log(selectedItem);
      setSelectedItem(menuItem);
   }

  return (
    <div className={styles.container}>
    {menuItems.map((menuItem) => {
      var index = menuItems.findIndex(x => x.id === menuItem.id);
      console.log(menuItem.id);
      console.log(index);
       return (
         // https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal
         <Card menuItem={menuItem} fnc={changeSelectedItem} />
       );
   })}
   <Footer>
      {selectedItem}
   </Footer>
   </div>
  );
};

export default App;