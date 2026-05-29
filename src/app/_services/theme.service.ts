import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, collectionData, doc, docData,
  addDoc, updateDoc, deleteDoc, query, where, orderBy,
  serverTimestamp, increment, getDocs
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Theme, ThemeMember } from '../_models/theme.model';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private firestore = inject(Firestore);

  getThemes(city?: string): Observable<Theme[]> {
    const col = collection(this.firestore, 'themes');
    const q = city
      ? query(col, where('status', '==', 'active'), where('city', '==', city), orderBy('membersCount', 'desc'))
      : query(col, where('status', '==', 'active'), orderBy('membersCount', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Theme[]>;
  }

  getTheme(id: string): Observable<Theme> {
    return docData(doc(this.firestore, `themes/${id}`), { idField: 'id' }) as Observable<Theme>;
  }

  async createTheme(data: Omit<Theme, 'id' | 'membersCount' | 'groupsGenerated' | 'createdAt'>): Promise<string> {
    const ref = await addDoc(collection(this.firestore, 'themes'), {
      ...data,
      membersCount: 0,
      groupsGenerated: 0,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  }

  async joinTheme(themeId: string, userId: string): Promise<void> {
    await addDoc(collection(this.firestore, 'theme_members'), {
      themeId,
      userId,
      joinedAt: serverTimestamp(),
      status: 'active',
    });
    await updateDoc(doc(this.firestore, `themes/${themeId}`), {
      membersCount: increment(1),
    });
  }

  async leaveTheme(themeId: string, userId: string): Promise<void> {
    const q = query(
      collection(this.firestore, 'theme_members'),
      where('themeId', '==', themeId),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    const promises = snap.docs.map(d => deleteDoc(d.ref));
    await Promise.all(promises);
    await updateDoc(doc(this.firestore, `themes/${themeId}`), {
      membersCount: increment(-1),
    });
  }

  async isMember(themeId: string, userId: string): Promise<boolean> {
    const q = query(
      collection(this.firestore, 'theme_members'),
      where('themeId', '==', themeId),
      where('userId', '==', userId),
      where('status', '==', 'active')
    );
    const snap = await getDocs(q);
    return !snap.empty;
  }

  getUserThemes(userId: string): Observable<ThemeMember[]> {
    const q = query(
      collection(this.firestore, 'theme_members'),
      where('userId', '==', userId),
      where('status', '==', 'active')
    );
    return collectionData(q) as Observable<ThemeMember[]>;
  }
}
