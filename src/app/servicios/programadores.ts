import { Injectable } from '@angular/core';
import { Programador } from '../modelos/programador';

import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteField,
  deleteDoc,
  DocumentReference,
  DocumentData,
} from '@angular/fire/firestore';
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

  private async getDocRefPorId(
    idProgramador: number
  ): Promise<DocumentReference<DocumentData> | null> {
    const q = query(this.colRef, where('id', '==', idProgramador));
    const snap = await getDocs(q);

    if (snap.empty) {
      console.warn('No se encontró programador con id', idProgramador);
      return null;
    }

    return snap.docs[0].ref;
  }

  async actualizarDuenioUid(idProgramador: number, duenioUid?: string | null): Promise<void> {
    const docRef = await this.getDocRefPorId(idProgramador);
    if (!docRef) return;

    const cambios: any = {};

    if (duenioUid) {
      cambios.duenioUid = duenioUid;
    } else {
      cambios.duenioUid = deleteField();
    }

    await updateDoc(docRef, cambios);
  }

  async actualizarProyectosProgramador(
    idProgramador: number,
    proyectos: Proyecto[]
  ): Promise<void> {
    const docRef = await this.getDocRefPorId(idProgramador);
    if (!docRef) return;

    await updateDoc(docRef, { proyectos });
  }

  async actualizarProgramador(programador: Programador): Promise<void> {
    const docRef = await this.getDocRefPorId(programador.id);
    if (!docRef) return;

    await updateDoc(docRef, {
      nombre: programador.nombre,
      especialidad: programador.especialidad,
      descripcion: programador.descripcion,
      fotoUrl: programador.fotoUrl ?? null,
      emailContacto: programador.emailContacto ?? null,
      githubUrl: programador.githubUrl ?? null,
      linkedinUrl: programador.linkedinUrl ?? null,
      sitioWeb: programador.sitioWeb ?? null,
    });
  }

  async eliminarProgramador(idProgramador: number): Promise<void> {
    const docRef = await this.getDocRefPorId(idProgramador);
    if (!docRef) return;

    await deleteDoc(docRef);
  }

  async actualizarDuenioYContacto(
    programadorId: number,
    duenioUid: string | null,
    email?: string | null,
    fotoUrl?: string
  ): Promise<void> {

    const ref = await this.getDocRefPorId(programadorId);
    if (!ref) return;

    const data: any = { duenioUid };

    if (email !== undefined) {
      data.emailContacto = email;
    }
    if (fotoUrl !== undefined) {
      data.fotoUrl = fotoUrl;
    }

    await updateDoc(ref, data);
  }
}
