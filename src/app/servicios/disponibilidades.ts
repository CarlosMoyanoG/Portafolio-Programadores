import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc
} from '@angular/fire/firestore';
import { Disponibilidad } from '../modelos/disponibilidad';

@Injectable({
  providedIn: 'root',
})
export class Disponibilidades {
  private colRef;

  constructor(private firestore: Firestore) {
    this.colRef = collection(this.firestore, 'disponibilidades');
  }

  async crearDisponibilidad( data: Omit<Disponibilidad, 'id'>): Promise<Disponibilidad> {
    const registro: Disponibilidad = {
      id: Date.now(),
      ...data,
    };

    await addDoc(this.colRef, registro);
    return registro;
  }

  async getTodas(): Promise<Disponibilidad[]> {
    const snap = await getDocs(this.colRef);
    return snap.docs.map((d) => d.data() as Disponibilidad);
  }

  async getPorProgramador(programadorId: number): Promise<Disponibilidad[]> {
    const qRef = query(this.colRef, where('programadorId', '==', programadorId));
    const snap = await getDocs(qRef);
    return snap.docs.map((d) => d.data() as Disponibilidad);
  }

  async eliminarPorId(id: number): Promise<void> {
    const qRef = query(this.colRef, where('id', '==', id));
    const snap = await getDocs(qRef);
    if (snap.empty) return;

    await deleteDoc(snap.docs[0].ref);
  }
}
