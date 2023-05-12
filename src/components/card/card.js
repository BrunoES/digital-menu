import ReactModal from 'react-modal';
import styles from './Card.module.css';
import checkoutStyles from '../checkout/Checkout.module.css';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { FaCartPlus, FaPlus, FaPlusSquare, FaRegPlusSquare, Plus } from 'react-icons/fa';

function Card({menuItem, totalCart, setTotalCart, cart, setCart}) {

    const [modalIsOpened, setModalIsOpened] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [openAlertSucess, setOpenAlertSucess] = useState(false);
    const [msgAlert, setMsgAlert] = useState("");

    function openModal() {
        setQuantity(1);
        setModalIsOpened(true);
    }

    function closeModal() {
        setModalIsOpened(false);
    }
    
    function increaseQtd() {
        let qtd = quantity;
        if(qtd < 99) setQuantity(++qtd);
     }
  
     function decreaseQtd() {
        let qtd = quantity;
        if(qtd > 0) setQuantity(--qtd);
     }

     function add(menuItem) {
        let indexIfExists = cart.findIndex(x => x.menuItem.id === menuItem.id);
        var subTot = (quantity * menuItem.price);
        var qtd = quantity;
        var totCart = (parseFloat(totalCart) + parseFloat(subTot));

        console.log("index: " + indexIfExists);

        if(indexIfExists >= 0) {
            subTot = parseFloat(cart[indexIfExists].subtotal) + subTot;
            qtd = cart[indexIfExists].quantity + quantity;
        }

        cart.push(
            {
                menuItem,
                quantity: qtd,
                subtotal: subTot
            }
        );

        setCart(oldValues => {
            return oldValues.filter((_, i) => i !== indexIfExists)
          });

        setTotalCart(parseFloat(totCart).toFixed(2));

        console.log("totCart: " + parseFloat(totCart).toFixed(2));
        console.log("setTotalCart: " + parseFloat(totCart).toFixed(2));
        closeModal();
        setMsgAlert(quantity + " x " + menuItem.name + " adicionado(s) ao carrinho");
        setOpenAlertSucess(true);
     }

     function handleCloseAlert() {
        setOpenAlertSucess(false);
        setMsgAlert("");
     }

    return (
        <div>
            <Snackbar open={openAlertSucess} autoHideDuration={1000} onClose={handleCloseAlert}>
                <Alert severity="success" sx={{ width: '100%' }}>
                    {msgAlert}
                </Alert>
            </Snackbar>
            <img className={styles.cardPrincipalImage} src={`data:image/png;base64,${menuItem.base64Img}`}></img>
            <div className={styles.card} key={menuItem.id}>
                <div className={styles.itemInfos} onClick={() => openModal()}>
                    <span className={styles.itemTitle}>{menuItem.name}</span>
                    <br/>
                    <span className={styles.itemDescription}>{menuItem.description}</span>
                    <br/>
                    <span className={styles.itemPrice}>R$ {menuItem.price}</span>
                </div>
                <ReactModal
                    isOpen={modalIsOpened}
                    onRequestClose={closeModal}
                    appElement={this}
                    preventScroll={true}
                    contentLabel='Adicionar ao pedido'>
                    <div className={styles.modal}>
                        <button onClick={closeModal} className={styles.close}>X</button>
                        <p className={styles.title}>{menuItem.name}</p>
                        <p>
                            <button className={styles.buttonIcreaseDecrease} onClick={decreaseQtd}>-</button>
                            <input className={styles.inputQuantity} type='number' value={quantity} readOnly/>
                            <button className={styles.buttonIcreaseDecrease} onClick={increaseQtd}>+</button>
                        </p>
                        <p><button className={styles.buttonAdd} onClick={() => add(menuItem) }><FaPlus size={35}/> Adicionar</button></p>
                    </div>
                    <button className={checkoutStyles.buttonCloseModal} onClick={() => closeModal()}>Fechar</button>
                </ReactModal>
            </div>
        </div>
    )
};

export default Card;