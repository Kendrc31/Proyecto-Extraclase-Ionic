import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonSearchbar, IonTitle, IonToolbar, useIonViewWillEnter, useIonRouter, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons'; // Icono del botón +
import React, { useState } from 'react';

interface StoreRecord {
  id: number;
  description: string;
  recommendation: string;
}

const Tab1: React.FC = () => {
  const [stores, setStores] = useState<StoreRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useIonRouter();

  useIonViewWillEnter(() => {
    const savedStores = JSON.parse(localStorage.getItem('stores') || '[]');
    setStores(savedStores);
  });

  const filteredStores = stores.filter(store =>
    store.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para el botón (+): Va al formulario en modo "Agregar"
  const goToAdd = () => {
    localStorage.removeItem('selectedStoreId'); // Aseguramos que la memoria esté limpia
    router.push('/tab2', 'forward', 'push');
  };

  // Función al tocar un registro: Va al formulario en modo "Editar"
  const handleSelectRecord = (store: StoreRecord) => {
    localStorage.setItem('selectedStoreId', JSON.stringify(store.id));
    router.push('/tab2', 'forward', 'push');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lista de Locales</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonSearchbar 
          value={searchTerm} 
          onIonInput={(e: any) => setSearchTerm(e.detail.value || '')} 
          placeholder="Buscar local..." 
        />

        {filteredStores.length === 0 ? (
          <p className="ion-text-center">No hay registros guardados.</p>
        ) : (
          <IonList>
            {filteredStores.map(store => (
              <IonItem 
                key={store.id} 
                button 
                onClick={() => handleSelectRecord(store)}
              >
                <IonLabel>
                  <h2><strong>{store.description}</strong></h2>
                  <p>{store.recommendation}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}

        {/* Botón Flotante (+) */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={goToAdd}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default Tab1;