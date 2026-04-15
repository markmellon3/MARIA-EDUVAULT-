// ============================================================
// FIREBASE CONFIGURATION
// Replace these with YOUR Firebase project credentials
// Get them from: https://console.firebase.google.com
//   -> Project Settings -> General -> Your apps -> Web app
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyDfkn8qSyzl0dbGF345p-EBoGdzwkahFZw",
  authDomain: "maria-eduvault.firebaseapp.com",
  databaseURL: "https://maria-eduvault-default-rtdb.firebaseio.com",
  projectId: "maria-eduvault",
  storageBucket: "maria-eduvault.firebasestorage.app",
  messagingSenderId: "937941285420",
  appId: "1:937941285420:web:9202c12953b1f184a42f89",
  measurementId: "G-Z1FKQCFKP8"
};

// Initialize Firebase
let db, auth, storage;
let firebaseReady = false;
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  auth = firebase.auth();
  storage = firebase.storage();
  firebaseReady = true;
  console.log("Firebase initialized successfully.");
} catch (e) {
  console.error("Firebase initialization FAILED. App cannot run without Firebase.", e);
}

// ============================================================
// COMPLETE GLOBAL SUBJECT DATA — 72 Subjects, 10 Categories
// ============================================================
const CATS = [
  { id: "math", name: "Mathematics & Statistics", color: "var(--cat-math)", icon: "fa-calculator", sub: [
    { id: "math_gen", name: "Mathematics (General)" }, { id: "pure_math", name: "Pure Mathematics" },
    { id: "app_math", name: "Applied Mathematics" }, { id: "further_math", name: "Further Mathematics" },
    { id: "stats", name: "Statistics" }, { id: "prob", name: "Probability" }
  ]},
  { id: "sci", name: "Sciences", color: "var(--cat-science)", icon: "fa-flask", sub: [
    { id: "physics", name: "Physics" }, { id: "chem", name: "Chemistry" }, { id: "bio", name: "Biology" },
    { id: "env_sci", name: "Environmental Science" }, { id: "agri", name: "Agricultural Science" },
    { id: "marine", name: "Marine Biology" }, { id: "biotech", name: "Biotechnology" },
    { id: "food_sci", name: "Food Science" }, { id: "earth_sci", name: "Earth Science" }
  ]},
  { id: "ict", name: "ICT & Technology", color: "var(--cat-ict)", icon: "fa-laptop-code", sub: [
    { id: "comp_stud", name: "Computer Studies" }, { id: "it", name: "Information Technology (IT)" },
    { id: "ict_sub", name: "ICT" }, { id: "prog", name: "Programming" },
    { id: "web", name: "Web Development" }, { id: "ds", name: "Data Science" },
    { id: "ai_sub", name: "Artificial Intelligence" }, { id: "cyber", name: "Cybersecurity" },
    { id: "robo", name: "Robotics" }
  ]},
  { id: "hum", name: "Humanities & Social Sciences", color: "var(--cat-humanities)", icon: "fa-landmark", sub: [
    { id: "hist", name: "History" }, { id: "geo", name: "Geography" },
    { id: "rel_ed", name: "Religious Education" }, { id: "soc", name: "Sociology" },
    { id: "psych", name: "Psychology" }, { id: "phil", name: "Philosophy" },
    { id: "pol_sci", name: "Political Science" }, { id: "econ", name: "Economics" },
    { id: "anthro", name: "Anthropology" }
  ]},
  { id: "lang", name: "Languages & Literature", color: "var(--cat-languages)", icon: "fa-language", sub: [
    { id: "eng", name: "English Language" }, { id: "lit_eng", name: "Literature in English" },
    { id: "kisw", name: "Kiswahili" }, { id: "fr", name: "French" },
    { id: "es", name: "Spanish" }, { id: "ar", name: "Arabic" },
    { id: "de", name: "German" }, { id: "zh", name: "Chinese" },
    { id: "loc_lang", name: "Local Languages" }
  ]},
  { id: "biz", name: "Business & Commerce", color: "var(--cat-business)", icon: "fa-briefcase", sub: [
    { id: "comm", name: "Commerce" }, { id: "acc", name: "Accounting" },
    { id: "biz_stud", name: "Business Studies" }, { id: "entre", name: "Entrepreneurship" },
    { id: "mkt", name: "Marketing" }, { id: "fin", name: "Finance" }
  ]},
  { id: "tech", name: "Technical & Vocational", color: "var(--cat-technical)", icon: "fa-wrench", sub: [
    { id: "tech_draw", name: "Technical Drawing" }, { id: "wood", name: "Woodwork" },
    { id: "metal", name: "Metalwork" }, { id: "bldg", name: "Building Construction" },
    { id: "elec", name: "Electrical Installation" }, { id: "mech", name: "Mechanics" },
    { id: "auto", name: "Automotive Studies" }
  ]},
  { id: "cre", name: "Creative & Arts", color: "var(--cat-creative)", icon: "fa-palette", sub: [
    { id: "fine_art", name: "Fine Art" }, { id: "music", name: "Music" },
    { id: "dance", name: "Dance" }, { id: "drama", name: "Drama & Theatre" },
    { id: "film", name: "Film Studies" }
  ]},
  { id: "phy", name: "Physical & Life Skills", color: "var(--cat-physical)", icon: "fa-running", sub: [
    { id: "pe", name: "Physical Education" }, { id: "health", name: "Health Education" },
    { id: "life_sk", name: "Life Skills Education" }, { id: "guid", name: "Guidance & Counseling" }
  ]},
  { id: "spec", name: "Specialized & Advanced", color: "var(--cat-specialized)", icon: "fa-rocket", sub: [
    { id: "avia", name: "Aviation Studies" }, { id: "law", name: "Law" },
    { id: "med", name: "Medicine Basics" }, { id: "eng_fund", name: "Engineering Fundamentals" },
    { id: "arch", name: "Architecture" }, { id: "nurs", name: "Nursing Studies" }
  ]}
];

const SCHOOLS = [
  { id: "s1", name: "Alliance High School", country: "Kenya", cur: "CBC", tc: "#059669", stu: 1200, tch: 85, res: 340, sn: "AHS" },
  { id: "s2", name: "Starehe Boys Centre", country: "Kenya", cur: "CBC", tc: "#0891B2", stu: 980, tch: 72, res: 280, sn: "SBC" },
  { id: "s3", name: "Lagos International College", country: "Nigeria", cur: "WASSCE", tc: "#D97706", stu: 2100, tch: 140, res: 520, sn: "LIC" },
  { id: "s4", name: "Marlborough Academy", country: "UK", cur: "GCSE/A-Level", tc: "#DC2626", stu: 850, tch: 65, res: 410, sn: "MA" },
  { id: "s5", name: "Delhi Public School", country: "India", cur: "CBSE", tc: "#EA580C", stu: 3500, tch: 220, res: 780, sn: "DPS" },
  { id: "s6", name: "Gymnasium Bern", country: "Switzerland", cur: "Swiss Matura", tc: "#0D9488", stu: 620, tch: 48, res: 195, sn: "GB" },
  { id: "s7", name: "Tokyo Metropolitan High", country: "Japan", cur: "Japanese National", tc: "#DB2777", stu: 1100, tch: 78, res: 310, sn: "TMH" },
  { id: "s8", name: "Springfield Academy", country: "USA", cur: "Common Core", tc: "#CA8A04", stu: 1800, tch: 125, res: 620, sn: "SA" }
];

const LEVELS = ["Senior 1","Senior 2","Senior 3","Senior 4","Senior 5","Senior 6","Year 10","Year 11","Year 12","Grade 9","Grade 10","Grade 11","Grade 12"];
const COUNTRIES = ["Kenya","Nigeria","Uganda","Tanzania","Ghana","South Africa","UK","USA","India","Japan","Switzerland","Germany","France","China","Brazil","Australia"];
const TYPES = ["notes", "exams", "books", "videos"];

// ============================================================
// RESOURCE GENERATION — 130+ realistic academic resources
// ============================================================
function genRes() {
  var R = [];
  var T = {
    physics: ["Mechanics: Newton's Laws of Motion","Thermal Physics & Heat Transfer","Waves & Optics Comprehensive Notes","Electricity & Magnetism Study Guide","Atomic Physics & Radioactivity","Quantum Mechanics Introduction","Fluid Dynamics & Bernoulli's Principle"],
    chem: ["Organic Chemistry: Alkanes to Alcohols","Periodic Table Trends & Patterns","Chemical Bonding & Structure","Acids, Bases & Salt Analysis","Electrochemistry & Cells","Rate of Reaction & Equilibrium","Industrial Chemistry Processes"],
    bio: ["Cell Biology & Organelles","Genetics & Inheritance Patterns","Ecology & Ecosystem Dynamics","Human Physiology: Digestive System","Photosynthesis & Respiration","Evolution & Natural Selection","Reproduction in Plants & Animals"],
    math_gen: ["Algebra: Quadratic Equations","Calculus: Differentiation Basics","Trigonometry & Identities","Probability & Combinatorics","Statistics: Measures of Central Tendency","Coordinate Geometry","Matrices & Transformations"],
    eng: ["Grammar Rules & Common Errors","Essay Writing Techniques","Comprehension Passage Analysis","Poetry Analysis Framework","Oral Communication Skills","Vocabulary Building Guide","Shakespeare: Hamlet Study Notes"],
    hist: ["The Scramble for Africa","World War I: Causes & Effects","The Industrial Revolution","Ancient Civilizations","Cold War: Origins & Key Events","Decolonization in Africa","The French Revolution"],
    geo: ["Climate & Weather Systems","Population Dynamics & Migration","Map Reading & Interpretation","Rivers & Hydrological Cycle","Agricultural Systems","Urbanization & Settlement Patterns","Mineral Resources & Mining"],
    comp_stud: ["Introduction to Programming Logic","Database Management Systems","Networking Fundamentals","Computer Hardware Components","Operating Systems Concepts","HTML & CSS Basics","Data Representation & Binary"],
    econ: ["Supply & Demand Analysis","Market Structures & Competition","National Income Accounting","Inflation & Unemployment","International Trade Theory","Economic Development Indicators","Fiscal & Monetary Policy"],
    acc: ["Double Entry Bookkeeping","Financial Statements Preparation","Partnership Accounts","Company Accounts & Balance Sheet","Cost Accounting Principles","Budgeting & Budgetary Control","Auditing Fundamentals"],
    kisw: ["Sarufi na Matumizi ya Lugha","Ushairi: Vipengele na Vyanzo","Hadithi Fupi: Mbinu za Uandishi","Tafsiri ya Riwaya","Insha za Kiswahili","Lugha na Jamii","Fasihi Simulizi na Andishi"],
    prog: ["Python Basics: Variables & Data Types","OOP in Java","C++ Pointers & Memory Management","Data Structures: Arrays & Linked Lists","Algorithm Design & Analysis","Web APIs with JavaScript","Machine Learning with Python"],
    psych: ["Introduction to Psychology","Memory & Learning Theories","Developmental Psychology","Social Psychology & Group Behavior","Abnormal Psychology & Disorders","Research Methods in Psychology","Cognitive Psychology & Perception"],
    biz_stud: ["Business Environment Analysis","Human Resource Management","Marketing Mix & Strategy","Operations Management","Business Ethics & CSR","Entrepreneurship & Innovation","Financial Management Basics"],
    pe: ["Anatomy for Physical Education","Training Methods & Principles","Sports Nutrition & Diet","First Aid & Injury Management","Fitness Testing & Assessment","Sports Psychology Basics","History of Olympic Games"],
    further_math: ["Complex Numbers & Argand Diagrams","Differential Equations","Vector Spaces & Linear Algebra","Group Theory Introduction","Numerical Methods","Hyperbolic Functions","Mechanics: Work, Energy & Power"],
    ai_sub: ["Introduction to Artificial Intelligence","Neural Networks Fundamentals","Natural Language Processing","Computer Vision Basics","Reinforcement Learning","Ethics in AI","AI in Healthcare Applications"],
    fr: ["Grammaire Francaise de Base","Comprehension Ecrite","Expression Orale","Civilisation Francaise","Litterature Francaise","Vocabulaire et Idiomes","Preparation DELF B1"]
  };
  var id = 1;
  var auths = ["Dr. A. Kimani","Prof. J. Ochieng","Ms. S. Patel","Mr. R. Johnson","Dr. L. Mueller","Ms. Y. Tanaka","Prof. M. Santos"];
  for (var si in T) {
    T[si].forEach(function(t, i) {
      var tp = TYPES[i % 4];
      var sch = i % 3 === 0 ? SCHOOLS[i % SCHOOLS.length] : null;
      R.push({
        id: "r" + (id++), title: t, subjId: si,
        subjName: subjName(si), cat: subjCat(si), type: tp,
        level: LEVELS[i % LEVELS.length],
        schId: sch ? sch.id : null, schName: sch ? sch.name : "Public",
        vis: sch ? "school" : "public",
        desc: "Comprehensive " + tp + " covering key concepts in " + t.split(":")[0] + ". Ideal for exam preparation with detailed explanations and worked examples.",
        tags: t.toLowerCase().split(/[:\s,&]+/).filter(function(w){ return w.length > 3; }).slice(0, 5),
        dl: Math.floor(Math.random() * 5000) + 100,
        rat: +(3.5 + Math.random() * 1.5).toFixed(1),
        auth: auths[i % 7],
        date: "2024-" + String(Math.floor(Math.random()*12)+1).padStart(2,"0") + "-" + String(Math.floor(Math.random()*28)+1).padStart(2,"0"),
        ctry: COUNTRIES[i % COUNTRIES.length],
        cur: sch ? sch.cur : "International",
        sz: (Math.random() * 10 + 0.5).toFixed(1) + " MB",
        pg: Math.floor(Math.random() * 80) + 8
      });
    });
  }
  return R;
}

// ============================================================
// UTILITY HELPERS
// ============================================================
function subjName(id) {
  for (var ci = 0; ci < CATS.length; ci++) {
    for (var si = 0; si < CATS[ci].sub.length; si++) {
      if (CATS[ci].sub[si].id === id) return CATS[ci].sub[si].name;
    }
  }
  var found = firebaseCustomSubjects.find(function(s){ return s.id === id; });
  return found ? found.name : id;
}

function subjCat(id) {
  for (var ci = 0; ci < CATS.length; ci++) {
    for (var si = 0; si < CATS[ci].sub.length; si++) {
      if (CATS[ci].sub[si].id === id) return CATS[ci].name;
    }
  }
  var found = firebaseCustomSubjects.find(function(s){ return s.id === id; });
  return found ? (found.cat || "Custom") : "Custom";
}

function catColor(cn) {
  var c = CATS.find(function(x){ return x.name === cn; });
  return c ? c.color : "var(--acc)";
}

function catIcon(cn) {
  var c = CATS.find(function(x){ return x.name === cn; });
  return c ? c.icon : "fa-book";
}

function allSubj() {
  var a = [];
  CATS.forEach(function(c) {
    c.sub.forEach(function(s) {
      a.push({ id: s.id, name: s.name, cat: c.name, color: c.color, icon: c.icon });
    });
  });
  firebaseCustomSubjects.forEach(function(s) {
    a.push({ id: s.id, name: s.name, cat: s.cat || "Custom", color: "var(--acc)", icon: "fa-plus-circle" });
  });
  return a;
}

function resCount(sid) {
  return RES.filter(function(r){ return r.subjId === sid; }).length;
}

function esc(s) {
  if (!s) return "";
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

function toast(m, t) {
  t = t || "inf";
  var c = document.getElementById("tC");
  if (!c) return;
  var icons = { ok: "fa-check-circle", er: "fa-times-circle", inf: "fa-info-circle" };
  var d = document.createElement("div");
  d.className = "toast " + t;
  d.innerHTML = '<i class="fas ' + icons[t] + '"></i> ' + m;
  c.appendChild(d);
  setTimeout(function() {
    d.style.opacity = "0";
    d.style.transform = "translateX(25px)";
    d.style.transition = "all .3s";
    setTimeout(function() { d.remove(); }, 300);
  }, 3000);
}

function modal(t, h) {
  document.getElementById("mC").innerHTML =
    '<div class="mo" onclick="if(event.target===this)clMod()"><div class="mb"><button class="mcl" onclick="clMod()"><i class="fas fa-times"></i></button><h3 class="fd">' + t + "</h3>" + h + "</div></div>";
}

function clMod() {
  document.getElementById("mC").innerHTML = "";
}

function togSB() {
  document.getElementById("sb").classList.toggle("mo");
  document.getElementById("sov").classList.toggle("act");
}

// ============================================================
// APP STATE — All Firebase-backed
// ============================================================
var RES = genRes();
var curView = "dash";
var curP = {};
var curRole = "student";
var curSch = "all";
var chatH = [];
var upPDF = null;
var pdfTxt = "";
var chrts = {};
var currentUser = null;
var userProfile = null;
var downloadHistory = [];
var firebaseCustomSubjects = []; // Loaded from Firestore
var firebaseRegistrations = [];  // Loaded from Firestore
var unsubscribers = [];          // Track real-time listeners for cleanup

// ============================================================
// FIREBASE AUTH — Login
// ============================================================
function showLogin() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("authError").style.display = "none";
}

function showRegister() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
  document.getElementById("authError").style.display = "none";
}

function showAuthError(msg) {
  var el = document.getElementById("authError");
  el.textContent = msg;
  el.style.display = "block";
}

function showAuthLoading(show) {
  document.getElementById("authLoading").style.display = show ? "flex" : "none";
  document.getElementById("authForms").style.opacity = show ? "0.4" : "1";
  document.getElementById("authForms").style.pointerEvents = show ? "none" : "auto";
}

async function handleLogin() {
  var email = document.getElementById("loginEmail").value.trim();
  var pass = document.getElementById("loginPass").value;
  if (!email || !pass) { showAuthError("Please enter email and password."); return; }
  if (!auth) { showAuthError("Firebase not configured. Check app.js line 10."); return; }
  showAuthLoading(true);
  document.getElementById("authError").style.display = "none";
  try {
    await auth.signInWithEmailAndPassword(email, pass);
  } catch (e) {
    showAuthError(fbErr(e.code));
  }
  showAuthLoading(false);
}

// ============================================================
// FIREBASE AUTH — Register
// ============================================================
async function handleRegister() {
  var name = document.getElementById("regName").value.trim();
  var email = document.getElementById("regEmail").value.trim();
  var pass = document.getElementById("regPass").value;
  var role = document.getElementById("regRole").value;
  if (!name || !email || !pass) { showAuthError("Please fill all fields."); return; }
  if (pass.length < 6) { showAuthError("Password must be at least 6 characters."); return; }
  if (!auth) { showAuthError("Firebase not configured. Check app.js line 10."); return; }
  showAuthLoading(true);
  document.getElementById("authError").style.display = "none";
  try {
    var cred = await auth.createUserWithEmailAndPassword(email, pass);
    await cred.user.updateProfile({ displayName: name });
    await db.collection("users").doc(cred.user.uid).set({
      displayName: name, email: email, role: role,
      schoolId: null, photoURL: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      settings: { notifications: true, darkMode: true, emailDigest: false, publicProfile: false, defaultSchool: "all" }
    });
  } catch (e) {
    showAuthError(fbErr(e.code));
  }
  showAuthLoading(false);
}

// ============================================================
// FIREBASE AUTH — Google Sign-In
// ============================================================
async function handleGoogleSignIn() {
  if (!auth) { showAuthError("Firebase not configured. Check app.js line 10."); return; }
  showAuthLoading(true);
  document.getElementById("authError").style.display = "none";
  try {
    var provider = new firebase.auth.GoogleAuthProvider();
    var result = await auth.signInWithPopup(provider);
    var doc = await db.collection("users").doc(result.user.uid).get();
    if (!doc.exists) {
      await db.collection("users").doc(result.user.uid).set({
        displayName: result.user.displayName || "User",
        email: result.user.email,
        photoURL: result.user.photoURL || null,
        role: "student", schoolId: null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        settings: { notifications: true, darkMode: true, emailDigest: false, publicProfile: false, defaultSchool: "all" }
      });
    }
  } catch (e) {
    if (e.code !== "auth/popup-closed-by-user" && e.code !== "auth/cancelled-popup-request") {
      showAuthError(fbErr(e.code));
    }
  }
  showAuthLoading(false);
}

// ============================================================
// FIREBASE AUTH — Logout
// ============================================================
async function handleLogout() {
  // Clean up all real-time listeners
  unsubscribers.forEach(function(unsub) { if (typeof unsub === "function") unsub(); });
  unsubscribers = [];
  firebaseCustomSubjects = [];
  firebaseRegistrations = [];
  downloadHistory = [];
  chatH = [];

  if (auth) {
    try { await auth.signOut(); } catch (e) { console.warn(e); }
  }
  currentUser = null;
  userProfile = null;
  document.getElementById("app").classList.remove("vis");
  document.getElementById("authScreen").classList.remove("hid");
  toast("Signed out", "inf");
}

// ============================================================
// FIREBASE AUTH — Error Messages
// ============================================================
function fbErr(code) {
  var msgs = {
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/popup-blocked": "Popup was blocked. Please allow popups and try again.",
    "auth/cancelled-popup-request": "Sign-in was cancelled.",
    "auth/invalid-credential": "Invalid credentials. Please check your email and password."
  };
  return msgs[code] || "Authentication error: " + (code || "unknown") + ". Please try again.";
}

// ============================================================
// FIREBASE AUTH — State Observer
// ============================================================
function initAuthObserver() {
  if (!auth || !db) {
    document.getElementById("authScreen").innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;text-align:center;padding:20px">' +
      '<i class="fas fa-exclamation-triangle" style="font-size:48px;color:var(--red);margin-bottom:20px"></i>' +
      '<h2 style="color:var(--tx);font-size:22px;font-weight:700;margin-bottom:8px">Firebase Not Configured</h2>' +
      '<p style="color:var(--tx2);font-size:14px;max-width:400px;line-height:1.6">EduVault requires Firebase to function. Please check your <code style="background:var(--input);padding:2px 6px;border-radius:4px">firebaseConfig</code> in <code style="background:var(--input);padding:2px 6px;border-radius:4px">app.js</code> and ensure Firebase SDK scripts are loaded in your HTML.</p>' +
      '</div>';
    return;
  }

  auth.onAuthStateChanged(async function(user) {
    if (user) {
      currentUser = user;
      try {
        var doc = await db.collection("users").doc(user.uid).get();
        if (doc.exists) {
          userProfile = doc.data();
          curRole = userProfile.role || "student";
        } else {
          // Create profile if it doesn't exist (edge case)
          userProfile = {
            displayName: user.displayName || "User",
            email: user.email,
            role: "student",
            photoURL: user.photoURL || null,
            schoolId: null,
            settings: { notifications: true, darkMode: true, emailDigest: false, publicProfile: false, defaultSchool: "all" }
          };
          await db.collection("users").doc(user.uid).set(userProfile);
        }
      } catch (e) {
        console.error("Failed to load user profile:", e);
        userProfile = {
          displayName: user.displayName || "User",
          email: user.email,
          role: "student",
          photoURL: null,
          settings: {}
        };
      }

      // Load all Firebase data in parallel
      await Promise.all([
        loadDownloadHistory(user.uid),
        loadCustomSubjects(user.uid),
        loadSchoolRegistrations(user.uid)
      ]);

      enterApp();
    } else {
      // Clean up listeners
      unsubscribers.forEach(function(unsub) { if (typeof unsub === "function") unsub(); });
      unsubscribers = [];
      firebaseCustomSubjects = [];
      firebaseRegistrations = [];
      downloadHistory = [];
      currentUser = null;
      userProfile = null;
      document.getElementById("app").classList.remove("vis");
      document.getElementById("authScreen").classList.remove("hid");
    }
  });
}

function enterApp() {
  document.getElementById("authScreen").classList.add("hid");
  document.getElementById("app").classList.add("vis");
  updateTopBar();
  buildSidebar();
  populateSchoolSelect();
  updCnt();
  render();
}

// ============================================================
// FIREBASE — Download History (FULLY FIRESTORE)
// ============================================================
async function loadDownloadHistory(uid) {
  try {
    var snap = await db.collection("downloads")
      .where("userId", "==", uid)
      .orderBy("timestamp", "desc")
      .limit(200)
      .get();

    downloadHistory = snap.docs.map(function(d) {
      var data = d.data();
      return {
        id: d.id,
        date: data.timestamp ? new Date(data.timestamp.toDate()).toLocaleDateString() : "",
        resourceTitle: data.resourceTitle || "",
        subjectName: data.subjectName || "",
        type: data.type || "",
        level: data.level || "",
        timestamp: data.timestamp
      };
    });
  } catch (e) {
    console.error("Failed to load download history:", e);
    downloadHistory = [];
  }
}

async function trackDownload(resource) {
  var entry = {
    userId: currentUser.uid,
    resourceId: resource.id,
    resourceTitle: resource.title,
    subjectName: resource.subjName,
    type: resource.type,
    level: resource.level,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    await db.collection("downloads").add(entry);
  } catch (e) {
    console.error("Failed to save download to Firestore:", e);
    toast("Download tracked locally (sync failed)", "inf");
    return;
  }

  // Update local state for immediate UI response
  downloadHistory.unshift({
    id: "tmp_" + Date.now(),
    date: new Date().toLocaleDateString(),
    resourceTitle: resource.title,
    subjectName: resource.subjName,
    type: resource.type,
    level: resource.level,
    timestamp: new Date()
  });

  if (downloadHistory.length > 200) downloadHistory = downloadHistory.slice(0, 200);

  var nd = document.getElementById("dlNotif");
  if (nd) nd.style.display = "block";
  toast("Downloading: " + resource.title, "ok");
}

async function clearHistory() {
  if (!currentUser) return;

  try {
    // Delete in batches of 500 (Firestore limit)
    var keepDeleting = true;
    while (keepDeleting) {
      var snap = await db.collection("downloads")
        .where("userId", "==", currentUser.uid)
        .limit(500)
        .get();

      if (snap.empty) {
        keepDeleting = false;
        break;
      }

      var batch = db.batch();
      snap.docs.forEach(function(d) { batch.delete(d.ref); });
      await batch.commit();
    }
  } catch (e) {
    console.error("Failed to clear download history:", e);
    toast("Failed to clear history", "er");
    return;
  }

  downloadHistory = [];
  var nd = document.getElementById("dlNotif");
  if (nd) nd.style.display = "none";
  toast("History cleared from Firebase", "ok");
  render();
}

// ============================================================
// FIREBASE — Custom Subjects (FULLY FIRESTORE)
// ============================================================
async function loadCustomSubjects(uid) {
  try {
    var snap = await db.collection("customSubjects")
      .where("userId", "==", uid)
      .orderBy("createdAt", "desc")
      .get();

    firebaseCustomSubjects = snap.docs.map(function(d) {
      var data = d.data();
      return {
        id: d.id,
        docId: d.id,
        name: data.name || "",
        cat: data.category || "Custom",
        userId: data.userId
      };
    });
  } catch (e) {
    console.error("Failed to load custom subjects:", e);
    firebaseCustomSubjects = [];
  }
}

async function addSubj() {
  var n = document.getElementById("nsN").value.trim();
  if (!n) { toast("Enter a subject name", "er"); return; }
  var c = document.getElementById("nsC").value;
  var i = document.getElementById("nsI").value.trim();
  if (!i) i = "custom_" + n.toLowerCase().replace(/[^a-z0-9]/g, "_") + "_" + Date.now();

  // Check for duplicates in built-in subjects
  for (var ci = 0; ci < CATS.length; ci++) {
    for (var si = 0; si < CATS[ci].sub.length; si++) {
      if (CATS[ci].sub[si].id === i) { toast("Subject ID already exists in built-in subjects", "er"); return; }
    }
  }

  // Check for duplicates in existing custom subjects
  if (firebaseCustomSubjects.find(function(s) { return s.id === i; })) {
    toast("Subject ID already exists", "er"); return;
  }

  try {
    var docRef = await db.collection("customSubjects").add({
      name: n,
      category: c,
      customId: i,
      userId: currentUser.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    firebaseCustomSubjects.unshift({
      id: i,
      docId: docRef.id,
      name: n,
      cat: c,
      userId: currentUser.uid
    });

    updCnt();
    toast('"' + n + '" added to Firebase!', "ok");
    document.getElementById("nsN").value = "";
    document.getElementById("nsI").value = "";
    buildSidebar();
    render();
  } catch (e) {
    console.error("Failed to add custom subject:", e);
    toast("Failed to add subject. Check Firebase connection.", "er");
  }
}

async function delSubj(customId) {
  var subject = firebaseCustomSubjects.find(function(s) { return s.id === customId; });
  if (!subject || !subject.docId) { toast("Subject not found", "er"); return; }

  try {
    await db.collection("customSubjects").doc(subject.docId).delete();
    firebaseCustomSubjects = firebaseCustomSubjects.filter(function(s) { return s.id !== customId; });
    updCnt();
    toast("Subject removed from Firebase", "ok");
    buildSidebar();
    render();
  } catch (e) {
    console.error("Failed to delete custom subject:", e);
    toast("Failed to delete subject", "er");
  }
}

// ============================================================
// FIREBASE — School Registrations (FULLY FIRESTORE)
// ============================================================
async function loadSchoolRegistrations(uid) {
  // For admins, load all; for others, load own
  try {
    if (curRole === "admin") {
      var allSnap = await db.collection("schoolRegistrations")
        .orderBy("createdAt", "desc")
        .limit(100)
        .get();
      firebaseRegistrations = allSnap.docs.map(function(d) {
        var data = d.data();
        return {
          id: d.id,
          schoolName: data.schoolName || "",
          shortName: data.shortName || "",
          country: data.country || "",
          curriculum: data.curriculum || "",
          status: data.status || "pending",
          userName: data.userName || "",
          createdAt: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString() : ""
        };
      });
    } else {
      var mySnap = await db.collection("schoolRegistrations")
        .where("userId", "==", uid)
        .orderBy("createdAt", "desc")
        .limit(50)
        .get();
      firebaseRegistrations = mySnap.docs.map(function(d) {
        var data = d.data();
        return {
          id: d.id,
          schoolName: data.schoolName || "",
          shortName: data.shortName || "",
          country: data.country || "",
          curriculum: data.curriculum || "",
          status: data.status || "pending",
          userName: data.userName || "",
          createdAt: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString() : ""
        };
      });
    }
  } catch (e) {
    console.error("Failed to load school registrations:", e);
    firebaseRegistrations = [];
  }
}

async function registerSchool(data) {
  try {
    await db.collection("schoolRegistrations").add({
      schoolName: data.schoolName,
      shortName: data.shortName,
      country: data.country,
      curriculum: data.curriculum,
      themeColor: data.themeColor,
      students: data.students,
      notes: data.notes,
      userId: currentUser.uid,
      userName: currentUser.displayName || "Unknown",
      status: "pending",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return true;
  } catch (e) {
    console.error("Failed to save school registration:", e);
    return false;
  }
}

async function getSchoolRegistrations() {
  // Returns this user's registrations (already loaded in firebaseRegistrations)
  return firebaseRegistrations.filter(function(r) {
    return r.userName === (currentUser.displayName || "");
  });
}

async function getAllRegistrations() {
  // Reload all for admin view to get fresh data
  if (curRole !== "admin") return firebaseRegistrations;
  try {
    var snap = await db.collection("schoolRegistrations")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();
    firebaseRegistrations = snap.docs.map(function(d) {
      var data = d.data();
      return {
        id: d.id,
        schoolName: data.schoolName || "",
        shortName: data.shortName || "",
        country: data.country || "",
        curriculum: data.curriculum || "",
        status: data.status || "pending",
        userName: data.userName || "",
        createdAt: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString() : ""
      };
    });
    return firebaseRegistrations;
  } catch (e) {
    console.error("Failed to reload registrations:", e);
    return firebaseRegistrations;
  }
}

async function updateRegStatus(regId, status) {
  try {
    await db.collection("schoolRegistrations").doc(regId).update({ status: status });
    // Update local cache
    var r = firebaseRegistrations.find(function(x) { return x.id === regId; });
    if (r) r.status = status;
  } catch (e) {
    console.error("Failed to update registration status:", e);
    toast("Failed to update status", "er");
  }
}

// ============================================================
// FIREBASE — Profile & Settings (FULLY FIRESTORE)
// ============================================================
async function saveProfile(data) {
  try {
    await db.collection("users").doc(currentUser.uid).update(data);
    userProfile = Object.assign({}, userProfile, data);
    if (data.displayName) {
      try { await currentUser.updateProfile({ displayName: data.displayName }); } catch (e) {}
    }
    toast("Profile updated in Firebase", "ok");
    updateTopBar();
    render();
  } catch (e) {
    console.error("Failed to save profile:", e);
    toast("Failed to save profile", "er");
  }
}

async function saveSettings(data) {
  try {
    await db.collection("users").doc(currentUser.uid).update({ settings: data });
    userProfile = Object.assign({}, userProfile, { settings: Object.assign({}, userProfile.settings, data) });
    toast("Settings saved to Firebase", "ok");
    render();
  } catch (e) {
    console.error("Failed to save settings:", e);
    toast("Failed to save settings", "er");
  }
}

// ============================================================
// UI UPDATES
// ============================================================
function updateTopBar() {
  if (!userProfile) return;
  var initials = (userProfile.displayName || "U").split(" ").map(function(w) { return w[0]; }).join("").toUpperCase().substring(0, 2);
  document.getElementById("topAvatar").textContent = initials;
  document.querySelectorAll(".rb").forEach(function(b) { b.classList.toggle("act", b.dataset.r === curRole); });
  var an = document.getElementById("adminNavItem");
  if (an) an.style.display = curRole === "admin" ? "flex" : "none";
}

function setRole(r) {
  curRole = r;
  document.querySelectorAll(".rb").forEach(function(b) { b.classList.toggle("act", b.dataset.r === r); });
  var an = document.getElementById("adminNavItem");
  if (an) an.style.display = r === "admin" ? "flex" : "none";
  // Persist role to Firebase
  db.collection("users").doc(currentUser.uid).update({ role: r }).catch(function(e) {
    console.error("Failed to update role:", e);
  });
  if (userProfile) userProfile.role = r;
  toast("Switched to " + r + " view", "inf");
  render();
}

function populateSchoolSelect() {
  var sel = document.getElementById("ssSel");
  while (sel.options.length > 1) sel.remove(1);
  SCHOOLS.forEach(function(s) {
    var o = document.createElement("option");
    o.value = s.id;
    o.textContent = s.name;
    sel.appendChild(o);
  });
}

function updCnt() {
  var el = document.getElementById("subjectCntBadge");
  if (el) el.textContent = allSubj().length;
}

function buildSidebar() {
  var nav = document.getElementById("sidebarNav");
  var items = [
    { type: "sec", label: "Main" },
    { v: "dash", icon: "fa-th-large", label: "Dashboard" },
    { v: "search", icon: "fa-search", label: "Global Search" },
    { v: "subjects", icon: "fa-graduation-cap", label: "All Subjects", badge: true },
    { type: "sec", label: "Intelligence" },
    { v: "ai", icon: "fa-robot", label: "AI Assistant" },
    { type: "sec", label: "Resources" },
    { v: "lib", icon: "fa-book-open", label: "Resource Library" },
    { v: "upl", icon: "fa-cloud-upload-alt", label: "Upload" },
    { v: "history", icon: "fa-history", label: "Download History" },
    { type: "sec", label: "Schools" },
    { v: "schools", icon: "fa-school", label: "Browse Schools" },
    { v: "regschool", icon: "fa-plus-square", label: "Register School" },
    { v: "mysch", icon: "fa-building", label: "My School Portal" },
    { type: "sec", label: "Account" },
    { v: "profile", icon: "fa-user-circle", label: "My Profile" },
    { v: "analytics", icon: "fa-chart-bar", label: "Analytics" },
    { v: "admin", icon: "fa-shield-alt", label: "Admin Panel", id: "adminNavItem", hidden: curRole !== "admin" },
    { v: "settings", icon: "fa-cog", label: "Settings" }
  ];
  var html = "";
  items.forEach(function(item) {
    if (item.type === "sec") {
      html += '<div class="ns">' + item.label + "</div>";
    } else {
      var hidden = item.hidden ? "display:none;" : "";
      var badge = item.badge ? '<span class="bg" id="subjectCntBadge">' + allSubj().length + "</span>" : "";
      html += '<div class="ni' + (curView === item.v ? " act" : "") + '" data-v="' + item.v + '" onclick="nav(\'' + item.v + '\')" style="' + hidden + '"><i class="fas ' + item.icon + '"></i>' + item.label + badge + "</div>";
    }
  });
  nav.innerHTML = html;
}

// ============================================================
// NAVIGATION ENGINE
// ============================================================
function nav(v, p) {
  curView = v;
  curP = p || {};
  document.querySelectorAll(".ni").forEach(function(n) { n.classList.toggle("act", n.dataset.v === v); });
  document.getElementById("sb").classList.remove("mo");
  document.getElementById("sov").classList.remove("act");
  render();
}

function render() {
  Object.values(chrts).forEach(function(c) { c.destroy(); });
  chrts = {};
  var c = document.getElementById("vc");
  var h = "";
  switch (curView) {
    case "dash": h = vDash(); break;
    case "search": h = vSearch(); break;
    case "subjects": h = vSubjects(); break;
    case "subj": h = vSubj(); break;
    case "ai": h = vAI(); break;
    case "lib": h = vLib(); break;
    case "upl": h = vUpl(); break;
    case "history": h = vHistory(); break;
    case "schools": h = vSchools(); break;
    case "regschool": h = vRegSchool(); break;
    case "mysch": h = vMySch(); break;
    case "profile": h = vProfile(); break;
    case "analytics": h = vAnalytics(); break;
    case "admin": h = vAdmin(); break;
    case "settings": h = vSettings(); break;
    default: h = vDash();
  }
  c.innerHTML = '<div class="ve">' + h + "</div>";
  if (curView === "analytics") initCharts();
  if (curView === "search") setTimeout(function() { var i = document.getElementById("hsi"); if (i) i.focus(); }, 100);
  if (curView === "ai") scrollAI();
}

// ============================================================
// RESOURCE CARD COMPONENT
// ============================================================
function rCard(r) {
  var typeLabel = r.type === "exams" ? "Past Paper" : r.type === "books" ? "Textbook" : r.type.charAt(0).toUpperCase() + r.type.slice(1);
  return '<div class="rc" onclick="showResModal(\'' + r.id + '\')">' +
    '<div class="rtt"><span class="rtp ' + r.type + '">' + typeLabel + "</span>" +
    '<span class="rsc">' + esc(r.schName) + "</span></div>" +
    '<div class="rcl">' + esc(r.title) + "</div>" +
    '<div class="rcd">' + esc(r.desc) + "</div>" +
    '<div class="rcm"><span><i class="fas fa-download"></i>' + r.dl.toLocaleString() + "</span>" +
    '<span><i class="fas fa-star" style="color:var(--amb)"></i>' + r.rat + "</span>" +
    '<span><i class="fas fa-layer-group"></i>' + esc(r.level) + "</span>" +
    '<span><i class="fas fa-file"></i>' + r.sz + "</span></div></div>";
}

function showResModal(id) {
  var r = RES.find(function(x) { return x.id === id; });
  if (!r) return;
  modal(r.title,
    '<div style="display:flex;gap:7px;margin-bottom:12px;flex-wrap:wrap">' +
    '<span style="padding:2px 8px;background:var(--accG);border-radius:4px;font-size:10.5px;color:var(--accL)">' + esc(r.subjName) + "</span>" +
    '<span style="padding:2px 8px;background:var(--ambG);border-radius:4px;font-size:10.5px;color:var(--amb)">' + esc(r.level) + "</span>" +
    '<span style="padding:2px 8px;background:var(--input);border-radius:4px;font-size:10.5px">' + esc(r.ctry) + "</span></div>" +
    '<p style="font-size:12.5px;color:var(--tx2);line-height:1.6;margin-bottom:12px">' + esc(r.desc) + "</p>" +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:12px">' +
    '<div style="padding:9px;background:var(--input);border-radius:6px;text-align:center"><div style="font-size:15px;font-weight:700;color:var(--accL)">' + r.dl.toLocaleString() + '</div><div style="font-size:9.5px;color:var(--txM)">Downloads</div></div>' +
    '<div style="padding:9px;background:var(--input);border-radius:6px;text-align:center"><div style="font-size:15px;font-weight:700;color:var(--amb)">' + r.rat + '</div><div style="font-size:9.5px;color:var(--txM)">Rating</div></div></div>' +
    '<div style="font-size:11px;color:var(--txM);margin-bottom:12px"><strong>Author:</strong> ' + esc(r.auth) + " &middot; <strong>Date:</strong> " + r.date + " &middot; <strong>Pages:</strong> " + r.pg + " &middot; <strong>Size:</strong> " + r.sz + "</div>" +
    '<div style="display:flex;gap:7px">' +
    '<button class="bp" style="flex:1" onclick="doDownload(\'' + r.id + '\')"><i class="fas fa-download"></i> Download</button>' +
    '<button class="bo" onclick="clMod();nav(\'ai\',{q:\'Teach me about ' + esc(r.title.split(":")[0]) + '\'})"><i class="fas fa-robot"></i> Ask AI</button></div>'
  );
}

async function doDownload(resId) {
  var r = RES.find(function(x) { return x.id === resId; });
  if (!r) return;
  clMod();
  await trackDownload(r);
}

// ============================================================
// VIEW: Dashboard
// ============================================================
function vDash() {
  var ts = allSubj().length, tr = RES.length, tsch = SCHOOLS.length;
  var trend = RES.slice().sort(function(a, b) { return b.dl - a.dl; }).slice(0, 6);
  return '<div class="hs"><h1 class="fd">Learn Anything, <span>Anywhere</span></h1>' +
    '<p>Search across ' + tr.toLocaleString() + " resources from " + tsch + " schools worldwide</p>" +
    '<div class="hsb"><input type="text" id="hsi" placeholder="What do you want to learn today?" onkeyup="if(event.key===\'Enter\')nav(\'search\',{q:this.value})"><button onclick="nav(\'search\',{q:document.getElementById(\'hsi\').value})"><i class="fas fa-arrow-right"></i></button></div>' +
    '<div class="sfs">' + TYPES.map(function(t) { return '<span class="fc" onclick="nav(\'search\',{type:\'' + t + '\'})">' + (t === "exams" ? "Past Papers" : t.charAt(0).toUpperCase() + t.slice(1)) + "</span>"; }).join("") +
    '<span class="fc" onclick="nav(\'ai\')">Ask AI</span></div></div>' +
    '<div class="sg">' +
    '<div class="sc"><div class="sci" style="background:var(--accG);color:var(--accL)"><i class="fas fa-graduation-cap"></i></div><div class="sv">' + ts + '</div><div class="slb">Subjects</div><div class="sch up"><i class="fas fa-arrow-up"></i> +3 this month</div></div>' +
    '<div class="sc"><div class="sci" style="background:var(--ambG);color:var(--amb)"><i class="fas fa-book-open"></i></div><div class="sv">' + tr.toLocaleString() + '</div><div class="slb">Resources</div><div class="sch up"><i class="fas fa-arrow-up"></i> +127 this week</div></div>' +
    '<div class="sc"><div class="sci" style="background:rgba(16,185,129,.15);color:var(--grn)"><i class="fas fa-school"></i></div><div class="sv">' + tsch + '</div><div class="slb">Schools</div><div class="sch up"><i class="fas fa-arrow-up"></i> +2 this month</div></div>' +
    '<div class="sc"><div class="sci" style="background:rgba(220,38,38,.15);color:var(--red)"><i class="fas fa-download"></i></div><div class="sv">' + downloadHistory.length + '</div><div class="slb">My Downloads</div><div class="sch up"><i class="fas fa-arrow-up"></i> Saved to Cloud</div></div></div>' +
    '<div class="shr"><h2 class="fd">Trending Resources</h2><a onclick="nav(\'lib\')">View all <i class="fas fa-arrow-right" style="font-size:9px"></i></a></div>' +
    '<div class="rg" style="margin-bottom:22px">' + trend.map(rCard).join("") + "</div>" +
    '<div class="shr"><h2 class="fd">Subject Categories</h2><a onclick="nav(\'subjects\')">Browse all <i class="fas fa-arrow-right" style="font-size:9px"></i></a></div>' +
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px">' +
    CATS.slice(0, 6).map(function(c) {
      return '<div style="background:var(--card);border:1px solid var(--brd);border-radius:8px;padding:12px;cursor:pointer;display:flex;align-items:center;gap:9px;transition:all .2s" onmouseover="this.style.borderColor=\'' + c.color + '\'" onmouseout="this.style.borderColor=\'var(--brd)\'" onclick="nav(\'subjects\',{cat:\'' + c.id + '\'})"><div style="width:32px;height:32px;border-radius:7px;background:' + c.color + "20;color:" + c.color + ';display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0"><i class="fas ' + c.icon + '"></i></div><div><div style="font-size:12px;font-weight:600">' + c.name + '</div><div style="font-size:10px;color:var(--txM)">' + c.sub.length + " subjects</div></div><i class=\"fas fa-chevron-right\" style=\"margin-left:auto;font-size:9px;color:var(--txM)\"></i></div>";
    }).join("") + "</div>";
}

// ============================================================
// VIEW: Search
// ============================================================
function vSearch() {
  var q = curP.q || "", tf = curP.type || "", cf = curP.cat || "", lf = curP.level || "", cof = curP.country || "";
  var r = RES.slice();
  if (curSch !== "all") r = r.filter(function(x) { return !x.schId || x.schId === curSch || x.vis === "public"; });
  if (q) { var ql = q.toLowerCase(); r = r.filter(function(x) { return x.title.toLowerCase().indexOf(ql) !== -1 || x.subjName.toLowerCase().indexOf(ql) !== -1 || x.desc.toLowerCase().indexOf(ql) !== -1 || x.tags.some(function(t) { return t.indexOf(ql) !== -1; }); }); }
  if (tf) r = r.filter(function(x) { return x.type === tf; });
  if (cf) { var catName = CATS.find(function(c) { return c.id === cf; }); if (catName) r = r.filter(function(x) { return x.cat === catName.name; }); }
  if (lf) r = r.filter(function(x) { return x.level === lf; });
  if (cof) r = r.filter(function(x) { return x.ctry === cof; });
  var ul = []; RES.forEach(function(x) { if (ul.indexOf(x.level) === -1) ul.push(x.level); }); ul.sort();
  var uc = []; RES.forEach(function(x) { if (uc.indexOf(x.ctry) === -1) uc.push(x.ctry); }); uc.sort();
  var clearBtn = (q || tf || cf || lf || cof) ? '<span class="fc" style="color:var(--red);border-color:rgba(239,68,68,.3)" onclick="nav(\'search\')"><i class="fas fa-times" style="font-size:8px"></i> Clear</span>' : "";
  var aiBlock = q ? '<div style="margin-top:18px;padding:12px;background:var(--card);border:1px solid var(--brd);border-radius:8px"><div style="font-size:11px;font-weight:600;color:var(--accL);margin-bottom:5px"><i class="fas fa-robot"></i> AI Suggestions for "' + esc(q) + '"</div><div style="font-size:12px;color:var(--tx2);line-height:1.6">' + aiSugg(q) + '</div><button class="bp" style="margin-top:7px;height:28px;font-size:11px" onclick="nav(\'ai\',{q:\'' + esc(q) + '\'})"><i class="fas fa-robot"></i> Ask AI</button></div>' : "";
  return '<div class="hs" style="padding:6px 0 16px"><div class="hsb" style="max-width:100%"><input type="text" id="hsi" placeholder="Search any subject, resource, topic..." value="' + esc(q) + '" onkeyup="if(event.key===\'Enter\')nav(\'search\',{q:this.value,type:\'' + tf + '\',cat:\'' + cf + '\',level:\'' + lf + '\',country:\'' + cof + '\'})"><button onclick="nav(\'search\',{q:document.getElementById(\'hsi\').value,type:\'' + tf + '\',cat:\'' + cf + '\',level:\'' + lf + '\',country:\'' + cof + '\'})"><i class="fas fa-search"></i></button></div>' +
    '<div class="sfs" style="margin-top:8px;justify-content:flex-start">' + TYPES.map(function(t) { return '<span class="fc ' + (tf === t ? "act" : "") + '" onclick="nav(\'search\',{q:\'' + esc(q) + '\',type:' + (tf === t ? "''" : "'" + t + "'") + ',cat:\'' + cf + '\',level:\'' + lf + '\',country:\'' + cof + '\'})">' + (t === "exams" ? "Past Papers" : t.charAt(0).toUpperCase() + t.slice(1)) + "</span>"; }).join("") + "</div></div>" +
    '<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;align-items:center">' +
    '<select class="fsel" style="width:auto;min-width:160px;height:32px;font-size:11px" onchange="nav(\'search\',{q:\'' + esc(q) + '\',type:\'' + tf + '\',cat:this.value,level:\'' + lf + '\',country:\'' + cof + '\'})"><option value="">All Categories</option>' + CATS.map(function(c) { return '<option value="' + c.id + '"' + (cf === c.id ? " selected" : "") + ">" + c.name + "</option>"; }).join("") + "</select>" +
    '<select class="fsel" style="width:auto;min-width:120px;height:32px;font-size:11px" onchange="nav(\'search\',{q:\'' + esc(q) + '\',type:\'' + tf + '\',cat:\'' + cf + '\',level:this.value,country:\'' + cof + '\'})"><option value="">All Levels</option>' + ul.map(function(l) { return '<option value="' + l + '"' + (lf === l ? " selected" : "") + ">" + l + "</option>"; }).join("") + "</select>" +
    '<select class="fsel" style="width:auto;min-width:120px;height:32px;font-size:11px" onchange="nav(\'search\',{q:\'' + esc(q) + '\',type:\'' + tf + '\',cat:\'' + cf + '\',level:\'' + lf + '\',country:this.value})"><option value="">All Countries</option>' + uc.map(function(c) { return '<option value="' + c + '"' + (cof === c ? " selected" : "") + ">" + c + "</option>"; }).join("") + "</select>" +
    '<span style="margin-left:auto;font-size:11px;color:var(--txM)">' + r.length + " result" + (r.length !== 1 ? "s" : "") + "</span>" + clearBtn + "</div>" +
    (r.length ? '<div class="rg">' + r.map(rCard).join("") + "</div>" : '<div class="es"><i class="fas fa-search"></i><p>No resources found. Try different keywords or filters.</p></div>') + aiBlock;
}

function aiSugg(q) {
  var l = q.toLowerCase();
  if (l.match(/phys|force|motion|energy/)) return 'Physics is vast. Start with <strong>Newton\'s Laws</strong>, then <strong>Work & Energy</strong>, then <strong>Waves & Optics</strong>. Want a study plan?';
  if (l.match(/math|calc|algebra/)) return 'For math: <strong>Algebra</strong> &rarr; <strong>Trigonometry</strong> &rarr; <strong>Calculus</strong> &rarr; <strong>Statistics</strong>. Each builds on the last.';
  if (l.match(/chem|element|reaction/)) return 'Chemistry: <strong>Physical</strong> (states, bonding), <strong>Inorganic</strong> (periodic table), <strong>Organic</strong> (hydrocarbons). Which area?';
  if (l.match(/bio|cell|gene|dna/)) return 'Biology path: Cells &rarr; Genetics &rarr; Physiology &rarr; Ecology &rarr; Evolution. I can quiz you!';
  return 'Based on "' + esc(q) + '", try filtering by resource type and level. I can <strong>summarize</strong> any topic or <strong>generate a quiz</strong>.';
}

// ============================================================
// VIEW: All Subjects
// ============================================================
function vSubjects() {
  var cf = curP.cat || "";
  var cats = cf ? CATS.filter(function(c) { return c.id === cf; }) : CATS;
  var catFilters = '<span class="fc ' + (!cf ? "act" : "") + '" onclick="nav(\'subjects\')">All</span>' + CATS.map(function(c) { return '<span class="fc ' + (cf === c.id ? "act" : "") + '" onclick="nav(\'subjects\',{cat:\'' + c.id + '\'})">' + c.name.split(" ")[0] + "</span>"; }).join("");
  var catRows = cats.map(function(c) {
    var cards = c.sub.map(function(s) {
      var n = resCount(s.id);
      return '<div class="suc" onclick="nav(\'subj\',{sid:\'' + s.id + '\'})"><div style="position:absolute;top:0;left:0;right:0;height:3px;background:' + c.color + ';border-radius:8px 8px 0 0"></div><div class="ui" style="background:' + c.color + "20;color:" + c.color + '"><i class="fas ' + c.icon + '"></i></div><div class="un">' + esc(s.name) + "</div><div class=\"uc\">" + n + " resource" + (n !== 1 ? "s" : "") + "</div></div>";
    }).join("");
    return '<div class="crl"><div class="crlbl"><div class="crdt" style="background:' + c.color + '"></div><span>' + c.name + "</span><span style=\"font-size:10px;color:var(--txM);text-transform:none;letter-spacing:0;font-weight:400\">" + c.sub.length + "</span></div><div class=\"sug\">" + cards + "</div></div>";
  }).join("");
  var customRow = "";
  if (firebaseCustomSubjects.length) {
    var customCards = firebaseCustomSubjects.map(function(s) {
      var n = resCount(s.id);
      return '<div class="suc" onclick="nav(\'subj\',{sid:\'' + s.id + '\'})"><div style="position:absolute;top:0;left:0;right:0;height:3px;background:var(--acc);border-radius:8px 8px 0 0"></div><div class="ui" style="background:var(--accG);color:var(--accL)"><i class="fas fa-plus-circle"></i></div><div class="un">' + esc(s.name) + "</div><div class=\"uc\">" + n + " resource" + (n !== 1 ? "s" : "") + "</div></div>";
    }).join("");
    customRow = '<div class="crl"><div class="crlbl"><div class="crdt" style="background:var(--acc)"></div><span>Custom Subjects</span></div><div class="sug">' + customCards + "</div></div>";
  }
  return '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:8px"><div><h1 class="fd" style="font-size:20px;font-weight:700">All Subjects</h1><p style="font-size:12px;color:var(--tx2);margin-top:2px">' + allSubj().length + " subjects across " + CATS.length + " categories</p></div><div style=\"display:flex;gap:5px;flex-wrap:wrap\">" + catFilters + "</div></div>" + catRows + customRow;
}

// ============================================================
// VIEW: Subject Detail
// ============================================================
function vSubj() {
  var sid = curP.sid;
  if (!sid) return '<div class="es"><i class="fas fa-exclamation-circle"></i><p>Subject not found</p></div>';
  var nm = subjName(sid), ct = subjCat(sid), cl = catColor(ct), ci = catIcon(ct);
  var sr = RES.filter(function(r) { return r.subjId === sid; });
  if (curSch !== "all") sr = sr.filter(function(r) { return !r.schId || r.schId === curSch || r.vis === "public"; });
  var tab = curP.tab || "notes";
  var fl = tab === "all" ? sr : sr.filter(function(r) { return r.type === tab; });
  var nt = sr.filter(function(r) { return r.type === "notes"; });
  var ex = sr.filter(function(r) { return r.type === "exams"; });
  var bk = sr.filter(function(r) { return r.type === "books"; });
  var emptyMsg = fl.length ? "" : '<div class="es"><i class="fas fa-folder-open"></i><p>No ' + (tab === "all" ? "" : tab) + " resources yet for " + esc(nm) + ".</p></div>";
  return '<div class="shdr"><div style="position:absolute;top:0;left:0;bottom:0;width:4px;background:' + cl + '"></div><div class="shi" style="background:' + cl + "20;color:" + cl + '"><i class="fas ' + ci + '"></i></div><div class="shf"><h1 class="fd">' + esc(nm) + "</h1><p>" + esc(ct) + " &middot; " + sr.length + " resources</p></div><div class=\"shs\"><div class=\"sst\"><div class=\"v\" style=\"color:var(--accL)\">" + nt.length + '</div><div class="l">Notes</div></div><div class="sst"><div class="v" style="color:var(--amb)">' + ex.length + '</div><div class="l">Exams</div></div><div class="sst"><div class="v" style="color:#A78BFA">' + bk.length + '</div><div class="l">Books</div></div></div></div>' +
    '<div class="tb"><button class="tbb ' + (tab === "notes" ? "act" : "") + '" onclick="nav(\'subj\',{sid:\'' + sid + '\',tab:\'notes\'})">Notes (' + nt.length + ')</button><button class="tbb ' + (tab === "exams" ? "act" : "") + '" onclick="nav(\'subj\',{sid:\'' + sid + '\',tab:\'exams\'})">Past Papers (' + ex.length + ')</button><button class="tbb ' + (tab === "books" ? "act" : "") + '" onclick="nav(\'subj\',{sid:\'' + sid + '\',tab:\'books\'})">Books (' + bk.length + ')</button><button class="tbb ' + (tab === "all" ? "act" : "") + '" onclick="nav(\'subj\',{sid:\'' + sid + '\',tab:\'all\'})">All</button><button class="tbb" onclick="nav(\'ai\',{subject:\'' + esc(nm) + '\'})" style="margin-left:auto"><i class="fas fa-robot" style="margin-right:3px"></i>Ask AI</button></div>' +
    (fl.length ? '<div class="rg">' + fl.map(rCard).join("") + "</div>" : emptyMsg);
}

// ============================================================
// VIEW: AI Assistant
// ============================================================
function vAI() {
  var im = curP.q || curP.subject || "";
  var initBot = "Welcome! I can <strong>Teach</strong>, <strong>Summarize</strong>, <strong>Generate Quizzes</strong>, and <strong>Explain Simply</strong>. Upload a PDF and I'll teach from it!" + (im ? ' You asked about "<strong>' + esc(im) + '</strong>" — here\'s what I found:' : " How can I help you today?");
  var userMsg = im ? '<div class="msg us"><div class="mav"><i class="fas fa-user"></i></div><div class="mbb">' + esc(im) + "</div></div>" : "";
  var botReply = im ? '<div class="msg bt"><div class="mav"><i class="fas fa-robot"></i></div><div class="mbb">' + aiResp(im) + "</div></div>" : "";
  var chatMsgs = chatH.map(function(m) { return '<div class="msg ' + m.r + '"><div class="mav"><i class="fas ' + (m.r === "bt" ? "fa-robot" : "fa-user") + '"></i></div><div class="mbb">' + m.t + "</div></div>"; }).join("");
  var pdfBar = upPDF ? '<div style="display:flex;align-items:center;gap:6px;margin-bottom:7px;padding:6px 9px;background:var(--card);border:1px solid var(--brd);border-radius:6px;font-size:11px"><i class="fas fa-file-pdf" style="color:var(--red)"></i><span style="flex:1">' + esc(upPDF.name) + '</span><span style="color:var(--grn);font-size:9.5px"><i class="fas fa-check"></i> Loaded</span><button style="background:none;border:none;color:var(--txM);cursor:pointer" onclick="upPDF=null;pdfTxt=\'\';render()"><i class="fas fa-times"></i></button></div>' : "";
  return '<div class="ac"><div style="margin-bottom:12px"><h2 class="fd" style="font-size:17px;font-weight:700">AI Teaching Assistant</h2><p style="font-size:11.5px;color:var(--tx2);margin-top:2px">Powered by EduVault AI</p></div>' +
    '<div class="am" id="amDiv"><div class="msg bt"><div class="mav"><i class="fas fa-robot"></i></div><div class="mbb">' + initBot + "</div></div>" + userMsg + botReply + chatMsgs + "</div>" +
    '<div class="aia">' + pdfBar +
    '<div class="air"><textarea id="aiIn" rows="1" placeholder="Ask me anything..." onkeydown="if(event.key===\'Enter\'&&!event.shiftKey){event.preventDefault();sendAI();}" oninput="this.style.height=\'auto\';this.style.height=Math.min(this.scrollHeight,100)+\'px\'"></textarea><button class="asb" onclick="sendAI()"><i class="fas fa-paper-plane"></i></button></div>' +
    '<div class="acs"><span class="acm" onclick="sendCmd(\'Teach me this document\')">Teach from PDF</span><span class="acm" onclick="sendCmd(\'Summarize this topic\')">Summarize</span><span class="acm" onclick="sendCmd(\'Generate quiz\')">Generate Quiz</span><span class="acm" onclick="sendCmd(\'Explain like I am a beginner\')">Explain Simply</span><span class="acm" onclick="document.getElementById(\'pdfIn\').click()">Upload PDF</span></div>' +
    '<div class="apu" onclick="document.getElementById(\'pdfIn\').click()"><i class="fas fa-cloud-upload-alt"></i><p>Drop a PDF or click to upload</p><input type="file" id="pdfIn" accept=".pdf" style="display:none" onchange="handlePDF(this)"></div></div></div>';
}

function scrollAI() { setTimeout(function() { var e = document.getElementById("amDiv"); if (e) e.scrollTop = e.scrollHeight; }, 50); }
function sendCmd(c) { document.getElementById("aiIn").value = c; sendAI(); }
function sendAI() {
  var i = document.getElementById("aiIn"); var t = i.value.trim(); if (!t) return;
  i.value = ""; i.style.height = "auto";
  chatH.push({ r: "us", t: t }); render();
  setTimeout(function() { chatH.push({ r: "bt", t: aiResp(t) }); render(); }, 500 + Math.random() * 500);
}

function handlePDF(inp) {
  var f = inp.files[0]; if (!f) return;
  if (f.type !== "application/pdf") { toast("Please upload a PDF", "er"); return; }
  upPDF = { name: f.name, size: f.size };
  var r = new FileReader();
  r.onload = function(e) { var m = e.target.result.match(/[\x20-\x7E]{4,}/g); pdfTxt = m ? m.join(" ").substring(0, 5000) : "PDF content extracted."; toast('"' + f.name + '" loaded', "ok"); render(); };
  r.readAsText(f);
}

function aiResp(t) {
  var l = t.toLowerCase(); var hp = upPDF && pdfTxt;
  if (l.indexOf("quiz") !== -1 || l.indexOf("test") !== -1) return genQuiz(l.replace(/.*quiz\s*(for\s*)?/i, "").replace(/.*test\s*(for\s*)?/i, "").trim() || "General");
  if (l.indexOf("teach") !== -1 && hp) return '<strong>Teaching from: ' + esc(upPDF.name) + "</strong><br><br>Key concepts:<br><br><strong>1. Core Topic:</strong> Fundamental principles building systematically.<br><br><strong>2. Key Definitions:</strong> Important terms with precise language.<br><br><strong>3. Main Principles:</strong> " + (Math.floor(Math.random()*5)+3) + " major principles identified.<br><br><strong>4. Applications:</strong> Real-world examples included.<br><br><strong>5. Summary Points:</strong> Review questions at section ends.<br><br>Want me to <strong>summarize</strong> or <strong>quiz</strong> you?";
  if (l.indexOf("teach") !== -1) { var tp = t.replace(/teach\s*(me\s*)?(about\s*)?/i, "").trim() || "the topic"; return "<strong>Lesson: " + esc(tp) + "</strong><br><br><strong>Step 1:</strong> Start with basic definitions and terminology.<br><br><strong>Step 2:</strong> Core concepts and their relationships.<br><br><strong>Step 3:</strong> Real-world applications and problem-solving.<br><br><strong>Step 4:</strong> Advanced connections to other subjects.<br><br><em>Tip:</em> Practice 3-5 problems after each step!"; }
  if (l.indexOf("summar") !== -1) { var tp = t.replace(/summar(?:ize|y)\s*(this\s*)?(topic\s*)?/i, "").trim() || "the topic"; return "<strong>Summary: " + esc(tp) + "</strong><br><br>&bull; Core principles and interrelationships<br>&bull; Governing theorem/formula<br>&bull; Multiple methods — choose by context<br>&bull; Common mistakes: confusing concepts<br>&bull; Exam split: Theory (40%) + Application (60%)"; }
  if (l.indexOf("beginner") !== -1 || l.indexOf("simple") !== -1) { var tp = t.replace(/explain\s*(this\s*)?[\w'\s]*?(beginner|simple|easy)/i, "").trim() || "this concept"; return "<strong>" + esc(tp) + " — Simply</strong><br><br>Think of it like a recipe: ingredients, method, result.<br><br>&bull; You use this daily without realizing<br>&bull; It follows a familiar pattern<br>&bull; The 'complicated' part is just more steps<br><br><strong>One Thing:</strong> Everything = inputs &rarr; outputs."; }
  if (l.match(/phys|force|motion|energy/)) return "<strong>Physics</strong><br><br><strong>Mechanics:</strong> <code>F = ma</code> — Newton's cornerstone.<br><strong>Waves:</strong> Sound, light, water share principles.<br><strong>Electricity:</strong> <code>V = IR</code> — Ohm's Law.<br><strong>Thermal:</strong> Conduction, convection, radiation.";
  if (l.match(/math|calc|algebra/)) return "<strong>Mathematics</strong><br><br><strong>Algebra:</strong> Linear &rarr; Quadratic equations.<br><strong>Calculus:</strong> Differentiation (rates) + Integration (areas).<br><strong>Statistics:</strong> Mean, median, mode &rarr; distributions.";
  if (l.match(/chem|element|reaction/)) return "<strong>Chemistry</strong><br><br><strong>Atomic:</strong> Protons, neutrons, electrons.<br><strong>Bonding:</strong> Ionic, covalent, metallic.<br><strong>Reactions:</strong> Reactants &rarr; Products. Balance equations.<br><strong>Organic:</strong> Hydrocarbons &rarr; functional groups.";
  if (l.match(/bio|cell|gene|dna/)) return "<strong>Biology</strong><br><br><strong>Cell Theory:</strong> All life = cells.<br><strong>Genetics:</strong> DNA &rarr; RNA &rarr; Protein.<br><strong>Ecology:</strong> Organisms in ecosystems.<br><strong>Physiology:</strong> Digestive, respiratory, circulatory.";
  if (l.match(/prog|code|python|java/)) return "<strong>Programming</strong><br><br><code>def factorial(n):\n  if n &lt;= 1: return 1\n  return n * factorial(n-1)</code><br><br><strong>Path:</strong> Python &rarr; JavaScript &rarr; Data Structures &rarr; Algorithms";
  return 'Great question about "<strong>' + esc(t) + '</strong>"!<br><br>&bull; Fundamental principles consistent across curricula<br>&bull; Understanding "why" beats memorization<br>&bull; Past papers are best exam prep<br>&bull; Real-world applications improve retention<br><br>Mention a specific subject for targeted help!';
}

function genQuiz(subj) {
  var qs = [
    { q: "In " + subj + ", the primary principle is:", o: ["A) The fundamental governing law","B) An unrelated concept","C) A misconception","D) A deprecated theory"], a: 0 },
    { q: "Which is correct about " + subj + "?", o: ["A) Only theoretical","B) Both theoretical and practical","C) Disproven","D) Only advanced"], a: 1 },
    { q: "Common mistake when studying " + subj + ":", o: ["A) Too much practice","B) Confusing correlation/causation","C) Reading too carefully","D) Asking questions"], a: 1 },
    { q: "Best study strategy for " + subj + ":", o: ["A) Rereading notes","B) Active recall + practice","C) Highlighting everything","D) Only lectures"], a: 1 },
    { q: "Real-world application of " + subj + ":", o: ["A) Abstract proof only","B) Practical scenario","C) Historical anecdote","D) Fiction"], a: 1 }
  ];
  var h = "<strong>Quiz: " + esc(subj) + "</strong><br><br>";
  qs.forEach(function(q, i) { h += "<strong>Q" + (i+1) + ".</strong> " + q.q + "<br>"; q.o.forEach(function(o) { h += "&nbsp;&nbsp;" + o + "<br>"; }); h += "<br>"; });
  h += "<em>Answers: " + qs.map(function(q) { return String.fromCharCode(65 + q.a); }).join(", ") + "</em>";
  return h;
}

// ============================================================
// VIEW: Library
// ============================================================
function vLib() {
  var r = RES.slice();
  if (curSch !== "all") r = r.filter(function(x) { return !x.schId || x.schId === curSch || x.vis === "public"; });
  r.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
  var uplBtn = curRole !== "student" ? '<button class="bp" onclick="nav(\'upl\')"><i class="fas fa-plus"></i> Upload</button>' : "";
  return '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px"><div><h1 class="fd" style="font-size:20px;font-weight:700">Resource Library</h1><p style="font-size:12px;color:var(--tx2);margin-top:2px">' + r.length + " resources</p></div>" + uplBtn + "</div>" +
    '<div style="display:flex;gap:5px;margin-bottom:16px;flex-wrap:wrap"><span class="fc act" onclick="filtLib(this,\'all\')">All</span>' + TYPES.map(function(t) { return '<span class="fc" onclick="filtLib(this,\'' + t + '\')">' + (t === "exams" ? "Past Papers" : t.charAt(0).toUpperCase() + t.slice(1)) + "</span>"; }).join("") + "</div>" +
    '<div class="rg" id="libG">' + r.map(rCard).join("") + "</div>";
}

function filtLib(el, tp) {
  el.parentElement.querySelectorAll(".fc").forEach(function(c) { c.classList.remove("act"); });
  el.classList.add("act");
  var r = RES.slice();
  if (curSch !== "all") r = r.filter(function(x) { return !x.schId || x.schId === curSch || x.vis === "public"; });
  if (tp !== "all") r = r.filter(function(x) { return x.type === tp; });
  document.getElementById("libG").innerHTML = r.map(rCard).join("");
}

// ============================================================
// VIEW: Upload — Saves to Firestore
// ============================================================
function vUpl() {
  if (curRole === "student") return '<div class="es"><i class="fas fa-lock"></i><p>Upload available for teachers and admins only.</p></div>';
  var subjOpts = allSubj().map(function(s) { return '<option value="' + s.id + '">' + esc(s.name) + "</option>"; }).join("");
  var levelOpts = LEVELS.map(function(l) { return '<option value="' + l + '">' + l + "</option>"; }).join("");
  return '<h1 class="fd" style="font-size:20px;font-weight:700;margin-bottom:4px">Upload Resource</h1><p style="font-size:12px;color:var(--tx2);margin-bottom:18px">Share notes, exams, or books — saved to Firebase</p>' +
    '<div class="af"><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
    '<div class="fg"><label>Resource Title</label><input type="text" class="fi" id="upT" placeholder="e.g., Organic Chemistry Notes"></div>' +
    '<div class="fg"><label>Subject</label><select class="fsel" id="upS"><option value="">Select subject</option>' + subjOpts + "</select></div>" +
    '<div class="fg"><label>Resource Type</label><select class="fsel" id="upTy"><option value="notes">Notes</option><option value="exams">Past Papers</option><option value="books">Textbook</option><option value="videos">Video</option></select></div>' +
    '<div class="fg"><label>Class Level</label><select class="fsel" id="upL"><option value="">Select level</option>' + levelOpts + "</select></div>" +
    '<div class="fg"><label>Visibility</label><select class="fsel" id="upV"><option value="public">Public (Global)</option><option value="school">School Only</option></select></div>' +
    '<div class="fg"><label>Tags (comma separated)</label><input type="text" class="fi" id="upTag" placeholder="waves, optics, light"></div></div>' +
    '<div class="fg"><label>Description</label><textarea class="fi" id="upD" rows="2" style="height:auto;padding:8px 10px" placeholder="Brief description..."></textarea></div>' +
    '<div class="fg"><label>File</label><div class="apu" style="text-align:left;padding:14px" onclick="document.getElementById(\'upF\').click()"><i class="fas fa-cloud-upload-alt" style="display:block;margin-bottom:3px"></i><p id="upFN">Click to select a file</p><input type="file" id="upF" style="display:none" onchange="document.getElementById(\'upFN\').textContent=this.files[0]?.name||\'Click to select\'"></div></div>' +
    '<button class="bp" id="upBtn" onclick="doUpload()"><i class="fas fa-upload"></i> Upload Resource</button></div>';
}

async function doUpload() {
  var t = document.getElementById("upT").value.trim();
  var s = document.getElementById("upS").value;
  var ty = document.getElementById("upTy").value;
  var l = document.getElementById("upL").value;
  var d = document.getElementById("upD").value.trim();
  var v = document.getElementById("upV").value || "public";
  var tg = document.getElementById("upTag").value.split(",").map(function(x) { return x.trim(); }).filter(Boolean);

  if (!t) { toast("Enter a title", "er"); return; }
  if (!s) { toast("Select a subject", "er"); return; }
  if (!l) { toast("Select a level", "er"); return; }

  var btn = document.getElementById("upBtn");
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving to Firebase...';

  var resourceData = {
    title: t,
    subjectId: s,
    subjectName: subjName(s),
    category: subjCat(s),
    type: ty,
    level: l,
    description: d || "User-uploaded resource.",
    tags: tg,
    visibility: v,
    schoolId: v === "school" && curSch !== "all" ? curSch : null,
    schoolName: v === "school" && curSch !== "all" ? (SCHOOLS.find(function(x) { return x.id === curSch; }) || {}).name || "Public" : "Public",
    authorName: userProfile.displayName || "Unknown",
    authorId: currentUser.uid,
    country: "Uploaded",
    curriculum: "Uploaded",
    downloads: 0,
    rating: 0,
    pages: 0,
    fileSize: "0 MB",
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    // Handle file upload to Firebase Storage if a file is selected
    var fileInput = document.getElementById("upF");
    if (fileInput.files[0]) {
      var file = fileInput.files[0];
      var filePath = "resources/" + currentUser.uid + "/" + Date.now() + "_" + file.name;
      var storageRef = storage.ref(filePath);

      try {
        var uploadSnapshot = await storageRef.put(file);
        var downloadURL = await uploadSnapshot.ref.getDownloadURL();
        resourceData.fileURL = downloadURL;
        resourceData.filePath = filePath;
        resourceData.fileSize = (file.size / (1024 * 1024)).toFixed(1) + " MB";
        resourceData.storageSize = file.size;
      } catch (storageErr) {
        console.error("Storage upload failed:", storageErr);
        toast("File upload failed, saving metadata only", "inf");
      }
    }

    // Save resource metadata to Firestore
    var docRef = await db.collection("resources").add(resourceData);

    // Also add to local RES array for immediate display
    RES.unshift({
      id: docRef.id,
      title: t,
      subjId: s,
      subjName: subjName(s),
      cat: subjCat(s),
      type: ty,
      level: l,
      schId: resourceData.schoolId,
      schName: resourceData.schoolName,
      vis: v,
      desc: resourceData.description,
      tags: tg,
      dl: 0,
      rat: 0,
      auth: resourceData.authorName,
      date: new Date().toISOString().split("T")[0],
      ctry: resourceData.country,
      cur: resourceData.curriculum,
      sz: resourceData.fileSize,
      pg: 0
    });

    toast("Resource saved to Firebase!", "ok");
    nav("lib");
  } catch (e) {
    console.error("Failed to upload resource:", e);
    toast("Upload failed: " + (e.message || "Unknown error"), "er");
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-upload"></i> Upload Resource';
  }
}

// ============================================================
// VIEW: Download History — Reads from Firestore
// ============================================================
function vHistory() {
  var h = downloadHistory;
  var clearBtn = h.length ? '<button class="bd" onclick="clearHistory()"><i class="fas fa-trash"></i> Clear History</button>' : "";
  var tableRows = h.length ? h.slice(0, 50).map(function(d) {
    return '<tr><td style="color:var(--tx);font-weight:500;max-width:300px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(d.resourceTitle) + '</td><td>' + esc(d.subjectName) + '</td><td><span class="rtp ' + d.type + '" style="font-size:9px">' + d.type + "</span></td><td>" + (d.date || "") + "</td></tr>";
  }).join("") : "";
  var table = h.length ? '<div style="background:var(--card);border:1px solid var(--brd);border-radius:10px;overflow:hidden"><table class="htable"><thead><tr><th>Resource</th><th>Subject</th><th>Type</th><th>Date</th></tr></thead><tbody>' + tableRows + "</tbody></table></div>" : '<div class="es"><i class="fas fa-download"></i><p>No downloads yet. Browse resources and download to see your history here.</p><button class="bp" style="margin-top:14px" onclick="nav(\'lib\')"><i class="fas fa-book-open"></i> Browse Library</button></div>';
  return '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:8px"><div><h1 class="fd" style="font-size:20px;font-weight:700">Download History</h1><p style="font-size:12px;color:var(--tx2);margin-top:2px">' + h.length + " downloads stored in Firebase</p></div>" + clearBtn + "</div>" + table;
}

// ============================================================
// VIEW: Schools
// ============================================================
function vSchools() {
  var cards = SCHOOLS.map(function(s) {
    return '<div class="skc" onclick="schModal(\'' + s.id + '\')"><div class="skl" style="background:' + s.tc + '">' + s.sn + "</div><div class=\"skn\">" + esc(s.name) + "</div><div class=\"skm\"><span><i class=\"fas fa-map-marker-alt\"></i> " + s.country + "</span><span><i class=\"fas fa-book\"></i> " + s.cur + "</span></div><div class=\"skst\"><div><strong>" + s.stu.toLocaleString() + "</strong>Students</div><div><strong>" + s.tch + "</strong>Teachers</div><div><strong>" + s.res + "</strong>Resources</div></div></div>";
  }).join("");
  return '<div style="margin-bottom:20px"><h1 class="fd" style="font-size:20px;font-weight:700">Partner Schools</h1><p style="font-size:12px;color:var(--tx2);margin-top:2px">' + SCHOOLS.length + " schools across " + new Set(SCHOOLS.map(function(s) { return s.country; })).size + " countries</p></div><div class=\"skg\">" + cards + "</div>";
}

function schModal(id) {
  var s = SCHOOLS.find(function(x) { return x.id === id; });
  if (!s) return;
  var sr = RES.filter(function(r) { return r.schId === id; });
  var resList = sr.length ? sr.slice(0, 4).map(function(r) { return '<div style="padding:7px;background:var(--input);border-radius:6px;margin-bottom:4px"><div style="font-size:12px;font-weight:600">' + esc(r.title) + "</div><div style=\"font-size:10px;color:var(--txM)\">" + r.type + " &middot; " + r.level + "</div></div>"; }).join("") : '<p style="font-size:11px;color:var(--txM)">No resources listed.</p>';
  modal(s.name,
    '<div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap"><span style="padding:2px 8px;background:var(--input);border-radius:4px;font-size:10.5px"><i class="fas fa-map-marker-alt" style="color:var(--accL)"></i> ' + s.country + "</span><span style=\"padding:2px 8px;background:var(--input);border-radius:4px;font-size:10.5px\"><i class=\"fas fa-book\" style=\"color:var(--amb)\"></i> " + s.cur + "</span></div>" +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px"><div style="text-align:center;padding:8px;background:var(--input);border-radius:6px"><div style="font-size:16px;font-weight:700;color:var(--accL)">' + s.stu.toLocaleString() + '</div><div style="font-size:9.5px;color:var(--txM)">Students</div></div><div style="text-align:center;padding:8px;background:var(--input);border-radius:6px"><div style="font-size:16px;font-weight:700;color:var(--amb)">' + s.tch + '</div><div style="font-size:9.5px;color:var(--txM)">Teachers</div></div><div style="text-align:center;padding:8px;background:var(--input);border-radius:6px"><div style="font-size:16px;font-weight:700;color:var(--grn)">' + s.res + '</div><div style="font-size:9.5px;color:var(--txM)">Resources</div></div></div>' +
    '<h4 style="font-size:12.5px;font-weight:600;margin-bottom:7px">Resources (' + sr.length + ")</h4>" + resList +
    '<button class="bp" style="margin-top:12px;width:100%" onclick="clMod();curSch=\'' + s.id + '\';document.getElementById(\'ssSel\').value=\'' + s.id + '\';nav(\'mysch\',{sid:\'' + s.id + '\'})"><i class="fas fa-sign-in-alt"></i> Enter Portal</button>'
  );
}

// ============================================================
// VIEW: Register School — Saves to Firestore
// ============================================================
function vRegSchool() {
  var ctryOpts = COUNTRIES.map(function(c) { return '<option value="' + c + '">' + c + "</option>"; }).join("");
  return '<h1 class="fd" style="font-size:20px;font-weight:700;margin-bottom:4px">Register Your School</h1><p style="font-size:12px;color:var(--tx2);margin-bottom:18px">Add your school to EduVault — submission saved to Firebase</p>' +
    '<div class="af"><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
    '<div class="fg"><label>School Name *</label><input type="text" class="fi" id="rgName" placeholder="e.g., Greenfield Academy"></div>' +
    '<div class="fg"><label>Short Name *</label><input type="text" class="fi" id="rgShort" placeholder="e.g., GA" maxlength="4"></div>' +
    '<div class="fg"><label>Country *</label><select class="fsel" id="rgCtry"><option value="">Select country</option>' + ctryOpts + "</select></div>" +
    '<div class="fg"><label>Curriculum *</label><select class="fsel" id="rgCur"><option value="">Select curriculum</option><option value="CBC">CBC (Kenya)</option><option value="WASSCE">WASSCE (West Africa)</option><option value="GCSE/A-Level">GCSE/A-Level (UK)</option><option value="CBSE">CBSE (India)</option><option value="Common Core">Common Core (USA)</option><option value="IB">International Baccalaureate</option><option value="Other">Other</option></select></div>' +
    '<div class="fg"><label>Theme Color</label><input type="color" id="rgColor" value="#0D9488" style="width:100%;height:36px;border:1px solid var(--brd);border-radius:7px;background:var(--input);cursor:pointer;padding:2px"></div>' +
    '<div class="fg"><label>Estimated Students</label><input type="number" class="fi" id="rgStu" placeholder="e.g., 500"></div></div>' +
    '<div class="fg"><label>Additional Notes</label><textarea class="fi" id="rgNotes" rows="2" style="height:auto;padding:8px 10px" placeholder="Anything else we should know..."></textarea></div>' +
    '<button class="bp" id="regBtn" onclick="doRegSchool()"><i class="fas fa-paper-plane"></i> Submit Registration</button></div><div id="regResult"></div>';
}

async function doRegSchool() {
  var name = document.getElementById("rgName").value.trim();
  var short = document.getElementById("rgShort").value.trim();
  var ctry = document.getElementById("rgCtry").value;
  var cur = document.getElementById("rgCur").value;
  var color = document.getElementById("rgColor").value || "#0D9488";
  var stu = parseInt(document.getElementById("rgStu").value) || 0;
  var notes = document.getElementById("rgNotes").value.trim();
  
  if (!name || !short || !ctry || !cur) {
    toast("Please fill all required fields", "er");
    return;
  }
  
  if (short.length > 4) {
    toast("Short name must be 4 characters or fewer", "er");
    return;
  }
  
  var btn = document.getElementById("regBtn");
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving to Firebase...';
  
  try {
    var ok = await registerSchool({
      schoolName: name,
      shortName: short,
      country: ctry,
      curriculum: cur,
      themeColor: color,
      students: stu,
      notes: notes
    });
    
    if (ok) {
      // Update local cache so admin panel sees it immediately
      firebaseRegistrations.unshift({
        id: "pending_" + Date.now(),
        schoolName: name,
        shortName: short,
        country: ctry,
        curriculum: cur,
        status: "pending",
        userName: currentUser.displayName || "Unknown",
        createdAt: new Date().toLocaleDateString()
      });
      
      document.getElementById("regResult").innerHTML =
        '<div class="reg-success" style="margin-top:18px">' +
        '<i class="fas fa-check-circle"></i>' +
        '<h3 class="fd" style="font-size:16px;margin-bottom:4px">Registration Submitted to Firebase</h3>' +
        '<p style="font-size:12.5px;color:var(--tx2)">Your school "<strong>' + esc(name) + '</strong>" has been saved. An admin will review it.</p>' +
        '</div>';
      
      // Reset ALL fields including dropdowns and color
      document.getElementById("rgName").value = "";
      document.getElementById("rgShort").value = "";
      document.getElementById("rgCtry").value = "";
      document.getElementById("rgCur").value = "";
      document.getElementById("rgColor").value = "#0D9488";
      document.getElementById("rgStu").value = "";
      document.getElementById("rgNotes").value = "";
      
      toast("Registration saved to Firebase!", "ok");
    } else {
      toast("Failed to submit. Check Firebase connection.", "er");
    }
  } catch (e) {
    console.error("Registration error:", e);
    toast("Unexpected error: " + (e.message || "Unknown"), "er");
  }
  
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Registration';
}

// ============================================================
// VIEW: My School Portal
// ============================================================
function vMySch() {
  var sid = curP.sid || curSch;
  if (sid === "all") return '<div class="es"><i class="fas fa-school"></i><p>No school selected. Choose from the dropdown or browse schools.</p><button class="bp" style="margin-top:14px" onclick="nav(\'schools\')"><i class="fas fa-search"></i> Browse Schools</button></div>';
  var s = SCHOOLS.find(function(x) { return x.id === sid; });
  if (!s) return '<div class="es"><i class="fas fa-exclamation-circle"></i><p>School not found</p></div>';
  var sr = RES.filter(function(r) { return r.schId === sid; });
  var pub = RES.filter(function(r) { return r.vis === "public"; }).slice(0, 4);
  var uplBtn = curRole !== "student" ? '<button class="bp" style="margin-bottom:18px" onclick="nav(\'upl\')"><i class="fas fa-plus"></i> Upload to School</button>' : "";
  var schoolRes = sr.length ? '<div class="rg" style="margin-bottom:24px">' + sr.map(rCard).join("") + "</div>" : '<div class="es" style="padding:24px"><i class="fas fa-folder-open"></i><p>No school resources yet.</p></div>';
  return '<div class="shdr"><div style="position:absolute;top:0;left:0;bottom:0;width:4px;background:' + s.tc + '"></div><div class="shi" style="background:' + s.tc + "30;color:" + s.tc + ";font-size:16px;font-weight:800\">" + s.sn + "</div><div class=\"shf\"><h1 class=\"fd\">" + esc(s.name) + "</h1><p>" + s.country + " &middot; " + s.cur + "</p></div><div class=\"shs\"><div class=\"sst\"><div class=\"v\" style=\"color:" + s.tc + '">' + s.stu.toLocaleString() + '</div><div class="l">Students</div></div><div class="sst"><div class="v">' + sr.length + '</div><div class="l">Resources</div></div><div class="sst"><div class="v">' + s.tch + '</div><div class="l">Teachers</div></div></div></div>' +
    uplBtn +
    '<div class="shr"><h2 class="fd">School Resources</h2></div>' + schoolRes +
    '<div class="shr"><h2 class="fd">Public Resources</h2><a onclick="nav(\'lib\')">View all <i class="fas fa-arrow-right" style="font-size:9px"></i></a></div><div class="rg">' + pub.map(rCard).join("") + "</div>";
}

// ============================================================
// VIEW: Profile — Saves to Firestore
// ============================================================
function vProfile() {
  if (!userProfile) return '<div class="es"><i class="fas fa-user"></i><p>No profile data.</p></div>';
  var initials = (userProfile.displayName || "U").split(" ").map(function(w) { return w[0]; }).join("").toUpperCase().substring(0, 2);
  var avatarContent = userProfile.photoURL ? '<img src="' + esc(userProfile.photoURL) + '" alt="Avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%">' : initials;
  return '<div class="profile-card">' +
    '<div class="profile-avatar-lg">' + avatarContent + "</div>" +
    '<div class="profile-name">' + esc(userProfile.displayName) + "</div>" +
    '<div class="profile-email">' + esc(userProfile.email) + "</div>" +
    '<div class="profile-badge">' + esc(userProfile.role || "student") + "</div>" +
    '<div class="profile-stats"><div class="profile-stat"><div class="pv">' + downloadHistory.length + '</div><div class="pl">Downloads</div></div><div class="profile-stat"><div class="pv">' + allSubj().length + '</div><div class="pl">Subjects</div></div><div class="profile-stat"><div class="pv">' + RES.length + '</div><div class="pl">Resources</div></div></div></div>' +
    '<div class="af"><h4 class="fd" style="font-size:15px;font-weight:600;margin-bottom:14px">Edit Profile</h4>' +
    '<div class="fg"><label>Display Name</label><input type="text" class="fi" id="profName" value="' + esc(userProfile.displayName) + '"></div>' +
    '<div class="fg"><label>Email</label><input type="text" class="fi" value="' + esc(userProfile.email) + '" disabled style="opacity:0.5"></div>' +
    '<div class="fg"><label>Role</label><select class="fsel" id="profRole"><option value="student"' + ((userProfile.role || "student") === "student" ? " selected" : "") + ">Student</option><option value=\"teacher\"" + (userProfile.role === "teacher" ? " selected" : "") + ">Teacher</option><option value=\"admin\"" + (userProfile.role === "admin" ? " selected" : "") + ">Admin</option></select></div>" +
    '<button class="bp" onclick="doSaveProfile()"><i class="fas fa-save"></i> Save to Firebase</button></div>';
}

function doSaveProfile() {
  var name = document.getElementById("profName").value.trim();
  var role = document.getElementById("profRole").value;
  if (!name) { toast("Name cannot be empty", "er"); return; }
  saveProfile({ displayName: name, role: role });
  curRole = role;
  updateTopBar();
  buildSidebar();
}

// ============================================================
// VIEW: Settings — Saves to Firestore
// ============================================================
function vSettings() {
  var s = (userProfile && userProfile.settings) || {};
  return '<div style="margin-bottom:22px"><h1 class="fd" style="font-size:20px;font-weight:700">Settings</h1><p style="font-size:12px;color:var(--tx2);margin-top:2px">All preferences saved to Firebase</p></div>' +
    '<div class="setting-group"><h4>Notifications</h4>' +
    '<div class="setting-row"><div><div class="setting-label">Push Notifications</div><div class="setting-desc">Receive alerts for new resources and updates</div></div><div class="toggle ' + (s.notifications !== false ? "on" : "") + '" onclick="toggleSetting(this,\'notifications\')"></div></div>' +
    '<div class="setting-row"><div><div class="setting-label">Email Digest</div><div class="setting-desc">Weekly summary of trending resources</div></div><div class="toggle ' + (s.emailDigest ? "on" : "") + '" onclick="toggleSetting(this,\'emailDigest\')"></div></div></div>' +
    '<div class="setting-group"><h4>Appearance</h4>' +
    '<div class="setting-row"><div><div class="setting-label">Dark Mode</div><div class="setting-desc">Use dark color scheme (recommended)</div></div><div class="toggle ' + (s.darkMode !== false ? "on" : "") + '" onclick="toggleSetting(this,\'darkMode\')"></div></div></div>' +
    '<div class="setting-group"><h4>Privacy</h4>' +
    '<div class="setting-row"><div><div class="setting-label">Public Profile</div><div class="setting-desc">Allow others to see your name on downloads</div></div><div class="toggle ' + (s.publicProfile ? "on" : "") + '" onclick="toggleSetting(this,\'publicProfile\')"></div></div></div>' +
    '<div class="setting-group"><h4>Data</h4>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="bo" onclick="exportData()"><i class="fas fa-download"></i> Export My Data</button><button class="bd" onclick="clearHistory()"><i class="fas fa-trash"></i> Clear Download History</button></div></div>' +
    '<div class="setting-group"><h4>Account</h4>' +
    '<div class="setting-row"><div><div class="setting-label">Sign Out</div><div class="setting-desc">Sign out of your account on this device</div></div><button class="bd" style="height:32px;font-size:11px;padding:0 12px" onclick="handleLogout()"><i class="fas fa-sign-out-alt"></i> Sign Out</button></div></div>';
}

function toggleSetting(el, key) {
  el.classList.toggle("on");
  var s = (userProfile && userProfile.settings) || {};
  s[key] = el.classList.contains("on");
  saveSettings(s);
}

function exportData() {
  var data = {
    profile: userProfile,
    downloads: downloadHistory.map(function(d) {
      return {
        resourceTitle: d.resourceTitle,
        subjectName: d.subjectName,
        type: d.type,
        level: d.level,
        date: d.date
      };
    }),
    customSubjects: firebaseCustomSubjects.map(function(s) {
      return { name: s.name, category: s.cat, id: s.id };
    }),
    exportedAt: new Date().toISOString()
  };
  var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "eduvault_data_" + new Date().toISOString().split("T")[0] + ".json";
  a.click();
  URL.revokeObjectURL(url);
  toast("Data exported from Firebase", "ok");
}

// ============================================================
// VIEW: Analytics
// ============================================================
function vAnalytics() {
  var sc = {}; RES.forEach(function(r) { sc[r.subjName] = (sc[r.subjName] || 0) + 1; });
  var ts = Object.entries(sc).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 8);
  return '<div style="margin-bottom:22px"><h1 class="fd" style="font-size:20px;font-weight:700">Analytics Dashboard</h1><p style="font-size:12px;color:var(--tx2);margin-top:2px">Platform-wide insights</p></div>' +
    '<div class="sg"><div class="sc"><div class="sci" style="background:var(--accG);color:var(--accL)"><i class="fas fa-eye"></i></div><div class="sv">48.2K</div><div class="slb">Views This Month</div><div class="sch up"><i class="fas fa-arrow-up"></i> +12.3%</div></div><div class="sc"><div class="sci" style="background:rgba(16,185,129,.15);color:var(--grn)"><i class="fas fa-download"></i></div><div class="sv">12.8K</div><div class="slb">Downloads</div><div class="sch up"><i class="fas fa-arrow-up"></i> +8.7%</div></div><div class="sc"><div class="sci" style="background:var(--ambG);color:var(--amb)"><i class="fas fa-robot"></i></div><div class="sv">6.4K</div><div class="slb">AI Queries</div><div class="sch up"><i class="fas fa-arrow-up"></i> +24.1%</div></div><div class="sc"><div class="sci" style="background:rgba(220,38,38,.15);color:var(--red)"><i class="fas fa-users"></i></div><div class="sv">3.2K</div><div class="slb">Active Users</div><div class="sch dn"><i class="fas fa-arrow-down"></i> -2.1%</div></div></div>' +
    '<div class="cg"><div class="cc"><h4 class="fd">Uploads Trend</h4><canvas id="ch1" height="200"></canvas></div><div class="cc"><h4 class="fd">Resource Types</h4><canvas id="ch2" height="200"></canvas></div><div class="cc"><h4 class="fd">Top Subjects</h4><canvas id="ch3" height="200"></canvas></div><div class="cc"><h4 class="fd">By Country</h4><canvas id="ch4" height="200"></canvas></div></div>' +
    '<div class="cc" style="margin-top:14px"><h4 class="fd">Trending This Week</h4><div style="margin-top:10px">' +
    RES.slice().sort(function(a, b) { return b.dl - a.dl; }).slice(0, 5).map(function(r, i) {
      var colors = ["var(--amb)", "#94A3B8", "#B45309", "var(--input)", "var(--input)"];
      var txtColors = ["#fff", "#fff", "#fff", "var(--txM)", "var(--txM)"];
      return '<div style="display:flex;align-items:center;gap:10px;padding:9px 0;' + (i < 4 ? 'border-bottom:1px solid var(--brd)' : '') + '"><span style="width:22px;height:22px;border-radius:5px;background:' + colors[i] + ";color:" + txtColors[i] + ';display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0">' + (i + 1) + '</span><div style="flex:1;min-width:0"><div style="font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(r.title) + "</div><div style=\"font-size:10.5px;color:var(--txM)\">" + r.subjName + " &middot; " + r.type + "</div></div><span style=\"font-size:11px;color:var(--tx2);white-space:nowrap\"><i class=\"fas fa-download\" style=\"font-size:9px\"></i> " + r.dl.toLocaleString() + "</span></div>";
    }).join("") + "</div></div>";
}

function initCharts() {
  Chart.defaults.color = "#8899AA";
  Chart.defaults.borderColor = "#1E2A3A";
  Chart.defaults.font.family = "DM Sans";
  var c1 = document.getElementById("ch1");
  if (c1) chrts.t = new Chart(c1, { type: "line", data: { labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], datasets: [{ label: "Uploads", data: [320,410,380,520,480,610,570,690,720,680,750,810], borderColor: "#0D9488", backgroundColor: "rgba(13,148,136,0.1)", fill: true, tension: 0.4, pointRadius: 2, pointBackgroundColor: "#0D9488" }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: "#1E2A3A" } } } } });
  var c2 = document.getElementById("ch2");
  if (c2) { var tc = {}; RES.forEach(function(r) { tc[r.type] = (tc[r.type] || 0) + 1; }); chrts.ty = new Chart(c2, { type: "doughnut", data: { labels: Object.keys(tc).map(function(t) { return t === "exams" ? "Past Papers" : t.charAt(0).toUpperCase() + t.slice(1); }), datasets: [{ data: Object.values(tc), backgroundColor: ["#0D9488","#F59E0B","#A78BFA","#EF4444"], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { padding: 10, usePointStyle: true, pointStyle: "circle", font: { size: 11 } } } }, cutout: "65%" } }); }
  var c3 = document.getElementById("ch3");
  if (c3) { var sc = {}; RES.forEach(function(r) { sc[r.subjName] = (sc[r.subjName] || 0) + 1; }); var topS = Object.entries(sc).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 8); chrts.su = new Chart(c3, { type: "bar", data: { labels: topS.map(function(t) { return t[0].length > 16 ? t[0].substring(0, 16) + "..." : t[0]; }), datasets: [{ data: topS.map(function(t) { return t[1]; }), backgroundColor: "rgba(13,148,136,0.6)", borderRadius: 3, barThickness: 16 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grid: { color: "#1E2A3A" } }, y: { grid: { display: false } } } } }); }
  var c4 = document.getElementById("ch4");
  if (c4) { var cc = {}; RES.forEach(function(r) { cc[r.ctry] = (cc[r.ctry] || 0) + 1; }); var topC = Object.entries(cc).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 6); chrts.co = new Chart(c4, { type: "bar", data: { labels: topC.map(function(t) { return t[0]; }), datasets: [{ data: topC.map(function(t) { return t[1]; }), backgroundColor: ["#0D9488","#059669","#0891B2","#D97706","#DC2626","#EA580C"], borderRadius: 3, barThickness: 24 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: "#1E2A3A" } }, x: { grid: { display: false } } } } }); }
}

// ============================================================
// VIEW: Admin Panel — Fully Firestore-backed
// ============================================================
function vAdmin() {
  if (curRole !== "admin") return '<div class="es"><i class="fas fa-shield-alt"></i><p>Admin access required. Switch to Admin role.</p></div>';
  return '<div style="margin-bottom:22px"><h1 class="fd" style="font-size:20px;font-weight:700">Admin Panel</h1><p style="font-size:12px;color:var(--tx2);margin-top:2px">Manage subjects, schools, and platform — all data in Firebase</p></div>' +
    '<div class="tb" style="max-width:380px"><button class="tbb act" id="at1" onclick="admTab(\'t1\')">Add Subject</button><button class="tbb" id="at2" onclick="admTab(\'t2\')">Custom (' + firebaseCustomSubjects.length + ')</button><button class="tbb" id="at3" onclick="admTab(\'t3\')">Registrations (' + firebaseRegistrations.length + ')</button></div>' +
    '<div id="admTabs">' +
    '<div id="t1"><div class="af"><h4 class="fd" style="font-size:15px;font-weight:600;margin-bottom:14px">Add New Subject (saved to Firebase)</h4><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div class="fg"><label>Subject Name</label><input type="text" class="fi" id="nsN" placeholder="e.g., Astrophysics"></div><div class="fg"><label>Category</label><select class="fsel" id="nsC">' + CATS.map(function(c) { return '<option value="' + c.name + '">' + c.name + "</option>"; }).join("") + '<option value="Custom">Custom</option></select></div></div><div class="fg"><label>Subject ID (auto if empty)</label><input type="text" class="fi" id="nsI" placeholder="auto-generated"></div><button class="bp" onclick="addSubj()"><i class="fas fa-plus"></i> Add to Firebase</button></div></div>' +
    '<div id="t2" style="display:none">' + (firebaseCustomSubjects.length ? '<div style="display:flex;flex-direction:column;gap:7px">' + firebaseCustomSubjects.map(function(s) { return '<div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--card);border:1px solid var(--brd);border-radius:9px"><div style="width:32px;height:32px;border-radius:7px;background:var(--accG);color:var(--accL);display:flex;align-items:center;justify-content:center"><i class="fas fa-plus-circle"></i></div><div style="flex:1"><div style="font-size:13px;font-weight:600">' + esc(s.name) + "</div><div style=\"font-size:10.5px;color:var(--txM)\">" + esc(s.cat) + " &middot; ID: " + s.id + "</div></div><button style=\"background:none;border:1px solid rgba(239,68,68,.3);border-radius:6px;padding:4px 8px;color:var(--red);cursor:pointer;font-size:11px\" onclick=\"delSubj('" + s.id + '\')"><i class="fas fa-trash"></i></button></div>'; }).join("") + "</div>" : '<div class="es" style="padding:24px"><i class="fas fa-plus-circle"></i><p>No custom subjects in Firebase yet.</p></div>') + "</div>" +
    '<div id="t3" style="display:none"><div id="regList"><div class="es"><i class="fas fa-spinner fa-spin"></i><p>Loading from Firebase...</p></div></div></div></div>';
}

function admTab(id) {
  ["t1", "t2", "t3"].forEach(function(t) {
    var el = document.getElementById(t);
    var btn = document.getElementById("a" + t);
    if (el) el.style.display = t === id ? "block" : "none";
    if (btn) btn.classList.toggle("act", t === id);
  });
  if (id === "t3") loadRegList();
}

async function loadRegList() {
  var el = document.getElementById("regList");
  if (!el) return;

  el.innerHTML = '<div class="es"><i class="fas fa-spinner fa-spin"></i><p>Loading from Firebase...</p></div>';

  var regs = await getAllRegistrations();
  if (!regs.length) {
    el.innerHTML = '<div class="es" style="padding:24px"><i class="fas fa-inbox"></i><p>No school registrations in Firebase yet.</p></div>';
    return;
  }

  var statusColors = { pending: "var(--amb)", approved: "var(--grn)", rejected: "var(--red)" };
  el.innerHTML = '<div style="display:flex;flex-direction:column;gap:8px">' + regs.map(function(r) {
    var color = statusColors[r.status] || "var(--txM)";
    return '<div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--card);border:1px solid var(--brd);border-radius:9px"><div style="flex:1"><div style="font-size:13px;font-weight:600">' + esc(r.schoolName) + " (" + esc(r.shortName) + ")</div><div style=\"font-size:10.5px;color:var(--txM)\">" + esc(r.country) + " &middot; " + esc(r.curriculum) + (r.userName ? " &middot; By " + esc(r.userName) : "") + " &middot; " + (r.createdAt || "") + "</div></div><span style=\"padding:3px 8px;border-radius:10px;font-size:10px;font-weight:600;background:" + color + "20;color:" + color + ';text-transform:capitalize">' + r.status + "</span>" +
      (r.status === "pending" ? '<div style="display:flex;gap:4px"><button class="bp" style="height:28px;font-size:10px;padding:0 8px" onclick="approveReg(\'' + r.id + '\')"><i class="fas fa-check"></i></button><button class="bd" style="height:28px;font-size:10px;padding:0 8px" onclick="rejectReg(\'' + r.id + '\')"><i class="fas fa-times"></i></button></div>' : "") + "</div>";
  }).join("") + "</div>";
}

async function approveReg(id) {
  await updateRegStatus(id, "approved");
  toast("Registration approved in Firebase", "ok");
  loadRegList();
}

async function rejectReg(id) {
  await updateRegStatus(id, "rejected");
  toast("Registration rejected in Firebase", "inf");
  loadRegList();
}

// ============================================================
// INITIALIZATION
// ============================================================
function init() {
  if (!firebaseReady) {
    // Show critical error immediately — app cannot function
    document.getElementById("authScreen").innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;text-align:center;padding:20px">' +
      '<i class="fas fa-exclamation-triangle" style="font-size:48px;color:var(--red);margin-bottom:20px"></i>' +
      '<h2 style="color:var(--tx);font-size:22px;font-weight:700;margin-bottom:8px">Firebase Not Available</h2>' +
      '<p style="color:var(--tx2);font-size:14px;max-width:450px;line-height:1.6">EduVault requires Firebase to store all data. Please ensure:</p>' +
      '<div style="text-align:left;max-width:400px;margin:16px 0;background:var(--card);border:1px solid var(--brd);border-radius:10px;padding:16px;font-size:13px;color:var(--tx2);line-height:1.8">' +
      '1. Firebase SDK scripts are loaded in your HTML (before app.js)<br>' +
      '2. Your <code style="background:var(--input);padding:1px 5px;border-radius:3px">firebaseConfig</code> is correct in app.js<br>' +
      '3. Firestore is enabled in your Firebase Console<br>' +
      '4. Firebase Storage is enabled (for file uploads)<br>' +
      '5. Auth is enabled (Email/Password + Google)</div>' +
      '<a href="https://console.firebase.google.com" target="_blank" style="color:var(--accL);font-size:13px;text-decoration:underline">Open Firebase Console</a>' +
      '</div>';
    return;
  }

  populateSchoolSelect();

  // Keyboard shortcut: Ctrl+K for search
  document.addEventListener("keydown", function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      if (currentUser) {
        nav("search");
        setTimeout(function() { var i = document.getElementById("hsi"); if (i) i.focus(); }, 100);
      }
    }
  });

  // Start Firebase auth observer
  initAuthObserver();
}

// Boot the app
init();