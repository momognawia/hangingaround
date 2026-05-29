import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth, authState, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider,
  signOut, updateProfile, User
} from '@angular/fire/auth';
import {
  Firestore, doc, setDoc, getDoc, updateDoc, serverTimestamp
} from '@angular/fire/firestore';
import { Observable, from, switchMap, of } from 'rxjs';
import { UserProfile } from '../_models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  readonly user$: Observable<User | null> = authState(this.auth);

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  async registerWithEmail(email: string, password: string, firstName: string): Promise<void> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    await updateProfile(cred.user, { displayName: firstName });
    await this.createUserProfile(cred.user.uid, { email, firstName });
    this.router.navigate(['/onboarding']);
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
    await this.postLoginRedirect();
  }

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(this.auth, provider);
    const exists = await this.userProfileExists(cred.user.uid);
    if (!exists) {
      await this.createUserProfile(cred.user.uid, {
        email: cred.user.email ?? '',
        firstName: cred.user.displayName?.split(' ')[0] ?? '',
        profilePhotoUrl: cred.user.photoURL ?? undefined,
      });
      this.router.navigate(['/onboarding']);
    } else {
      await this.postLoginRedirect();
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  getUserProfile(uid: string): Observable<UserProfile | null> {
    const ref = doc(this.firestore, `users/${uid}`);
    return from(getDoc(ref)).pipe(
      switchMap(snap => of(snap.exists() ? (snap.data() as UserProfile) : null))
    );
  }

  async updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    const ref = doc(this.firestore, `users/${uid}`);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  }

  private async userProfileExists(uid: string): Promise<boolean> {
    const snap = await getDoc(doc(this.firestore, `users/${uid}`));
    return snap.exists();
  }

  private async createUserProfile(uid: string, partial: Partial<UserProfile>): Promise<void> {
    const ref = doc(this.firestore, `users/${uid}`);
    const profile: Partial<UserProfile> = {
      id: uid,
      preferredFrequency: 'biweekly',
      subscriptionStatus: 'inactive',
      reputationScore: 100,
      verificationStatus: 'none',
      ...partial,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await setDoc(ref, profile);
  }

  private async postLoginRedirect(): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;
    const snap = await getDoc(doc(this.firestore, `users/${uid}`));
    const profile = snap.data() as UserProfile | undefined;
    if (profile?.city && profile?.bio) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/onboarding']);
    }
  }
}
