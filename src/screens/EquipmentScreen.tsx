import React, { useState } from 'react';
import Image from 'next/image';

interface Equipment {
  id: string;
  name: string;
  price: string;
  location: string;
  image: string;
}

const EquipmentScreen = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: '1',
      name: 'Colheitadeira',
      price: 'R$ 250.000,00',
      location: 'Campinas, SP',
      image: '/images/equipamentos/colheitadeira.jpg',
    },
    // Adicione mais equipamentos aqui
  ]);

  const renderEquipmentCard = ({ item }: { item: Equipment }) => (
    <div className="bg-white rounded-lg shadow-md mb-5">
      <div className="relative w-full h-48">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="rounded-t-lg object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
        <p className="text-green-700 mt-1">{item.price}</p>
        <p className="text-gray-600 mt-1">{item.location}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="p-5 border-b">
        <h1 className="text-2xl font-bold text-green-700">Equipamentos</h1>
      </div>

      <div className="p-5">
        {equipment.map((item) => (
          <div key={item.id}>
            {renderEquipmentCard({ item })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentScreen; 