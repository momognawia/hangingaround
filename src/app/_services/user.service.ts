import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData, updateDoc, serverTimestamp } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { UserProfile } from '../_models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  getUser(uid: string): Observable<UserProfile> {
    return docData(doc(this.firestore, `users/${uid}`), { idField: 'id' }) as Observable<UserProfile>;
  }

  async updateProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    await updateDoc(doc(this.firestore, `users/${uid}`), { ...data, updatedAt: serverTimestamp() });
  }

  async uploadProfilePhoto(uid: string, file: File): Promise<string> {
    const storageRef = ref(this.storage, `users/${uid}/profile_${Date.now()}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }
}
