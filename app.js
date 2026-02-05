// =========================
// app.js (FULL – FINAL)
// =========================

// ===== Elements =====
const skinSelect  = document.getElementById("skinSelect");
const brandSelect = document.getElementById("brandSelect");
const categorySelect = document.getElementById("categorySelect");
const panelNightBadge = document.getElementById("panelNightBadge");

const brandLabel  = document.getElementById("brandLabel");
const brandLogo   = document.getElementById("brandLogo");
const brandName   = document.getElementById("brandName");

const skinLabel   = document.getElementById("skinLabel");
const grid        = document.getElementById("grid");
const emptyState  = document.getElementById("emptyState");

const overlay     = document.getElementById("overlay");
const closePanel  = document.getElementById("closePanel");

const panelImg         = document.getElementById("panelImg");
const panelName        = document.getElementById("panelName");
const panelDesc        = document.getElementById("panelDesc");
const panelIngredients = document.getElementById("panelIngredients");
const panelBenefits    = document.getElementById("panelBenefits");
const panelUsage       = document.getElementById("panelUsage");

// =========================
// ✅ Brand logos (ONE PLACE ONLY)
// =========================
// حط هنا روابط اللوجوه مرة واحدة فقط
// لازم تكون روابط مباشرة للصورة (png/jpg/svg)
const BRAND_LOGOS = {
  vichy: "https://raw.githubusercontent.com/drshawky26/skin-care/refs/heads/main/vichy.png",
  larocheposay: "https://raw.githubusercontent.com/drshawky26/skin-care/refs/heads/main/la%20roche.png",
  avene: "https://raw.githubusercontent.com/drshawky26/skin-care/refs/heads/main/avene.png",
  isispharma: "https://raw.githubusercontent.com/drshawky26/skin-care/refs/heads/main/isis.png",
  bioderma: "https://raw.githubusercontent.com/drshawky26/skin-care/refs/heads/main/bioderma.png",
  uriage: "https://raw.githubusercontent.com/drshawky26/skin-care/refs/heads/main/uriage.png",
  acm: "https://raw.githubusercontent.com/drshawky26/skin-care/refs/heads/main/acm.png",
  eucerin: "https://raw.githubusercontent.com/drshawky26/skin-care/refs/heads/main/eucerin.png",
  cerave: "https://raw.githubusercontent.com/drshawky26/skin-care/refs/heads/main/cerave.png",
  anivagen: "https://raw.githubusercontent.com/drshawky26/skin-care/refs/heads/main/anivagen.png",
  matriskin:"https://raw.githubusercontent.com/drshawky26/skin-care/refs/heads/main/matriskin.png",
};

// =========================
// Category options control
// =========================
const ALL_CAT_OPTIONS = Array.from(categorySelect.options).map(opt => ({
  value: opt.value,
  text: opt.textContent,
  disabled: opt.disabled,
  selected: opt.selected
}));

const categoryDisplay = {
  "cleanser": "غسول",
  "moisturizer": "مرطب",
  "toner": "تونر",
  "sunscreen": "صن سكرين",
  "wrinkles": "تجاعيد",
  "brightening": "تفتيح",
  "micellar water": "مياه ميسيلار",
  "lip balm": "مرطب شفاه",
  "black heads": "للرؤوس السوداء",
  "healing":"Healing ترميم حاجز البشره",
  "acne":" حب الشباب ",
  "finelines":"الخطوط الدقيقه",
  "all hair": "جميع أنواع الشعر",
  "dry hair": "الشعر الجاف",
  "normal hair": "الشعر العادي",
  "oily hair": "الشعر الدهني",
  "volume hair": "كثافة الشعر",
  "hair loss": "تساقط الشعر",
  "hair dandruf":"للقشره",
  "viltigo":"بهاق",
  "night care":"العنايه اليليه",
  "hand":"العنايه باليدين",
  "exfoliating":"مقشر",
  "eye lash":"العنايه بالرموش",
  "eye brow":"العنايه بالحواجب",
  "firming":"شد الترهلات والسيلوليت",
  "puffness":"إنتفاخات العين",
};

function rebuildCategoryOptions(allowedValues) {
  categorySelect.innerHTML = "";

  const allOpt = document.createElement("option");
  allOpt.value = "";
  allOpt.textContent = "جميع المنتجات";
  categorySelect.appendChild(allOpt);

  for (const v of allowedValues) {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = categoryDisplay[v] ?? v;
    categorySelect.appendChild(opt);
  }

  categorySelect.value = "";
}

function normalizeText(v) {
  return String(v ?? "").trim().toLowerCase();
}

function updateCategoryOptionsBySkin(skin) {
  const prev = normalizeText(categorySelect.value);
  skin = normalizeText(skin);

  if (skin === "eye") {
    rebuildCategoryOptions(["wrinkles", "moisturizer", "brightening","eye lash","eye brow","puffness"]);
  } else if (skin === "hair") {
    const hairValues = ALL_CAT_OPTIONS
      .map(o => normalizeText(o.value))
      .filter(v => v && v.includes("hair"));

    rebuildCategoryOptions(hairValues);
  } else {
    const skinValues = ALL_CAT_OPTIONS
      .map(o => normalizeText(o.value))
      .filter(v => v && !v.includes("hair"));

    rebuildCategoryOptions(skinValues);
  }

  const exists = Array.from(categorySelect.options)
    .some(opt => normalizeText(opt.value) === prev);

  categorySelect.value = exists ? prev : "";
}

// Zoom elements
const hoverPreview = document.getElementById("hoverPreview");
const hoverPreviewLens = document.getElementById("hoverPreviewLens");

// ===== Helpers =====
function isNightProduct(p){
  const words = normalizeText(
    (p.name || "") + " " +
    (p.description || "") + " " +
    (p.usage || "")
  )
  .split(/[\s\-_/،.]+/)
  .filter(Boolean);

  const morningWords = ["morning","am","صباح","صباحا","صباحاً"];
  const nightWords = ["night","pm","overnight","مساء","مساءا","مساءً","ليلي","ليل","ليلى"];

  if (words.some(w => morningWords.includes(w))) return false;
  if (words.includes("صباحا") && words.includes("مساءa")) return false;

  return words.some(w => nightWords.includes(w));
}

// ===== Display Maps =====
const skinDisplay = {
  oily: "دهنيه",
  normal: "عاديه",
  combination: "مختلطه",
  sensitive: "حساسة",
  dry: "جافه",
  allskin: "جميع أنواع البشرة",
  facebody:"للبشره والوجه",
  eye:"للعين",
  cica:"بشره متضرره",
  body:"للجسم",
  nails:"للأظافر",
};

const labelClass = {
  oily: "label-oily",
  normal: "label-normal",
  combination: "label-combination",
  sensitive: "label-sensitive",
  dry: "label-dry",
  allskin: "label-allskin",
  facebody:"label-facebody",
  eye:"label-eye",
  cica:"label-cica",
  nails:"label-nails",
  body:"label-body",
};

const brandDisplay = {
  vichy: "Vichy",
  "la roche posay": "La Roche-Posay",
  avene: "Avène",
  isispharma: "IsisPharma",
  bioderma: "Bioderma",
  eucerin: "Eucerin",
  acm:"Acm",
  uriage:"Uriage",
  cerave:"CeraVe",
  anivagen:"Anivagen",
  matriskin:"matriskin",
};

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1200&q=60";

// ===== State =====
let allProducts = [];

// =========================
// Google Sheet Loader (OpenSheet)
// =========================
const SHEET_ID = "1sGAoP3LRFv9c59CSS3GVYqjhiUtoJ9c5W__29XQMVhc";
const SHEET_NAME = "Sheet1";
const SHEET_URL = `https://opensheet.elk.sh/${SHEET_ID}/${encodeURIComponent(SHEET_NAME)}`;

async function loadExcel() {
  const res = await fetch(SHEET_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("فشل تحميل Google Sheet");

  const rows = await res.json();

  allProducts = rows
    .map(r => {
      const skinTypes = normalizeText(r.skinType)
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      return {
        id: String(r.id ?? "").trim(),
        skinTypes,
        brand: normalizeText(r.brand),
        category: normalizeText(r.category),
        name: String(r.name ?? "").trim(),
        description: String(r.description ?? "").trim(),
        ingredients: String(r.ingredients ?? "").trim(),
        benefits: String(r.benefits ?? "").trim(),
        usage: String(r.usage ?? "").trim(),
        image: String(r.image ?? "").trim(),
      };
    })
    .filter(p => p.skinTypes.length && p.brand && p.name);

  applyFilters();

  // بعد تحميل الداتا: جهّز فقاعات اللوجوه
  if (typeof window.__initBrandBubbles === "function") {
    window.__initBrandBubbles();
  }
}

// =========================
// Brand helpers
// =========================
function getBrandLogoUrl(brandKey) {
  return BRAND_LOGOS[brandKey] || "";
}

function getAvailableBrands() {
  const set = new Set(allProducts.map(p => p.brand).filter(Boolean));
  return Array.from(set);
}

// =========================
// UI Helpers
// =========================
function setSkinLabel(type) {
  skinLabel.classList.remove("hidden", ...Object.values(labelClass));
  if (!type) {
    skinLabel.classList.add("hidden");
    return;
  }
  skinLabel.textContent = `نوع البشرة: ${skinDisplay[type] ?? type}`;
  if (labelClass[type]) skinLabel.classList.add(labelClass[type]);
}

function setBrandLabel(brand) {
  if (!brand) {
    brandLabel.classList.add("hidden");
    brandLogo.src = "";
    brandLogo.alt = "";
    return;
  }

  brandLabel.classList.remove("hidden");
  brandName.textContent = `الشركة: ${brandDisplay[brand] ?? brand}`;

  const logoUrl = getBrandLogoUrl(brand);
  if (logoUrl) {
    brandLogo.src = logoUrl;
    brandLogo.alt = brandDisplay[brand] ?? brand;
    brandLogo.style.display = "";
  } else {
    brandLogo.src = "";
    brandLogo.alt = "";
    brandLogo.style.display = "none";
  }
}

function showEmpty(msg) {
  grid.innerHTML = "";
  emptyState.textContent = msg;
  emptyState.classList.remove("hidden");
}
function hideEmpty() {
  emptyState.classList.add("hidden");
}

// =========================
// Filters
// =========================
function applyFilters() {
  const skin = normalizeText(skinSelect.value);
  const brand = normalizeText(brandSelect.value);
  const category = normalizeText(categorySelect.value);

  setSkinLabel(skin);
  setBrandLabel(brand);

  if (!skin && !brand && !category) {
    showEmpty("اختار (نوع البشرة) أو (الشركة) أو (نوع المنتج) علشان تظهر المنتجات");
    return;
  }

  renderProducts(skin, brand, category);
}

// =========================
// Render Products
// =========================
function renderProducts(skin, brand, category) {
  grid.innerHTML = "";

  const filtered = allProducts.filter(p => {

    if (skin) {
      if (skin === "hair") {
        if (!p.skinTypes.includes("hair")) return false;
      } else {
        const baseSkinTypes = ["oily", "normal", "combination", "sensitive", "dry"];
        const allowAllskin = baseSkinTypes.includes(skin);

        const ok =
          p.skinTypes.includes(skin) ||
          (allowAllskin && p.skinTypes.includes("allskin"));

        if (!ok) return false;
      }
    }

    if (category) {
      if (category === "night care") {
        if (!isNightProduct(p)) return false;
      } else {
        const cats = normalizeText(p.category)
          .split(",")
          .map(s => s.trim())
          .filter(Boolean);

        if (!cats.includes(category)) return false;
      }
    }

    if (brand && p.brand !== brand) return false;

    return true;
  });

  if (!filtered.length) {
    showEmpty("مفيش منتجات مطابقة للاختيارات دي");
    return;
  }

  hideEmpty();

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = p.image || PLACEHOLDER;
    img.alt = p.name;

    const name = document.createElement("h3");
    name.textContent = p.name;

    card.append(img, name);

    if (isNightProduct(p)) {
      const badge = document.createElement("div");
      badge.className = "night-badge";
      badge.title = "منتج ليلي";
      badge.innerHTML = `
        <svg viewBox="0 0 122.88 122.89" aria-hidden="true">
          <path d="M49.06,1.27c2.17-0.45,4.34-0.77,6.48-0.98c2.2-0.21,4.38-0.31,6.53-0.29c1.21,0.01,2.18,1,2.17,2.21 c-0.01,0.93-0.6,1.72-1.42,2.03c-9.15,3.6-16.47,10.31-20.96,18.62c-4.42,8.17-6.1,17.88-4.09,27.68l0.01,0.07 c2.29,11.06,8.83,20.15,17.58,25.91c8.74,5.76,19.67,8.18,30.73,5.92l0.07-0.01c7.96-1.65,14.89-5.49,20.3-10.78 c5.6-5.47,9.56-12.48,11.33-20.16c0.27-1.18,1.45-1.91,2.62-1.64c0.89,0.21,1.53,0.93,1.67,1.78c2.64,16.2-1.35,32.07-10.06,44.71 c-8.67,12.58-22.03,21.97-38.18,25.29c-16.62,3.42-33.05-0.22-46.18-8.86C14.52,104.1,4.69,90.45,1.27,73.83 C-2.07,57.6,1.32,41.55,9.53,28.58C17.78,15.57,30.88,5.64,46.91,1.75c0.31-0.08,0.67-0.16,1.06-0.25 l0.01,0l0,0L49.06,1.27z"/>
        </svg>
      `;
      card.appendChild(badge);
    }

    card.onclick = () => openPanel(p);
    grid.appendChild(card);
  });
}

// =========================
// Panel
// =========================
function openPanel(p) {
  panelImg.src = p.image || PLACEHOLDER;
  panelName.textContent = p.name || "—";
  panelDesc.textContent = p.description || "—";
  panelIngredients.textContent = p.ingredients || "—";
  panelBenefits.textContent = p.benefits || "—";
  panelUsage.textContent = p.usage || "—";

  if (isNightProduct(p)) {
    panelNightBadge.classList.remove("hidden");
    panelNightBadge.innerHTML = `
      <svg viewBox="0 0 122.88 122.89" aria-hidden="true">
        <path d="M49.06,1.27c2.17-0.45,4.34-0.77,6.48-0.98c2.2-0.21,4.38-0.31,6.53-0.29c1.21,0.01,2.18,1,2.17,2.21 c-0.01,0.93-0.6,1.72-1.42,2.03c-9.15,3.6-16.47,10.31-20.96,18.62c-4.42,8.17-6.1,17.88-4.09,27.68l0.01,0.07 c2.29,11.06,8.83,20.15,17.58,25.91c8.74,5.76,19.67,8.18,30.73,5.92l0.07-0.01c7.96-1.65,14.89-5.49,20.3-10.78 c5.6-5.47,9.56-12.48,11.33-20.16c0.27-1.18,1.45-1.91,2.62-1.64c0.89,0.21,1.53,0.93,1.67,1.78c2.64,16.2-1.35,32.07-10.06,44.71 c-8.67,12.58-22.03,21.97-38.18,25.29c-16.62,3.42-33.05-0.22-46.18-8.86C14.52,104.1,4.69,90.45,1.27,73.83 C-2.07,57.6,1.32,41.55,9.53,28.58C17.78,15.57,30.88,5.64,46.91,1.75c0.31-0.08,0.67-0.16,1.06-0.25 l0.01,0l0,0L49.06,1.27z"/>
      </svg>
    `;
  } else {
    panelNightBadge.classList.add("hidden");
    panelNightBadge.innerHTML = "";
  }

  overlay.classList.remove("hidden");
}

closePanel.onclick = () => overlay.classList.add("hidden");

// =========================
// Zoom
// =========================
const MAG_ZOOM = 4;

function setLensImage(src) {
  hoverPreviewLens.style.backgroundImage = `url("${src}")`;
  hoverPreviewLens.style.backgroundSize = `${MAG_ZOOM * 100}% ${MAG_ZOOM * 100}%`;
}
function updateMagnifier(e) {
  const rect = panelImg.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  hoverPreviewLens.style.backgroundPosition =
    `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`;
}
panelImg.onmouseenter = e => {
  setLensImage(panelImg.src);
  hoverPreview.style.display = "block";
  updateMagnifier(e);
};
panelImg.onmousemove = updateMagnifier;
panelImg.onmouseleave = () => hoverPreview.style.display = "none";

// =========================
// Events
// =========================
skinSelect.onchange = () => {
  updateCategoryOptionsBySkin(skinSelect.value);
  applyFilters();
};
brandSelect.onchange = applyFilters;
categorySelect.onchange = applyFilters;

// =========================
// Start
// =========================
loadExcel().catch(err => {
  console.error(err);
  showEmpty(err.message);
  updateCategoryOptionsBySkin(skinSelect.value);
});

// =========================
// Bubbles + Brand Logo Bubbles (Clickable)
// =========================
(() => {
  const canvas = document.getElementById("bubblesCanvas");
  const ctx = canvas.getContext("2d", { alpha: true });

  const DPR = Math.min(2, window.devicePixelRatio || 1);

  let W = 0, H = 0;
  let bubbles = [];
  let logoBubbles = [];
  let hoveredBrandKey = "";

  const logoImages = new Map();
  const LOGO_COUNT = 12;

  let lastT = performance.now();

  const pointer = { x: 0, y: 0, vx: 0, vy: 0, active: false };
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function rand(min, max){ return Math.random() * (max - min) + min; }

  function resize() {
    W = Math.floor(canvas.clientWidth);
    H = Math.floor(canvas.clientHeight);
    canvas.width  = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const targetCount = Math.max(50, Math.min(180, Math.floor((W * H) / 11000)));

    if (!bubbles.length) {
      bubbles = makeBubbles(targetCount);
    } else if (bubbles.length < targetCount) {
      bubbles.push(...makeBubbles(targetCount - bubbles.length));
    } else if (bubbles.length > targetCount) {
      bubbles.length = targetCount;
    }

    if (!logoBubbles.length && typeof window.__initBrandBubbles === "function") {
      window.__initBrandBubbles();
    }
  }

  const palette = [
    { core: [170, 225, 255], glow: [210, 245, 255] },
    { core: [140, 205, 255], glow: [200, 235, 255] },
    { core: [185, 240, 255], glow: [220, 252, 255] },
  ];

  function makeBubbles(n){
    const arr = [];
    for (let i = 0; i < n; i++){
      const p = palette[Math.floor(Math.random() * palette.length)];
      const r = rand(4, 28) * (W < 520 ? 0.95 : 1);

      arr.push({
        x: rand(0, W),
        y: rand(H * 0.35, H),
        r,
        vx: rand(-0.08, 0.08),
        vy: rand(-0.40, -0.10),
        wob: rand(0.6, 1.6),
        ph: rand(0, Math.PI * 2),
        a: rand(0.10, 0.22),
        core: p.core,
        glow: p.glow,
        z: rand(0.4, 1.2)
      });
    }
    return arr;
  }

  function makeLogoBubbles(brandKeys){
    const keys = brandKeys
      .filter(k => getBrandLogoUrl(k)) // لازم يبقى ليه لوجو
      .slice(0, LOGO_COUNT);

    const arr = [];

    for (const brandKey of keys){
      const url = getBrandLogoUrl(brandKey);
      if (!url) continue;

      if (!logoImages.has(brandKey)) {
        const im = new Image();
        im.crossOrigin = "anonymous";
        im.src = url;
        logoImages.set(brandKey, im);
      }

      const r = rand(34, 48) * (W < 520 ? 0.9 : 1.1);

      arr.push({
        brandKey,
        x: rand(0, W),
        y: rand(H * 0.35, H),
        r,
        vx: rand(-0.08, 0.08),
        vy: rand(-0.36, -0.12),
        wob: rand(0.6, 1.6),
        ph: rand(0, Math.PI * 2),
        a: rand(0.18, 0.30),
        z: rand(0.6, 1.25),
      });
    }
    return arr;
  }

  window.__initBrandBubbles = () => {
    const brands = getAvailableBrands();
    brands.sort();
    logoBubbles = makeLogoBubbles(brands);
  };

  function onPointerMove(e){
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);
    pointer.vx = x - pointer.x;
    pointer.vy = y - pointer.y;
    pointer.x = x; pointer.y = y;
    pointer.active = true;
  }

  function onTouchMove(e){
    if (!e.touches || !e.touches[0]) return;
    onPointerMove(e.touches[0]);
  }

  window.addEventListener("mousemove", onPointerMove, { passive: true });
  window.addEventListener("touchstart", onTouchMove, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("mouseleave", () => pointer.active = false, { passive: true });

  // =========================
// Hover على لوجو الشركة
// =========================
canvas.style.pointerEvents = "auto";

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  hoveredBrandKey = "";

  for (let i = logoBubbles.length - 1; i >= 0; i--) {
    const b = logoBubbles[i];
    const dx = x - b.x;
    const dy = y - b.y;
    if (dx * dx + dy * dy <= b.r * b.r) {
      hoveredBrandKey = b.brandKey;
      break;
    }
  }

  canvas.style.cursor = hoveredBrandKey ? "pointer" : "default";
}, { passive: true });
canvas.addEventListener("click", (e) => {
  if (!hoveredBrandKey) return;

  // اختيار الشركة + عرض المنتجات
  selectBrandSafe(hoveredBrandKey);
});

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = logoBubbles.length - 1; i >= 0; i--){
      const b = logoBubbles[i];
      const dx = x - b.x;
      const dy = y - b.y;
      if (dx*dx + dy*dy <= (b.r * b.r)) {
        brandSelect.value = b.brandKey;
        applyFilters();
        return;
      }
    }
  });

  function drawBubble(b) {
    const glow = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 2.8);
    glow.addColorStop(0, `rgba(200,245,255,${b.a * 0.55})`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r * 2.8, 0, Math.PI * 2);
    ctx.fill();

    const body = ctx.createRadialGradient(
      b.x - b.r * 0.22, b.y - b.r * 0.22, b.r * 0.10,
      b.x, b.y, b.r
    );
    body.addColorStop(0, `rgba(255,255,255,${b.a * 0.75})`);
    body.addColorStop(0.45, `rgba(170,230,255,${b.a * 0.40})`);
    body.addColorStop(1, `rgba(255,255,255,${b.a * 0.18})`);

    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 1.6;
    ctx.strokeStyle = `rgba(255,255,255,${b.a * 1.25})`;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r * 0.98, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawLogoBubble(b){
    // bubble + clip logo
    const body = ctx.createRadialGradient(
      b.x - b.r * 0.22, b.y - b.r * 0.22, b.r * 0.10,
      b.x, b.y, b.r
    );
    body.addColorStop(0, `rgba(255,255,255,${b.a * 0.85})`);
    body.addColorStop(1, `rgba(255,255,255,${b.a * 0.18})`);

    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r * 0.82, 0, Math.PI * 2);
    ctx.clip();

    const im = logoImages.get(b.brandKey);
    if (im && im.complete && im.naturalWidth) {
      const size = b.r * 1.45;
      ctx.drawImage(im, b.x - size/2, b.y - size/2, size, size);
    }
    ctx.restore();

    ctx.lineWidth = 1.8;
    ctx.strokeStyle = `rgba(255,255,255,${b.a * 1.2})`;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r * 0.98, 0, Math.PI * 2);
    ctx.stroke();
  }

  function step(t){
    const dt = Math.min(32, t - lastT) / 16.666;
    lastT = t;

    ctx.clearRect(0, 0, W, H);

    if (prefersReduced) {
      for (const b of bubbles) drawBubble(b);
      for (const b of logoBubbles) drawLogoBubble(b);
      requestAnimationFrame(step);
      return;
    }

    const px = pointer.x, py = pointer.y;
    const hasPointer = pointer.active;

    function moveBubble(b){
      b.ph += 0.01 * b.wob * dt;
      const wobX = Math.sin(b.ph) * 0.15 * b.z;
      const wobY = Math.cos(b.ph * 0.9) * 0.18 * b.z;

      b.x += (b.vx + wobX) * dt * (0.6 + b.z);
      b.y += (b.vy + wobY) * dt * (0.6 + b.z);

      if (hasPointer){
        const dx = b.x - px;
        const dy = b.y - py;
        const dist2 = dx*dx + dy*dy;
        const range = Math.max(120, Math.min(260, (b.r * 7)));
        const range2 = range * range;

        if (dist2 < range2){
          const dist = Math.sqrt(dist2) || 1;
          const force = (1 - dist / range) * 0.9 * b.z;
          const nx = dx / dist;
          const ny = dy / dist;
          b.x += nx * force * 2.2 * dt;
          b.y += ny * force * 2.2 * dt;
        }
      }

      const pad = b.r * 2.5;
      if (b.x < -pad) b.x = W + pad;
      else if (b.x > W + pad) b.x = -pad;
      if (b.y < -pad) {
        b.y = H + pad;
        b.x = rand(0, W);
      }
    }

    for (const b of bubbles){ moveBubble(b); drawBubble(b); }
    for (const b of logoBubbles){ moveBubble(b); drawLogoBubble(b); }

    requestAnimationFrame(step);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(document.querySelector(".bg-bubbles"));

  resize();
  requestAnimationFrame(step);
})();
