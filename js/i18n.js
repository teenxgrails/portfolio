/* i18n.js — auto language detection + dictionary + switcher
 * UI strings only. Project titles/descriptions stay English (from JSON).
 * Auto-detect only (no switcher UI). An optional #lang=xx still forces a locale.
 */
(function () {
  const LANGS = ["fr", "de", "en", "it", "ru"];
  const FALLBACK = "en";

  const DICT = {
    en: {
      cat_websites: "Websites",
      cat_programs: "Programs",
      cat_videos: "Videos",
      cat_designs: "Designs",
      designs_banner: "banner",
      designs_avatar: "avatar",
      designs_other: "other pictures",
      lightbox_open: "Open",
      lightbox_close: "Close",
      lightbox_view: "View",
      footer_made: "made by été23",
    },
    fr: {
      cat_websites: "Sites web",
      cat_programs: "Programmes",
      cat_videos: "Vidéos",
      cat_designs: "Designs",
      designs_banner: "bannière",
      designs_avatar: "avatar",
      designs_other: "autres images",
      lightbox_open: "Ouvrir",
      lightbox_close: "Fermer",
      lightbox_view: "Voir",
      footer_made: "réalisé par été23",
    },
    de: {
      cat_websites: "Webseiten",
      cat_programs: "Programme",
      cat_videos: "Videos",
      cat_designs: "Designs",
      designs_banner: "Banner",
      designs_avatar: "Avatar",
      designs_other: "weitere Bilder",
      lightbox_open: "Öffnen",
      lightbox_close: "Schließen",
      lightbox_view: "Ansehen",
      footer_made: "gemacht von été23",
    },
    it: {
      cat_websites: "Siti web",
      cat_programs: "Programmi",
      cat_videos: "Video",
      cat_designs: "Design",
      designs_banner: "banner",
      designs_avatar: "avatar",
      designs_other: "altre immagini",
      lightbox_open: "Apri",
      lightbox_close: "Chiudi",
      lightbox_view: "Guarda",
      footer_made: "fatto da été23",
    },
    ru: {
      cat_websites: "Сайты",
      cat_programs: "Программы",
      cat_videos: "Видео",
      cat_designs: "Дизайны",
      designs_banner: "баннер",
      designs_avatar: "аватар",
      designs_other: "другие картинки",
      lightbox_open: "Открыть",
      lightbox_close: "Закрыть",
      lightbox_view: "Смотреть",
      footer_made: "сделано été23",
    },
  };

  function hashLang() {
    const m = location.hash.match(/lang=([a-z]{2})/i);
    return m ? m[1].toLowerCase() : null;
  }

  function detect() {
    const fromHash = hashLang();
    if (fromHash && LANGS.includes(fromHash)) return fromHash;
    const navs = navigator.languages || [navigator.language || ""];
    for (const n of navs) {
      const code = (n || "").slice(0, 2).toLowerCase();
      if (LANGS.includes(code)) return code;
    }
    return FALLBACK;
  }

  let current = detect();

  function t(key) {
    const d = DICT[current] || DICT[FALLBACK];
    return (d && d[key]) || DICT[FALLBACK][key] || key;
  }

  function apply() {
    document.documentElement.lang = current;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      // format: "aria-label:lightbox_close"
      el.getAttribute("data-i18n-attr").split(";").forEach((pair) => {
        const [attr, key] = pair.split(":");
        if (attr && key) el.setAttribute(attr.trim(), t(key.trim()));
      });
    });
    document.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang: current } }));
  }

  window.i18n = { t, get lang() { return current; }, LANGS };

  function init() {
    apply();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
