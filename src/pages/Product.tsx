import { useParams } from 'react-router-dom';
import { useStore } from '../store';

export default function Product() {
  const { id } = useParams();
  const { products, categories } = useStore();
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return <div>Товар не найден</div>;
  }

  const category = categories.find(c => c.id === product.category_id);
  const finalPrice = product.discount > 0 
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full rounded-lg"
        />
        
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-400 mb-4">{category?.name}</p>
          <p className="mb-6">{product.description}</p>
          
          <div className="mb-6">
            {product.discount > 0 ? (
              <div>
                <span className="text-gray-400 line-through text-xl mr-2">
                  ${product.price}
                </span>
                <span className="text-green-500 text-3xl font-bold">
                  ${finalPrice.toFixed(2)}
                </span>
                <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded-full">
                  -{product.discount}%
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold">${product.price}</span>
            )}
          </div>

          <button className="btn btn-primary w-full">
            Купить
          </button>
        </div>
      </div>
    </div>
  );
}