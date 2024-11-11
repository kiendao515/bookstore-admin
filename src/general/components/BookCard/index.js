import AppResource from 'general/constants/AppResource';
import CustomButton from '../CustomButton';
import './styles.scss';
import { useState } from 'react';

function BookCard({ title, author, price, rating, image }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      className="book-card"
      onClick={() => {
        setIsLiked(!isLiked);
      }}
      style={{ cursor: 'pointer' }}
    >
      <div className="image-container">
        <img src={image} alt={title} className="book-image" />
      </div>
      <div className="book-title">
        {title} ({author})
        <div>
          {isLiked ? (
            <i className="fas fa-heart" style={{ color: AppResource.colors.primary }} />
          ) : (
            <i className="far fa-heart" />
          )}
        </div>
      </div>
      <p className="book-price">₫ {price.toLocaleString()}</p>
      <div className="book-actions">
        <div className="book-rating">
          <i className="fas fa-star" style={{ color: AppResource.colors.yellow }}></i>
          <span style={{ color: AppResource.colors.neutral }}>{rating}/5</span>
        </div>
        <CustomButton text="Đặt hàng" />
      </div>
    </div>
  );
}

export default BookCard;
