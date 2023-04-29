import ReactModal from 'react-modal';
import styles from './Card.module.css';
import { useState } from 'react';

function Card({menuItem, fnc}) {

    const [modalIsOpened, setModalIsOpened] = useState(false);

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
                contentLabel='Adicionar ao pedido'>
                <div>
                    <button onClick={closeModal}>Close Modal</button>
                    <p>Nome: {menuItem.name}</p>
                    <p><button>-</button><input type='number'/><button>+</button></p>
                    <p><button>Adicionar</button></p>
                </div>
            </ReactModal>
        </div>
    )
};

export default Card;