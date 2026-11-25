(() => {
  const root = document.documentElement;
  const isEnglish = root.lang === 'en';
  const themeButton = document.querySelector('.theme-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const toc = document.querySelector('.toc');
  const tocButton = document.querySelector('.toc-toggle');

  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('qafnama-theme');
  } catch {
    // The page still works when browser storage is unavailable.
  }

  if (savedTheme === 'dark' || savedTheme === 'light') {
    root.dataset.theme = savedTheme;
  }

  const syncThemeButton = () => {
    const isDark = root.dataset.theme === 'dark';
    themeButton?.setAttribute('aria-label', isEnglish
      ? (isDark ? 'Switch to light theme' : 'Switch to dark theme')
      : (isDark ? 'تغییر به تم روشن' : 'تغییر به تم تیره'));
    themeButton?.setAttribute('title', isEnglish ? 'Change theme' : 'تغییر تم');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#181c20' : '#f5f2e8');
  };

  syncThemeButton();

  let welcomeHintSeen = false;
  try {
    welcomeHintSeen = localStorage.getItem('mahan-film-welcome-seen') === 'true';
  } catch {
    // The welcome hint can still be dismissed for the current page view.
  }

  if (!welcomeHintSeen) {
    const hint = document.createElement('aside');
    hint.className = 'welcome-hint';
    hint.setAttribute('role', 'status');
    hint.setAttribute('aria-live', 'polite');

    const icon = document.createElement('span');
    icon.className = 'welcome-hint-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '✦';

    const copy = document.createElement('span');
    copy.className = 'welcome-hint-copy';
    const title = document.createElement('strong');
    title.textContent = isEnglish ? 'A quick tip' : 'یک نکتهٔ کوتاه';
    const message = document.createElement('span');
    message.textContent = isEnglish
      ? 'Use the header buttons to switch themes and move between English and Persian.'
      : 'با دکمه‌های هدر، تم روشن و تیره را عوض کن یا بین فارسی و انگلیسی جابه‌جا شو.';
    copy.append(title, message);

    const dismiss = document.createElement('button');
    dismiss.className = 'welcome-hint-dismiss';
    dismiss.type = 'button';
    dismiss.textContent = isEnglish ? 'Got it' : 'فهمیدم';
    dismiss.addEventListener('click', () => {
      hint.remove();
      try {
        localStorage.setItem('mahan-film-welcome-seen', 'true');
      } catch {
        // Dismissal still applies until this page is reloaded.
      }
    });

    hint.append(icon, copy, dismiss);
    document.body.append(hint);
  }

  themeButton?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('qafnama-theme', root.dataset.theme);
    } catch {
      // Theme switching remains available for this page view.
    }
    syncThemeButton();
  });

  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isEnglish
      ? (isOpen ? 'Close menu' : 'Open menu')
      : (isOpen ? 'بستن منو' : 'باز کردن منو'));
    nav?.classList.toggle('is-open', isOpen);
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuButton?.setAttribute('aria-expanded', 'false');
      menuButton?.setAttribute('aria-label', isEnglish ? 'Open menu' : 'باز کردن منو');
    });
  });

  tocButton?.addEventListener('click', () => {
    const isExpanded = tocButton.getAttribute('aria-expanded') !== 'false';
    tocButton.setAttribute('aria-expanded', String(!isExpanded));
    tocButton.setAttribute('aria-label', isEnglish
      ? (isExpanded ? 'Expand table of contents' : 'Collapse table of contents')
      : (isExpanded ? 'باز کردن فهرست مطالب' : 'جمع کردن فهرست مطالب'));
    tocButton.textContent = isExpanded ? '+' : '−';
    toc?.classList.toggle('is-collapsed', isExpanded);
  });
})();
