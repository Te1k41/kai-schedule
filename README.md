# kai-schedule

Personal daily timetable + SOC analyst roadmap. Static HTML, synced across
devices via Firebase (Google sign-in + Firestore). Hosted free on GitHub Pages.

## Setup (one-time)

### 1. Firebase project
1. Go to **console.firebase.google.com** → **Add project** → name it anything → skip Analytics.
2. Once created, click the **</> (Web)** icon to register a web app. Name it anything, skip Firebase Hosting (using GitHub Pages instead).
3. Copy the `firebaseConfig` object it shows you.

### 2. Turn on Google sign-in
1. In the Firebase console: **Build → Authentication → Get started**.
2. Enable the **Google** provider. Pick a support email (your own).

### 3. Turn on Firestore
1. **Build → Firestore Database → Create database**.
2. Start in **production mode** (not test mode — the rules below handle security).
3. Pick any region close to you.
4. Go to the **Rules** tab and replace the contents with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This means: only you, signed in, can ever read or write your own data — even
though this whole repo (config included) is public. Firebase config values
are not secrets; the security rules are what actually protect the data.
Click **Publish**.

### 4. Paste your config
Open `firebase-init.js` in this repo and replace the placeholder
`firebaseConfig` values with the ones from step 1.

### 5. Push to GitHub and enable Pages
```bash
git add .
git commit -m "Add Firebase config"
git push
```
Then on GitHub: **Settings → Pages → Source → Deploy from a branch → main → / (root) → Save**.
Give it a minute — your site will be live at `https://<your-username>.github.io/kai-schedule/`.

## Notes

- **Local testing:** opening `index.html` by double-clicking it won't work —
  browsers block ES module imports over `file://`. Run a tiny local server
  instead: `python3 -m http.server 8000` in this folder, then visit
  `http://localhost:8000`.
- **Adding more devices:** just visit the site and sign in with the same
  Google account. No extra setup per device.
- **Free tier limits:** Firestore's free tier is far more than one person
  checking boxes a few times a day will ever use.
- **Editing content yourself:** see [GUIDE.md](./GUIDE.md) — the daily
  schedule is now editable right in the app (no code), roadmap tasks and a
  few other things still live in code, GUIDE.md walks through both.
