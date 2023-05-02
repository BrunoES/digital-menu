import React, { useState, useEffect } from 'react';
import Card from '../src/components/card/card.js';
import styles from "../styles/Home.module.css";
import checkoutStyles from "../src/components/checkout/Checkout.module.css";
import ReactModal from 'react-modal';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

ReactModal.defaultStyles.content.padding = '0px';
ReactModal.defaultStyles.content.border = 'none';
ReactModal.defaultStyles.content.position = 'none';
ReactModal.defaultStyles.content.marginTop = '40px';
ReactModal.defaultStyles.content.marginLeft = '5px';
ReactModal.defaultStyles.content.marginRight = '5px';
ReactModal.defaultStyles.content.marginBottom = '20px';

const App = () => {
  const [modalIsOpened, setModalIsOpened] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [totalCart, setTotalCart] = useState(0);

  const [openAlertRemoveItemCheckout, setOpenAlertRemoveItemCheckout] = useState(false);
  const [msgAlert, setMsgAlert] = useState("");
  
  useEffect(() => {
     fetch('http://192.168.0.18:8080/menu-items')
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

   function openModal() {
      setModalIsOpened(true);
  }

  function closeModal() {
      setModalIsOpened(false);
   }

   function removeCartItemByIndex(index) {
      setMsgAlert("Removendo " + cart[index].quantity + " " + cart[index].menuItem.name + " do carrinho.");
      setCart(oldValues => {
         return oldValues.filter((_, i) => i !== index)
       });
       setOpenAlertRemoveItemCheckout(true);
   }

   function save() {
      console.log("Chamando API de cadastro de pedido");
   }

   function handleCloseAlert() {
      setOpenAlertRemoveItemCheckout(false);
      setMsgAlert("");
   }

  return (
   <div>
      <Snackbar open={openAlertRemoveItemCheckout} autoHideDuration={1500} onClose={handleCloseAlert}>
         <Alert severity="error" sx={{ width: '100%' }}>
            {msgAlert}
         </Alert>
      </Snackbar>
      <div className={styles.container}>
            <ReactModal
               isOpen={modalIsOpened}
               onRequestClose={closeModal}
               appElement={this}
               preventScroll={true}
               contentLabel='Finalizar Pedido'>
               <div className={checkoutStyles.modal}>
                  <div className={checkoutStyles.checkoutItems}>
                     <table className={checkoutStyles.table}>
                     {cart.map((item) => {
                        var index = cart.findIndex(x => x.id === item.id);
                        return (
                           // https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal
                           <tr className={checkoutStyles.item}>
                              <td className={checkoutStyles.checkoutQuantity}>{item.quantity} X</td>
                              <td className={checkoutStyles.checkoutDetail}>{item.menuItem.name}</td>
                              <td className={checkoutStyles.checkoutSubTotal}>R$ {item.subtotal}</td>
                              <td><button className={checkoutStyles.close} onClick={() => removeCartItemByIndex(index)}>X</button></td>
                           </tr>
                        );
                     })}
                     </table>
                  </div>
                  <button className={checkoutStyles.buttonFinish} onClick={() => save()}>Finalizar</button>
               </div>
         </ReactModal>

         {menuItems.map((menuItem) => {
            return (
               // https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal
               <div>
                  <Card menuItem={menuItem} totalCart={totalCart} setTotalCart={setTotalCart} cart={cart} setCart={setCart} />
               </div>
            );
         })}

         <div className={styles.endList}></div>
         <div className={styles.footer}>
            <p>R$ {totalCart}</p>
            <button className={checkoutStyles.buttonCart} onClick={() => openModal()}>Pedido</button>
         </div>
      </div>
   </div>
  );
};

export default App;