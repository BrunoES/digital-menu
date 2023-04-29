import ReactModal from 'react-modal';
import styles from './Card.module.css';
import { useState } from 'react';

function Card({menuItem, totalCart, setTotalCart, cart}) {

    const [modalIsOpened, setModalIsOpened] = useState(false);
    const [quantity, setQuantity] = useState(0);

    function openModal() {
        console.log(modalIsOpened);
        setModalIsOpened(true);
        console.log(modalIsOpened);
    }

    function closeModal() {
        console.log(modalIsOpened);
        setModalIsOpened(false);
        console.log(modalIsOpened);
    }
    
    function increaseQtd() {
        let qtd = quantity;
        if(qtd < 99) setQuantity(++qtd);
        console.log(quantity);
     }
  
     function decreaseQtd() {
        let qtd = quantity;
        if(qtd > 0) setQuantity(--qtd);
        console.log(quantity);
     }

     function add(menuItem) {
        cart.push(
            {
                menuItem,
                quantity: quantity,
                subtotal: (menuItem.price * quantity)
            }
        );
        setTotalCart( totalCart + (quantity * menuItem.price));
        console.log(cart);
     }

    return (
        <div className={styles.card} key={menuItem.id}>
            <div onClick={() => openModal()}>
                <h3 className="item-title">{menuItem.name}</h3>
                <p className="item-description">{menuItem.description}</p>
                <p className="item-price">R$ {menuItem.price}</p>
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
                    <p><button className={styles.buttonAdd} onClick={() => add(menuItem) }>Adicionar</button></p>
                </div>
            </ReactModal>
        </div>
    )
};

export default Card;