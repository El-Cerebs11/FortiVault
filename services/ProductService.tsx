import { signIn, useSession } from 'next-auth/react'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'

export default class ProductService {
  private session: any
  private collection: string = 'products'

  constructor(session: any) {
    this.session = session
  }

  public update(data: any) {
    if ((this.session.status = 'authenticated')) {
      const docRef = doc(db, `users/${this.session.data.user.email}`)
      return setDoc(docRef, data)
    } else {
      throw Error('User is not authenticated')
    }
  }

  public getAll() {
    const collectionRef = collection(db, this.collection)
    return getDocs(collectionRef)
  }

  public get(id: string) {
    const docRef = doc(db, this.collection, id)
    return getDoc(docRef)
  }
}
