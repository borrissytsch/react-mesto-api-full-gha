import React, { useContext } from 'react';
import {CurrentUserContext} from '../contexts/CurrentUserContext.js';
import {cardSettings} from '../utils/constants.js';
export default function Card({card, onCardClick, onCardLike, onCardDelete}) {
  const {name, about, avatar, _id/*, cohort*/} = React.useContext(CurrentUserContext);
  const { trashActiveClass: trashActive
    , likeIconClass: likeIcon, likenActiveClass: likenActive
  } = cardSettings;
  // const isOwn = card.owner._id === _id;
  const isOwn = card.owner === _id; // Trash search @ 10/10/23
  // alert(`Cards like: _id ${_id} // likes: ${card.likes}`);
  // const isLiked = card.likes.some(i => i._id === _id);
  const isLiked = card.likes ? card.likes.some(i => i === _id) : false; // likes search @ 10/10/23
  // console.log(`Cards trash: isOwn/Liked-${isOwn}/${isLiked} 4 card ${Object.entries(card)} _id ${_id} of ${name}/${about} // owner: ${card.owner} & likes ${card.likes}`);
  function handleClick(evt) {
    onCardClick(evt, undefined, card);
  }

  return (
    <li className="table__cell" onClick={handleClick}>
      <button type="button" className={`table__trash ${isOwn ? trashActive : ""}`}
        onClick={evt => onCardDelete(evt, card)}>
      </button>
      <img className="table__image table__area-image" src={card.link} alt={card.name} />
      <h2 className="table__title table__area-title">{card.name}</h2>
      <div className="table__like table__area-like">
        <button type="button" className={`table__icon ${isLiked ? likeIcon : ""}`}
          onClick={evt => onCardLike(evt, card)}>
        </button>
        <p className={`table__liken ${card.likes ? (card.likes.length > 0 ? likenActive : "") : ""}`}>{card.likes.length}</p>
      </div>
    </li>
  );
  // redraw seek: @ 10/10/23
  // <p className={`table__liken ${card.likes.length > 0 ? likenActive : ""}`}>{card.likes.length}</p>
}
