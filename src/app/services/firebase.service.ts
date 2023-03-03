import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface User {
  id?: string;
  avatar: string;
  name: string;
  surname: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: Firestore) { }

  // User controls
  getUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'id' }) as Observable<User[]>;
  }

  getUserById(id): Observable<User> {
    const userRef = doc(this.firestore, `users/${id}`);
    return docData(userRef, { idField: 'id' }) as Observable<User>;
  }

  addUser(user: User) {
    const usersRef = collection(this.firestore, 'users');
    return addDoc(usersRef, user);
  }

  deleteNote(user: User) {
    const userRef = doc(this.firestore, `users/${user.id}`);
    return deleteDoc(userRef);
  }

  updateNote(user: User) {
    const userRef = doc(this.firestore, `users/${user.id}`);
    return updateDoc(userRef, {
      avatar: user.avatar,
      name: user.name,
      surname: user.surname,
      email: user.email
    });
  }
  // END OF User controls
}
