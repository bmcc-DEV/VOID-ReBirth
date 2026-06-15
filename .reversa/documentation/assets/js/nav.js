// Injeção dinâmica do header e nav
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;
  const currentPageId = document.body.dataset.pageId;
  const rootPrefix = currentPageId.startsWith("feature-") ? "../" : "";
  
  const header = document.createElement("header");
  header.className = "reversa-header";
  
  // Brand
  const brand = document.createElement("a");
  brand.href = rootPrefix + "index.html";
  brand.className = "header-brand";
  brand.innerHTML = `
    ${window.RV_DATA.sealMiniSvg}
    <span>Reversa<span>Docs</span></span>
  `;
  header.appendChild(brand);
  
  // Nav
  const nav = document.createElement("nav");
  nav.className = "reversa-nav";
  
  window.RV_DATA.nav.forEach(item => {
    // Pular topologia se a página não existir fisicamente no build
    if (item.id === "topologia" && !window.RV_DATA.config.knowledgeSources.topology) {
        return;
    }
    const a = document.createElement("a");
    a.href = rootPrefix + item.href;
    a.textContent = item.label;
    if (currentPageId === item.id) {
      a.setAttribute("aria-current", "page");
    }
    nav.appendChild(a);
  });
  
  header.appendChild(nav);
  document.body.insertBefore(header, document.body.firstChild);
});
