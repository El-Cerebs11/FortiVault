import { signIn, useSession } from 'next-auth/react'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'

export default class UserService {
  private session: any
  private collection: string = 'users'
  constructor(session: any) {
    this.session = session
  }

  public signIn(method: string, email: string = '', password: string = '') {
    switch (method) {
      case 'Credentials':
        return signIn('credentials', {
          email: email,
          password: password,
          redirect: true,
          callbackUrl: '/',
        })
      case 'google':
        return signIn('google')
      default:
        break
    }
  }

  public signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  public update(data: any) {
    if ((this.session.status = 'authenticated')) {
      const docRef = doc(db, `users/${this.session.data.user.email}`)
      return setDoc(docRef, data)
    } else {
      throw Error('User is not authenticated')
    }
  }

  public async fetch() {
    if ((this.session.status = 'authenticated')) {
      const docRef = doc(
        db,
        `${this.collection}/${this.session.data.user.email}`
      )
      let d = await getDoc(docRef)
      return d.data()
    } else {
      throw Error('User is not authenticated')
    }
  }
}
