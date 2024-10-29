import { Link } from 'react-router-dom';
import { useStore } from '../store';

export default function Home() {
  const { products, settings } = useStore();

  return (
    <div>
      <div 
        className="h-64 bg-cover bg-center mb-8 rounded-lg relative"
        style={{ backgroundImage: `url(${settings.header_image})` }}
      >
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">{settings.site_name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
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