// Google Play kapalı test kaydı: Firebase (toprak-mirasi) Firestore'da testers/<uid>_android belgesi.
// Ziyaretçi misafir (anonim) girişle yazar; kayıtları sadece yönetici okur (rules/firestore.rules).
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyBKPBnF0SaAKSeEGWXWOKUY9U1werI4Szg",
  authDomain: "toprak-mirasi.firebaseapp.com",
  projectId: "toprak-mirasi",
  appId: "1:1050939526923:web:9e8ad82dfb3c137c169c0e",
});
const f = document.getElementById("tform");
const msg = f.querySelector(".msg"), btn = f.querySelector("button");
const KEY = "tasami-test-kayit";
const say = (t, ok) => { msg.textContent = t; msg.className = "msg " + (ok ? "ok" : "err"); };
const done = () => { try { return localStorage.getItem(KEY) } catch (e) { return null } };
if (done()) { say(f.dataset.dup, true); btn.disabled = true; }

const label = btn.textContent;
const busy = on => {
  btn.disabled = on;
  btn.classList.toggle("busy", on);
  btn.setAttribute("aria-busy", on ? "true" : "false");
  btn.textContent = on ? f.dataset.busy : label;
};
f.email.addEventListener("input", () => f.email.removeAttribute("aria-invalid"));
f.ok.addEventListener("change", () => { if (f.ok.checked && msg.classList.contains("err")) say("", true); });

f.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = f.email.value.trim().toLowerCase(), name = f.name.value.trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 100) {
    f.email.setAttribute("aria-invalid", "true"); say(f.dataset.bad, false); f.email.focus(); return;
  }
  if (!f.ok.checked) { say(f.dataset.need, false); f.ok.focus(); return; }
  busy(true);
  try {
    const { user } = await signInAnonymously(getAuth(app));
    const data = { uid: user.uid, email, platform: "android", lang: f.dataset.lang, at: serverTimestamp() };
    if (name) data.name = name.slice(0, 60);
    await setDoc(doc(getFirestore(app), "testers", user.uid + "_android"), data);
    try { localStorage.setItem(KEY, "1") } catch (e) {}
    say(f.dataset.ok, true); f.reset();
    if (f.dataset.next) location.href = f.dataset.next;
    else { busy(false); btn.disabled = true; }
  } catch (err) {
    console.error(err);
    busy(false);
    if (err && err.code === "permission-denied" && done()) { say(f.dataset.dup, true); btn.disabled = true; }
    else say(f.dataset.err, false);
  }
});
