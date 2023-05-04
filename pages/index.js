import React, { useState, useEffect } from 'react';
import Card from '../src/components/card/card.js';
import styles from "../styles/Home.module.css";
import checkoutStyles from "../src/components/checkout/Checkout.module.css";
import pedidosStyles from "../src/components/pedidos/Pedidos.module.css";
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
   // Variáveis de sessão
   const [customerId, setCustomerId] = useState(0);

   // Modals
  const [modalCartIsOpened, setModalCartIsOpened] = useState(false);
  const [modalMeusPedidosIsOpened, setModalMeusPedidosIsOpened] = useState(false);

  // Cardápio
  const [menuItems, setMenuItems] = useState([]);

  // Carrinho
  const [cart, setCart] = useState([]);
  const [totalCart, setTotalCart] = useState(0);
  
  // Consulta Meus Pedidos
  const [meusPedidos, setMeusPedidos] = useState([]);

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

         setCustomerId(1);
         setMenuItems(tempMenuItems);
        })
        .catch((err) => {
           console.log(err.message);
        });
        
  }, []);

   function loadMeusPedidos() {
      fetch(`http://192.168.0.18:8080/pedidos/${customerId}`)
      .then((response) => response.json())
      .then((data) => {
         console.log(data);
       setMeusPedidos(data);
      })
   }

   function openModalCart() {
      setModalCartIsOpened(true);
   }

   function closeModalCart() {
      setModalCartIsOpened(false);
   }

   function openModalMeusPedidos() {
      loadMeusPedidos();
      setModalMeusPedidosIsOpened(true);
   }

   function closeModalMeusPedidos() {
      setModalMeusPedidosIsOpened(false);
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

      var checkoutItems = [];

      {cart.map((item) => {
         checkoutItems.push({
            itemId: item.menuItem.id,
            quantity: item.quantity,
            price: item.menuItem.price
         });
      })}

      var checkout = {
         customerId: customerId,
         customerName: "Bruno Henrique",
         total: totalCart,
         obs: "Sem katchup",
         checkoutItems : checkoutItems
     }

      fetch('http://192.168.0.18:8080/pedidos', {
         method: "POST",
         body: JSON.stringify(checkout),
         headers: {"Content-type": "application/json; charset=UTF-8"}
         })
         .then(response => response.json())
         .then(json => console.log(json));
   }

   function handleCloseAlert() {
      setOpenAlertRemoveItemCheckout(false);
      setMsgAlert("");
   }

   function formatDate(stringDate) {
      var datePedido = new Date(stringDate);
      return (datePedido.toLocaleDateString() + " às " + datePedido.getHours() + ":" + datePedido.getMinutes());
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
               isOpen={modalCartIsOpened}
               onRequestClose={closeModalCart}
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
         <ReactModal
               isOpen={modalMeusPedidosIsOpened}
               onRequestClose={closeModalMeusPedidos}
               appElement={this}
               preventScroll={true}
               contentLabel='Meus Pedidos'>
               <div className={checkoutStyles.modal}>
                  <div className={checkoutStyles.checkoutItems}>
                     <table className={checkoutStyles.table}>
                     {meusPedidos.map((pedido) => {
                        var index = meusPedidos.findIndex(x => x.id === pedido.id);
                        return (
                           // https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal
                           <tr className={pedidosStyles.pedido}>
                              <td className={checkoutStyles.checkoutSubTotal}>R$ {pedido.total}</td>
                              <td className={pedidosStyles.dateHour}>{formatDate(pedido.date_hour)}</td>
                              <td className={pedidosStyles.pedidoObs}>{pedido.obs}</td>
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
            <button className={checkoutStyles.buttonCart} onClick={() => openModalCart()}>Carrinho</button>
            <button className={checkoutStyles.buttonCart} onClick={() => openModalMeusPedidos()}>Meus Pedidos</button>
         </div>
      </div>
   </div>
  );
};

export default App;