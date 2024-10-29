import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store';

export default function Category() {
  const { id } = useParams();
  const { products, categories } = useStore();
  
  const category = categories.find(c => c.id === id);
  const categoryProducts = products.filter(p => p.category_id === id);

  if (!category) {
    return <div>Категория не найдена</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{category.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoryProducts.map(product => (
          <Link key={product.id} to={`/product/${product.id}`} className="card">
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{product.name}</h2>
              <div className="flex justify-between items-center">
                <div>
                  {product.discount > 0 ? (
                    <>
                      <span className="text-gray-400 line-through mr-2">
                        ${product.price}
                      </span>
                      <span className="text-green-500">
                        ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span>${product.price}</span>
                  )}
                </div>
                {product.discount > 0 && (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                    -{product.discount}%
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}