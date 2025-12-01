import { Injectable } from '@angular/core';
import { Asesoria } from '../modelos/asesoria';

import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class Asesorias {

  private coleccionRef;

  constructor(private firestore: Firestore) {
    this.coleccionRef = collection(this.firestore, 'asesorias');
  }

  async crearAsesoria(
    nueva: Omit<Asesoria, 'id' | 'estado'>
  ): Promise<Asesoria> {
    const asesoria: Asesoria = {
      id: Date.now(),
      estado: 'pendiente',
      ...nueva,
    };

    await addDoc(this.coleccionRef, asesoria);
    console.log('Asesoría creada:', asesoria);
    return asesoria;
  }

  async getAsesorias(): Promise<Asesoria[]> {
    const snap = await getDocs(this.coleccionRef);
    return snap.docs.map(d => d.data() as Asesoria);
  }

  async actualizarAsesoria(id: number, cambios: Partial<Asesoria>): Promise<void> {
    const q = query(this.coleccionRef, where('id', '==', id));
    const snap = await getDocs(q);

    if (snap.empty) {
      console.warn('No se encontró asesoria con id', id);
      return;
    }

    const docRef = snap.docs[0].ref;
    await updateDoc(docRef, cambios as any);

    console.log('Asesoría actualizada en Firestore:', id, cambios);
  }
}
