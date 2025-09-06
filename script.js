// ============ Theme Toggle ============
const body = document.body;
const toggleBtn = document.getElementById('theme-toggle');
const toggleIcon = toggleBtn?.querySelector('.toggle-icon');
const THEME_KEY = 'pg-theme';

function applyTheme(theme) {
  const isDark = theme === 'dark';
  body.classList.toggle('dark', isDark);
  if (toggleIcon) toggleIcon.textContent = isDark ? '☀️' : '🌙';
}

function getSystemPref() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// First load: use saved theme or system preference
(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved || getSystemPref());
})();

// Manual toggle
toggleBtn?.addEventListener('click', () => {
  const current = body.classList.contains('dark') ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});

// Follow system changes only if user hasn't manually chosen
const mql = window.matchMedia('(prefers-color-scheme: dark)');
if (typeof mql.addEventListener === 'function') {
  mql.addEventListener('change', (e) => {
    const saved = localStorage.getItem(THEME_KEY);
    if (!saved) applyTheme(e.matches ? 'dark' : 'light');
  });
}

// ============ Section Reveal on Scroll ============
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// ============ Scroll-to-Top ============
const scrollBtn = document.getElementById('scroll-top');
function updateScrollBtn() {
  if (window.scrollY > 300) scrollBtn.classList.add('show');
  else scrollBtn.classList.remove('show');
}
window.addEventListener('scroll', updateScrollBtn);
scrollBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
updateScrollBtn();

// ============ Project Filter ============
const filterInput = document.getElementById('project-filter');
const projectCards = [...document.querySelectorAll('.project.card')];

function filterProjects(q) {
  const query = (q || '').trim().toLowerCase();
  projectCards.forEach((card) => {
    const text = (card.textContent || '').toLowerCase();
    const tags = (card.getAttribute('data-tags') || '').toLowerCase();
    const match = !query || text.includes(query) || tags.includes(query);
    card.style.display = match ? '' : 'none';
  });
}
filterInput?.addEventListener('input', (e) => filterProjects(e.target.value));
