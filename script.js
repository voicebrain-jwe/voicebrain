(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Scroll-reveal for cards, list items, and content blocks ---------- */
  if (window.IntersectionObserver) {
    var revealEls = document.querySelectorAll(".reveal");
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Mobile hamburger menu ---------- */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("primaryMenu");

  function closeMenu() {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    navMenu.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = navMenu.classList.contains("is-open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navMenu.classList.contains("is-open")) {
        closeMenu();
        navToggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      var isClickInside = navMenu.contains(event.target) || navToggle.contains(event.target);
      if (!isClickInside && navMenu.classList.contains("is-open")) {
        closeMenu();
      }
    });
  }

  /* ---------- Smooth scroll for in-page links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") {
        return;
      }
      var targetEl = document.querySelector(targetId);
      if (!targetEl) {
        return;
      }
      event.preventDefault();
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      targetEl.setAttribute("tabindex", "-1");

      /* Late-loading web fonts and images can reflow the page (different
         line-heights, images finishing above the fold) after the scroll
         above has already settled, leaving a long way down the page
         mis-aligned. Watch the document's size for a few seconds and
         re-snap the target into place whenever it changes, instead of
         guessing a fixed delay. */
      var guardActive = true;
      var resizeObserver = null;

      function stopGuard() {
        if (!guardActive) {
          return;
        }
        guardActive = false;
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
        targetEl.focus({ preventScroll: true });
      }

      if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver(function () {
          if (guardActive) {
            targetEl.scrollIntoView({ behavior: "auto", block: "start" });
          }
        });
        resizeObserver.observe(document.body);
      }

      setTimeout(stopGuard, 2500);

      ["wheel", "touchstart", "keydown"].forEach(function (evt) {
        window.addEventListener(evt, stopGuard, { passive: true, once: true });
      });
    });
  });

  /* ============================================================
     Language toggle (English default / Filipino)
     ============================================================ */

  var translations = {
    "skip": { en: "Skip to main content", fil: "Lumaktaw papunta sa pangunahing nilalaman" },
    "nav.toggle": { en: "Open menu", fil: "Buksan ang menu" },
    "nav.home": { en: "Home", fil: "Home" },
    "nav.features": { en: "Features", fil: "Mga Feature" },
    "nav.mission": { en: "Mission", fil: "Misyon" },
    "nav.screenshots": { en: "Screenshots", fil: "Screenshots" },
    "nav.about": { en: "About Us", fil: "Tungkol sa Amin" },
    "nav.contact": { en: "Contact", fil: "Makipag-ugnayan" },
    "nav.privacy": { en: "Privacy Policy", fil: "Patakaran sa Privacy" },

    "hero.eyebrow": { en: "The Voice You Need. Nothing Else.", fil: "Boses ang Kailangan Mo. Wala Nang Iba." },
    "hero.tagline": {
      en: "The AI accessibility app that gives independence to the blind and visually impaired — object detection, navigation, OCR, and a voice assistant, all by voice alone, online or offline.",
      fil: "Ang AI accessibility app na nagbibigay ng kalayaan sa mga bulag at may kapansanan sa paningin — object detection, navigation, OCR, at voice assistant, lahat gamit lang ang boses, online man o offline."
    },
    "hero.cta1": { en: "Download the App", fil: "I-download ang App" },
    "hero.cta2": { en: "Learn the Features", fil: "Alamin ang mga Feature" },
    "hero.note": { en: "Available on Android · Works online and offline · Filipino &amp; English", fil: "Available sa Android · Gumagana online at offline · Filipino at English" },

    "features.eyebrow": { en: "Features", fil: "Mga Feature" },
    "features.heading": { en: "Everything You Need, Just Say It", fil: "Lahat ng Kailangan Mo, Sasabihin Lang" },
    "features.lead": {
      en: "Every Voicebrain feature is designed to work hands-free and screen-free — your voice is all it takes.",
      fil: "Dinisenyo ang bawat feature ng Voicebrain para gumana nang hands-free, screen-free — sapat na ang boses mo."
    },

    "f1.title": { en: "Voice Assistant", fil: "Voice Assistant" },
    "f1.desc": {
      en: "Just tap to talk — no wake word to remember. Get instant answers for the time, date, weather, and simple math.",
      fil: "Tap-to-speak lang, walang wake word na kailangang tandaan. Sumasagot agad ng oras, petsa, weather, at simple math sa isang tapik lang."
    },
    "f2.title": { en: 'Object Detection <span class="feature-sub">(Suriin ang Bagay)</span>', fil: 'Suriin ang Bagay <span class="feature-sub">(Object Detection)</span>' },
    "f2.desc": {
      en: "Powered by AI object detection, Voicebrain tells you what's in front of the camera — from laptops to everyday items around you.",
      fil: "Gamit ang AI object detection, sinasabi ng Voicebrain kung anong bagay ang nakaharap sa camera — mula sa laptop hanggang sa mga pang-araw-araw na gamit."
    },
    "f3.title": { en: 'Obstacle &amp; Guidance <span class="feature-sub">(Iwas at Gabay)</span>', fil: 'Iwas at Gabay <span class="feature-sub">(Obstacle &amp; Guidance)</span>' },
    "f3.desc": {
      en: "Get alerted to obstacles with an estimated distance, plus optional LiDAR support on compatible devices for more precise guidance.",
      fil: "Nag-aabiso ng mga hadlang at tinatantiya ang layo nito, may karagdagang LiDAR support sa mga suportadong device para mas tumpak na guidance."
    },
    "f4.title": { en: 'Place Detection <span class="feature-sub">(Suriin ang Lugar)</span>', fil: 'Suriin ang Lugar <span class="feature-sub">(Place Detection)</span>' },
    "f4.desc": {
      en: "The app recognizes the type of place you're in — a classroom, a kitchen, an office — so you always have a sense of your surroundings.",
      fil: "Kinikilala ng app ang uri ng lugar na kinaroroonan mo — halimbawa, classroom, kusina, o office — para may kamalayan ka sa paligid."
    },
    "f5.title": { en: 'Text Reader / OCR <span class="feature-sub">(Basahin ang Teksto)</span>', fil: 'Basahin ang Teksto <span class="feature-sub">(Text Reader / OCR)</span>' },
    "f5.desc": {
      en: "Just scan any printed text — receipts, letters, signage — and Voicebrain reads it aloud using OCR.",
      fil: "I-scan lang ang anumang nakalimbag na teksto — resibo, liham, karatula — at babasahin ito nang malakas ng Voicebrain gamit ang OCR."
    },
    "f6.title": { en: 'Color Identifier <span class="feature-sub">(Alamin ang Kulay)</span>', fil: 'Alamin ang Kulay <span class="feature-sub">(Color Identifier)</span>' },
    "f6.desc": {
      en: "Point the camera at any object to instantly learn its color — handy for picking out clothes or identifying items.",
      fil: "Itapat lang ang camera sa isang bagay para malaman kaagad ang kulay nito — kapaki-pakinabang sa pagpili ng damit o pagkilala ng gamit."
    },
    "f7.title": { en: 'Money Detection <span class="feature-sub">(Suriin ang Pera)</span>', fil: 'Suriin ang Pera <span class="feature-sub">(Money Detection)</span>' },
    "f7.desc": {
      en: "Voicebrain recognizes Philippine Peso bills and coins, so you can shop and count money with confidence.",
      fil: "Kinikilala ng Voicebrain ang mga Philippine Peso bills at coins, kaya makakapamili at makakabilang ng pera nang may kumpiyansa."
    },
    "f8.title": { en: 'Help Signal <span class="feature-sub">(Humingi ng Tulong)</span>', fil: 'Humingi ng Tulong <span class="feature-sub">(Help Signal)</span>' },
    "f8.desc": {
      en: "Triggers a flashlight SOS blinking signal to catch the attention of people nearby during an emergency.",
      fil: "Nagpapakita ng flashlight SOS blinking signal para mahikayat ang atensyon ng taong nasa paligid sa oras ng emergency."
    },
    "f9.title": { en: "Voice SMS Mode", fil: "Voice SMS Mode" },
    "f9.desc": {
      en: "Just dictate your message and it gets sent as an SMS — no buttons needed, voice does everything from start to finish.",
      fil: "I-dikta lang ang mensahe mo at ipapadala ito bilang SMS — walang kailangang pindutin, boses lang ang gamit sa simula hanggang matapos."
    },
    "f10.title": { en: "Emergency Contacts", fil: "Emergency Contacts" },
    "f10.desc": {
      en: "Set up two emergency numbers with a countdown timer — if it isn't cancelled in time, it automatically calls them one after another.",
      fil: "Mag-set ng dalawang emergency number na may countdown timer — kung hindi makansela sa oras, awtomatiko itong tatawag nang sunod-sunod."
    },
    "f11.title": { en: "Auto Send Location", fil: "Auto Send Location" },
    "f11.desc": {
      en: "Automatically shares your location with a designated guardian at regular intervals, so someone always knows where you are.",
      fil: "Awtomatikong nagpapadala ng lokasyon sa itinalagang guardian sa regular na agwat ng oras, para laging may nakakaalam kung nasaan ka."
    },
    "f12.title": { en: "Multi-language Support", fil: "Multi-language Support" },
    "f12.desc": {
      en: "Available in Filipino and English, so the app feels natural and comfortable for any user, anywhere in the Philippines.",
      fil: "Available sa Filipino at English, para komportable at natural gamitin kahit sino ang user, saan man sa Pilipinas."
    },
    "f13.title": { en: "Customizable TTS", fil: "Customizable TTS" },
    "f13.desc": {
      en: "Adjust the text-to-speech voice and speaking rate to your liking — faster for frequent use, slower for extra clarity.",
      fil: "I-adjust ang boses at bilis ng text-to-speech ayon sa gusto mong pakinggan — mabilis para sa madalas gumamit, mabagal para sa mas malinaw."
    },
    "f14.title": { en: "Bluetooth Support", fil: "Bluetooth Support" },
    "f14.desc": {
      en: "Connects to Bluetooth mics and speakers — smart glasses included — for a more discreet, comfortable experience anywhere.",
      fil: "Konektado sa Bluetooth mic at speaker — kasama na ang mga smart glasses — para mas discreet at komportable ang paggamit kahit saan."
    },

    "mission.eyebrow": { en: "Our Mission", fil: "Ang Aming Misyon" },
    "mission.heading": { en: "Independence, Powered by Voice", fil: "Kalayaan sa Pamamagitan ng Boses" },
    "mission.p1": {
      en: "Voicebrain was built for the <strong>blind and visually impaired</strong> who want greater independence in everyday life — from recognizing objects around them and navigating obstacles, to reading documents and identifying money — without always having to rely on someone else.",
      fil: "Ginawa ang Voicebrain para sa mga <strong>bulag at may kapansanan sa paningin</strong> na nais mamuhay nang may higit na kalayaan sa araw-araw — mula sa pagkilala ng mga bagay sa paligid, pag-navigate sa mga hadlang, pagbabasa ng dokumento, hanggang sa pagtukoy ng pera — nang hindi kailangang umasa palagi sa ibang tao."
    },
    "mission.p2": {
      en: "We believe accessibility shouldn't be a burden. That's why we designed Voicebrain to be <strong>hands-free and screen-free</strong> — all you need is your voice, no need to look at or touch a screen.",
      fil: "Naniniwala kami na ang accessibility ay hindi dapat maging pabigat. Kaya naman idinisenyo namin ang Voicebrain para maging <strong>hands-free at screen-free</strong> — boses lang ang kailangan, walang kailangang tignan o hipuin ang screen."
    },
    "mission.point1": { en: "<strong>Empowerment</strong> — a tool that builds confidence in every task.", fil: "<strong>Empowerment</strong> — bigyan ng tool na nagpapalakas ng loob sa bawat gawain." },
    "mission.point2": { en: "<strong>Independence</strong> — less reliance on others for simple, everyday tasks.", fil: "<strong>Independence</strong> — bawasan ang pag-asa sa tulong ng ibang tao sa simpleng gawain." },
    "mission.point3": { en: "<strong>Accessibility</strong> — works online or offline, using on-device Whisper speech recognition.", fil: "<strong>Accessibility</strong> — gumana kahit online o offline, gamit ang on-device Whisper speech recognition." },
    "mission.point4": { en: "<strong>Safety</strong> — quick access to emergency contacts, a help signal, and automatic location sharing.", fil: "<strong>Kaligtasan (Safety)</strong> — mabilis na access sa emergency contacts, help signal, at auto location sharing." },
    "mission.badge": { en: "“Just speak. You've got this.”", fil: "“Boses lang, kaya na.”" },

    "objectives.eyebrow": { en: "Our Objectives", fil: "Ang Aming mga Layunin" },
    "objectives.heading": { en: "5 Things Voicebrain Is Built To Do", fil: "5 Bagay na Ginagawa ng Voicebrain" },
    "obj1.title": { en: "Environmental Awareness", fil: "Kamalayan sa Paligid" },
    "obj1.desc": {
      en: "Give a real-time understanding of surroundings through object, obstacle, and place detection, so users can move confidently without a sighted companion.",
      fil: "Bigyan ng real-time na kamalayan sa paligid gamit ang object, obstacle, at place detection, para makagalaw nang may kumpiyansa kahit walang kasamang nakakakita."
    },
    "obj2.title": { en: "Independent Reading", fil: "Malayang Pagbabasa" },
    "obj2.desc": {
      en: "Let users read any printed material on their own through OCR-powered text-to-speech — no need to ask someone else to read it for them.",
      fil: "Hayaang makabasa ang user ng anumang nakalimbag na materyal nang mag-isa gamit ang OCR at text-to-speech — hindi na kailangang magpabasa pa sa iba."
    },
    "obj3.title": { en: "Confident Money Handling", fil: "Kumpiyansa sa Paghawak ng Pera" },
    "obj3.desc": {
      en: "Help users identify Philippine Peso bills and coins so they can shop, pay, and manage cash independently and with confidence.",
      fil: "Tulungan ang user na makilala ang Philippine Peso bills at coins para makapamili, makabayad, at makapamahala ng pera nang mag-isa at may kumpiyansa."
    },
    "obj4.title": { en: "Rapid Emergency Response", fil: "Mabilis na Tugon sa Emergency" },
    "obj4.desc": {
      en: "Provide fast access to help through emergency contacts, a help signal, and automatic location sharing when every second counts.",
      fil: "Magbigay ng mabilis na access sa tulong gamit ang emergency contacts, help signal, at automatic location sharing kapag bawat segundo ay mahalaga."
    },
    "obj5.title": { en: "Inclusive, Everyday Access", fil: "Inklusibong Access Araw-araw" },
    "obj5.desc": {
      en: "Make the app usable by anyone, anywhere in the Philippines, in Filipino or English, online or offline.",
      fil: "Gawing magagamit ang app ninuman, kahit saan sa Pilipinas, sa Filipino man o English, online man o offline."
    },

    "screenshots.eyebrow": { en: "How It Works", fil: "Paano Ito Gumagana" },
    "screenshots.heading": { en: "One Tap, and It Tells You What You Need", fil: "Isang Tapik, Sasabihin ang Kailangan Mo" },
    "screenshots.lead": {
      en: "Swipe through the actual Voicebrain interface for each mode — with clear voice guidance every step of the way.",
      fil: "I-swipe ang aktwal na interface ng Voicebrain sa bawat mode — malinaw ang boses na gabay sa bawat hakbang."
    },

    "cap1": { en: "Voice Assistant", fil: "Voice Assistant" },
    "cap2": { en: "Object Detection", fil: "Suriin ang Bagay" },
    "cap3": { en: "Obstacle & Guidance", fil: "Iwas at Gabay" },
    "cap4": { en: "Place Detection", fil: "Suriin ang Lugar" },
    "cap5": { en: "Text Reader", fil: "Basahin ang Teksto" },
    "cap6": { en: "Color Identifier", fil: "Alamin ang Kulay" },
    "cap7": { en: "Money Detection", fil: "Suriin ang Pera" },
    "cap8": { en: "Help Signal", fil: "Humingi ng Tulong" },
    "cap9": { en: "Voice SMS Mode", fil: "Voice SMS Mode" },
    "cap10": { en: "Emergency Contact #1", fil: "Emergency Contact #1" },
    "cap11": { en: "Emergency Contact #2", fil: "Emergency Contact #2" },

    "about.eyebrow": { en: "About Us", fil: "Tungkol sa Amin" },
    "about.heading": { en: "The Team Behind Voicebrain", fil: "Ang Koponan sa Likod ng Voicebrain" },
    "about.lead": {
      en: "A small team who came together to build Voicebrain — from AI and machine learning to design and web development.",
      fil: "Isang maliit na koponan na sama-samang gumawa ng Voicebrain — mula sa AI/machine learning hanggang sa disenyo at web development."
    },
    "team1.bio": {
      en: "Built the app's entire functional framework, turning complex logic into a seamless, high-performance experience behind Voicebrain.",
      fil: "Programmed ang buong functional framework ng app, ginawang seamless at high-performance ang bawat kumplikadong logic sa likod ng Voicebrain."
    },
    "team2.bio": {
      en: "Focused on building an intuitive user dashboard and a responsive web experience for Voicebrain.",
      fil: "Nakatuon sa paggawa ng intuitive na user dashboard at responsive na web experience para sa Voicebrain."
    },
    "team3.bio": {
      en: "Leads model training and the full ML pipeline that powers Voicebrain's AI features.",
      fil: "Namumuno sa pag-train ng modelo at sa buong ML pipeline na nagpapagana sa mga AI feature ng Voicebrain."
    },

    "contact.eyebrow": { en: "Get in Touch", fil: "Makipag-ugnayan" },
    "contact.heading": { en: "Have a Question? Talk to Us", fil: "May Tanong Ka? Kausapin Kami" },
    "contact.lead": {
      en: "Fill out the form and we'll get your message directly in our inbox.",
      fil: "Punan ang form at direktang mapupunta ang mensahe mo sa aming inbox."
    },
    "contact.name": { en: "Name", fil: "Pangalan" },
    "contact.email": { en: "Email", fil: "Email" },
    "contact.message": { en: "Message", fil: "Mensahe" },
    "contact.send": { en: "Send Message", fil: "Ipadala ang Mensahe" },
    "contact.direct": { en: "Direct Contact", fil: "Direktang Contact" },

    "privacy.eyebrow": { en: "Legal", fil: "Legal" },
    "privacy.heading": { en: "Privacy Policy", fil: "Patakaran sa Privacy" },

    "footer.features": { en: "Features", fil: "Mga Feature" },
    "footer.privacy": { en: "Privacy Policy", fil: "Patakaran sa Privacy" },
    "footer.contact": { en: "Contact", fil: "Makipag-ugnayan" },
    "footer.rights": { en: "All rights reserved.", fil: "Lahat ng karapatan ay nakalaan." },

    "carousel.prev": { en: "Previous screenshot", fil: "Nakaraang screenshot" },
    "carousel.next": { en: "Next screenshot", fil: "Susunod na screenshot" },
    "carousel.play": { en: "Play automatic slideshow", fil: "I-play ang automatic slideshow" },
    "carousel.pause": { en: "Pause automatic slideshow", fil: "I-pause ang automatic slideshow" },
    "carousel.showing": { en: "Showing", fil: "Ipinapakita" },

    "form.errName": { en: "Please enter your full name (at least 2 characters).", fil: "Ilagay ang buo mong pangalan (hindi bababa sa 2 letra)." },
    "form.errEmail": { en: "Please enter a valid email address.", fil: "Ilagay ang wastong email address." },
    "form.errMessage": { en: "Please enter your message (at least 10 characters).", fil: "Ilagay ang mensahe mo (hindi bababa sa 10 letra)." },
    "form.hasErrors": { en: "A few things still need to be fixed before this form can be sent.", fil: "May mga kailangan pang ayusin sa form bago ito maipadala." },
    "form.sending": { en: "Sending your message…", fil: "Ipinapadala ang iyong mensahe…" },
    "form.success": { en: "Thanks, {name}! Your message has been sent.", fil: "Salamat, {name}! Naipadala na ang iyong mensahe." },
    "form.networkError": { en: "Something went wrong sending your message. Please try again, or email us directly.", fil: "May problema sa pagpapadala ng mensahe mo. Subukan muli, o mag-email na lang nang direkta." }
  };

  var currentLang = "en";

  function t(key) {
    var entry = translations[key];
    if (!entry) {
      return "";
    }
    return entry[currentLang] || entry.en;
  }

  function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var text = t(key);
      if (text) {
        el.innerHTML = text;
      }
    });
    document.documentElement.setAttribute("lang", currentLang === "fil" ? "fil" : "en");
  }

  function setLanguage(lang) {
    currentLang = lang === "fil" ? "fil" : "en";
    applyTranslations();

    var btnEn = document.getElementById("langEn");
    var btnFil = document.getElementById("langFil");
    if (btnEn && btnFil) {
      var enActive = currentLang === "en";
      btnEn.classList.toggle("is-active", enActive);
      btnEn.setAttribute("aria-pressed", String(enActive));
      btnFil.classList.toggle("is-active", !enActive);
      btnFil.setAttribute("aria-pressed", String(!enActive));
    }

    try {
      localStorage.setItem("voicebrain-lang", currentLang);
    } catch (err) {
      /* localStorage unavailable — ignore */
    }

    if (typeof updateCarouselStrings === "function") {
      updateCarouselStrings();
    }
  }

  var langEnBtn = document.getElementById("langEn");
  var langFilBtn = document.getElementById("langFil");
  if (langEnBtn && langFilBtn) {
    langEnBtn.addEventListener("click", function () { setLanguage("en"); });
    langFilBtn.addEventListener("click", function () { setLanguage("fil"); });
  }

  var storedLang = "en";
  try {
    storedLang = localStorage.getItem("voicebrain-lang") || "en";
  } catch (err) {
    storedLang = "en";
  }
  setLanguage(storedLang);

  /* ============================================================
     Phone-mockup screenshot carousel (auto-advancing vertical swipe)
     ============================================================ */

  var updateCarouselStrings = null;

  (function initPhoneCarousel() {
    var screen = document.getElementById("phoneScreen");
    var dotsContainer = document.getElementById("phoneDots");
    var prevBtn = document.getElementById("phonePrev");
    var nextBtn = document.getElementById("phoneNext");
    var playPauseBtn = document.getElementById("phonePlayPause");
    var liveRegion = document.getElementById("phoneLive");

    if (!screen || !dotsContainer || !prevBtn || !nextBtn || !playPauseBtn) {
      return;
    }

    var realSlides = Array.prototype.slice.call(screen.querySelectorAll(".phone-slide"));
    var realCount = realSlides.length;
    if (!realCount) {
      return;
    }

    /* True infinite looping without a visible "rewind" to slide 1: clone the
       last slide before the first and the first slide after the last. When
       autoplay/swipe scrolls onto one of those clones, silently (no
       animation) snap to the matching real slide the instant it settles —
       since the clone is pixel-identical to that real slide, the jump is
       invisible. */
    var leadingClone = realSlides[realCount - 1].cloneNode(true);
    var trailingClone = realSlides[0].cloneNode(true);
    leadingClone.setAttribute("aria-hidden", "true");
    trailingClone.setAttribute("aria-hidden", "true");
    var slidesList = document.getElementById("phoneSlides");
    slidesList.insertBefore(leadingClone, realSlides[0]);
    slidesList.appendChild(trailingClone);

    var allSlides = [leadingClone].concat(realSlides, [trailingClone]);
    var activeIndex = 1;
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var autoplay = !prefersReducedMotion;
    var timer = null;
    var resumeTimer = null;

    var playIconSVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
    var pauseIconSVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';

    realSlides.forEach(function (slide, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.addEventListener("click", function () {
        pauseThenResume();
        goTo(i + 1);
      });
      dotsContainer.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsContainer.children);

    function goTo(index, smooth) {
      var clamped = Math.max(0, Math.min(allSlides.length - 1, index));
      screen.scrollTo({ top: allSlides[clamped].offsetTop, behavior: smooth === false ? "auto" : "smooth" });
    }

    function updateActive(index) {
      activeIndex = index;
      var dotIndex = ((index - 1) % realCount + realCount) % realCount;
      dots.forEach(function (dot, idx) {
        dot.classList.toggle("is-active", idx === dotIndex);
      });
      var captionEl = allSlides[index].querySelector(".slide-caption");
      if (liveRegion && captionEl) {
        liveRegion.textContent = t("carousel.showing") + ": " + captionEl.textContent;
      }
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            var idx = allSlides.indexOf(entry.target);
            if (idx === -1) {
              return;
            }
            updateActive(idx);
            if (idx === 0) {
              goTo(realCount, false);
              activeIndex = realCount;
            } else if (idx === allSlides.length - 1) {
              goTo(1, false);
              activeIndex = 1;
            }
          }
        });
      },
      { root: screen, threshold: [0.6] }
    );
    allSlides.forEach(function (s) { io.observe(s); });

    goTo(1, false);
    activeIndex = 1;

    function stopAutoplay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function startAutoplay() {
      stopAutoplay();
      if (!autoplay) {
        return;
      }
      timer = setInterval(function () {
        goTo(activeIndex + 1);
      }, 3200);
    }

    function setAutoplay(on) {
      autoplay = on;
      playPauseBtn.setAttribute("aria-pressed", String(on));
      playPauseBtn.setAttribute("aria-label", on ? t("carousel.pause") : t("carousel.play"));
      playPauseBtn.innerHTML = on ? pauseIconSVG : playIconSVG;
      if (on) {
        startAutoplay();
      } else {
        stopAutoplay();
      }
    }

    function pauseThenResume() {
      stopAutoplay();
      if (resumeTimer) {
        clearTimeout(resumeTimer);
      }
      resumeTimer = setTimeout(function () {
        if (autoplay) {
          startAutoplay();
        }
      }, 4000);
    }

    prevBtn.addEventListener("click", function () {
      pauseThenResume();
      goTo(activeIndex - 1);
    });
    nextBtn.addEventListener("click", function () {
      pauseThenResume();
      goTo(activeIndex + 1);
    });
    playPauseBtn.addEventListener("click", function () {
      setAutoplay(!autoplay);
    });

    ["pointerdown", "touchstart", "wheel"].forEach(function (evt) {
      screen.addEventListener(evt, pauseThenResume, { passive: true });
    });
    screen.addEventListener("mouseenter", stopAutoplay);
    screen.addEventListener("mouseleave", function () {
      if (autoplay) {
        startAutoplay();
      }
    });

    prevBtn.setAttribute("aria-label", t("carousel.prev"));
    nextBtn.setAttribute("aria-label", t("carousel.next"));
    updateActive(1);
    setAutoplay(autoplay);

    updateCarouselStrings = function () {
      prevBtn.setAttribute("aria-label", t("carousel.prev"));
      nextBtn.setAttribute("aria-label", t("carousel.next"));
      playPauseBtn.setAttribute("aria-label", autoplay ? t("carousel.pause") : t("carousel.play"));
      var captionEl = allSlides[activeIndex].querySelector(".slide-caption");
      if (liveRegion && captionEl) {
        liveRegion.textContent = t("carousel.showing") + ": " + captionEl.textContent;
      }
    };
  })();

  /* ---------- Contact form: validate, then send via Web3Forms (no custom backend) ---------- */
  var form = document.getElementById("contactForm");
  var formStatus = document.getElementById("formStatus");
  var submitBtn = document.getElementById("contactSubmitBtn");

  function setError(fieldId, errorId, message) {
    var field = document.getElementById(fieldId);
    var errorEl = document.getElementById(errorId);
    var group = field.closest(".form-group");

    errorEl.textContent = message;

    if (message) {
      field.setAttribute("aria-invalid", "true");
      group.classList.add("has-error");
    } else {
      field.setAttribute("aria-invalid", "false");
      group.classList.remove("has-error");
    }
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = document.getElementById("cf-name").value.trim();
      var email = document.getElementById("cf-email").value.trim();
      var message = document.getElementById("cf-message").value.trim();

      var isValid = true;

      if (name.length < 2) {
        setError("cf-name", "err-name", t("form.errName"));
        isValid = false;
      } else {
        setError("cf-name", "err-name", "");
      }

      if (!isValidEmail(email)) {
        setError("cf-email", "err-email", t("form.errEmail"));
        isValid = false;
      } else {
        setError("cf-email", "err-email", "");
      }

      if (message.length < 10) {
        setError("cf-message", "err-message", t("form.errMessage"));
        isValid = false;
      } else {
        setError("cf-message", "err-message", "");
      }

      if (!isValid) {
        formStatus.textContent = t("form.hasErrors");
        return;
      }

      formStatus.textContent = t("form.sending");
      submitBtn.disabled = true;

      fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          submitBtn.disabled = false;
          if (data && data.success) {
            formStatus.textContent = t("form.success").replace("{name}", name);
            form.reset();
          } else {
            formStatus.textContent = t("form.networkError");
          }
        })
        .catch(function () {
          submitBtn.disabled = false;
          formStatus.textContent = t("form.networkError");
        });
    });
  }
})();
