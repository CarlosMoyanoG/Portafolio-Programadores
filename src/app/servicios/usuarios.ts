import { Injectable } from '@angular/core';
import { Usuario, RolUsuario } from '../modelos/usuario';

import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  deleteField,
} from '@angular/fire/firestore';

interface DatosFirebaseUsuario {
  uid: string;
  nombre: string | null;
  email: string | null;
  fotoUrl: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class Usuarios {
  constructor(private firestore: Firestore) {}

  private refUsuario(uid: string) {
    return doc(this.firestore, 'usuarios', uid);
  }

  /**
   * Crea el usuario en la colección `usuarios` si no existe
   * y si ya existe, actualiza email/foto si cambiaron.
   */
  async obtenerOCrearUsuarioDesdeFirebase(
    datos: DatosFirebaseUsuario
  ): Promise<Usuario> {
    const ref = this.refUsuario(datos.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      const nuevo: Usuario = {
        id: Date.now(),
        nombre: datos.nombre || 'Usuario',
        rol: 'visitante',
        fotoUrl: datos.fotoUrl || undefined,
      };

      if (datos.email) nuevo.email = datos.email;

      await setDoc(ref, nuevo as any);
      return nuevo;
    }

    // Si ya existe, sincronizamos email/foto si cambiaron
    const existente = snap.data() as Usuario;
    const cambios: any = {};

    if (datos.email && datos.email !== existente.email) {
      cambios.email = datos.email;
    }

    if (datos.fotoUrl && datos.fotoUrl !== existente.fotoUrl) {
      cambios.fotoUrl = datos.fotoUrl;
    }

    if (Object.keys(cambios).length > 0) {
      await updateDoc(ref, cambios);
      return { ...existente, ...cambios };
    }

    return existente;
  }

  async obtenerUsuario(uid: string): Promise<Usuario | null> {
    const ref = this.refUsuario(uid);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as Usuario) : null;
  }

  async getUsuarios(): Promise<(Usuario & { uid: string })[]> {
    const colRef = collection(this.firestore, 'usuarios');
    const snap = await getDocs(colRef);

    return snap.docs.map(d => {
      const data = d.data() as Usuario;
      return { ...data, uid: d.id };
    });
  }

  async actualizarUsuarioRolYProgramador(
    uid: string,
    rol: RolUsuario,
    programadorId?: number | null
  ): Promise<void> {
    const ref = this.refUsuario(uid);
    const cambios: any = { rol };

    if (rol === 'programador' && programadorId != null) {
      cambios.programadorId = programadorId;
    } else {
      cambios.programadorId = deleteField();
    }

    await updateDoc(ref, cambios);
  }
}
