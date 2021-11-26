import type { FirebaseApp } from "firebase/app";
import type { Auth as FirebaseAuth } from "firebase/auth";

import { getApps, initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, updatePassword, reauthenticateWithCredential } from "firebase/auth";

/**
 * @description Firebaseの管理画面から取得したAPIオブジェクト
 * @note 環境変数は`.env.local`ファイルに定義しています
 */
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: process.env.FIREBASE_DOMAIN,
  databeseURL: process.env.FIREBASE_DATABASE,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.env.FIREBASE_MEASUREMENTID
};

/**
 * @description FirebaseAppを返す
 */
export const getFirebaseApp = (): FirebaseApp | undefined => {
  if (typeof window === "undefined") return; // バックエンドで実行されないようにする

  return getApps()[0] || initializeApp(firebaseConfig);
};

/**
 * @description FirebaseAuthを返す
 */
export const getFirebaseAuth = (): FirebaseAuth => {
  return getAuth(getFirebaseApp());
};

/**
 * @description メールアドレスとパスワードでログイン
 */
export const login = async (email: string, password: string) => {
  // FirebaseAuthを取得する
  const auth = getFirebaseAuth();

  // メールアドレスとパスワードでログインする
  const result = await signInWithEmailAndPassword(auth, email, password);

  // セッションIDを作成するためのIDを作成する
  const id = await result.user.getIdToken();

  // Cookieにセッションを付与するようにAPIを投げる
  await fetch("/api/session", { method: "POST", body: JSON.stringify({ id }) });
};

/**
 * @description ログアウトさせる
 */
export const logout = async () => {
  // セッションCookieを削除するため、Firebase SDKでなくREST APIでログアウトさせる
  await fetch("/api/sessionLogout", { method: "POST" });
};

// /**
//  * 
//  * @param auth:any
//  * @param email: string
//  * https://firebase.google.com/docs/auth/web/manage-users?hl=ja
//  */
// export const emailUpdate = async (auth: any, newemail: string) => {
//   const user = auth.currentUser;
//   await reauthenticateWithCredential(user, newemail).then(() => {
//     console.log('成功しました')
//   }).catch((error) => {
//     console.log(error);
//   });
// }

/**
 * @param auth: any
 * @param password:string
 * https://blog.ojisan.io/firebase-auth-ipass-login/
 * https://firebase.google.com/docs/auth/web/manage-users?hl=ja#set_a_users_password
 */
 export const passwordupdate = async (auth: any, password: string) => {
  // FirebaseAuthを取得する
  const user = auth.currentUser;
  await updatePassword(user, password).then(() => {
    console.log('成功しました')
  }).catch((error) => {
    console.log(error);
  });
};

/**
 * @description パスワードリマインダー
 */
 export const password = async (email: string) => {
  // FirebaseAuthを取得する
  const auth = getFirebaseAuth();

  // メールアドレスとパスワードでログインする
  await sendPasswordResetEmail(auth, email)
          .then((resp) => {
            // メール送信成功
            console.log(resp);
          })
          .catch((error) => {
            // メール送信失敗
            console.log(error)
          })

};
