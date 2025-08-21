(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function a(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=a(s);fetch(s.href,i)}})();const ze="modulepreload",Ge=function(t){return"/food-delivery-spa/"+t},qe={},Oe=function(e,a,r){let s=Promise.resolve();if(a&&a.length>0){let o=function(d){return Promise.all(d.map(l=>Promise.resolve(l).then(g=>({status:"fulfilled",value:g}),g=>({status:"rejected",reason:g}))))};document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),c=n?.nonce||n?.getAttribute("nonce");s=o(a.map(d=>{if(d=Ge(d),d in qe)return;qe[d]=!0;const l=d.endsWith(".css"),g=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${g}`))return;const y=document.createElement("link");if(y.rel=l?"stylesheet":ze,l||(y.as="script"),y.crossOrigin="",y.href=d,c&&y.setAttribute("nonce",c),document.head.appendChild(y),l)return new Promise((f,m)=>{y.addEventListener("load",f),y.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${d}`)))})}))}function i(n){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=n,window.dispatchEvent(c),!c.defaultPrevented)throw n}return s.then(n=>{for(const c of n||[])c.status==="rejected"&&i(c.reason);return e().catch(i)})},Qe=document.getElementById("app");let J=null;const u={showSpinner(t){if(J)return;const e=`
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
    `;if(!document.getElementById("spinner-animations")){const r=document.createElement("style");r.id="spinner-animations",r.textContent=`
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
      `,document.head.appendChild(r)}J=u.modal(e,{closeOnBackdropClick:!1});const a=J.element.querySelector(".modal-content");a&&(a.classList.add("!max-w-sm","!p-0"),a.classList.remove("-mt-[70px]","sm:-mt-[60px]","md:-mt-[80px]","lg:-mt-[100px]"))},hideSpinner(){J&&(J.close(),J=null)},updateSpinnerMessage(t){if(!J)return;const e=J.element.querySelector(".text-center");e&&(e.innerHTML=`
        <p class="text-gray-700 dark:text-gray-300 text-lg font-medium animate-pulse-text">
          ${t}
        </p>
        <div class="flex justify-center mt-3 space-x-1">
          <div class="w-2 h-2 bg-[#0F9FE0] rounded-full animate-bounce-dot" style="animation-delay: 0ms"></div>
          <div class="w-2 h-2 bg-[#0F9FE0] rounded-full animate-bounce-dot" style="animation-delay: 150ms"></div>
          <div class="w-2 h-2 bg-[#0F9FE0] rounded-full animate-bounce-dot" style="animation-delay: 300ms"></div>
        </div>
      `)},toastTimer:0,renderShell(){Qe.innerHTML=`
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
    `,document.querySelectorAll("#bottomNav .nav-item").forEach(t=>{t.setAttribute("tabindex","0"),t.addEventListener("keydown",e=>{(e.key==="Enter"||e.key===" ")&&(e.currentTarget.click(),e.preventDefault())})})},toast(t,e=3e3){const a=document.getElementById("toastRoot");if(a.innerHTML=`
      <div class="toast bg-sky-500 text-white rounded-xl p-4 shadow-xl border border-sky-400 
                  transform transition-all duration-500 ease-out scale-95 opacity-0
                  backdrop-blur-sm font-medium text-center text-sm text-lg
                  animate-pulse-gentle">
        <div class="flex items-center justify-center gap-2">
          <i class="fa fa-info-circle fa-lg"></i>
          <span>${t}</span>
        </div>
      </div>
    `,!document.getElementById("toast-animations")){const s=document.createElement("style");s.id="toast-animations",s.textContent=`
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
      `,document.head.appendChild(s)}const r=a.querySelector(".toast");setTimeout(()=>{r&&(r.classList.remove("scale-95","opacity-0"),r.classList.add("toast-show"))},10),u.toastTimer&&window.clearTimeout(u.toastTimer),u.toastTimer=window.setTimeout(()=>{r&&(r.classList.add("toast-exit"),setTimeout(()=>{a.innerHTML=""},500))},e)},modal(t,e={}){const{closeOnBackdropClick:a=!0}=e,r=document.getElementById("modalRoot"),s=document.documentElement;if(r.children.length===0){s.style.overflow="hidden";const l=document.getElementById("scrollToTopBtn");l&&l.classList.add("opacity-0","pointer-events-none","translate-y-4")}const i=document.createElement("div");i.className="modal-instance";const n=20+r.children.length*10;i.innerHTML=`
    <div class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center p-2 opacity-0 transition-opacity duration-300 ease-out" style="z-index: ${n};">
      <div class="modal-content bg-white dark:bg-dark-bg-secondary rounded-xl w-full max-w-xl p-2 shadow-lg relative
          -mt-[70px] sm:-mt-[60px] md:-mt-[80px] lg:-mt-[100px] transform -translate-y-10 scale-95 opacity-0 transition-all duration-300 ease-out">
        ${t}
      </div>
    </div>
  `,r.appendChild(i),i.offsetHeight;const c=i.querySelector(".modal-backdrop"),o=i.querySelector(".modal-content");requestAnimationFrame(()=>{c?.classList.remove("opacity-0"),o?.classList.remove("-translate-y-10","scale-95","opacity-0"),o?.classList.add("translate-y-0","scale-100","opacity-100")});const d=()=>{c?.classList.add("opacity-0"),o?.classList.remove("translate-y-0","scale-100","opacity-100"),o?.classList.add("-translate-y-10","scale-95","opacity-0");const l=()=>{if(i.parentNode&&i.parentNode.removeChild(i),r.children.length===0){s.style.overflow="";const g=document.getElementById("scrollToTopBtn");g&&(window.scrollY>200?g.classList.remove("opacity-0","pointer-events-none","translate-y-4"):g.classList.add("opacity-0","pointer-events-none","translate-y-4"))}};o?.addEventListener("transitionend",l,{once:!0}),setTimeout(l,350)};return a&&c?.addEventListener("click",l=>{l.target===c&&d()}),{close:d,element:i}},confirm(t,e,a){const r=`
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
    `,{close:s,element:i}=this.modal(r,{closeOnBackdropClick:!1});i.querySelector("#confirmOk").addEventListener("click",()=>{s(),e()}),i.querySelector("#confirmCancel").addEventListener("click",()=>{s(),a&&a()}),setTimeout(()=>{i.querySelector("#confirmOk")?.focus()},200)},updateTitle(t){const e=document.getElementById("main-title");let a="Gestión Delivery";t==="clients"?a+=" -- Clientes":t==="foods"?a+=" -- Comidas":t==="settings"&&(a+=" -- Ajustes"),e.textContent=a},updateHeaderContent(t){const e=document.getElementById("header-extra");e&&(e.innerHTML=t)},renderNavActive(t="dashboard"){document.querySelectorAll("#bottomNav .nav-item").forEach(e=>{const r=e.dataset.screen===t;e.classList.toggle("bg-accent",r),e.classList.toggle("text-white",r),e.classList.toggle("shadow-lg",r),r?e.setAttribute("aria-current","page"):e.removeAttribute("aria-current")})}},Je="fd_meta_v1",Ue="fd_foods_v1",Ke="fd_orders_v1",We="fd_audit_v1",Xe="fd_food_sale_records_v1",Y={read(t){try{const e=localStorage.getItem(t);return e?JSON.parse(e):null}catch(e){return console.warn("Storage.read error",e),null}},write(t,e){try{return localStorage.setItem(t,JSON.stringify(e)),!0}catch(a){return console.error("Storage.write failed",a),!1}},keys:{KEY_META:Je,KEY_FOODS:Ue,KEY_ORDERS:Ke,KEY_AUDIT:We,KEY_FOOD_SALE_RECORDS:Xe}},we=(t="")=>t+Math.random().toString(36).slice(2,9),Re=()=>Date.now(),se=t=>(t||"").toString().trim(),Ze=(t,e=300)=>{let a;return(...r)=>{a&&window.clearTimeout(a),a=window.setTimeout(()=>t(...r),e)}};function be(t){if(!t||!t.includes(":"))return t;const[e,a]=t.split(":");let r=parseInt(e,10);const s=r>=12?"p.m.":"a.m.";return r=r%12,r=r||12,`${r<10?"0"+r:r.toString()}:${a} ${s}`}const Ne=t=>{const e=(t||"").toString();let a="";if(e.startsWith("+")){const r=e.substring(1);if(r.startsWith("593")){const s=r.substring(3);if(s.startsWith(" ")){const i=s.substring(1);let n="+593 ",c=0;for(let o=0;o<i.length&&c<9;o++){const d=i[o];/[0-9]/.test(d)&&((c===2||c===5)&&(n+=" "),n+=d,c++)}a=n}else a="+593"+s.replace(/[^0-9]/g,"")}else a="+"+r.replace(/[^0-9]/g,"")}else a=e.replace(/[^0-9]/g,"");return a.startsWith("09")?a.length>10&&(a=a.substring(0,10)):a.startsWith("+593 9")?a.length>16&&(a=a.substring(0,16)):a.startsWith("+593")&&a.length>13&&(a=a.substring(0,13)),a},he=t=>!!(/^09\d{8}$/.test(t)||/^\+5939\d{8}$/.test(t)||/^\+593 9\d \d{3} \d{4}$/.test(t)),De=t=>{if(!t)return"";const e=t.replace(/\s/g,"");return e.startsWith("09")&&e.length===10?`+593${e.substring(1)}`:e.startsWith("+5939")&&e.length===13?e:""},je=t=>t?t.toString().replace(/\D/g,""):"",He={STORAGE_KEYS:{SETTINGS:"fd_meta_v1"},BUSINESS:{CURRENCY:"USD"}};function $(t){return new Intl.NumberFormat("es-EC",{style:"currency",currency:He.BUSINESS.CURRENCY,minimumFractionDigits:2}).format(t)}function et(t){return new Date(t).toLocaleTimeString("es-EC",{hour:"2-digit",minute:"2-digit",hour12:!1})}const Be=Y.keys.KEY_FOODS,Pe=Y.keys.KEY_FOOD_SALE_RECORDS,E={getAll(){return Y.read(Pe)||[]},saveAll(t){Y.write(Pe,t)},add(t){const e={id:we("record_"),...t},a=this.getAll();return a.push(e),this.saveAll(a),e},update(t){const e=this.getAll().map(a=>a.id===t.id?{...a,...t}:a);this.saveAll(e)},findByFoodId(t){return this.getAll().filter(e=>e.foodId===t).sort((e,a)=>{const r=new Date(a.recordDate).getTime()-new Date(e.recordDate).getTime();return r!==0?r:a.id.localeCompare(e.id)})},findLatestActiveByFoodId(t){return this.findByFoodId(t).find(e=>e.isActive)}},T={getAll(){return Y.read(Be)||[]},saveAll(t){Y.write(Be,t)},async add(t,e){return new Promise(a=>{setTimeout(()=>{const r={id:we("food_"),amountSold:0,createdAt:Re(),isActive:!0,...t},s=this.getAll();s.push(r),this.saveAll(s);const i=new Date().toISOString().slice(0,10);E.add({foodId:r.id,recordDate:i,startTime:e.startTime,endTime:e.endTime,initialStock:r.stock,unitPrice:r.price,unitCost:r.cost,quantitySoldSingle:0,comboSales:{},isActive:!0}),console.log("Food created",{id:r.id,name:r.name}),a(r)},1e3)})},async update(t,e){return new Promise(a=>{setTimeout(()=>{const r=this.findById(t.id);if(!r)return a();const s=new Date().toISOString().slice(0,10),i=E.findLatestActiveByFoodId(t.id),n=Math.abs(t.price-r.price)>.001||Math.abs(t.cost-r.cost)>.001;if(t.isActive&&n)i&&i.recordDate===s&&(i.isActive=!1,E.update(i)),t.amountSold=0,E.add({foodId:t.id,recordDate:s,startTime:e?.startTime||"08:00",endTime:e?.endTime||"23:00",initialStock:t.stock,unitPrice:t.price,unitCost:t.cost,quantitySoldSingle:0,comboSales:{},isActive:!0});else if(t.isActive&&!r.isActive){const o=E.findByFoodId(t.id).find(d=>d.recordDate===s);o&&!n?(o.isActive=!0,t.stock>r.stock&&(o.initialStock+=t.stock-r.stock),e?.startTime&&(o.startTime=e.startTime),e?.endTime&&(o.endTime=e.endTime),E.update(o)):(t.amountSold=0,E.add({foodId:t.id,recordDate:s,startTime:e?.startTime||"08:00",endTime:e?.endTime||"23:00",initialStock:t.stock,unitPrice:t.price,unitCost:t.cost,quantitySoldSingle:0,comboSales:{},isActive:!0}))}else if(!t.isActive&&r.isActive)i&&(i.isActive=!1,E.update(i));else if(t.isActive&&i){if(t.stock>r.stock){const o=t.stock-r.stock;i.initialStock+=o}e?.startTime&&(i.startTime=e.startTime),e?.endTime&&(i.endTime=e.endTime),E.update(i)}const c=this.getAll().map(o=>o.id===t.id?{...o,...t}:o);this.saveAll(c),console.log("Food updated",{id:t.id,name:t.name}),a()},1e3)})},findById(t){return this.getAll().find(e=>e.id===t)},nameExists(t,e){const a=t.trim().toLowerCase();return this.getAll().some(r=>r.id!==e&&r.name.trim().toLowerCase()===a)},totalProfit(){return E.getAll().reduce((e,a)=>{const r=(a.unitPrice-a.unitCost)*(a.quantitySoldSingle||0),s=Object.values(a.comboSales||{}).reduce((i,n)=>{const c=n.price*n.count,o=a.unitCost*n.quantity*n.count;return i+(c-o)},0);return e+r+s},0)},decreaseStock(t,e){const a=this.getAll(),r=a.findIndex(s=>s.id===t.foodId);if(r>-1){a[r].stock=Math.max(0,a[r].stock-e),a[r].amountSold+=e,this.saveAll(a);const s=E.findLatestActiveByFoodId(t.foodId);if(s){if(t.quantity>0&&(s.quantitySoldSingle=(s.quantitySoldSingle||0)+t.quantity),t.comboId&&t.comboQuantity>0){const n=a[r].combos.find(c=>c.id===t.comboId);n&&(s.comboSales||(s.comboSales={}),s.comboSales[t.comboId]||(s.comboSales[t.comboId]={quantity:n.quantity,price:n.price,count:0}),s.comboSales[t.comboId].count+=t.comboQuantity)}E.update(s)}}},increaseStock(t,e){const a=this.getAll(),r=a.findIndex(s=>s.id===t.foodId);if(r>-1){a[r].stock+=e,a[r].amountSold=Math.max(0,a[r].amountSold-e),this.saveAll(a);const s=E.findLatestActiveByFoodId(t.foodId);s&&(t.quantity>0&&(s.quantitySoldSingle=Math.max(0,(s.quantitySoldSingle||0)-t.quantity)),t.comboId&&t.comboQuantity>0&&s.comboSales&&s.comboSales[t.comboId]&&(s.comboSales[t.comboId].count=Math.max(0,s.comboSales[t.comboId].count-t.comboQuantity)),E.update(s))}}},Me=Y.keys.KEY_ORDERS,I={_calculateTotalItems(t){const e=T.findById(t.foodId);if(!e)return t.quantity;let a=t.quantity;if(t.comboId&&t.comboQuantity>0){const r=e.combos.find(s=>s.id===t.comboId);r&&(a+=r.quantity*t.comboQuantity)}return a},_internalGetAll(){return Y.read(Me)||[]},getReservedStockForFood(t,e){return this._internalGetAll().filter(s=>s.foodId===t&&!s.delivered&&s.id!==e).reduce((s,i)=>s+this._calculateTotalItems(i),0)},getAll(){return this._internalGetAll().filter(t=>t.state!==!1)},saveAll(t){Y.write(Me,t)},async add(t){return new Promise(e=>{setTimeout(()=>{const a=T.findById(t.foodId);if(!a)return u.toast("La comida seleccionada no existe."),e(null);const r=E.findLatestActiveByFoodId(t.foodId);if(!r||!r.isActive)return u.toast("La comida no está disponible para la venta en este momento."),e(null);const s=new Date(t.deliveryTime),[i,n]=[s.getHours(),s.getMinutes()],c=i*60+n,[o,d]=r.startTime.split(":").map(Number),l=o*60+d,[g,y]=r.endTime.split(":").map(Number),f=g*60+y;if(c<l||c>f)return u.toast(`Pedido fuera de horario. Disponible de ${r.startTime} a ${r.endTime}.`),e(null);const m={id:"temp",...t,createdAt:0,delivered:!1,state:!0,deliveredAt:null},v=this._calculateTotalItems(m),k=this.getReservedStockForFood(a.id),x=a.stock-k;if(x<v)return u.toast(`Stock insuficiente para '${a.name}'. Solicitado: ${v}, Disponible: ${x}.`,1e4),e(null);const L={id:we("order_"),createdAt:Re(),delivered:!1,deliveredAt:null,state:!0,...t},D=this._internalGetAll();D.push(L),this.saveAll(D),e(L)},500)})},async update(t){return new Promise(e=>{setTimeout(()=>{const a=this._internalGetAll(),r=a.find(l=>l.id===t.id);if(!r)return u.toast("El pedido original no se encontró para actualizar."),e(!1);if(r.delivered)return u.toast("No se puede modificar un pedido que ya ha sido entregado."),e(!1);const s=T.findById(t.foodId);if(!s)return u.toast("La comida seleccionada no existe."),e(!1);const i=E.findLatestActiveByFoodId(t.foodId);if(!i||!i.isActive)return u.toast("La comida no está disponible para la venta en este momento."),e(!1);const n=this._calculateTotalItems(t),c=this.getReservedStockForFood(s.id,t.id),o=s.stock-c;if(o<n)return u.toast(`Stock insuficiente para '${s.name}'. Solicitado: ${n}, Disponible: ${o}.`,1e4),e(!1);const d=a.map(l=>l.id===t.id?{...l,...t}:l);this.saveAll(d),e(!0)},500)})},async updateDeliveryStatus(t,e){return new Promise(a=>{setTimeout(()=>{const r=this._internalGetAll(),s=r.findIndex(d=>d.id===t);if(s===-1)return u.toast("Pedido no encontrado."),a(!1);const i=r[s],n=i.delivered;if(n===e)return a(!0);const c=T.findById(i.foodId);if(!c)return u.toast("La comida asociada al pedido ya no existe."),a(!1);const o=this._calculateTotalItems(i);if(e&&!n){if(c.stock<o)return u.toast(`No se puede entregar: Stock físico insuficiente para '${c.name}'. Requerido: ${o}, Físico: ${c.stock}.`,1e4),a(!1);T.decreaseStock(i,o),i.delivered=!0,i.deliveredAt=new Date().toISOString()}else!e&&n&&(T.increaseStock(i,o),i.delivered=!1,i.deliveredAt=null);r[s]=i,this.saveAll(r),a(!0)},500)})},archiveDeliveredOrders(){const t=this._internalGetAll().map(e=>e.delivered?{...e,state:!1}:e);this.saveAll(t),u.toast("Pedidos entregados archivados.")},isFoodInActiveOrder(t){return this.getAll().some(e=>e.foodId===t)},getSorted(){const t=this.getAll(),e=t.filter(r=>!r.delivered),a=t.filter(r=>r.delivered);return e.sort((r,s)=>new Date(r.deliveryTime).getTime()-new Date(s.deliveryTime).getTime()),a.sort((r,s)=>{const i=r.deliveredAt?new Date(r.deliveredAt).getTime():0;return(s.deliveredAt?new Date(s.deliveredAt).getTime():0)-i}),[...e,...a]},findById(t){return this.getAll().find(e=>e.id===t)},checkConflict(t,e,a){const r=Math.abs(e)*60*1e3,s=new Date(t).getTime(),i=this.getAll().filter(n=>n.id!==a&&!n.delivered);for(const n of i)if(Math.abs(s-new Date(n.deliveryTime).getTime())<r)return{conflict:!0,other:n};return{conflict:!1}}};window.addEventListener("unhandledrejection",t=>{console.error("Unhandled promise rejection:",t.reason),u.toast("Ocurrió un error inesperado.")});function tt(t){setTimeout(()=>window.scrollTo(0,0),0);const e=a=>{const r=T.getAll(),s=I.getSorted().filter(o=>o.state),i=s.filter(o=>!o.delivered).length,n=s.filter(o=>o.delivered).length,c=T.totalProfit();t.innerHTML=`<section class="space-y-4">
    <div class="grid grid-cols-2 gap-3">
      <div class="dashboard-card cursor-pointer p-3 bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border dark:border-dark-border">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <i class="fa fa-clock text-white fa-lg"></i>
          </div>
          <div class="text-lg font-bold text-gray-600 dark:text-gray-400">Pendientes</div>
        </div>
        <div class="text-2xl text-center font-bold text-gray-900 dark:text-white">${i}</div>
      </div>
      <div class="dashboard-card cursor-pointer p-3 bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border dark:border-dark-border">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <i class="fa fa-check text-white fa-lg"></i>
          </div>
          <div class="text-lg font-bold text-gray-600 dark:text-gray-400">Entregados</div>
        </div>
        <div class="text-2xl text-center font-bold text-gray-900 dark:text-white">${n}</div>
      </div>
      <div class="dashboard-card cursor-pointer p-3 bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border dark:border-dark-border">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
            <i class="fa fa-utensils text-white fa-lg"></i>
          </div>
          <div class="text-lg font-bold text-gray-600 dark:text-gray-400">Productos</div>
        </div>
        <div class="text-2xl text-center font-bold text-gray-900 dark:text-white">${r.length}</div>
      </div>
      <div class="dashboard-card cursor-pointer p-3 bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border dark:border-dark-border">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <i class="fa fa-dollar-sign text-white fa-lg"></i>
          </div>
          <div class="text-lg font-bold text-gray-600 dark:text-gray-400">Beneficios</div>
        </div>
        <div class="text-2xl text-center font-bold text-gray-900 dark:text-white">${$(c)}</div>
      </div>
    </div>
    <div class="flex gap-2">
      <button id="btnAddOrderQuick" class="flex-1 px-2 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow hover:shadow-md transition-all duration-200">
        <div class="flex items-center justify-center gap-2">
          <i class="fa fa-plus fa-lg"></i>
          <span class="text-base font-semibold">Nuevo pedido</span>
        </div>
      </button>
      <button id="btnAddFoodQuick" class="flex-1 px-2 py-2 border-2 border-accent hover:border-accent text-gray-700 dark:text-gray-300 hover:text-accent rounded-lg font-medium transition-all duration-200">
        <div class="flex items-center justify-center gap-2">
          <i class="fa fa-utensils fa-lg"></i>
          <span class="text-base font-semibold">Nueva comida</span>
        </div>
      </button>
    </div>
  </section>`,a&&t.querySelectorAll(".dashboard-card").forEach((d,l)=>{const g=d;g.style.opacity="0",g.style.transform="translateY(20px)",setTimeout(()=>{g.style.transition="all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",g.style.opacity="1",g.style.transform="translateY(0)"},l*100)}),t.querySelector("#btnAddOrderQuick")?.addEventListener("click",o=>{const d=o.currentTarget;d.style.transform="scale(0.95)",setTimeout(()=>{d.style.transform="",document.dispatchEvent(new CustomEvent("openOrderForm"))},100)}),t.querySelector("#btnAddFoodQuick")?.addEventListener("click",o=>{const d=o.currentTarget;d.style.transform="scale(0.95)",setTimeout(()=>{d.style.transform="",document.dispatchEvent(new CustomEvent("openFoodForm"))},100)})};e(!0),document.addEventListener("refreshViews",()=>{t.querySelector(".dashboard-card")&&e(!1)}),u.updateHeaderContent}function at(t){setTimeout(()=>window.scrollTo(0,0),0),t.innerHTML=`<div class="food-container bg-white dark:bg-dark-bg-secondary rounded-xl p-3 border dark:border-dark-border space-y-3 mb-32 opacity-0 transform translate-y-4">
    <div class="flex gap-2 items-center">
      <input id="inputFilterFood" placeholder="Buscar por comida..." class="flex-1 px-3 py-2 border dark:border-dark-border rounded-lg bg-transparent transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-1 focus:ring-blue-500" />
      <button id="btnAddFood" class="px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-200 hover:scale-105 active:scale-95">
        <i class="fa-solid fa-plus fa-lg"></i>
      </button>
    </div>
    <div id="foodsList" class="space-y-3"></div>
  </div>`;const e=t.querySelector(".food-container");requestAnimationFrame(()=>{e.style.transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",e.style.opacity="1",e.style.transform="translateY(0)"});const a=t.querySelector("#inputFilterFood"),r=t.querySelector("#foodsList"),s=(n,c=!1)=>{if(r.innerHTML="",n.length===0){const o=document.createElement("div");o.className="text-gray-500 dark:text-gray-400 text-center py-8 opacity-0 transform translate-y-4",o.innerHTML=`
        <i class="fa fa-bowl-food text-4xl mb-2 opacity-50"></i>
        <p>Sin resultados.</p>`,r.appendChild(o),requestAnimationFrame(()=>{o.style.transition="all 0.4s ease-out",o.style.opacity="1",o.style.transform="translateY(0)"});return}n.forEach((o,d)=>{const l=document.createElement("div");l.className=`food-item p-3 bg-gray-50 dark:bg-dark-bg rounded-lg border dark:border-dark-border hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer ${o.isActive?"":"opacity-60"}`,c&&l.classList.add("opacity-0","transform","translate-y-4"),l.innerHTML=`
        <div class="flex items-center justify-between mb-2">
          <div class="font-semibold text-xl text-gray-900 dark:text-white">${o.name}</div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium transition-all duration-200 ${o.isActive?"bg-green-100 text-green-800 hover:bg-green-200":"bg-red-100 text-red-800 hover:bg-red-200"}">
              <i class="fa ${o.isActive?"fa-check-circle":"fa-times-circle"} mr-1 text-base"></i>
              ${o.isActive?"Activo":"Inactivo"}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-lg text-gray-600 dark:text-gray-300 mb-3">
          <div class="flex items-center gap-1 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/30">
            <i class="fa-solid fa-shopping-cart text-blue-500 text-2xl"></i>
            <span class="font-semibold"><strong>${o.amountSold||0}</strong></span>
          </div>
          <div class="flex items-center gap-1 p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 transition-colors hover:bg-orange-100 dark:hover:bg-orange-900/30">
            <i class="fa-solid fa-boxes-stacked text-orange-500 text-2xl"></i>
            <span class="font-semibold"><strong>${o.stock-I.getReservedStockForFood(o.id)}</strong></span>
          </div>
          <div class="flex items-center gap-1 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 transition-colors hover:bg-green-100 dark:hover:bg-green-900/30">
            <i class="fa-solid fa-dollar-sign text-green-500 text-2xl"></i>
            <span class="font-semibold"><strong>${$(o.price)}</strong></span>
          </div>
        </div>
        <div class="flex gap-2">
          <button data-id="${o.id}" class="salesHistoryBtn flex-1 px-1 py-1 bg-blue-500 text-white rounded flex items-center justify-center gap-2 hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold">
            <i class="fa fa-history text-lg"></i>
            Historial
          </button>
          <button data-id="${o.id}" class="editFood flex-1 px-1 py-1 bg-yellow-500 text-white rounded flex items-center justify-center gap-2 hover:bg-yellow-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold">
            <i class="fa-solid fa-store text-lg"></i>
            Venta
          </button>
        </div>`,r.appendChild(l),c&&setTimeout(()=>{l.style.transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",l.style.opacity=o.isActive?"1":"0.6",l.style.transform="translateY(0)"},d*100)}),setTimeout(()=>{r.querySelectorAll(".editFood").forEach(o=>{o.addEventListener("click",d=>{const l=d.currentTarget;l.style.transform="scale(0.95)",setTimeout(()=>{l.style.transform="",document.dispatchEvent(new CustomEvent("openFoodForm",{detail:{id:l.dataset.id}}))},100)})}),r.querySelectorAll(".salesHistoryBtn").forEach(o=>{o.addEventListener("click",d=>{const l=d.currentTarget,g=l.dataset.id;l.style.transform="scale(0.95)",setTimeout(()=>{l.style.transform="",document.dispatchEvent(new CustomEvent("openSalesHistory",{detail:{foodId:g}}))},100)})})},n.length*100+100)},i=(n=!1)=>{const c=T.getAll();c.sort((l,g)=>l.isActive&&!g.isActive?-1:!l.isActive&&g.isActive?1:l.name.localeCompare(g.name));const o=se(a.value).toLowerCase(),d=o?c.filter(l=>se(l.name).toLowerCase().includes(o)):c;s(d,n)};a.addEventListener("input",()=>i(!1)),t.querySelector("#btnAddFood")?.addEventListener("click",n=>{const c=n.currentTarget;c.style.transform="scale(0.95)",setTimeout(()=>{c.style.transform="",document.dispatchEvent(new CustomEvent("openFoodForm"))},100)}),document.addEventListener("refreshViews",()=>i(!1)),i(!0)}function rt(t){setTimeout(()=>window.scrollTo(0,0),0),t.innerHTML=`
    <div class="clients-container bg-white dark:bg-dark-bg-secondary rounded-xl p-3 border dark:border-dark-border space-y-3 mb-32 opacity-0 transform translate-y-4">
      <div class="flex gap-2 items-center">
        <input id="inputFilterPhone" placeholder="Buscar por nombre o teléfono..." class="flex-1 px-3 py-2 border dark:border-dark-border rounded-lg bg-transparent transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" inputmode="text" />
        <button id="btnAddOrder" class="px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-200 hover:scale-105 active:scale-95">
          <i class="fa-solid fa-plus fa-lg"></i>
        </button>
      </div>
      <div id="ordersList" class="space-y-3"></div>
    </div>`;const e=t.querySelector(".clients-container");requestAnimationFrame(()=>{e.style.transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",e.style.opacity="1",e.style.transform="translateY(0)"});const a=t.querySelector("#inputFilterPhone"),r=t.querySelector("#ordersList"),s=(n,c=!1)=>{if(r.innerHTML="",!n.length){const o=document.createElement("div");o.className="text-gray-500 dark:text-gray-400 text-center py-8 opacity-0 transform translate-y-4",o.innerHTML=`
        <i class="fa-solid fa-bag-shopping text-4xl mb-2 opacity-50"></i>
        <p>Sin resultados.</p>`,r.appendChild(o),requestAnimationFrame(()=>{o.style.transition="all 0.4s ease-out",o.style.opacity="1",o.style.transform="translateY(0)"});return}n.forEach((o,d)=>{const l=document.createElement("div");l.className=`order-item p-3 bg-gray-50 dark:bg-dark-bg rounded-lg border dark:border-dark-border hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer ${o.delivered?"opacity-60":""}`,c&&l.classList.add("opacity-0","transform","translate-y-4"),l.innerHTML=`
        <div class="flex items-center justify-between mb-2">
          <div class="font-semibold text-xl flex items-center min-w-0">
            <i class="fa fa-user mr-2 shrink-0 text-blue-500"></i>
            <span class="truncate text-gray-900 dark:text-white" title="${o.fullName}">${o.fullName}</span>
          </div>
          <div class="flex items-center">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium transition-all duration-200 ${o.delivered?"bg-green-100 text-green-800 hover:bg-green-200":"bg-red-100 text-red-800 hover:bg-red-200"}">
              <i class="fa ${o.delivered?"fa-check-circle":"fa-times-circle"} mr-1 text-base"></i>
              ${o.delivered?"Entregado":"Pendiente"}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 text-lg text-gray-600 dark:text-gray-300 mb-3">
          <div class="flex items-center gap-1 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/30">
            <i class="fa fa-clock text-blue-500 text-2xl"></i>
            <span class="font-semibold"><strong>${new Date(o.deliveryTime).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:!1})}</strong></span>
          </div>
          <div class="flex items-center gap-1 p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-900/30">
            <i class="fa fa-mobile text-indigo-500 text-2xl"></i>
            <span class="font-semibold"><strong>${o.phone}</strong></span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button data-phone="${o.phone}" class="callBtn flex-1 px-1 py-[17.5px] bg-green-500 text-white rounded flex items-center justify-center gap-2 hover:bg-green-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold">
            <i class="fa fa-phone fa-lg"></i>
          </button>
          <button data-id="${o.id}" class="viewOrder flex-1 px-1 py-[17.5px] bg-blue-500 text-white rounded flex items-center justify-center gap-2 hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold">
            <i class="fa fa-eye fa-lg"></i>
          </button>
          <button data-id="${o.id}" class="editOrder flex-1 px-1 py-[17.5px] bg-yellow-500 text-white rounded flex items-center justify-center gap-2 hover:bg-yellow-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold">
            <i class="fa-solid fa-pencil fa-lg"></i>
          </button>
          <label class="relative inline-flex items-center cursor-pointer ml-2">
            <input data-id="${o.id}" type="checkbox" ${o.delivered?"checked":""} class="sr-only deliveredToggle">
            <div class="toggle-bg w-11 h-6 ${o.delivered?"bg-green-600":"bg-red-500"} rounded-full transition-all duration-300">
              <div class="toggle-dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${o.delivered?"translate-x-5":"translate-x-0"}"></div>
            </div>
          </label>
        </div>`,r.appendChild(l),c&&setTimeout(()=>{l.style.transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",l.style.opacity=o.delivered?"0.6":"1",l.style.transform="translateY(0)"},d*100)}),setTimeout(()=>{r.querySelectorAll(".deliveredToggle").forEach(o=>{o.addEventListener("change",d=>{const l=d.currentTarget,g=l.dataset.id,y=I.findById(g);y&&dt(y,l,m=>{const v=l.nextElementSibling,k=v.firstElementChild;v.className=`toggle-bg w-11 h-6 ${m?"bg-green-600":"bg-red-500"} rounded-full transition-all duration-300`,k.className=`toggle-dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${m?"translate-x-5":"translate-x-0"}`;const x=l.closest(".p-3")?.querySelector("span.inline-flex");x&&(x.className=`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium transition-all duration-200 ${m?"bg-green-100 text-green-800 hover:bg-green-200":"bg-red-100 text-red-800 hover:bg-red-200"}`,x.innerHTML=`${m?'<i class="fa fa-check-circle mr-1 text-base"></i>Entregado':'<i class="fa fa-times-circle mr-1 text-base"></i>Pendiente'}`);const L=l.closest(".p-3");L&&(L.className=`order-item p-3 bg-gray-50 dark:bg-dark-bg rounded-lg border dark:border-dark-border hover:shadow-md transition-all duration-300 hover:scale-[1.02] ${m?"opacity-60":""}`)},()=>i(!1))})}),r.querySelectorAll(".callBtn").forEach(o=>{o.addEventListener("click",d=>{const l=d.currentTarget;l.style.transform="scale(0.95)",setTimeout(()=>{l.style.transform="",document.dispatchEvent(new CustomEvent("openCallModal",{detail:{phone:l.dataset.phone}}))},100)})}),r.querySelectorAll(".viewOrder").forEach(o=>{o.addEventListener("click",d=>{const l=d.currentTarget;l.style.transform="scale(0.95)",setTimeout(()=>{l.style.transform="",document.dispatchEvent(new CustomEvent("openOrderDetails",{detail:{id:l.dataset.id}}))},100)})}),r.querySelectorAll(".editOrder").forEach(o=>{o.addEventListener("click",d=>{const l=d.currentTarget;l.style.transform="scale(0.95)",setTimeout(()=>{l.style.transform="",document.dispatchEvent(new CustomEvent("openOrderForm",{detail:{id:l.dataset.id}}))},100)})})},n.length*100+100)},i=(n=!1)=>{const c=I.getSorted(),o=a.value.toLowerCase().trim();if(!o){s(c,n);return}const d=je(o),l=c.filter(g=>{const y=se(g.fullName).toLowerCase().includes(o);let f=!1;return d.length>0&&(f=je(g.phone).includes(d)),y||f});s(l,n)};a.addEventListener("input",()=>i(!1)),t.querySelector("#btnAddOrder")?.addEventListener("click",n=>{const c=n.currentTarget;c.style.transform="scale(0.95)",setTimeout(()=>{c.style.transform="",document.dispatchEvent(new CustomEvent("openOrderForm"))},100)}),document.addEventListener("refreshViews",()=>i(!1)),i(!0)}let ve="dashboard";const ke=new Set,re={getScreen(){return ve},setScreen(t){t!==ve&&(ve=t,ke.forEach(e=>e(ve)))},subscribe(t){return ke.add(t),()=>ke.delete(t)}};let X,W=60;function pe(){X&&(clearInterval(X),X=void 0);const t=I.getAll(),e=t.filter(r=>!r.delivered).length,a=t.length-e;e>0?(u.updateHeaderContent(`<div class="pulse-animation bg-red-500 text-white text-base font-bold w-8 h-8 flex items-center justify-center rounded-full">${e}</div>`),W=60):a>0?st():(u.updateHeaderContent(""),W=60)}function st(){const t=()=>{const a='<button id="archive-btn" title="Archivar pedidos entregados" class="bg-red-500 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-600"><i class="fa fa-trash-can fa-lg"></i></button>';if(re.getScreen()==="clients"){u.updateHeaderContent(a);const r=document.getElementById("archive-btn");r&&r.addEventListener("click",()=>{u.confirm("¿Deseas archivar todos los pedidos ya entregados?",()=>{I.archiveDeliveredOrders(),document.dispatchEvent(new CustomEvent("refreshViews")),pe()})})}else u.updateHeaderContent("")},e=()=>{const a=Math.floor(W/60),r=W%60,s=`<div class="bg-gray-400 text-white text-sm font-mono w-12 h-8 flex items-center justify-center rounded-lg">${a}:${r.toString().padStart(2,"0")}</div>`;re.getScreen()==="clients"?u.updateHeaderContent(s):u.updateHeaderContent("")};if(W<=0){t();return}e(),X=window.setInterval(()=>{W--,W<=0?(X&&(clearInterval(X),X=void 0),t()):e()},1e3)}function ot(t){const e=localStorage.getItem("fd_meta_v1")||"{}";let a={};try{a=JSON.parse(e)||{}}catch{a={}}const r=a.deliveryGapMinutes??15,s=!!a.darkMode;t.innerHTML=`
    <section class="space-y-4">
      <div class="settings-header bg-white dark:bg-dark-bg-secondary rounded-xl p-4 border dark:border-dark-border shadow-sm opacity-0 transform translate-y-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
            <i class="fa fa-gear text-xl"></i>
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Configuración</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Personaliza tu experiencia</p>
          </div>
        </div>
      </div>
      <div class="space-y-3">
        <div class="settings-card bg-white dark:bg-dark-bg-secondary rounded-xl p-4 border dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-300 opacity-0 transform translate-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <i class="fa fa-clock text-orange-600 dark:text-orange-400 fa-lg"></i>
              </div>
              <div>
                <div class="font-medium text-base text-gray-900 dark:text-white">Intervalo</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">De entregas</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <input id="inputGap" type="number" min="0" max="120" value="${r}" class="w-16 px-2 py-1.5 border dark:border-dark-border rounded-lg text-center text-sm bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />
            </div>
          </div>
        </div>
        <div class="settings-card bg-white dark:bg-dark-bg-secondary rounded-xl p-4 border dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-300 opacity-0 transform translate-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div id="themeIconContainer" class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <i id="themeIcon" class="${s?"fa-solid fa-cloud-moon text-purple-600 dark:text-purple-400":"fa-solid fa-cloud-sun text-purple-600 dark:text-purple-400"}"></i>
              </div> 
              <div>
                <div class="font-medium text-base text-gray-900 dark:text-white">Tema</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Oscuro o Claro</div>
              </div>
            </div>
            <div>
              <button id="themeToggle" aria-pressed="${s}" title="${s?"Cambiar a modo claro":"Cambiar a modo oscuro"}" class="relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${s?"bg-blue-600":"bg-gray-300"}">
                <span class="sr-only">Cambiar tema</span>
                <span id="toggleDot" class="inline-block w-4 h-4 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${s?"translate-x-6":"translate-x-1"}"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>`,t.querySelectorAll(".settings-header, .settings-card").forEach((f,m)=>{const v=f;setTimeout(()=>{v.style.transition="all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",v.style.opacity="1",v.style.transform="translateY(0)"},m*100)});const n=t.querySelector("#inputGap"),c=t.querySelector("#themeToggle"),o=t.querySelector("#themeIcon"),d=t.querySelector("#toggleDot"),l=f=>{f?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark"),c&&d&&(c.classList.toggle("bg-blue-600",f),c.classList.toggle("bg-gray-300",!f),d.classList.toggle("translate-x-6",f),d.classList.toggle("translate-x-1",!f)),o&&(o.style.transform="scale(0.8)",o.style.opacity="0.5",setTimeout(()=>{o.className=f?"fa-solid fa-cloud-moon fa-lg text-purple-600 dark:text-purple-400":"fa-solid fa-cloud-sun fa-lg text-purple-600 dark:text-purple-400",o.style.transform="scale(1)",o.style.opacity="1"},150));const m=localStorage.getItem("fd_meta_v1")||"{}";let v={};try{v=JSON.parse(m)||{}}catch{v={}}v.darkMode=!!f,localStorage.setItem("fd_meta_v1",JSON.stringify(v))},g=f=>{const m=f.currentTarget,v=Number(m.value||0);if(v<0||v>120){m.style.borderColor="#ef4444",setTimeout(()=>{m.style.borderColor=""},1500);return}m.style.borderColor="#10b981",m.style.backgroundColor="#f0fdf4",setTimeout(()=>{m.style.borderColor="",m.style.backgroundColor=""},1e3);const k=localStorage.getItem("fd_meta_v1")||"{}";let x={};try{x=JSON.parse(k)||{}}catch{x={}}x.deliveryGapMinutes=v,localStorage.setItem("fd_meta_v1",JSON.stringify(x)),u.toast("Intervalo actualizado correctamente")},y=()=>{const m=!document.documentElement.classList.contains("dark");c&&(c.style.transform="scale(0.95)",setTimeout(()=>{c.style.transform="scale(1)"},100)),l(m),u.toast(`Modo ${m?"oscuro":"claro"} activado`),pe()};n?.addEventListener("change",g),n?.addEventListener("input",f=>{const m=f.currentTarget,v=Number(m.value);v<0||v>120?m.style.borderColor="#ef4444":m.style.borderColor=""}),c?.addEventListener("click",y),l(s)}function it(t){const e=T.findById(t);if(!e){u.toast("Comida no encontrada");return}const a=E.findByFoodId(t);let r=null;const s=(n,c)=>{const o=n.quantitySoldSingle||0,d=Object.entries(n.comboSales||{}),l=o*n.unitPrice;let g=0,y=0;d.forEach(([Z,w])=>{g+=w.quantity*w.count,y+=w.price*w.count});const f=o+g,m=l+y,v=m-f*n.unitCost,k=`
      <tr class="border-b dark:border-dark-border">
        <td class="py-2 pr-2">Venta Unitaria</td>
        <td class="py-2 text-center">${o}</td>
        <td class="py-2 text-center">${$(n.unitPrice)}</td>
        <td class="py-2 text-right font-semibold">${$(l)}</td>
      </tr>
      ${d.map(([Z,w])=>`
        <tr class="border-b dark:border-dark-border">
          <td class="py-2 pr-2">Combo (${w.quantity}u) x ${w.count}</td>
          <td class="py-2 text-center">${w.quantity*w.count}</td>
          <td class="py-2 text-center">${$(w.price)}</td>
          <td class="py-2 text-right font-semibold">${$(w.price*w.count)}</td>
        </tr>
      `).join("")}
    `,x=`
      <div class="flex flex-col h-full max-h-[90vh] text-sm sm:text-base bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
        <div class="flex-shrink-0 p-3 sm:p-4 border-b dark:border-dark-border flex items-center justify-between gap-4">
          <button id="backToHistoryList" class="text-accent hover:underline flex items-center gap-1.5 text-sm">
            <i class="fa fa-arrow-left"></i>
            <span class="hidden sm:inline">Volver</span>
          </button>
          <h3 class="text-base sm:text-xl font-bold text-center truncate">Detalles ${n.recordDate}</h3>
          <button id="closeRecordDetails" class="w-7 h-7 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 flex-shrink-0">
            <i class="fa fa-times text-base"></i>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6">
          <div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 border-b dark:border-dark-border pb-2">
              <div>
                <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold"><i class="fa fa-bowl-food w-4 text-center"></i>Comida:</label>
                <div class="text-gray-900 dark:text-dark-text font-medium pl-6">${e.name}</div>
              </div>
              <div>
                <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold"><i class="fa fa-clock w-4 text-center"></i>Horario:</label>
                <div class="text-gray-900 dark:text-dark-text font-medium pl-6">${be(n.startTime)} - ${be(n.endTime)}</div>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-2 sm:gap-4 text-center mt-3">
              <div>
                <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold">
                  <i class="fa-solid fa-boxes-stacked"></i> Stock
                </label>
                <div class="text-gray-900 dark:text-dark-text text-lg sm:text-xl font-bold">${n.initialStock}</div>
              </div>
              <div>
                <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold">
                  <i class="fa fa-shopping-cart"></i> Vendido
                </label>
                <div class="text-gray-900 dark:text-dark-text text-lg sm:text-xl font-bold">${f}</div>
              </div>
              <div>
                <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold">
                  <i class="fa-solid fa-box"></i> Disponible
                </label>
                <div class="text-gray-900 dark:text-dark-text text-lg sm:text-xl font-bold">${n.initialStock-f}</div>
              </div>
            </div>
            <div class="border-t dark:border-dark-border pt-3">
              <label class="flex items-center gap-2 text-base sm:text-lg text-gray-600 dark:text-gray-300 font-semibold mb-2"><i class="fa fa-receipt"></i>Desglose de Ventas</label>
              <div class="overflow-x-auto">
                <table class="w-full text-xs sm:text-sm">
                  <thead>
                    <tr class="text-left text-gray-500 dark:text-gray-400">
                      <th class="py-1 font-semibold">Tipo</th>
                      <th class="py-1 font-semibold text-center">Unidades</th>
                      <th class="py-1 font-semibold text-center">Precio</th>
                      <th class="py-1 font-semibold text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>${k}</tbody>
                </table>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
              <div class="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div>
                  <label class="text-xs sm:text-sm text-gray-500">Costo Unit.</label>
                  <div class="font-semibold text-sm sm:text-base">${$(n.unitCost)}</div>
                </div>
                <div>
                  <label class="text-xs sm:text-sm text-gray-500">Precio Unit.</label>
                  <div class="font-semibold text-sm sm:text-base">${$(n.unitPrice)}</div>
                </div>
                <div>
                  <label class="text-xs sm:text-sm text-gray-500">Lucro Unit.</label>
                  <div class="font-bold text-sm sm:text-base text-blue-600 dark:text-blue-400">${$(n.unitPrice-n.unitCost)}</div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 sm:gap-4 pt-3 border-t dark:border-dark-border text-center">
                <div>
                  <label class="flex items-center justify-center gap-2 text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-300"><i class="fa fa-piggy-bank"></i>Lucro Total</label>
                  <div class="font-bold text-blue-700 dark:text-blue-400 text-xl sm:text-2xl">${$(v)}</div>
                </div>
                <div>
                  <label class="flex items-center justify-center gap-2 text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-300"><i class="fa fa-coins"></i>Venta Total</label>
                  <div class="font-bold text-green-700 dark:text-green-400 text-xl sm:text-2xl">${$(m)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`,{close:L,element:D}=u.modal(x,{closeOnBackdropClick:!1});D.querySelector("#closeRecordDetails").addEventListener("click",L),D.querySelector("#backToHistoryList").addEventListener("click",()=>{L(),c()})},i=()=>{let n;a.length===0?n='<div class="text-gray-500 dark:text-gray-400 text-center py-8 flex flex-col items-center gap-2"><i class="fa fa-inbox text-3xl opacity-50"></i><p>No hay historial de ventas para esta comida.</p></div>':n=`<div class="bg-white dark:bg-dark-bg rounded-lg border dark:border-dark-border divide-y dark:divide-dark-border">${a.map(d=>{const l=d.quantitySoldSingle||0,g=Object.values(d.comboSales||{}).reduce((k,x)=>k+x.count*x.quantity,0),y=l+g,f=l*d.unitPrice,m=Object.values(d.comboSales||{}).reduce((k,x)=>k+x.count*x.price,0),v=f+m;return`
          <div class="border-b dark:border-dark-border last:border-b-0">
            <button data-record-id="${d.id}" class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 record-detail-btn transition-colors">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full ${d.isActive?"bg-green-500":"bg-gray-400"}"></div>
                  <div>
                    <div class="font-medium text-gray-900 dark:text-dark-text"><i class="fa fa-calendar-day mr-2 text-gray-400"></i>${d.recordDate}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">${be(d.startTime)} - ${be(d.endTime)}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-gray-900 dark:text-dark-text">Vendí: <span class="text-gray-600 dark:text-gray-300">${y}</span></div>
                  <div class="text-base font-bold text-green-600">${$(v)}</div>
                </div>
              </div>
            </button>
          </div>`}).join("")}</div>`;const c=`
      <div class="relative max-h-[80vh] overflow-y-auto">
        <button id="closeHistoryModal" class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 z-20">
          <i class="fa fa-times text-lg"></i>
        </button>
        <div class="pr-8 p-4">
          <h3 class="text-xl font-bold mb-4 text-center">
            <i class="fa fa-history mr-2"></i>Historial: ${e.name}
          </h3>
          <div class="max-h-96 overflow-y-auto">${n}</div>
        </div>
      </div>`;r=u.modal(c,{closeOnBackdropClick:!1}),r.element.querySelector("#closeHistoryModal").addEventListener("click",r.close),r.element.querySelectorAll(".record-detail-btn").forEach(o=>{o.addEventListener("click",d=>{const l=d.currentTarget.dataset.recordId,g=a.find(f=>f.id===l),y=r.close;y(),s(g,i)})})};i()}function nt(t){if(document.getElementById("foodForm"))return;const e=t?T.findById(t):null,a=e?I.isFoodInActiveOrder(e.id):!1,r=e?JSON.parse(JSON.stringify(e.combos)):[];let s=e?JSON.parse(JSON.stringify(e.combos)):[];const i=e?E.findLatestActiveByFoodId(e.id):null,n=i?.startTime||"08:00",c=i?.endTime||"23:00",o=a?"opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700":"",d=a?"disabled":"",l=a&&r.length>0,g=`
  <div class="flex flex-col h-full max-h-[calc(90*var(--vh,1vh))] bg-white dark:bg-gray-900 rounded-lg overflow-hidden text-sm sm:text-base">
    <div class="flex-shrink-0 p-2">
      <h3 class="text-xl font-bold text-center flex items-center justify-center gap-2">
        <i class="fa-solid fa-utensils"></i>
        <span>${e?"Editar Comida":"Agregar Comida"}</span>
        ${a?'<span class="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">🔒 EN USO</span>':""}
      </h3>
      ${a?'<div class="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">Solo se permite agregar nuevos combos.</div>':""}
    </div>
    <div class="flex-1 overflow-y-auto p-2 -mt-4">
      <form id="foodForm" class="space-y-3">
        <div>
          <label for="name" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-tag w-4"></i>Nombre</label>
          <input id="name" name="name" value="${e?.name??""}" required ${d}
            class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${o}"
            placeholder="Ej: Hamburguesa Clásica" />
        </div>
        <div class="${e?"grid grid-cols-3 gap-x-4":"grid grid-cols-2 gap-x-4"}">
          <div>
            <label for="cost" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-dollar-sign w-3"></i>Costo</label>
            <input id="cost" name="cost" type="number" step="0.01" min="0" value="${e?.cost??0}" ${d}
                   class="text-base text-center w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${o}"/>
          </div>
          <div>
            <label for="price" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-tag w-3"></i>Precio</label>
            <input id="price" name="price" type="number" step="0.01" min="0" value="${e?.price??0}" ${d}
                   class="text-base text-center w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${o}"/>
          </div>
          ${e?`
            <div class="flex flex-col justify-center ${a?"opacity-60":""}" 
                 title="${a?"No se puede desactivar: la comida está en un pedido activo.":"Activar/desactivar comida"}">
              <label for="isActive" class="flex flex-col gap-2 ${a?"cursor-not-allowed":"cursor-pointer"}">
                <span class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400">
                  <i class="fa fa-power-off w-3"></i> Activa
                </span>
                <div class="relative">
                  <input id="isActive" name="isActive" type="checkbox" ${e.isActive?"checked":""} ${d} class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 
                              peer-checked:after:translate-x-full peer-checked:after:border-white 
                              after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                              after:bg-white after:border after:rounded-full after:h-5 after:w-5 
                              after:transition-all dark:border-gray-600 peer-checked:bg-accent">
                  </div>
                </div>
              </label>
            </div>`:""}
        </div>
        <div class="grid grid-cols-[70px_100px_105px] gap-x-3">
          <div>
            <label for="stock" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400">
              <i class="fa fa-boxes-stacked w-4"></i>Stock
            </label>
            <input id="stock" name="stock" type="number" min="0" value="${e?.stock??0}" ${d}
                   class="text-base text-center w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${o}"/>
          </div>
          <div>
            <label for="startTime" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400">
              <i class="fa fa-play w-3"></i>Hora I.
            </label>
            <input id="startTime" name="startTime" type="time" value="${n}" step="60"
                   class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none"/>
          </div>
          <div>
            <label for="endTime" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400">
              <i class="fa fa-stop w-3"></i>Hora F.
            </label>
            <input id="endTime" name="endTime" type="time" value="${c}" step="60"
                   class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none"/>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between">
            <label class="text-lg font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2"><i class="fa fa-gift"></i><span id="combosText">Combos</span></label>
            <label class="relative inline-flex items-center cursor-pointer ${l?"opacity-50 cursor-not-allowed":""}" title="${l?"No se puede desactivar: hay combos en uso.":""}">
              <input id="comboToggle" type="checkbox" class="sr-only peer" ${s.length>0?"checked":""} ${l?"disabled":""}>
              <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
            </label>
          </div>
          <div id="comboFieldsContainer" class="mt-2 space-y-2 ${s.length===0?"hidden":""}">
            <div class="flex items-end gap-2">
              <div class="flex-1"><label class="block text-sm text-gray-500 dark:text-gray-400">Cantidad</label><input id="comboQuantity" type="number" min="2" placeholder="Ej: 2" class="p-1 w-full bg-transparent border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none"></div>
              <div class="flex-1"><label class="block text-sm text-gray-500 dark:text-gray-400">Precio Total</label><input id="comboPrice" type="number" step="0.01" min="0" placeholder="Ej: 3.50" class="p-1 w-full bg-transparent border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none"></div>
              <button type="button" id="addComboBtn" class="flex-shrink-0 w-10 h-9 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600"><i class="fa fa-plus"></i></button>
            </div>
            <div id="comboList" class="space-y-2 max-h-24 overflow-y-auto pr-2 "></div>
          </div>
        </div>
      </form>
    </div>
    <div class="flex-shrink-0 flex justify-center gap-10 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <button type="button" id="cancelFood" class="flex items-center gap-2 p-2 text-white bg-red-500 rounded-lg hover:bg-red-600 font-semibold text-base"><i class="fa fa-times fa-lg"></i> Cancelar</button>
      <button type="submit" form="foodForm" id="submitFood" class="flex items-center gap-2 p-2 bg-accent text-white rounded-lg hover:bg-accent/90 font-semibold text-base"><i class="fa ${e?"fa-save":"fa-plus"} fa-lg"></i> ${e?"Actualizar":"Agregar"}</button>
    </div>
  </div>`,y=()=>{const b=window.innerHeight*.01;document.documentElement.style.setProperty("--vh",`${b}px`)};y(),window.addEventListener("resize",y);const{close:f,element:m}=u.modal(g,{closeOnBackdropClick:!1}),v=()=>{f(),window.removeEventListener("resize",y)},k=m.querySelector("#foodForm"),x=m.querySelector("#submitFood"),L=m.querySelector("#comboToggle"),D=m.querySelector("#comboFieldsContainer"),Z=m.querySelector("#addComboBtn"),w=m.querySelector("#comboList"),j=m.querySelector("#comboQuantity"),V=m.querySelector("#comboPrice"),z=m.querySelector("#combosText");let q="";const oe=()=>{const b=new FormData(k),S={name:b.get("name"),cost:b.get("cost"),price:b.get("price"),stock:b.get("stock"),isActive:b.get("isActive")==="on",startTime:b.get("startTime"),endTime:b.get("endTime"),combos:JSON.stringify(s)};q=JSON.stringify(S)},xe=()=>{const b=new FormData(k),S={name:b.get("name"),cost:b.get("cost"),price:b.get("price"),stock:b.get("stock"),isActive:b.get("isActive")==="on",startTime:b.get("startTime"),endTime:b.get("endTime"),combos:JSON.stringify(s)};return q!==JSON.stringify(S)},G=()=>{if(!e)return;const b=xe();x.disabled=!b,x.classList.toggle("opacity-50",!b),x.classList.toggle("cursor-not-allowed",!b)},U=()=>{w.innerHTML=s.length?"":'<p class="text-xs text-center text-gray-500">Aún no hay combos.</p>',s.forEach(b=>{const S=r.some(ee=>ee.id===b.id),A=!a||!S,P=A?"":"disabled",K=A?"bg-red-500 hover:bg-red-600":"bg-gray-400 cursor-not-allowed",_=document.createElement("div");_.className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-base",_.innerHTML=`<div><span class="font-semibold">${b.quantity}</span> unidades por <span class="font-semibold text-green-500">${$(b.price)}</span></div><button data-id="${b.id}" ${P} class="remove-combo-btn w-7 h-7 ${K} text-white rounded-full flex items-center justify-center flex-shrink-0"><i class="fa fa-times text-xs"></i></button>`,w.appendChild(_)}),w.querySelectorAll(".remove-combo-btn").forEach(b=>{b.disabled||b.addEventListener("click",S=>{const A=S.currentTarget.dataset.id;s=s.filter(P=>P.id!==A),U(),G()})}),z.textContent=`Combos${s.length>0?` (${s.length})`:""}`};Z.addEventListener("click",()=>{const b=parseInt(j.value,10),S=parseFloat(V.value);if(isNaN(b)||b<2){u.toast("El combo debe tener al menos 2 U.");return}if(isNaN(S)||S<=0){u.toast("El precio del combo debe ser positivo.");return}if(s.some(A=>A.quantity===b)){u.toast("Ya existe un combo con esa cantidad.");return}s.push({id:`combo_${Date.now()}`,quantity:b,price:S}),s.sort((A,P)=>A.quantity-P.quantity),U(),j.value="",V.value="",j.focus(),G()});const B=async b=>{b.preventDefault(),x.disabled=!0,u.showSpinner("Guardando...");try{const S=new FormData(k),A=a?e.name:se(String(S.get("name")||"")),P=a?e.cost:parseFloat(String(S.get("cost")||"0")),K=a?e.price:parseFloat(String(S.get("price")||"0")),_=a?e.stock:parseInt(String(S.get("stock")||"0"),10),ee=a?e.isActive:S.get("isActive")==="on",le=String(S.get("startTime")||""),ie=String(S.get("endTime")||"");if(!A){u.toast("Nombre requerido");return}if(T.nameExists(A,e?.id)){u.toast("Comida existente",5e3);return}const ne=L.checked?s:[];if(e){const de={...e,name:A,cost:P,price:K,stock:_,isActive:ee,combos:ne};await T.update(de,{startTime:le,endTime:ie}),u.toast("Comida actualizada.")}else await T.add({name:A,cost:P,price:K,stock:_,combos:ne},{startTime:le,endTime:ie}),u.toast("Comida agregada.");v(),setTimeout(()=>document.dispatchEvent(new CustomEvent("refreshViews")),0)}finally{x.disabled=!1,u.hideSpinner()}};k.addEventListener("submit",B),m.querySelector("#cancelFood").addEventListener("click",v),L.addEventListener("change",()=>{D.classList.toggle("hidden",!L.checked),L.checked||(s=[]),U(),G()}),U(),e&&(setTimeout(()=>{oe(),G()},50),k.querySelectorAll("input, select").forEach(b=>{b.disabled||(b.addEventListener("input",G),b.addEventListener("change",G))}))}function lt(t){if(document.getElementById("orderForm"))return;const e=t?I.findById(t):null,r=T.getAll().filter(p=>p.isActive||e&&p.id===e.foodId).map(p=>{const h=I.getReservedStockForFood(p.id),C=p.stock-h;return`<option ${e?.foodId===p.id?"selected":""} value="${p.id}" data-price="${p.price}">${p.name} (Disp: ${C})</option>`}).join(""),s=e?new Date(e.deliveryTime).toTimeString().slice(0,5):"",i=e?e.delivered:!1,n=i?"disabled":"",c=i?"opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700":"",o=`
  <div class="flex flex-col h-full max-h-[calc(90*var(--vh,1vh))] bg-white dark:bg-gray-900 rounded-lg overflow-hidden text-sm sm:text-base">
    <div class="flex-shrink-0 p-2">
      <h3 class="text-xl font-bold text-center flex items-center justify-center gap-2">
        <i class="fa-solid fa-file-invoice-dollar"></i>
        <span>${e?"Editar Pedido":"Agregar Pedido"}</span>
        ${i?'<span class="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">🔒 ENTREGADO</span>':""}
      </h3>
    </div>
    <div class="flex-1 overflow-y-auto p-2 -mt-1">
      <form id="orderForm" class="space-y-4">
        <div>
          <label for="fullName" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-user w-4"></i>Nombres</label>
          <input id="fullName" name="fullName" value="${e?.fullName??""}" required ${n}
            class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${c}"
            placeholder="Ingresar nombres completos" />
        </div>
        <div>
          <label for="deliveryAddress" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-map-marker-alt w-4"></i>Dirección</label>
          <input id="deliveryAddress" name="deliveryAddress" value="${e?.deliveryAddress??""}" required ${n}
            class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${c}"
            placeholder="Ingresar dirección" />
        </div>
        <div class="grid grid-cols-2 gap-x-4">
          <div>
            <label for="phone" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-phone w-4"></i>Teléfono</label>
            <input id="phone" name="phone" value="${e?.phone??""}" required type="tel" inputmode="tel" ${n}
              placeholder="Formato 09 o +593"
              class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${c}" />
          </div>
          <div>
            <label for="deliveryTime" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-clock w-4"></i>Hora</label>
            <input id="deliveryTime" name="deliveryTime" type="time" value="${s}" required ${n}
              class="text-base w-full bg-transparent p-1 mb-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${c}" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-x-4">
          <div>
            <div class="flex justify-between items-center">
              <label for="foodId" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-utensils w-4"></i>Comida</label>
              <div id="unitPriceDisplay" class="text-sm text-gray-500 dark:text-gray-400 font-semibold"></div>
            </div>
            <select id="foodId" name="foodId" ${n} class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${c}">
              <option value="">Elegir comida</option>
              ${r}
            </select>
          </div>
          <div id="comboContainer">
            <label for="comboId" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-gift w-4"></i>Combo</label>
            <select id="comboId" name="comboId" ${n} class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${c}">
              <option value="">Sin combo</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-x-4">
          <div class="text-center">
            <label for="quantity" class="flex items-center justify-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-sort-numeric-up w-4"></i>Cant. U.</label>
            <input id="quantity" name="quantity" type="number" min="0" value="${e?.quantity??0}" ${n}
              class="text-base text-center w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${c}"/>
          </div>
          <div class="text-center">
            <label for="comboQuantity" class="flex items-center justify-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-gift w-4"></i>Combos</label>
            <input id="comboQuantity" name="comboQuantity" type="number" min="0" value="${e?.comboQuantity??0}" ${n}
              class="text-base text-center w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${c}"/>
          </div>
          <div class="text-center">
            <label class="flex items-center justify-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-calculator w-3"></i>Total</label>
            <div id="totalPrice" class="font-bold text-xl text-green-600 p-1">$0.00</div>
          </div>
        </div>
      </form>
    </div>
    <div class="flex-shrink-0 flex justify-center gap-10 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <button type="button" id="cancelOrder" class="flex items-center gap-2 p-2 text-white bg-red-500 rounded-lg hover:bg-red-600 font-semibold text-base"><i class="fa fa-times fa-lg"></i> Cancelar</button>
      <button type="submit" form="orderForm" id="submitOrder" 
              class="flex items-center gap-2 p-2 bg-accent text-white rounded-lg font-semibold text-base transition-all duration-200 ${e&&!i?"opacity-50 cursor-not-allowed":"hover:bg-accent/90"}" 
              ${e&&!i?"disabled":""}>
        <i class="fa ${e?"fa-save":"fa-plus"} fa-lg"></i> 
        ${e?"Actualizar":"Agregar"}
      </button>
    </div>
  </div>`,d=()=>{const p=window.innerHeight*.01;document.documentElement.style.setProperty("--vh",`${p}px`)};d(),window.addEventListener("resize",d);const{close:l,element:g}=u.modal(o,{closeOnBackdropClick:!1}),y=()=>{l(),window.removeEventListener("resize",d)},f=g.querySelector('input[name="phone"]'),m=g.querySelector('select[name="foodId"]'),v=g.querySelector('select[name="comboId"]'),k=g.querySelector('input[name="quantity"]'),x=g.querySelector('input[name="comboQuantity"]'),L=g.querySelector("#totalPrice"),D=g.querySelector("#unitPriceDisplay"),Z=g.querySelector("#cancelOrder"),w=g.querySelector("#orderForm"),j=w.querySelector('input[name="fullName"]'),V=w.querySelector('input[name="deliveryAddress"]'),z=w.querySelector('input[name="deliveryTime"]'),q=g.querySelector("#submitOrder");let oe=null;const xe=()=>{e&&(oe={fullName:j.value,phone:f.value,deliveryAddress:V.value,deliveryTime:z.value,foodId:m.value,quantity:parseInt(k.value,10)||0,comboId:v.value,comboQuantity:parseInt(x.value,10)||0})},G=()=>({fullName:j.value,phone:f.value,deliveryAddress:V.value,deliveryTime:z.value,foodId:m.value,quantity:parseInt(k.value,10)||0,comboId:v.value,comboQuantity:parseInt(x.value,10)||0}),U=()=>{if(!e||!oe)return!0;const p=G();return JSON.stringify(oe)!==JSON.stringify(p)},B=()=>{if(!e)return;if(i){q.disabled=!0,q.className="flex items-center gap-2 p-2 bg-gray-400 text-white rounded-lg cursor-not-allowed font-semibold text-base opacity-50",q.title="No se puede modificar un pedido entregado";return}const p=U();q.disabled=!p,p?(q.className="flex items-center gap-2 p-2 bg-accent text-white rounded-lg hover:bg-accent/90 font-semibold text-base transition-all duration-200",q.title="Guardar cambios"):(q.className="flex items-center gap-2 p-2 bg-gray-400 text-white rounded-lg cursor-not-allowed font-semibold text-base opacity-50 transition-all duration-200",q.title="No hay cambios para guardar")},b=()=>{const p=m.selectedOptions[0],h=p?T.findById(p.value):null;if(!h){L.textContent=$(0),D.textContent="",v.innerHTML='<option value="">Elegir combo</option>',x.disabled=!0;return}D.textContent=`${$(h.price)}`;const C=v.value,O=parseInt(k.value,10)||0,R=parseInt(x.value,10)||0;let H=O*h.price;if(C){const N=h.combos.find(Q=>Q.id===C);N&&(H+=R*N.price),x.disabled=i}else x.disabled=!0;L.textContent=$(H)},S=p=>{const h=T.findById(p);v.innerHTML='<option value="">Sin combo</option>',h&&h.combos.length>0&&h.combos.forEach(C=>{const O=document.createElement("option");O.value=C.id,O.textContent=`${C.quantity} Uds. x ${$(C.price)}`,e&&e.comboId===C.id&&(O.selected=!0),v.appendChild(O)}),v.value&&(x.value=e?.comboQuantity.toString()||"1"),b(),B()},A=Ze(()=>{const p=(()=>{const h=f.value.replace(/\s/g,"");return h.startsWith("09")||h.startsWith("+5939")||!h?null:"Formato válido: '09xxxxxxxx' o '+5939xxxxxxxx'"})();p&&u.toast(p)},3e3),P=(p,h)=>{const C=Math.abs(h)*60*1e3,O=I.getAll().filter(N=>!(e&&N.id===e.id)).map(N=>new Date(N.deliveryTime).getTime());let R=p,H=0;for(;;){const N=O.filter(ue=>Math.abs(R-ue)<C);if(N.length===0)break;const Q=Math.max(...N);if(R=Math.max(R,Q+C),H++,H>50)break}return R},K=async p=>{if(p.preventDefault(),e&&e.delivered){u.toast("❌ No se puede modificar un pedido que ya fue entregado");return}if(e&&!U()){u.toast("ℹ️ No hay cambios para guardar");return}q.disabled=!0,u.showSpinner("Espere un momento...");try{const h=new FormData(w),C=se(String(h.get("fullName")||"")),O=Ne(String(h.get("phone")||"")),R=se(String(h.get("deliveryAddress")||"")),H=String(h.get("foodId")||""),N=parseInt(String(h.get("quantity")||"0"),10),Q=String(h.get("comboId")||"")||null,ue=parseInt(String(h.get("comboQuantity")||"0"),10),Ae=String(h.get("deliveryTime")||"");if(!Ae){u.toast("Selecciona una hora de entrega.");return}let fe="";try{const F=new Date,[M,ae]=Ae.split(":");F.setHours(parseInt(M,10),parseInt(ae,10),0,0),fe=F.toISOString()}catch{u.toast("Hora de entrega inválida.");return}if(!C||!O||!R){u.toast("Completa todos los campos requeridos.");return}if(!he(O)){u.toast("El formato del teléfono es inválido."),f.focus(),f.classList.add("border-red-500");return}if(!H){u.toast("Selecciona una comida.");return}const me=T.findById(H);if(!me){u.toast("La comida seleccionada no fue encontrada.");return}let Ce=N;if(Q){const F=me.combos.find(M=>M.id===Q);F&&(Ce+=F.quantity*ue)}if(me.stock<Ce){u.toast(`Stock insuficiente para "${me.name}".`);return}if(N===0&&!Q){u.toast("Agrega al menos un item o un combo al pedido.");return}const Ie=De(O);if(Ie){const F=I.getAll().find(M=>e&&M.id===e.id?!1:De(M.phone)===Ie);if(F){u.toast(`El teléfono ya está registrado para el cliente '${F.fullName}'.`),f.focus(),f.classList.add("border-red-500");return}}const ye=JSON.parse(localStorage.getItem("fd_meta_v1")||"{}").deliveryGapMinutes??15;if(I.checkConflict(fe,ye,e?.id).conflict){const F=new Date(fe).getTime(),M=P(F,ye),ae=new Date(M),Ye=String(ae.getHours()).padStart(2,"0"),Ve=String(ae.getMinutes()).padStart(2,"0");z.value=`${Ye}:${Ve}`,u.toast(`Conflicto de entrega. Hora ajustada para cumplir ${ye} min de intervalo.`,7e3),B();return}const Fe={fullName:C,phone:O,deliveryAddress:R,foodId:H,quantity:N,comboId:Q,comboQuantity:ue,deliveryTime:fe};let ge=!1;if(e){ge=await I.update({...e,...Fe}),ge&&(u.toast("Pedido actualizado."),_(),y(),document.dispatchEvent(new CustomEvent("refreshViews")));return}else await I.add(Fe)&&(ge=!0,u.toast("Pedido agregado."));if(ge){document.dispatchEvent(new CustomEvent("refreshViews")),w.reset(),k.value="0",x.value="0",m.value="",v.innerHTML='<option value="">Sin combo</option>',f.value="",j.value="",V.value="";const F=new Date,M=String(F.getHours()).padStart(2,"0"),ae=String(F.getMinutes()).padStart(2,"0");z.value=`${M}:${ae}`,b(),B(),j.focus()}}finally{(!e||!i)&&(q.disabled=!1),u.hideSpinner()}},_=()=>{w.removeEventListener("submit",K),Z.removeEventListener("click",ee),f.removeEventListener("input",ne),f.removeEventListener("blur",de),f.removeEventListener("focus",Se),m.removeEventListener("change",Ee),v.removeEventListener("change",Te),k.removeEventListener("input",$e),x.removeEventListener("input",Le),j.removeEventListener("input",te),V.removeEventListener("input",te),z.removeEventListener("change",te)},ee=()=>{_(),y()},le=p=>{const h=p.target;h.value=Ne(h.value)},ie=()=>{const p=f.value;p.length===0?(f.classList.remove("border-green-500","border-red-500"),f.classList.add("border-gray-300")):he(p)?(f.classList.remove("border-gray-300","border-red-500"),f.classList.add("border-green-500")):(f.classList.remove("border-green-500","border-red-500"),f.classList.add("border-gray-300"))},ne=p=>{le(p),ie(),A(),B()},de=()=>{const p=f.value;p.length>0&&!he(p)&&(f.classList.add("border-red-500"),f.classList.remove("border-gray-300","border-green-500"))},Se=()=>{f.classList.contains("border-red-500")&&(f.classList.remove("border-red-500"),f.classList.add("border-gray-300"))},Ee=()=>{S(m.value),ce()},Te=()=>ce(),$e=()=>ce(),Le=()=>{parseInt(x.value,10)===0&&u.toast("La cantidad de combos debe ser mayor a 0."),ce()},te=()=>B(),ce=()=>{b(),B()};w.addEventListener("submit",K),Z.addEventListener("click",ee),f.addEventListener("input",ne),f.addEventListener("blur",de),f.addEventListener("focus",Se),m.addEventListener("change",Ee),v.addEventListener("change",Te),k.addEventListener("input",$e),x.addEventListener("input",Le),j.addEventListener("input",te),V.addEventListener("input",te),z.addEventListener("change",te),e&&(S(e.foodId),setTimeout(()=>{xe(),B()},100)),b(),ie(),B()}function dt(t,e,a,r){const s=e.checked,i=s?"ENTREGAR":"REVERTIR ENTREGA";e.checked=!s,a(!s);const n=`
    <div class="">
      <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <div class="font-bold text-lg text-gray-900 dark:text-white"><i class="fa fa-user text-blue-500"></i> ${t.fullName}</div>
        <div class="font-semibold text-gray-600 dark:text-gray-400"><i class="fa-solid fa-location-dot text-red-500"></i> ${t.deliveryAddress}</div>
        <div class="font-semibold text-gray-600 dark:text-gray-400 pb-3"><i class="fa fa-clock text-blue-500"></i> ${et(t.deliveryTime)}</div>
        <div class="font-semibold text-gray-600 dark:text-gray-400 pb-3"><i class="fa fa-mobile text-indigo-500"></i> ${t.phone}</div>
        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
          <div class="flex items-center justify-center gap-2 text-yellow-800 dark:text-yellow-200">
            <i class="fa fa-info-circle fa-lg"></i>
            <span class="font-medium"><div class="text-lg font-bold">${i} PEDIDO</div></span>
          </div>
        </div>
      </div>
    </div>`;u.confirm(n,()=>{u.showSpinner(`${s?"Entregando":"Revirtiendo"} pedido...`),setTimeout(async()=>{try{await I.updateDeliveryStatus(t.id,s)?(e.checked=s,a(s),pe(),r(),u.toast(s?`Pedido ENTREGADO a ${t.fullName}`:`Entrega REVERTIDA para ${t.fullName}`)):u.toast("❌ Error: No se pudo actualizar el pedido")}catch{u.toast("❌ Error crítico al actualizar el pedido")}finally{u.hideSpinner()}},150)},()=>{})}function _e(){const t=re.getScreen();u.updateTitle(t),u.renderNavActive(t),pe();const e=document.getElementById("mainArea");e.innerHTML="";const a=document.createElement("div");e.appendChild(a),t==="dashboard"?tt(a):t==="clients"?rt(a):t==="foods"?at(a):t==="settings"&&ot(a)}function ct(){const t=localStorage.getItem(He.STORAGE_KEYS.SETTINGS)||"{}";let e={};try{e=JSON.parse(t)||{}}catch{e={}}e.darkMode&&document.documentElement.classList.add("dark")}function ut(){ct(),u.renderShell(),document.querySelectorAll("#bottomNav .nav-item").forEach(e=>{e.setAttribute("tabindex","0"),e.addEventListener("click",a=>{const r=a.currentTarget.dataset.screen;r&&re.setScreen(r)})});const t=document.getElementById("scrollToTopBtn");t&&(window.addEventListener("scroll",()=>{const e=re.getScreen();window.scrollY>200&&(e==="clients"||e==="foods")?t.classList.remove("opacity-0","pointer-events-none","translate-y-4"):t.classList.add("opacity-0","pointer-events-none","translate-y-4")},{passive:!0}),t.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})})),document.addEventListener("openOrderForm",e=>{const a=e.detail?.id;lt(a)}),document.addEventListener("openFoodForm",e=>{const a=e.detail?.id;nt(a)}),document.addEventListener("openSalesHistory",e=>{const a=e.detail?.foodId;a&&it(a)}),document.addEventListener("openOrderDetails",e=>{const a=e.detail?.id;a&&Oe(()=>import("./components-ElNFo6fk.js"),[]).then(r=>r.showOrderDetails(a,()=>document.dispatchEvent(new CustomEvent("refreshViews"))))}),document.addEventListener("openCallModal",e=>{const a=e.detail?.phone;a&&Oe(()=>import("./components-ElNFo6fk.js"),[]).then(r=>r.showCallModal(a))}),re.subscribe(()=>_e()),_e()}ut();export{T as F,I as O,u as U,$ as a,at as b,rt as c,ot as d,nt as e,et as f,lt as g,dt as h,it as o,tt as r};
