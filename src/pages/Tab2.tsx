import { IonButton, IonContent, IonGrid, IonRow, IonCol, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, IonText, useIonViewWillEnter, useIonRouter, IonButtons, IonBackButton } from '@ionic/react';
import React, { useState } from 'react';

interface StoreRecord {
  id: number;
  description: string;
  recommendation: string;
}

const Tab2: React.FC = () => {
  const [stores, setStores] = useState<StoreRecord[]>([]);
  const [formState, setFormState] = useState({ description: '', recommendation: '' });
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const router = useIonRouter();

  useIonViewWillEnter(() => {
    // Si la memoria del ID seleccionado está vacía, nos preparamos para un registro NUEVO
    const savedStores = JSON.parse(localStorage.getItem('stores') || '[]');
    setStores(savedStores);

    const selectedId = JSON.parse(localStorage.getItem('selectedStoreId') || 'null');
    setSelectedStoreId(selectedId);
    
    if (selectedId) {
      const store = savedStores.find((s: StoreRecord) => s.id === selectedId);
      if (store) {
        setFormState({ description: store.description, recommendation: store.recommendation });
      }
    } else {
      // Si entramos a agregar, nos aseguramos que el formulario esté en blanco
      setFormState({ description: '', recommendation: '' });
      setErrorMessage('');
    }
  });

  const isEditing = selectedStoreId !== null;

  const validateForm = (): boolean => {
    if (!formState.description.trim() || !formState.recommendation.trim()) {
      setErrorMessage('Ambos campos son obligatorios.');
      return false;
    }
    const isDuplicate = stores.some(store =>
      store.description.toLowerCase().trim() === formState.description.toLowerCase().trim() &&
      store.id !== selectedStoreId
    );
    if (isDuplicate) {
      setErrorMessage('La descripción debe ser única (Llave primaria).');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const addStore = () => {
    if (!validateForm()) return;
    const newStore: StoreRecord = {
      id: Date.now(),
      description: formState.description.trim(),
      recommendation: formState.recommendation.trim(),
    };
    const updatedStores = [...stores, newStore];
    localStorage.setItem('stores', JSON.stringify(updatedStores));
    alert("Agregado exitosamente");
    router.push('/tab1', 'back', 'pop'); // Regresamos a la lista
  };

  const updateStore = () => {
    if (!validateForm() || !isEditing) return;
    const updatedStores = stores.map(store =>
      store.id === selectedStoreId
        ? { ...store, description: formState.description.trim(), recommendation: formState.recommendation.trim() }
        : store
    );
    localStorage.setItem('stores', JSON.stringify(updatedStores));
    alert("Actualizado exitosamente");
    router.push('/tab1', 'back', 'pop'); // Regresamos a la lista
  };

  const deleteStore = () => {
    if (!isEditing) return;
    const confirmDelete = window.confirm('¿Seguro que quieres eliminar este registro?');
    if (confirmDelete) {
      const updatedStores = stores.filter(store => store.id !== selectedStoreId);
      localStorage.setItem('stores', JSON.stringify(updatedStores));
      router.push('/tab1', 'back', 'pop'); // Regresamos a la lista
    }
  };

  const clearForm = () => {
    setFormState({ description: '', recommendation: '' });
    setErrorMessage('');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* Botón nativo de regreso a la lista por si el usuario se arrepiente */}
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" text="Volver" />
          </IonButtons>
          <IonTitle>{isEditing ? 'Editar Local' : 'Nuevo Local'}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="floating">Descripción </IonLabel>
            <IonInput 
              value={formState.description} 
              onIonInput={(e: any) => setFormState({ ...formState, description: e.detail.value || '' })} 
            />
          </IonItem>
          
          <IonItem>
            <IonLabel position="floating">Recomendación</IonLabel>
            <IonInput 
              value={formState.recommendation} 
              onIonInput={(e: any) => setFormState({ ...formState, recommendation: e.detail.value || '' })} 
            />
          </IonItem>

          {errorMessage && (
            <IonItem lines="none">
              <IonText color="danger">{errorMessage}</IonText>
            </IonItem>
          )}
        </IonList>

        <IonGrid className="ion-margin-top">
          <IonRow>
            <IonCol size="6">
              <IonButton expand="block" onClick={addStore} disabled={isEditing}>Agregar</IonButton>
            </IonCol>
            <IonCol size="6">
              <IonButton expand="block" fill="outline" onClick={clearForm}>Limpiar</IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="6">
              <IonButton expand="block" color="secondary" onClick={updateStore} disabled={!isEditing}>Editar</IonButton>
            </IonCol>
            <IonCol size="6">
              <IonButton expand="block" color="danger" onClick={deleteStore} disabled={!isEditing}>Eliminar</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;