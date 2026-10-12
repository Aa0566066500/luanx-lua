import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "REPLACE_WITH_FIREBASE_WEB_API_KEY",
  authDomain: "REPLACE_WITH_FIREBASE_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_FIREBASE_PROJECT_ID",
  appId: "REPLACE_WITH_FIREBASE_APP_ID"
};
const configured = !Object.values(firebaseConfig).some(v => v.startsWith("REPLACE_WITH"));
const $ = id => document.getElementById(id);
const icons = {
  logo:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5h6l8 14h-6L5 5Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M14 5h5l-8 14H6l8-14Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" opacity=".7"/></svg>',
  lock:'<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.7"/><path d="M12 14v3" stroke="currentColor" stroke-width="1.7"/></svg>',
  cloud:'<svg viewBox="0 0 24 24" fill="none"><path d="M7 18h11a4 4 0 0 0 .5-8A6.5 6.5 0 0 0 6 8.5 4.8 4.8 0 0 0 7 18Z" stroke="currentColor" stroke-width="1.7"/></svg>',
  activity:'<svg viewBox="0 0 24 24" fill="none"><path d="M3 12h4l3-8 4 16 3-8h4" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  files:'<svg viewBox="0 0 24 24" fill="none"><path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10Z" stroke="currentColor" stroke-width="1.7"/><path d="M13 3v7h7M8 14h8M8 17h6" stroke="currentColor" stroke-width="1.7"/></svg>',
  'shield-check':'<svg viewBox="0 0 24 24" fill="none"><path d="m12 3 8 3v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6l8-3Z" stroke="currentColor" stroke-width="1.7"/><path d="m8.5 12 2.3 2.3 4.7-5" stroke="currentColor" stroke-width="1.7"/></svg>',
  calendar:'<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M16 3v4M8 3v4M3 10h18" stroke="currentColor" stroke-width="1.7"/></svg>',
  refresh:'<svg viewBox="0 0 24 24" fill="none"><path d="M20 7v5h-5M4 17v-5h5" stroke="currentColor" stroke-width="1.7"/><path d="M6 9a7 7 0 0 1 12-2l2 5M4 12l2 5a7 7 0 0 0 12-2" stroke="currentColor" stroke-width="1.7"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8"/></svg>',
  code:'<svg viewBox="0 0 24 24" fill="none"><path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-11-2 14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  moon:'<svg viewBox="0 0 24 24" fill="none"><path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.6 8.6 0 1 0 20.2 15.2Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  sun:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  google:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.72-.06-1.42-.18-2.09H12v3.96h5.38a4.6 4.6 0 0 1-2 3.02v2.52h3.23c1.89-1.74 2.99-4.3 2.99-7.41Z"/><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.44l-3.23-2.52c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.75-5.59-4.1H3.08v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.41 13.9a6 6 0 0 1 0-3.8V7.5H3.08a10 10 0 0 0 0 9Z"/><path fill="#EA4335" d="M12 6c1.47 0 2.79.5 3.82 1.5l2.86-2.86C16.96 2.98 14.7 2 12 2a10 10 0 0 0-8.92 5.5l3.33 2.6C7.2 7.75 9.4 6 12 6Z"/></svg>'
};
const svg = name => icons[name] || '';
document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = svg(el.dataset.icon); });
$('brandIcon').innerHTML = svg('logo'); $('loginIcon').innerHTML = svg('logo'); $('googleIcon').innerHTML = svg('google');
$('year').textContent = new Date().getFullYear();

const themeKey = 'lunex-theme';
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const dark = theme === 'dark';
  $('themeIcon').innerHTML = svg(dark ? 'sun' : 'moon');
  $('themeToggle').setAttribute('aria-label', dark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن');
  $('themeToggle').title = dark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن';
}
let initialTheme = 'light';
try { initialTheme = localStorage.getItem(themeKey) === 'dark' ? 'dark' : 'light'; } catch {}
applyTheme(initialTheme);
$('themeToggle').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem(themeKey, next); } catch {}
});

let auth = null, currentUser = null, editingId = null, scriptsCache = [];
function toast(message) { const t = $('toast'); t.textContent = message; t.classList.remove('hidden'); clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.add('hidden'), 3200); }
function showLoginError(message) { $('loginError').textContent = message; $('loginError').classList.remove('hidden'); }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
async function api(path, options = {}) {
  if (!currentUser) throw new Error('سجّل الدخول أولًا.');
  const token = await currentUser.getIdToken();
  const response = await fetch(path, { ...options, headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}`, ...(options.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `حدث خطأ (${response.status})`);
  return data;
}
function setBusy(button, busy, label) { button.disabled = busy; if (busy) { button.dataset.oldLabel = button.textContent; button.textContent = label || 'لحظة...'; } else if (button.dataset.oldLabel) { button.textContent = button.dataset.oldLabel; delete button.dataset.oldLabel; } }
function openDialog(script = null) {
  editingId = script?.public_id || null;
  $('dialogTitle').textContent = script ? 'تعديل السورس' : 'إنشاء سورس جديد';
  $('scriptTitle').value = script?.title || '';
  $('scriptSource').value = script?.source || '';
  $('charCount').textContent = `${$('scriptSource').value.length.toLocaleString('ar')} حرف`;
  $('deleteScriptBtn').classList.toggle('hidden', !script);
  $('editorError').classList.add('hidden');
  $('scriptDialog').showModal();
  setTimeout(() => $('scriptTitle').focus(), 50);
}
function closeDialog() { $('scriptDialog').close(); }
function renderScripts(scripts) {
  scriptsCache = scripts;
  $('statTotal').textContent = scripts.length.toLocaleString('ar');
  $('statEnabled').textContent = scripts.filter(s => s.enabled).length.toLocaleString('ar');
  if (!scripts.length) {
    $('scriptsList').innerHTML = `<div class="empty-state"><span>${svg('files')}</span><b>ما عندك سورسات حتى الآن</b><p>أنشئ أول سورس واحفظه داخل حسابك الخاص.</p><button class="btn btn-primary" id="emptyNewBtn">${svg('plus')} إنشاء أول سورس</button></div>`;
    $('emptyNewBtn').addEventListener('click', () => openDialog());
    return;
  }
  $('scriptsList').innerHTML = scripts.map(s => `<article class="script-row">
    <div class="script-icon">${svg('code')}</div>
    <div class="script-info"><b>${escapeHtml(s.title)}</b><small>${escapeHtml(s.public_id)} · ${s.created_at ? new Date(s.created_at).toLocaleDateString('ar') : ''}</small></div>
    <span class="status ${s.enabled ? '' : 'off'}">${s.enabled ? 'مفعّل' : 'معطّل'}</span>
    <div class="row-actions"><button data-edit="${escapeHtml(s.public_id)}">فتح وتعديل</button><button data-toggle="${escapeHtml(s.public_id)}" data-enabled="${s.enabled}">${s.enabled ? 'تعطيل' : 'تفعيل'}</button></div>
  </article>`).join('');
  $('scriptsList').querySelectorAll('[data-edit]').forEach(btn => btn.addEventListener('click', async () => {
    try { const data = await api(`/api/scripts/${encodeURIComponent(btn.dataset.edit)}`); openDialog(data.script); }
    catch (e) { toast(e.message); }
  }));
  $('scriptsList').querySelectorAll('[data-toggle]').forEach(btn => btn.addEventListener('click', async () => {
    try { await api(`/api/scripts/${encodeURIComponent(btn.dataset.toggle)}`, { method:'PATCH', body:JSON.stringify({enabled:btn.dataset.enabled !== 'true'}) }); await loadScripts(); toast('تم تحديث حالة السورس.'); }
    catch (e) { toast(e.message); }
  }));
}
async function loadScripts() { const data = await api('/api/scripts'); renderScripts(data.scripts || []); }
async function loadEvents() {
  try {
    const data = await api('/api/admin/events');
    $('eventsList').innerHTML = data.events.length ? data.events.map(e => `<div class="event-row"><div class="script-icon">${svg('activity')}</div><div class="script-info"><b>${escapeHtml(e.event_type)} · ${escapeHtml(e.title || 'سورس محذوف')}</b><small>المالك: ${escapeHtml(e.owner_uid || '—')} · الفاعل: ${escapeHtml(e.actor_uid || '—')} · ${e.created_at ? new Date(e.created_at).toLocaleString('ar') : ''}</small></div></div>`).join('') : '<div class="empty-state">لا توجد أحداث حتى الآن.</div>';
  } catch (e) { toast(e.message); }
}
function showApp(user, profile) {
  $('loginView').classList.add('hidden'); $('appView').classList.remove('hidden'); $('logoutBtn').classList.remove('hidden');
  $('userEmail').textContent = user.email || '';
  $('adminPanel').classList.toggle('hidden', !profile.isAdmin);
  loadScripts().catch(e => toast(e.message));
}
function showLogin() {
  $('loginView').classList.remove('hidden'); $('appView').classList.add('hidden'); $('logoutBtn').classList.add('hidden'); $('userEmail').textContent = '';
}
$('googleBtn').addEventListener('click', async () => {
  $('loginError').classList.add('hidden');
  if (!configured) { showLoginError('أكمل إعداد Firebase في frontend/app.js حسب ملف README.md.'); return; }
  const button = $('googleBtn'); setBusy(button, true, 'جاري فتح Google...');
  try {
    const provider = new GoogleAuthProvider(); provider.setCustomParameters({ prompt:'select_account' });
    await signInWithPopup(auth, provider);
  } catch (e) {
    if (['auth/popup-blocked','auth/operation-not-supported-in-this-environment'].includes(e.code)) {
      try { await signInWithRedirect(auth, new GoogleAuthProvider()); } catch (err) { showLoginError(err.message); }
    } else showLoginError(e.code === 'auth/unauthorized-domain' ? 'أضف نطاق موقعك إلى Authorized domains في Firebase.' : (e.message || 'تعذر تسجيل الدخول.'));
  } finally { setBusy(button, false); }
});
$('logoutBtn').addEventListener('click', async () => { if (auth) await signOut(auth); currentUser = null; showLogin(); });
$('newScriptBtn').addEventListener('click', () => openDialog());
$('refreshBtn').addEventListener('click', () => loadScripts().catch(e => toast(e.message)));
$('refreshEventsBtn').addEventListener('click', loadEvents);
$('closeDialogBtn').addEventListener('click', closeDialog); $('cancelBtn').addEventListener('click', closeDialog);
$('scriptSource').addEventListener('input', () => $('charCount').textContent = `${$('scriptSource').value.length.toLocaleString('ar')} حرف`);
$('scriptForm').addEventListener('submit', async event => {
  event.preventDefault();
  const title = $('scriptTitle').value.trim(), source = $('scriptSource').value;
  const button = $('saveBtn'); setBusy(button, true, 'جاري الحفظ...');
  $('editorError').classList.add('hidden');
  try {
    if (editingId) await api(`/api/scripts/${encodeURIComponent(editingId)}`, { method:'PATCH', body:JSON.stringify({title, source}) });
    else await api('/api/scripts', { method:'POST', body:JSON.stringify({title, source}) });
    closeDialog(); await loadScripts(); toast('تم حفظ السورس بنجاح.');
  } catch (e) { $('editorError').textContent = e.message; $('editorError').classList.remove('hidden'); }
  finally { setBusy(button, false); }
});
$('deleteScriptBtn').addEventListener('click', async () => {
  if (!editingId || !confirm('متأكد أنك تبي تحذف السورس نهائيًا؟')) return;
  const button = $('deleteScriptBtn'); setBusy(button, true, 'جاري الحذف...');
  try { await api(`/api/scripts/${encodeURIComponent(editingId)}`, {method:'DELETE'}); closeDialog(); await loadScripts(); toast('تم حذف السورس.'); }
  catch (e) { $('editorError').textContent = e.message; $('editorError').classList.remove('hidden'); }
  finally { setBusy(button, false); }
});

if (configured) {
  try {
    const appInstance = initializeApp(firebaseConfig);
    auth = getAuth(appInstance);
    getRedirectResult(auth).catch(e => showLoginError(e.message));
    onAuthStateChanged(auth, async user => {
      currentUser = user;
      if (!user) { showLogin(); return; }
      try { const profile = await api('/api/me'); showApp(user, profile); if (profile.isAdmin) loadEvents(); }
      catch (e) { showLogin(); showLoginError(e.message); }
    });
  } catch (e) { showLoginError(`تعذر تشغيل Firebase: ${e.message}`); }
} else showLogin();
