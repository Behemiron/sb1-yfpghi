import { useStore } from '../store';

export default function Footer() {
  const { settings } = useStore();

  return (
    <footer className="bg-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Контакты</h3>
            <p>{settings.contact_email}</p>
            <p>{settings.contact_phone}</p>
            <p>{settings.contact_address}</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>{settings.copyright}</p>
        </div>
      </div>
    </footer>
  );
}