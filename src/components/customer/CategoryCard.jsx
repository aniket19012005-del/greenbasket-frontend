import { useNavigate } from 'react-router-dom';

export default function CategoryCard({ category }) {
  const navigate = useNavigate();
  return (
    <div
      className="card card-hover category-card"
      onClick={() => navigate(`/shop?category=${category.id}`)}
      role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/shop?category=${category.id}`)}
    >
      <span className="emoji">{category.emoji}</span>
      <h4>{category.name}</h4>
      <span>{category.productCount} products</span>
    </div>
  );
}
