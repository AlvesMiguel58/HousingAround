import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, docData, addDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { query, where } from 'firebase/firestore';
import { Observable } from 'rxjs';

export interface User {
  id?: string;
  avatar: string;
  name: string;
  surname: string;
  email: string;
}

export interface Property {
  id?: string;
  avatar: string,
  unit_number: number,
  street: string,
  suburb: string,
  city: string,
  postal_code: number,
  userIDs: []
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
    // const usersRef = collection(this.firestore, 'users');
    // return addDoc(usersRef, user);

    return setDoc(doc(this.firestore, "users", user.id), {
      avatar: null,
      name: user.name,
      surname: user.surname,
      email: user.email
    });

  }

  deleteUser(user: User) {
    const userRef = doc(this.firestore, `users/${user.id}`);
    return deleteDoc(userRef);
  }

  updateUser(user: User) {
    const userRef = doc(this.firestore, `users/${user.id}`);
    return updateDoc(userRef, {
      avatar: user.avatar,
      name: user.name,
      surname: user.surname,
      email: user.email
    });
  }
  // END OF User controls

  // Property controls

  addProperty(property: Property, uid) {
    return setDoc(doc(this.firestore, "properties", `${property.unit_number} ${property.street} ${property.suburb} ${property.city}`), {
      avatar: property.avatar,
      unit_number: property.unit_number,
      street: property.street,
      suburb: property.suburb,
      city: property.city,
      postal_code: property.postal_code,
      userIDs: [uid]
    });
    console.log('property', property);
    console.log('uid', uid);
  }

  getProperties(uid): Observable<User[]> {
    const propertyRef = query(
      collection(this.firestore, 'properties'),
      where('userIDs', 'array-contains', uid)
    );

    return collectionData(propertyRef, { idField: 'id' }) as Observable<User[]>;
  }

  getPropertyById(id): Observable<User> {
    const propertyRef = doc(this.firestore, `properties/${id}`);
    return docData(propertyRef, { idField: 'id' }) as Observable<User>;
  }
  // END OF Property controls
}
