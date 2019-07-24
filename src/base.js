import Rebase from 're-base';
import firebase from 'firebase';
import { baseConfig } from './base.config';

const firebaseApp = firebase.initializeApp(baseConfig);

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp };
export default base;
