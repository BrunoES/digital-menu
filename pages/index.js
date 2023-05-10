import React, { useState, useEffect } from 'react';
import Card from '../src/components/card/card.js';
import styles from "../styles/Home.module.css";
import checkoutStyles from "../src/components/checkout/Checkout.module.css";
import pedidosStyles from "../src/components/pedidos/Pedidos.module.css";
import ReactModal from 'react-modal';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { FaShoppingCart, FaListAlt } from 'react-icons/fa';

ReactModal.defaultStyles.content.padding = '0px';
ReactModal.defaultStyles.content.border = 'none';
ReactModal.defaultStyles.content.position = 'none';
ReactModal.defaultStyles.content.marginTop = '40px';
ReactModal.defaultStyles.content.marginLeft = '5px';
ReactModal.defaultStyles.content.marginRight = '5px';
ReactModal.defaultStyles.content.marginBottom = '20px';
ReactModal.defaultStyles.content.height = '100%';
//ReactModal.defaultStyles.content.display = 'flex';
//#ReactModal.defaultStyles.content.height = '500px';

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
  const [openAlertCheckoutFinished, setOpenAlertCheckoutFinished] = useState(false);
  const [openAlertCartIsEmpty, setOpenAlertCartIsEmpty] = useState(false);
  const [openAlertMeusPedidosIsEmpty , setOpenAlertMeusPedidosIsEmpty] = useState(false);
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
         if(data.length > 0) {
            setMeusPedidos(data);
            setModalMeusPedidosIsOpened(true);
         } else {
            setMsgAlert("Você ainda não possui pedidos, faça o primeiro");
            setOpenAlertMeusPedidosIsEmpty(true);
         }
         
      })
   }

   function openModalCart() {
      if(cart.length <= 0) {
         setMsgAlert("Carrinho vazio, selecione o produto desejado acima.");
         setOpenAlertCartIsEmpty(true);
      } else {
         setModalCartIsOpened(true);
      }
   }

   function closeModalCart() {
      setModalCartIsOpened(false);
   }

   function openModalMeusPedidos() {
      loadMeusPedidos();
   }

   function closeModalMeusPedidos() {
      setModalMeusPedidosIsOpened(false);
   }

   function removeCartItemByIndex(index) {
      var subtotalItem = (parseFloat(cart[index].subtotal));
      var totCart = parseFloat(totalCart - subtotalItem).toFixed(2);
      setTotalCart(totCart);

      setMsgAlert("Removendo " + cart[index].quantity + " " + cart[index].menuItem.name + " do carrinho.");
      setCart(oldValues => {
         return oldValues.filter((_, i) => i !== index)
       });

       setOpenAlertRemoveItemCheckout(true);

       console.log("Length: " + cart.length)
       if(cart.length <= 1) {
         closeModalCart();
       }
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

      setTotalCart(0);
      setCart([]);
      setMsgAlert("Seu pedido foi feito, é só aguardar ;) !");
      setOpenAlertCheckoutFinished(true);
      closeModalCart();
   }

   function handleCloseAlert() {
      setOpenAlertRemoveItemCheckout(false);
      setOpenAlertCheckoutFinished(false);
      setOpenAlertCartIsEmpty(false);
      setOpenAlertMeusPedidosIsEmpty(false);
      setMsgAlert("");
   }

   function formatDate(stringDate) {
      var datePedido = new Date(stringDate);
      return (datePedido.toLocaleDateString() + " " + datePedido.getHours() + ":" + datePedido.getMinutes());
   }

  return (
   <div>
      <Snackbar open={openAlertRemoveItemCheckout} autoHideDuration={1000} onClose={handleCloseAlert}>
         <Alert severity="error" sx={{ width: '100%' }}>
            {msgAlert}
         </Alert>
      </Snackbar>
      <Snackbar open={openAlertCheckoutFinished} autoHideDuration={5000} onClose={handleCloseAlert}>
         <Alert severity="success" sx={{ width: '100%' }}>
            {msgAlert}
         </Alert>
      </Snackbar>
      <Snackbar open={openAlertCartIsEmpty} autoHideDuration={3500} onClose={handleCloseAlert}>
         <Alert severity="info" sx={{ width: '100%' }}>
            {msgAlert}
         </Alert>
      </Snackbar>
      <Snackbar open={openAlertMeusPedidosIsEmpty} autoHideDuration={3500} onClose={handleCloseAlert}>
         <Alert severity="info" sx={{ width: '100%' }}>
            {msgAlert}
         </Alert>
      </Snackbar>
      <div className={styles.container}>
            <ReactModal
               isOpen={modalCartIsOpened}
               onRequestClose={closeModalCart}
               appElement={this}
               contentLabel='Finalizar Pedido'>
               <div className={checkoutStyles.modal}>
                  <div className={checkoutStyles.checkoutItems}>
                     <table className={checkoutStyles.table}>
                     {cart.map((item) => {
                        var index = cart.findIndex(x => x.menuItem.id === item.menuItem.id);
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
               <button className={checkoutStyles.buttonCloseModal} onClick={() => closeModalCart()}>Fechar</button>
         </ReactModal>
         <ReactModal
               isOpen={modalMeusPedidosIsOpened}
               onRequestClose={closeModalMeusPedidos}
               appElement={this}
               contentLabel='Meus Pedidos'>
               <div className={checkoutStyles.modal}>
                  <span className={checkoutStyles.description}>Você tem {meusPedidos.length} pedidos no pedaqui</span>
                  <div className={checkoutStyles.checkoutItems}>
                     <table className={checkoutStyles.table}>
                     {meusPedidos.map((p) => {
                        var index = meusPedidos.findIndex(x => x.id === p.id);
                        return (
                           // https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal
                           <div className={pedidosStyles.pedido}>
                              <tr className={pedidosStyles.geral}>
                                 <td className={checkoutStyles.pedidoText}>Lanches da Phanda</td>
                                 <td className={pedidosStyles.dateHour}>{formatDate(p.pedido.date_hour)}</td>
                                 <td className={checkoutStyles.checkoutSubTotal}>R$ {p.pedido.total}</td>
                              </tr>
                              {p.detalheItems.map((detalhe) => {
                                 return (
                                    <tr className={pedidosStyles.items}>   
                                    <td className={pedidosStyles.pedidoText}>{detalhe.name}</td>
                                       <td className={checkoutStyles.checkoutSubTotal}>{`X ${detalhe.quantity}`}</td>
                                       <td className={checkoutStyles.checkoutSubTotal}>R$ {detalhe.price}</td>
                                    </tr>
                                 );
                              })}
          
                           </div>
                        );
                     })}
                     </table>
                  </div>
               </div>
               <button className={checkoutStyles.buttonCloseModal} onClick={() => closeModalMeusPedidos()}>Fechar</button>
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
            <p>
               <span className={checkoutStyles.total}>R$ {totalCart}</span>
            </p>
            <button className={checkoutStyles.buttonCart} onClick={() => openModalCart()}>
               <FaShoppingCart size={35}/>
               <br/>
               {
                  (cart.length == 0 ? "Sem itens no carrinho" : ((cart.length == 1 ? "1 Item" : `${cart.length} Itens`) + ", vamos finalizar?"))
               }
            </button>
            <button className={checkoutStyles.buttonCart} onClick={() => openModalMeusPedidos()}>
               <FaListAlt size={35}/>
               <br/>
               Pedidos
            </button>
         </div>
      </div>
   </div>
  );
};

export default App;