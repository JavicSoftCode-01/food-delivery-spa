const x=document.getElementById("app");let r=null;const m={showSpinner(t){if(r)return;const e=`
      <div class="flex flex-col items-center justify-center py-8 px-6">
        <!-- Spinner moderno -->
        <div class="relative mb-6">
          <!-- Círculo de fondo -->
          <div class="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <!-- Círculo animado -->
          <div class="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-[#0F9FE0] rounded-full animate-spin"></div>
          <!-- Punto central -->
          <div class="absolute top-1/2 left-1/2 w-2 h-2 bg-[#0F9FE0] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        ${t?`
        <!-- Mensaje opcional -->
        <div class="text-center">
          <p class="text-gray-700 dark:text-gray-300 text-lg font-medium animate-pulse-text">
            ${t}
          </p>
          <div class="flex justify-center mt-3 space-x-1">
            <div class="w-2 h-2 bg-[#0F9FE0] rounded-full animate-bounce-dot" style="animation-delay: 0ms"></div>
            <div class="w-2 h-2 bg-[#0F9FE0] rounded-full animate-bounce-dot" style="animation-delay: 150ms"></div>
            <div class="w-2 h-2 bg-[#0F9FE0] rounded-full animate-bounce-dot" style="animation-delay: 300ms"></div>
          </div>
        </div>
        `:""}
      </div>
    `;if(!document.getElementById("spinner-animations")){const a=document.createElement("style");a.id="spinner-animations",a.textContent=`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-text {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        @keyframes bounce-dot {
          0%, 80%, 100% { 
            transform: translateY(0) scale(1); 
            opacity: 0.7;
          }
          40% { 
            transform: translateY(-8px) scale(1.1); 
            opacity: 1;
          }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .animate-pulse-text {
          animation: pulse-text 2s ease-in-out infinite;
        }
        
        .animate-bounce-dot {
          animation: bounce-dot 1.4s ease-in-out infinite;
        }
      `,document.head.appendChild(a)}r=m.modal(e,{closeOnBackdropClick:!1});const s=r.element.querySelector(".modal-content");s&&(s.classList.add("!max-w-sm","!p-0"),s.classList.remove("-mt-[70px]","sm:-mt-[60px]","md:-mt-[80px]","lg:-mt-[100px]"))},hideSpinner(){r&&(r.close(),r=null)},updateSpinnerMessage(t){if(!r)return;const e=r.element.querySelector(".text-center");e&&(e.innerHTML=`
        <p class="text-gray-700 dark:text-gray-300 text-lg font-medium animate-pulse-text">
          ${t}
        </p>
        <div class="flex justify-center mt-3 space-x-1">
          <div class="w-2 h-2 bg-[#0F9FE0] rounded-full animate-bounce-dot" style="animation-delay: 0ms"></div>
          <div class="w-2 h-2 bg-[#0F9FE0] rounded-full animate-bounce-dot" style="animation-delay: 150ms"></div>
          <div class="w-2 h-2 bg-[#0F9FE0] rounded-full animate-bounce-dot" style="animation-delay: 300ms"></div>
        </div>
      `)},toastTimer:0,renderShell(){x.innerHTML=`
      <header class="bg-white dark:bg-dark-bg-secondary rounded-xl p-3 shadow-sm border dark:border-dark-border flex items-center justify-between gap-3 mb-4">
        <div class="flex-grow">
          <h1 id="main-title" class="text-lg font-bold text-gray-900 dark:text-white">Gestión Delivery</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">JavicSoftCode · Developer</p>
        </div>
        <div id="header-extra" class="flex-shrink-0 flex items-center justify-center h-12 w-14 translate-x-2">
          <!-- El contador o botón de archivar se renderizará aquí -->
        </div>
      </header>
      <main id="mainArea"></main>
      <nav id="bottomNav" class="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-dark-bg-secondary/95 backdrop-blur-sm border-t dark:border-dark-border z-50" role="navigation" aria-label="Navegación principal">
        <div class="max-w-3xl mx-auto px-2 py-1.5">
          <div class="flex items-center justify-center gap-1 sm:gap-2">
            <button data-screen="dashboard" class="nav-item flex-1 max-w-[80px] sm:max-w-none flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 rounded-lg transition-all duration-200" aria-label="Dashboard">
              <i class="fa fa-chart-simple text-2xl" aria-hidden="true"></i>
              <span class="text-xs font-semibold">Dashboard</span>
            </button>
            <button data-screen="clients" class="nav-item flex-1 max-w-[80px] sm:max-w-none flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 rounded-lg transition-all duration-200" aria-label="Clientes">
              <i class="fa fa-users text-2xl" aria-hidden="true"></i>
              <span class="text-xs font-semibold">Clientes</span>
            </button>
            <button data-screen="foods" class="nav-item flex-1 max-w-[80px] sm:max-w-none flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 rounded-lg transition-all duration-200" aria-label="Comidas">
              <i class="fa fa-bowl-food text-2xl" aria-hidden="true"></i>
              <span class="text-xs font-semibold">Comidas</span>
            </button>
            <button data-screen="settings" class="nav-item flex-1 max-w-[80px] sm:max-w-none flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 rounded-lg transition-all duration-200" aria-label="Ajustes">
              <i class="fa fa-gear text-2xl" aria-hidden="true"></i>
              <span class="text-xs font-semibold">Ajustes</span>
            </button>
          </div>
        </div>
      </nav>

      <div id="modalRoot"></div>
      <div id="toastRoot" class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4"></div>

      <button id="scrollToTopBtn" title="Volver arriba" 
        class="fixed z-[9999] bottom-20 sm:bottom-5 right-7 sm:right-10 w-12 h-12 
               bg-gradient-to-br from-accent to-blue-600 text-white 
               rounded-full shadow-lg flex items-center justify-center 
               text-2xl opacity-0 pointer-events-none transform translate-y-4
               transition-all duration-300 ease-out hover:shadow-xl 
               hover:from-accent/90 hover:to-blue-700/90 hover:scale-110">
        <i class="fa-solid fa-chevron-up"></i>
      </button>
    `,document.querySelectorAll("#bottomNav .nav-item").forEach(t=>{t.setAttribute("tabindex","0"),t.addEventListener("keydown",e=>{(e.key==="Enter"||e.key===" ")&&(e.currentTarget.click(),e.preventDefault())})})},toast(t,e=3e3){const s=document.getElementById("toastRoot");if(s.innerHTML=`
      <div class="toast bg-sky-500 text-white rounded-xl p-4 shadow-xl border border-sky-400 
                  transform transition-all duration-500 ease-out scale-95 opacity-0
                  backdrop-blur-sm font-medium text-center text-sm text-lg
                  animate-pulse-gentle">
        <div class="flex items-center justify-center gap-2">
          <i class="fa fa-info-circle fa-lg"></i>
          <span>${t}</span>
        </div>
      </div>
    `,!document.getElementById("toast-animations")){const l=document.createElement("style");l.id="toast-animations",l.textContent=`
        @keyframes pulse-gentle {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 10px 25px -5px rgba(14, 165, 233, 0.3), 0 4px 6px -2px rgba(14, 165, 233, 0.1);
          }
          50% { 
            transform: scale(1.02);
            box-shadow: 0 20px 35px -5px rgba(14, 165, 233, 0.4), 0 8px 12px -2px rgba(14, 165, 233, 0.15);
          }
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 2s ease-in-out infinite;
        }
        .toast-enter {
          transform: translateY(-100%) scale(0.9);
          opacity: 0;
        }
        .toast-show {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        .toast-exit {
          transform: translateY(-100%) scale(0.9);
          opacity: 0;
        }
      `,document.head.appendChild(l)}const a=s.querySelector(".toast");setTimeout(()=>{a&&(a.classList.remove("scale-95","opacity-0"),a.classList.add("toast-show"))},10),m.toastTimer&&window.clearTimeout(m.toastTimer),m.toastTimer=window.setTimeout(()=>{a&&(a.classList.add("toast-exit"),setTimeout(()=>{s.innerHTML=""},500))},e)},modal(t,e={}){const{closeOnBackdropClick:s=!0}=e,a=document.getElementById("modalRoot"),l=document.documentElement;if(a.children.length===0){l.style.overflow="hidden";const d=document.getElementById("scrollToTopBtn");d&&d.classList.add("opacity-0","pointer-events-none","translate-y-4")}const i=document.createElement("div");i.className="modal-instance";const c=20+a.children.length*10;i.innerHTML=`
    <div class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center p-2 opacity-0 transition-opacity duration-300 ease-out" style="z-index: ${c};">
      <div class="modal-content bg-white dark:bg-dark-bg-secondary rounded-xl w-full max-w-xl p-2 shadow-lg relative
          -mt-[70px] sm:-mt-[60px] md:-mt-[80px] lg:-mt-[100px] transform -translate-y-10 scale-95 opacity-0 transition-all duration-300 ease-out">
        ${t}
      </div>
    </div>
  `,a.appendChild(i),i.offsetHeight;const o=i.querySelector(".modal-backdrop"),n=i.querySelector(".modal-content");requestAnimationFrame(()=>{o==null||o.classList.remove("opacity-0"),n==null||n.classList.remove("-translate-y-10","scale-95","opacity-0"),n==null||n.classList.add("translate-y-0","scale-100","opacity-100")});const f=()=>{o==null||o.classList.add("opacity-0"),n==null||n.classList.remove("translate-y-0","scale-100","opacity-100"),n==null||n.classList.add("-translate-y-10","scale-95","opacity-0");const d=()=>{if(i.parentNode&&i.parentNode.removeChild(i),a.children.length===0){l.style.overflow="";const u=document.getElementById("scrollToTopBtn");u&&(window.scrollY>200?u.classList.remove("opacity-0","pointer-events-none","translate-y-4"):u.classList.add("opacity-0","pointer-events-none","translate-y-4"))}};n==null||n.addEventListener("transitionend",d,{once:!0}),setTimeout(d,350)};return s&&(o==null||o.addEventListener("click",d=>{d.target===o&&f()})),{close:f,element:i}},confirm(t,e,s){const a=`
      <div class="text-center p-2">
        <div class="mb-2">
          <div class="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
            <i class="fa fa-exclamation-triangle text-3xl text-yellow-600 dark:text-yellow-400"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Confirmación Requerida</h3>
          <div class="text-base text-gray-700 dark:text-gray-300 leading-relaxed">${t}</div>
        </div>
        
        <!-- <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
          <div class="flex items-center justify-center gap-2 text-yellow-800 dark:text-yellow-200">
            <i class="fa fa-info-circle"></i>
            <span class="font-medium">Esta acción modificará el estado del pedido</span>
          </div>
        </div> -->

        <div class="flex gap-8 justify-center">
          <button id="confirmCancel" class="px-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 font-semibold min-w-[50px] hover:scale-105 active:scale-95">
            <i class="fa fa-times fa-lg"></i> Cancelar
          </button>
          <button id="confirmOk" class="px-2 py-3 text-white rounded-lg bg-accent hover:bg-accent/90 transition-all duration-200 font-bold min-w-[100px] hover:scale-105 active:scale-95 shadow-lg">
            <i class="fa fa-check fa-lg"></i> Confirmar
          </button>
        </div>
        
        <!-- <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Esta acción se registrará en el sistema
        </div> -->
      </div>
    `,{close:l,element:i}=this.modal(a,{closeOnBackdropClick:!1});i.querySelector("#confirmOk").addEventListener("click",()=>{l(),e()}),i.querySelector("#confirmCancel").addEventListener("click",()=>{l(),s&&s()}),setTimeout(()=>{const c=i.querySelector("#confirmOk");c==null||c.focus()},200)},updateTitle(t){const e=document.getElementById("main-title");let s="Gestión Delivery";t==="clients"?s+=" -- Clientes":t==="foods"?s+=" -- Comidas":t==="settings"&&(s+=" -- Ajustes"),e.textContent=s},updateHeaderContent(t){const e=document.getElementById("header-extra");e&&(e.innerHTML=t)},renderNavActive(t="dashboard"){document.querySelectorAll("#bottomNav .nav-item").forEach(e=>{const a=e.dataset.screen===t;e.classList.toggle("bg-accent",a),e.classList.toggle("text-white",a),e.classList.toggle("shadow-lg",a),a?e.setAttribute("aria-current","page"):e.removeAttribute("aria-current")})}};export{m as U};
