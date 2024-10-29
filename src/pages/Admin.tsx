import { useState } from 'react';
import { useStore } from '../store';

export default function Admin() {
  const { isAdmin, login, products, addProduct, updateProduct, deleteProduct } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState<any>(null);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Вход в админ-панель</h1>
        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={async (e) => {
          e.preventDefault();
          try {
            await login(password);
          } catch (err: any) {
            setError(err.message);
          }
        }}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Пароль"
            className="input mb-4"
          />
          <button type="submit" className="btn btn-primary w-full">
            Войти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Админ-панель</h1>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">
          {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
        </h2>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const data = new FormData(form);
          const product = {
            id: data.get('id') as string,
            name: data.get('name') as string,
            description: data.get('description') as string,
            price: parseFloat(data.get('price') as string),
            discount: parseInt(data.get('discount') as string) || 0,
            image_url: data.get('image_url') as string,
            category_id: data.get('category_id') as string
          };

          try {
            if (editingProduct) {
              await updateProduct(editingProduct.id, product);
            } else {
              await addProduct(product);
            }
            form.reset();
            setEditingProduct(null);
          } catch (err: any) {
            setError(err.message);
          }
        }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              name="id"
              defaultValue={editingProduct?.id}
              placeholder="ID (например: elden-ring-dlc)"
              className="input"
              required
            />
            <input
              name="name"
              defaultValue={editingProduct?.name}
              placeholder="Название"
              className="input"
              required
            />
            <input
              name="price"
              type="number"
              step="0.01"
              defaultValue={editingProduct?.price}
              placeholder="Цена"
              className="input"
              required
            />
            <input
              name="discount"
              type="number"
              defaultValue={editingProduct?.discount}
              placeholder="Скидка (%)"
              className="input"
            />
            <input
              name="image_url"
              defaultValue={editingProduct?.image_url}
              placeholder="URL изображения"
              className="input"
              required
            />
            <input
              name="category_id"
              defaultValue={editingProduct?.category_id}
              placeholder="ID категории"
              className="input"
              required
            />
          </div>
          <textarea
            name="description"
            defaultValue={editingProduct?.description}
            placeholder="Описание"
            className="input mb-4"
            rows={4}
            required
          />
          <div className="flex gap-4">
            <button type="submit" className="btn btn-primary">
              {editingProduct ? 'Сохранить' : 'Добавить'}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="btn bg-gray-700 text-white hover:bg-gray-600"
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Список товаров</h2>
        <div className="grid gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-gray-800 p-4 rounded-lg flex gap-4">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-grow">
                <h3 className="font-bold">{product.name}</h3>
                <p className="text-gray-400">${product.price}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="btn bg-blue-600 text-white hover:bg-blue-700"
                >
                  Изменить
                </button>
                <button
                  onClick={() => {
                    if (confirm('Удалить этот товар?')) {
                      deleteProduct(product.id);
                    }
                  }}
                  className="btn bg-red-600 text-white hover:bg-red-700"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}