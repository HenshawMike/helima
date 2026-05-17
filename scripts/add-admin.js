#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// 1. Simple, zero-dependency environment variable parser
function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  const envLocalPath = path.join(__dirname, '../.env.local');
  
  let envFile = '';
  if (fs.existsSync(envLocalPath)) {
    envFile = fs.readFileSync(envLocalPath, 'utf8');
    console.log('Loaded credentials from .env.local');
  } else if (fs.existsSync(envPath)) {
    envFile = fs.readFileSync(envPath, 'utf8');
    console.log('Loaded credentials from .env');
  } else {
    console.error('\x1b[31mError: Neither .env nor .env.local file was found in the project root.\x1b[0m');
    process.exit(1);
  }

  envFile.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    
    const index = trimmed.indexOf('=');
    if (index === -1) return;
    
    const key = trimmed.slice(0, index).trim();
    let val = trimmed.slice(index + 1).trim();
    
    // Remove surrounding quotes if present
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    
    if (!process.env[key]) {
      process.env[key] = val;
    }
  });
}

loadEnv();

// 2. Initialize Firebase Admin SDK
const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKey) {
  console.error('\x1b[31mError: Missing Firebase Admin variables in your environment configuration.\x1b[0m');
  console.error('Make sure these are defined in your env file:');
  console.error('  - FIREBASE_ADMIN_PROJECT_ID (or NEXT_PUBLIC_FIREBASE_PROJECT_ID)');
  console.error('  - FIREBASE_ADMIN_CLIENT_EMAIL');
  console.error('  - FIREBASE_ADMIN_PRIVATE_KEY');
  process.exit(1);
}

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });
} catch (error) {
  console.error('\x1b[31mError initializing Firebase Admin SDK:\x1b[0m', error.message);
  process.exit(1);
}

const db = admin.firestore();
const auth = admin.auth();

// 3. Process Command Line Arguments
const args = process.argv.slice(2);
const email = args[0];
const password = args[1];
const displayName = args[2] || (email ? email.split('@')[0] : 'Admin User');

if (!email) {
  console.log('\n\x1b[36m====================================================\x1b[0m');
  console.log('\x1b[1m   Helima E-Commerce Admin Pre-creation Utility\x1b[0m');
  console.log('\x1b[36m====================================================\x1b[0m');
  console.log('\n\x1b[1mUsage:\x1b[0m');
  console.log('  \x1b[32mnode scripts/add-admin.js <email> [password] [displayName]\x1b[0m\n');
  console.log('\x1b[1mNotes:\x1b[0m');
  console.log('  - If the user already exists, they will be promoted to Admin.');
  console.log('  - If they do not exist, a password is required to create them.');
  console.log('  - Password must be at least 6 characters long.\n');
  process.exit(0);
}

async function run() {
  let userRecord;
  let isNewUser = false;

  console.log(`\nProcessing request for: \x1b[1m${email}\x1b[0m...`);

  // A. Check if the user already exists in Firebase Auth
  try {
    userRecord = await auth.getUserByEmail(email);
    console.log(`Existing user found in Firebase Auth (UID: \x1b[33m${userRecord.uid}\x1b[0m).`);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      // User doesn't exist, we must create a new one
      if (!password) {
        console.error('\x1b[31mError: Account does not exist. A password is required to create a new user account.\x1b[0m');
        console.error('Usage: \x1b[32mnode scripts/add-admin.js <email> <password> [displayName]\x1b[0m');
        process.exit(1);
      }
      if (password.length < 6) {
        console.error('\x1b[31mError: Password must be at least 6 characters long.\x1b[0m');
        process.exit(1);
      }
      isNewUser = true;
    } else {
      console.error('\x1b[31mError looking up user:\x1b[0m', error.message);
      process.exit(1);
    }
  }

  // B. Create the user in Firebase Auth if they don't exist
  if (isNewUser) {
    try {
      userRecord = await auth.createUser({
        email,
        password,
        displayName,
        emailVerified: true,
      });
      console.log(`\x1b[32mSuccessfully created new account in Firebase Auth (UID: ${userRecord.uid})\x1b[0m`);
    } catch (error) {
      console.error('\x1b[31mError creating user in Firebase Auth:\x1b[0m', error.message);
      process.exit(1);
    }
  }

  const uid = userRecord.uid;

  // C. Create/Overwrite the document in the roles/{uid} collection
  try {
    const roleRef = db.collection('roles').doc(uid);
    await roleRef.set({
      role: 'admin',
      email: email,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`\x1b[32mSuccessfully registered role 'admin' in Firestore: \x1b[1mroles/${uid}\x1b[0m`);
  } catch (error) {
    console.error('\x1b[31mError setting role in Firestore:\x1b[0m', error.message);
    process.exit(1);
  }

  // D. Create/Sync the document in the users/{uid} collection
  try {
    const userProfileRef = db.collection('users').doc(uid);
    await userProfileRef.set({
      uid: uid,
      email: email,
      displayName: userRecord.displayName || displayName,
      photoURL: userRecord.photoURL || null,
      role: 'admin',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ...(isNewUser ? { createdAt: admin.firestore.FieldValue.serverTimestamp() } : {}),
    }, { merge: true });
    console.log(`\x1b[32mSuccessfully synced admin profile in Firestore: \x1b[1musers/${uid}\x1b[0m`);
  } catch (error) {
    console.error('\x1b[31mError syncing user profile in Firestore:\x1b[0m', error.message);
    process.exit(1);
  }

  console.log('\n\x1b[32m\x1b[1mSUCCESS: Admin setup completed successfully!\x1b[0m');
  console.log(`Email: ${email}`);
  console.log(`UID:   ${uid}\n`);
  process.exit(0);
}

run();
