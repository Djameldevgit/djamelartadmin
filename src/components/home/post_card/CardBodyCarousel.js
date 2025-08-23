import React, { useState  } from 'react';
import Carousel from '../../Carousel';
 
import { useSelector  } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
  
import VerifyModal from '../../authAndVerify/VerifyModal';
import DesactivateModal from '../../authAndVerify/DesactivateModal';


const CardBodyCarousel = ({ post }) => {
 
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);
  const { languageReducer, auth, socket } = useSelector((state) => state);
  const { t } = useTranslation('cardbodycarousel');
  const lang = languageReducer.language || 'en';
  const history = useHistory();
 const [showModal,setShowModal]= useState(false)


 
 

  

  return (
    <div>
      <div className="card_body">
     
        {post.images.length > 0 && (
          <div className="carousel-container" style={{ position: "relative" }}>
        
       
            <div className="card">
              <div className="card__image" onClick={() => history.push(`/post/${post._id}`)}>
                <Carousel images={post.images} id={post._id} />
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content" style={{ position: 'relative' }}>

            {/* Botón de cierre arriba derecha */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '1.8rem',
                color: '#333',
                cursor: 'pointer',
                fontWeight: 'bold',
                lineHeight: '1',
              }}
              aria-label="Cerrar"
            >
              ×
            </button>

            <h4>{t("title2", { lng: languageReducer.language })}</h4>
            <p>{t("message2", { lng: languageReducer.language })}</p>
            <div className="modal-buttons">
              <button onClick={() => history.push("/login")}>
                {t("login2", { lng: languageReducer.language })}
              </button>
              <button onClick={() => history.push("/register")}>
                {t("register2", { lng: languageReducer.language })}
              </button>
              <button onClick={() => setShowModal(false)}>
                {t("close2", { lng: languageReducer.language })}
              </button>
            </div>
          </div>
        </div>
      )}


      
 
      {showVerifyModal && (
        <VerifyModal show={showVerifyModal} onClose={() => setShowVerifyModal(false)} />
      )}
      <DesactivateModal show={showDeactivatedModal} onClose={() => setShowDeactivatedModal(false)} />

    </div>


 

  );
};

export default  CardBodyCarousel;
