// Configuración e Inicialización Híbrida de Firebase (Cloud Firestore + Fallback Local)
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCSB6CzI511ca9tGh4q9ouERcc2MxarasE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mashle-beta777.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mashle-beta777',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mashle-beta777.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '500337041629',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:500337041629:web:7ea729875d6846595cbb34',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-DRR33YD3KQ'
};

let app = null;
let db = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
} catch {
  // Si falla la inicialización (ej. entorno bloqueado), el sistema sigue 100% en modo local
  db = null;
}

const STATE_COLLECTION = 'mashle_app_state';
const STATE_DOC_ID = 'global_state';

// Identificador único de esta pestaña/cliente para ignorar ecos propios en onSnapshot
export const CLIENT_SESSION_ID = `cli-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const getFirestoreDb = () => db;

/**
 * Envía el estado completo de la aplicación a Cloud Firestore en segundo plano.
 * Si no hay internet o Firestore falla, no lanza error y conserva el respaldo en localStorage.
 */
export const pushAppStateToCloud = async (payload) => {
  if (!db || typeof navigator !== 'undefined' && !navigator.onLine) {
    return { synced: false, reason: 'offline' };
  }

  try {
    const stateRef = doc(db, STATE_COLLECTION, STATE_DOC_ID);
    await setDoc(
      stateRef,
      {
        ...payload,
        updatedAt: new Date().toISOString(),
        updatedByClient: CLIENT_SESSION_ID
      },
      { merge: true }
    );
    window.dispatchEvent(new CustomEvent('cal_estudiantil_cloud_status', { detail: { connected: true } }));
    return { synced: true };
  } catch {
    window.dispatchEvent(new CustomEvent('cal_estudiantil_cloud_status', { detail: { connected: false } }));
    return { synced: false, reason: 'error' };
  }
};

/**
 * Se suscribe en tiempo real a los cambios en Cloud Firestore.
 * Cuando otro dispositivo (o navegador) actualiza grupos, tareas, materias o progreso,
 * invoca `onRemoteChange(remoteData)` para actualizar localStorage y la interfaz en vivo.
 */
export const subscribeToCloudAppState = (onRemoteChange) => {
  if (!db) return () => {};

  try {
    const stateRef = doc(db, STATE_COLLECTION, STATE_DOC_ID);
    const unsubscribe = onSnapshot(
      stateRef,
      (snapshot) => {
        window.dispatchEvent(new CustomEvent('cal_estudiantil_cloud_status', { detail: { connected: true } }));
        if (!snapshot.exists()) {
          onRemoteChange(null, { isEmptyCloud: true });
          return;
        }
        const data = snapshot.data();
        // Si el cambio vino de otro dispositivo o es la primera carga, sincronizamos
        onRemoteChange(data, { isOwnEcho: data?.updatedByClient === CLIENT_SESSION_ID });
      },
      () => {
        window.dispatchEvent(new CustomEvent('cal_estudiantil_cloud_status', { detail: { connected: false } }));
      }
    );
    return unsubscribe;
  } catch {
    return () => {};
  }
};
