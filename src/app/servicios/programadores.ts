import { Injectable } from '@angular/core';
import { Programador } from '../modelos/programador';

import {Firestore, collection, addDoc, getDocs, query, where, updateDoc, deleteField,} from '@angular/fire/firestore';
import { Proyecto } from '../modelos/proyecto';

@Injectable({
  providedIn: 'root',
})
export class Programadores {

  private colRef;

  constructor(private firestore: Firestore) {
    this.colRef = collection(this.firestore, 'programadores');
  }

  async getProgramadores(): Promise<Programador[]> {
    const snap = await getDocs(this.colRef);
    return snap.docs.map(d => d.data() as Programador);
  }

  async getProgramadorById(id: number): Promise<Programador | undefined> {
    const q = query(this.colRef, where('id', '==', id));
    const snap = await getDocs(q);
    if (snap.empty) {
      return undefined;
    }
    return snap.docs[0].data() as Programador;
  }

  async crearProgramador(data: Omit<Programador, 'id' | 'duenioUid'>): Promise<Programador> {
    const programador: Programador = {
      id: Date.now(),
      ...data,
    };

    await addDoc(this.colRef, programador);
    return programador;
  }

  async actualizarDuenioUid(idProgramador: number, duenioUid?: string | null): Promise<void> {
    const q = query(this.colRef, where('id', '==', idProgramador));
    const snap = await getDocs(q);
    if (snap.empty) {
      console.warn('No se encontró programador con id', idProgramador);
      return;
    }

    const docRef = snap.docs[0].ref;
    const cambios: any = {};

    if (duenioUid) {
      cambios.duenioUid = duenioUid;
    } else {
      cambios.duenioUid = deleteField();
    }

    await updateDoc(docRef, cambios);
  }

  // Actualizar lista de proyectos

  async actualizarProyectosProgramador(
    idProgramador: number,
    proyectos: Proyecto[]
  ): Promise<void> {
    const q = query(this.colRef, where('id', '==', idProgramador));
    const snap = await getDocs(q);

    if (snap.empty) {
      console.warn('No se encontró programador con id', idProgramador);
      return;
    }

    const docRef = snap.docs[0].ref;
    await updateDoc(docRef, { proyectos });
  }
}
