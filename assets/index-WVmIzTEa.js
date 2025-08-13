(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function s(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(r){if(r.ep)return;r.ep=!0;const o=s(r);fetch(r.href,o)}})();const pe=document.getElementById("app"),d={toastTimer:0,renderShell(){pe.innerHTML=`
      <header class="bg-white rounded-xl p-4 shadow-sm border border-border flex items-center justify-between gap-3 mb-4">
        <div class="flex-grow">
          <h1 id="main-title" class="font-bold">Gestión Delivery</h1>
          <p class="text-sm text-gray-500">JavicSoftCode · Back-End Developer</p>
        </div>
        <div id="header-extra" class="flex-shrink-0 flex items-center justify-center h-12 w-14 translate-x-2">
          <!-- El contador o botón de archivar se renderizará aquí -->
        </div>
      </header>
      <main id="mainArea"></main>
      <nav id="bottomNav" class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-border safe-bottom p-2 md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:rounded-full md:px-2 md:py-1 md:w-auto flex items-center justify-between gap-2" role="navigation" aria-label="Navegación principal">
  <button data-screen="dashboard" class="nav-item flex-1 md:w-auto flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg" aria-label="Dashboard">
    <i class="fa fa-chart-simple text-2xl" aria-hidden="true"></i>
    <span class="text-sm font-semibold">Dashboard</span>
  </button>
  <button data-screen="clients" class="nav-item flex-1 md:w-auto flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg" aria-label="Clientes">
    <i class="fa fa-users text-2xl" aria-hidden="true"></i>
    <span class="text-sm font-semibold">Clientes</span>
  </button>
  <button data-screen="foods" class="nav-item flex-1 md:w-auto flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg" aria-label="Comidas">
    <i class="fa fa-bowl-food text-2xl" aria-hidden="true"></i>
    <span class="text-sm font-semibold">Comidas</span>
  </button>
  <button data-screen="settings" class="nav-item flex-1 md:w-auto flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg" aria-label="Ajustes">
    <i class="fa fa-gear text-2xl" aria-hidden="true"></i>
    <span class="text-sm font-semibold">Ajustes</span>
  </button>
</nav>

      <div id="modalRoot"></div>
      <div id="toastRoot" class="fixed right-4 bottom-24"></div>
    `,document.querySelectorAll("#bottomNav .nav-item").forEach(t=>{t.setAttribute("tabindex","0"),t.addEventListener("keydown",e=>{(e.key==="Enter"||e.key===" ")&&(e.currentTarget.click(),e.preventDefault())})})},toast(t){const e=document.getElementById("toastRoot");e.innerHTML=`<div class="toast bg-gray-900 text-white rounded-lg p-3 shadow">${t}</div>`,d.toastTimer&&window.clearTimeout(d.toastTimer),d.toastTimer=window.setTimeout(()=>{e.innerHTML=""},3500)},modal(t,e={}){const{closeOnBackdropClick:s=!0}=e,a=document.getElementById("modalRoot"),r=document.createElement("div");r.className="modal-instance";const o=20+a.children.length*10;r.innerHTML=`
      <div class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center p-4" style="z-index: ${o};">
        <div class="modal-content bg-white rounded-xl w-full max-w-xl p-4 shadow-lg relative
            -mt-[80px] sm:-mt-[60px] md:-mt-[80px] lg:-mt-[100px]">
          ${t}
        </div>
      </div>
    `,a.appendChild(r);const n=()=>{r.parentNode&&r.parentNode.removeChild(r)};if(s){const i=r.querySelector(".modal-backdrop");i==null||i.addEventListener("click",l=>{l.target===i&&n()})}return{close:n,element:r}},confirm(t,e){const{close:s,element:a}=d.modal(`<div>
        <p class="text-gray-700">${t}</p>
        <div class="mt-4 flex justify-end gap-2">
          <button class="confirm-no-btn px-4 py-2 rounded-lg border">No</button>
          <button class="confirm-yes-btn px-4 py-2 rounded-lg bg-accent text-white">Sí</button>
        </div>
      </div>`,{closeOnBackdropClick:!1}),r=a.querySelector(".confirm-no-btn"),o=a.querySelector(".confirm-yes-btn");r==null||r.addEventListener("click",s),o==null||o.addEventListener("click",()=>{s(),e()})},updateTitle(t){const e=document.getElementById("main-title");let s="Gestión Delivery";t==="clients"?s+=" -- Clientes":t==="foods"?s+=" -- Comidas":t==="settings"&&(s+=" -- Ajustes"),e.textContent=s},updateHeaderContent(t){const e=document.getElementById("header-extra");e&&(e.innerHTML=t)},renderNavActive(t="dashboard"){document.querySelectorAll("#bottomNav .nav-item").forEach(e=>{const a=e.dataset.screen===t;e.classList.toggle("bg-accent",a),e.classList.toggle("text-white",a),e.classList.toggle("shadow-lg",a),a?e.setAttribute("aria-current","page"):e.removeAttribute("aria-current")})}},xe="fd_meta_v1",ye="fd_foods_v1",he="fd_orders_v1",we="fd_audit_v1",Se="fd_food_sale_records_v1",E={read(t){try{const e=localStorage.getItem(t);return e?JSON.parse(e):null}catch(e){return console.warn("Storage.read error",e),null}},write(t,e){try{return localStorage.setItem(t,JSON.stringify(e)),!0}catch(s){return console.error("Storage.write failed",s),!1}},keys:{KEY_META:xe,KEY_FOODS:ye,KEY_ORDERS:he,KEY_AUDIT:we,KEY_FOOD_SALE_RECORDS:Se}},X=(t="")=>t+Math.random().toString(36).slice(2,9),ue=()=>Date.now(),P=t=>(t||"").toString().trim(),S=t=>"$ "+Number(t||0).toFixed(2),ke=(t,e=300)=>{let s;return(...a)=>{s&&window.clearTimeout(s),s=window.setTimeout(()=>t(...a),e)}},oe=t=>{const e=(t||"").toString();let s="";if(e.startsWith("+")){const a=e.substring(1);if(a.startsWith("593")){const r=a.substring(3);if(r.startsWith(" ")){const o=r.substring(1);let n="+593 ",i=0;for(let l=0;l<o.length&&i<9;l++){const c=o[l];/[0-9]/.test(c)&&((i===2||i===5)&&(n+=" "),n+=c,i++)}s=n}else s="+593"+r.replace(/[^0-9]/g,"")}else s="+"+a.replace(/[^0-9]/g,"")}else s=e.replace(/[^0-9]/g,"");return s.startsWith("09")?s.length>10&&(s=s.substring(0,10)):s.startsWith("+593 9")?s.length>16&&(s=s.substring(0,16)):s.startsWith("+593")&&s.length>13&&(s=s.substring(0,13)),s},$e=t=>{const e=(t||"").toString().trim();if(!e||e.length<2)return null;const s=e.replace(/\s/g,"");return s.startsWith("09")||s.startsWith("+5939")?null:"Formato válido: '09xxxxxxxx' o '+5939xxxxxxxx'"},U=t=>!!(/^09\d{8}$/.test(t)||/^\+5939\d{8}$/.test(t)||/^\+593 9\d \d{3} \d{4}$/.test(t)),le=t=>{if(!t)return"";const e=t.replace(/\s/g,"");return e.startsWith("09")&&e.length===10?`+593${e.substring(1)}`:e.startsWith("+5939")&&e.length===13?e:""},ne=t=>t?t.toString().replace(/\D/g,""):"";function Le(t){const e=t.replace(/\D/g,"");if(e.startsWith("0")){const s=e.substring(1);if(s.length===9)return`+593${s.substring(0,2)}${s.substring(2,5)}${s.substring(5)}`}if(e.startsWith("593")){const s=e.substring(3);if(s.length===9)return`+593${s.substring(0,2)}${s.substring(2,5)}${s.substring(5)}`}return t}function Te(t){return new Date(t).toLocaleTimeString("es-EC",{hour:"2-digit",minute:"2-digit",hour12:!0}).replace("AM","a. m.").replace("PM","p. m.")}function K(t){if(!t||!t.includes(":"))return t;const[e,s]=t.split(":");let a=parseInt(e,10);const r=a>=12?"p.m.":"a.m.";return a=a%12,a=a||12,`${a<10?"0"+a:a.toString()}:${s} ${r}`}const de=E.keys.KEY_FOODS,ce=E.keys.KEY_FOOD_SALE_RECORDS,x={getAll(){return E.read(ce)||[]},saveAll(t){E.write(ce,t)},add(t){const e={id:X("record_"),...t},s=this.getAll();return s.push(e),this.saveAll(s),e},update(t){const e=this.getAll().map(s=>s.id===t.id?{...s,...t}:s);this.saveAll(e)},findByFoodId(t){return this.getAll().filter(e=>e.foodId===t).sort((e,s)=>{const a=new Date(s.recordDate).getTime()-new Date(e.recordDate).getTime();return a!==0?a:s.id.localeCompare(e.id)})},findLatestActiveByFoodId(t){return this.findByFoodId(t).find(e=>e.isActive)}},y={getAll(){return E.read(de)||[]},saveAll(t){E.write(de,t)},add(t,e){const s={id:X("food_"),amountSold:0,createdAt:ue(),isActive:!0,...t},a=this.getAll();a.push(s),this.saveAll(a);const r=new Date().toISOString().slice(0,10);return x.add({foodId:s.id,recordDate:r,startTime:e.startTime,endTime:e.endTime,initialStock:s.stock,unitPrice:s.price,unitCost:s.cost,quantitySold:0,isActive:!0}),console.log("Food created",{id:s.id,name:s.name}),s},update(t,e){const s=this.findById(t.id);if(!s)return;const a=new Date().toISOString().slice(0,10),r=x.findLatestActiveByFoodId(t.id),o=Math.abs(t.price-s.price)>.001||Math.abs(t.cost-s.cost)>.001;if(t.isActive&&o)r&&r.recordDate===a&&(r.isActive=!1,x.update(r)),t.amountSold=0,x.add({foodId:t.id,recordDate:a,startTime:(e==null?void 0:e.startTime)||"08:00",endTime:(e==null?void 0:e.endTime)||"23:00",initialStock:t.stock,unitPrice:t.price,unitCost:t.cost,quantitySold:0,isActive:!0});else if(t.isActive&&!s.isActive){const i=x.findByFoodId(t.id).find(l=>l.recordDate===a);i&&!o?(i.isActive=!0,t.stock>s.stock&&(i.initialStock+=t.stock-s.stock),e!=null&&e.startTime&&(i.startTime=e.startTime),e!=null&&e.endTime&&(i.endTime=e.endTime),x.update(i)):(t.amountSold=0,x.add({foodId:t.id,recordDate:a,startTime:(e==null?void 0:e.startTime)||"08:00",endTime:(e==null?void 0:e.endTime)||"23:00",initialStock:t.stock,unitPrice:t.price,unitCost:t.cost,quantitySold:0,isActive:!0}))}else if(!t.isActive&&s.isActive)r&&(r.isActive=!1,x.update(r));else if(t.isActive&&r){if(t.stock>s.stock){const i=t.stock-s.stock;r.initialStock+=i}e!=null&&e.startTime&&(r.startTime=e.startTime),e!=null&&e.endTime&&(r.endTime=e.endTime),x.update(r)}const n=this.getAll().map(i=>i.id===t.id?{...i,...t}:i);this.saveAll(n),console.log("Food updated",{id:t.id,name:t.name})},findById(t){return this.getAll().find(e=>e.id===t)},nameExists(t,e){const s=t.trim().toLowerCase();return this.getAll().some(a=>a.id!==e&&a.name.trim().toLowerCase()===s)},totalProfit(){return this.getAll().reduce((t,e)=>t+(e.amountSold||0)*((e.price||0)-(e.cost||0)),0)},decreaseStock(t,e){const s=this.getAll(),a=s.findIndex(r=>r.id===t);if(a>-1){s[a].stock=Math.max(0,s[a].stock-e),s[a].amountSold+=e,this.saveAll(s);const r=x.findLatestActiveByFoodId(t);r&&(r.quantitySold+=e,x.update(r))}},increaseStock(t,e){const s=this.getAll(),a=s.findIndex(r=>r.id===t);if(a>-1){s[a].stock+=e,s[a].amountSold=Math.max(0,s[a].amountSold-e),this.saveAll(s);const r=x.findLatestActiveByFoodId(t);r&&(r.quantitySold=Math.max(0,r.quantitySold-e),x.update(r))}}},fe=E.keys.KEY_ORDERS,k={_internalGetAll(){return E.read(fe)||[]},getAll(){return this._internalGetAll().filter(t=>t.state!==!1)},saveAll(t){E.write(fe,t)},add(t){const e=x.findLatestActiveByFoodId(t.foodId);if(e){const r=new Date(t.deliveryTime),[o,n]=[r.getHours(),r.getMinutes()],i=o*60+n,[l,c]=e.startTime.split(":").map(Number),m=l*60+c,[f,u]=e.endTime.split(":").map(Number),p=f*60+u;if(i<m||i>p)return d.toast(`Pedido fuera de horario. Disponible de ${e.startTime} a ${e.endTime}.`),null}else return d.toast("La comida no está disponible para la venta en este momento."),null;const s={id:X("order_"),createdAt:ue(),delivered:!1,deliveredAt:null,state:!0,...t},a=this._internalGetAll();return a.push(s),this.saveAll(a),s},update(t){const e=this._internalGetAll(),s=e.find(o=>o.id===t.id),a=x.findLatestActiveByFoodId(t.foodId);if(a){const o=new Date(t.deliveryTime),[n,i]=[o.getHours(),o.getMinutes()],l=n*60+i,[c,m]=a.startTime.split(":").map(Number),f=c*60+m,[u,p]=a.endTime.split(":").map(Number),L=u*60+p;if(l<f||l>L)return d.toast(`Pedido fuera de horario. Disponible de ${a.startTime} a ${a.endTime}.`),!1}else if((s==null?void 0:s.foodId)!==t.foodId)return d.toast("La nueva comida seleccionada no está disponible para la venta."),!1;if(s){if(s.delivered!==t.delivered)t.delivered?y.decreaseStock(t.foodId,t.quantity):y.increaseStock(t.foodId,t.quantity);else if(s.delivered&&t.delivered)if(s.foodId!==t.foodId)y.increaseStock(s.foodId,s.quantity),y.decreaseStock(t.foodId,t.quantity);else{const o=t.quantity-s.quantity;o>0?y.decreaseStock(t.foodId,o):o<0&&y.increaseStock(t.foodId,Math.abs(o))}}const r=e.map(o=>o.id===t.id?{...o,...t}:o);return this.saveAll(r),!0},archiveDeliveredOrders(){const t=this._internalGetAll().map(e=>e.delivered?{...e,state:!1}:e);this.saveAll(t),d.toast("Pedidos entregados archivados.")},isFoodInActiveOrder(t){return this.getAll().some(e=>e.foodId===t)},getSorted(){const t=this.getAll(),e=t.filter(a=>!a.delivered),s=t.filter(a=>a.delivered);return e.sort((a,r)=>new Date(a.deliveryTime).getTime()-new Date(r.deliveryTime).getTime()),s.sort((a,r)=>a.deliveredAt&&r.deliveredAt?new Date(a.deliveredAt).getTime()-new Date(r.deliveredAt).getTime():-1),[...e,...s]},findById(t){return this.getAll().find(e=>e.id===t)},checkConflict(t,e,s,a){const r=Math.abs(s)*60*1e3,o=new Date(t).getTime(),n=this.getAll().filter(i=>i.id!==a);for(const i of n)if(Math.abs(o-new Date(i.deliveryTime).getTime())<r)return{conflict:!0,other:i};return{conflict:!1}}};function me(t){const e=Le(t),s=`<div class="relative">
    <button id="closeCall" class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-55 z-10"><i class="fa fa-times text-lg"></i></button>
    <div class="text-center">
      <h3 class="text-lg font-semibold mb-4">Contactar Cliente <i class="fa fa-user"></i></h3>
      <div class="flex gap-3 justify-center">
        <button id="callPhone" class="flex flex-col items-center gap-2 p-4 border-2 rounded-lg hover:bg-gray-75">
          <i class="fa-solid fa-phone-volume text-3xl text-blue-600"></i><span class="text-sm">Teléfono</span>
        </button>
        <button id="callWhatsApp" class="flex flex-col items-center gap-2 p-4 border-2 rounded-lg hover:bg-gray-75">
          <i class="fab fa-whatsapp text-4xl text-green-600"></i><span class="text-sm">WhatsApp</span>
        </button>
      </div>
    </div>
  </div>`,{close:a,element:r}=d.modal(s,{closeOnBackdropClick:!1});r.querySelector("#closeCall").addEventListener("click",a),r.querySelector("#callPhone").addEventListener("click",()=>{window.open(`tel:${t}`),a()}),r.querySelector("#callWhatsApp").addEventListener("click",()=>{window.open(`https://wa.me/${e.replace(/\s/g,"")}`),a()})}function Ae(t,e){const s=k.findById(t);if(!s){d.toast("Pedido no encontrado");return}const a=y.findById(s.foodId),r=(a==null?void 0:a.price)||0,o=r*s.quantity,n=`<button id="closeDetails" class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 z-20"><i class="fa fa-times text-lg"></i></button>
    <div class="relative max-h-[75vh] overflow-y-auto">
      <div class="pr-8 p-4">
        <h3 class="text-xl font-bold mb-4 text-center">Detalles del Pedido <i class="fa-solid fa-file-invoice-dollar fa-lg"></i></h3>
        <div class="space-y-4">
          <div class="border-b pb-2">
            <label class="text-base text-gray-500 font-bold">Cliente:</label>
            <div class="text-gray-800">${s.fullName}</div>
          </div>
          <div class="border-b pb-2">
            <label class="text-base text-gray-500 font-bold">Hora de entrega:</label>
            <div class="text-gray-800">${Te(s.deliveryTime)}</div>
          </div>
          <div class="border-b pb-2">
            <label class="text-base text-gray-500 font-bold">Dirección:</label>
            <div class="text-gray-800">${s.deliveryAddress}</div>
          </div>
          <div class="border-b pb-2">
            <label class="text-base text-gray-500 font-bold">Comida:</label>
            <div class="text-gray-800">${(a==null?void 0:a.name)||"No encontrado"}</div>
          </div>
          <div class="grid grid-cols-2 gap-4 border-b pb-2">
            <div>
              <label class="text-base text-gray-500 font-bold">Cantidad:</label>
              <div class="text-gray-800">${s.quantity}</div>
            </div>
            <div>
              <label class="text-base text-gray-500 font-bold">Combo:</label>
              <div class="text-gray-800">${s.combo?"Sí":"No"}</div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 border-b pb-2">
            <div>
              <label class="text-base text-gray-500 font-bold">P. unitario:</label>
              <div class="text-gray-800">${S(r)}</div>
            </div>
            <div>
              <label class="text-base text-gray-500 font-bold">Total:</label>
              <div class="font-bold text-lg text-green-600">${S(o)}</div>
            </div>
          </div>
        </div>
        <div class="flex justify-between items-center mt-4 gap-4">
          <button id="callFromDetails" data-phone="${s.phone}" class="flex items-center gap-2 px-4 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50">
            <i class="fa fa-phone"></i><span class="font-bold">Llamar</span>
          </button>
          <div class="flex items-center gap-2">
            <span class="text-base text-gray-500 font-bold">Entregado:</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input id="detailsToggle" data-id="${s.id}" type="checkbox" ${s.delivered?"checked":""} class="sr-only">
              <div id="toggleBg" class="toggle-bg-details w-11 h-6 ${s.delivered?"bg-green-600":"bg-red-500"} rounded-full relative">
                <div id="toggleDot" class="toggle-dot-details absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${s.delivered?"translate-x-5":"translate-x-0"}"></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>`,{close:i,element:l}=d.modal(n,{closeOnBackdropClick:!1});l.querySelector("#closeDetails").addEventListener("click",i),l.querySelector("#callFromDetails").addEventListener("click",f=>me(f.currentTarget.dataset.phone));const c=l.querySelector("#detailsToggle"),m=f=>{const u=l.querySelector("#toggleBg"),p=l.querySelector("#toggleDot");u.className=`toggle-bg-details w-11 h-6 ${f?"bg-green-600":"bg-red-500"} rounded-full relative`,p.className=`toggle-dot-details absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${f?"translate-x-5":"translate-x-0"}`};c.addEventListener("change",()=>{const f=k.findById(t);f&&ge(f,c,m,()=>{e()})})}function Ee(t){var n,i;const e=y.getAll(),s=k.getSorted().filter(l=>l.state),a=s.filter(l=>!l.delivered).length,r=s.filter(l=>l.delivered).length,o=y.totalProfit();t.innerHTML=`<section class="space-y-4">
    <div class="grid grid-cols-2 gap-3">
      <div class="p-3 bg-white rounded-xl border border-border shadow">
        <div class="text-sm text-gray-500">Pedidos pendientes</div>
        <div class="text-2xl font-semibold">${a}</div>
      </div>
      <div class="p-3 bg-white rounded-xl border border-border shadow">
        <div class="text-sm text-gray-500">Entregas realizadas</div>
        <div class="text-2xl font-semibold">${r}</div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="p-3 bg-white rounded-xl border border-border shadow">
        <div class="text-sm text-gray-500">Variedades</div>
        <div class="text-xl font-semibold">${e.length}</div>
      </div>
      <div class="p-3 bg-white rounded-xl border border-border shadow">
        <div class="text-sm text-gray-500">Beneficio total</div>
        <div class="text-xl font-semibold">${S(o)}</div>
      </div>
    </div>
    <div class="flex gap-2">
      <button id="btnAddOrderQuick" class="flex-1 px-3 py-2 bg-accent text-white rounded-lg">Nuevo pedido</button>
      <button id="btnAddFoodQuick" class="flex-1 px-3 py-2 border rounded-lg">Nueva comida</button>
    </div>
  </section>`,(n=t.querySelector("#btnAddOrderQuick"))==null||n.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("openOrderForm"))}),(i=t.querySelector("#btnAddFoodQuick"))==null||i.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("openFoodForm"))})}function Ce(t,e,s){const a=`<div class="relative max-h-[90vh] overflow-y-auto">
  <button id="closeRecordDetails" class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 z-20">
    <i class="fa fa-times text-lg"></i>
  </button>
  <div class="pr-8 p-4">
    <button id="backToHistoryList" class="text-sm text-accent hover:underline mb-4 flex items-center gap-2">
      <i class="fa fa-arrow-left"></i>Volver a la lista
    </button>
    <h3 class="text-2xl font-bold mb-4 text-center">Detalles ${t.recordDate}</h3>
    <div class="space-y-4">

      <div class="border-b pb-2">
        <label class="flex items-center gap-2 text-lg text-gray-600 font-semibold">
          <i class="fa fa-bowl-food"></i> Comida:
        </label>
        <div class="text-gray-900 text-lg">${e.name}</div>
      </div>

      <div class="border-b pb-2">
        <label class="flex items-center gap-2 text-lg text-gray-600 font-semibold">
          <i class="fa fa-clock"></i> Horario:
        </label>
        <div class="text-gray-900 text-lg">${K(t.startTime)} - ${K(t.endTime)}</div>
      </div>

      <div class="grid grid-cols-3 gap-4 border-b pb-2">
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 font-semibold">
            <i class="fa-solid fa-boxes-stacked"></i> Stock:
          </label>
          <div class="text-gray-900 text-lg flex items-center justify-center h-full -mt-2">${t.initialStock}</div>
        </div>
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 font-semibold">
            <i class="fa fa-shopping-cart"></i> Vend.:
          </label>
          <div class="text-gray-900 text-lg flex items-center justify-center h-full -mt-2">${t.quantitySold}</div>
        </div>
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 font-semibold">
            <i class="fa-solid fa-boxes-stacked"></i> Resto:
          </label>
          <div class="text-gray-900 text-lg flex items-center justify-center h-full -mt-2">${t.initialStock-t.quantitySold}</div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4 border-b pb-2">
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 font-semibold">
            <i class="fa fa-dollar-sign"></i> Precio:
          </label>
          <div class="text-gray-900 text-lg flex items-center justify-center h-full -mt-2">${S(t.unitPrice)}</div>
        </div>
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 font-semibold">
            <i class="fa fa-money-bill"></i> Costo:
          </label>
          <div class="text-gray-900 text-lg flex items-center justify-center h-full -mt-2">${S(t.unitCost)}</div>
        </div>
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 font-semibold">
            <i class="fa fa-chart-line"></i> Lucro:
          </label>
          <div class="font-bold text-blue-700 text-lg flex items-center justify-center h-full -mt-2">${S(t.unitPrice-t.unitCost)}</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 border-b pb-2">
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 font-semibold">
            <i class="fa fa-piggy-bank"></i> Lucro T.:
          </label>
          <div class="font-bold text-blue-700 text-xl flex h-full -mt-1">${S((t.unitPrice-t.unitCost)*t.quantitySold)}</div>
        </div>
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 font-semibold">
            <i class="fa fa-coins"></i> Total:
          </label>
          <div class="font-bold text-green-700 text-xl flex h-full -mt-1">${S(t.quantitySold*t.unitPrice)}</div>
        </div>
      </div>

    </div>
  </div>
</div>`,{close:r,element:o}=d.modal(a,{closeOnBackdropClick:!1});o.querySelector("#closeRecordDetails").addEventListener("click",r),o.querySelector("#backToHistoryList").addEventListener("click",()=>{r(),s()})}function Ie(t){const e=y.findById(t);if(!e){d.toast("Comida no encontrada");return}const s=x.findByFoodId(t);let a=null;const r=()=>{let o;s.length===0?o='<div class="text-gray-500 text-center py-8 flex flex-col items-center gap-2"><i class="fa fa-inbox text-3xl opacity-50"></i><p>No hay historial de ventas para esta comida.</p></div>':o=`<div class="bg-white rounded-lg border divide-y">${s.map(l=>{const c=l.quantitySold*l.unitPrice;return`
            <div class="border-b last:border-b-0">
              <button data-record-id="${l.id}" class="w-full text-left p-3 hover:bg-gray-50 record-detail-btn transition-colors">
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-3">
                    <div class="w-2 h-2 rounded-full ${l.isActive?"bg-green-500":"bg-gray-400"}"></div>
                    <div>
                      <div class="font-medium text-gray-900">
                        <i class="fa fa-calendar-day mr-2 text-gray-400"></i>
                        ${l.recordDate}
                      </div>
                      <div class="text-sm text-gray-500">
                        ${K(l.startTime)} - ${K(l.endTime)}
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold text-gray-900">
                      Vendidos: <span class="text-gray-600">${l.quantitySold}</span>
                    </div>
                    <div class="text-sm text-green-600">
                      ${S(c)}
                    </div>
                  </div>
                </div>
              </button>
            </div>`}).join("")}</div>`;const n=`
      <div class="relative max-h-[80vh] overflow-y-auto">
        <button id="closeHistoryModal" class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 z-20">
          <i class="fa fa-times text-lg"></i>
        </button>
        <div class="pr-8 p-4">
          <h3 class="text-xl font-bold mb-4 text-center">
            <i class="fa fa-history mr-2"></i>Historial: ${e.name}
          </h3>
          <div class="max-h-96 overflow-y-auto">
            ${o}
          </div>
        </div>
      </div>`;a=d.modal(n,{closeOnBackdropClick:!1}),a.element.querySelector("#closeHistoryModal").addEventListener("click",a.close),a.element.querySelectorAll(".record-detail-btn").forEach(i=>{i.addEventListener("click",l=>{const c=l.currentTarget.dataset.recordId,m=s.find(u=>u.id===c),f=a.close;f(),Ce(m,e,r)})})};r()}function qe(t){var o;t.innerHTML=`<div class="bg-white rounded-xl p-3 border space-y-3 mb-20">
    <div class="flex gap-2 items-center">
      <input id="inputFilterFood" placeholder="Buscar por comida..." class="flex-1 px-3 py-2 border rounded-lg" />
      <button id="btnAddFood" class="px-3 py-2 bg-accent text-white rounded-lg hover:bg-green-600 transition-colors">
        <i class="fa-solid fa-plus fa-lg"></i>
      </button>
    </div>
    <div id="foodsList" class="space-y-3"></div>
  </div>`;const e=t.querySelector("#inputFilterFood"),s=t.querySelector("#foodsList");function a(){const n=y.getAll(),i=P(e.value).toLowerCase(),l=i?n.filter(c=>P(c.name).toLowerCase().includes(i)):n;r(l)}const r=n=>{if(s.innerHTML="",n.length===0){s.innerHTML=`
        <div class="text-gray-500 text-center py-8">
          <i class="fa fa-bowl-food text-4xl mb-2 opacity-50"></i>
          <p>Sin resultados.</p>
        </div>`;return}n.forEach(i=>{const l=document.createElement("div");l.className=`p-3 bg-gray-50 rounded-lg border hover:shadow-sm transition-shadow ${i.isActive?"":"opacity-60"}`,l.innerHTML=`
        <div class="flex items-center justify-between mb-2">
          <div class="font-semibold text-xl">${i.name}</div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${i.isActive?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}">
              <i class="fa ${i.isActive?"fa-check-circle":"fa-times-circle"} mr-1 text-base"></i>
              ${i.isActive?"Activo":"Inactivo"}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-lg text-gray-600 mb-3">
          <div class="flex items-center gap-1">
            <i class="fa-solid fa-shopping-cart text-blue-500 text-2xl"></i>
            <span class="font-semibold"><strong>${i.amountSold||0}</strong></span>
          </div>
          <div class="flex items-center gap-1">
            <i class="fa-solid fa-boxes-stacked text-orange-500 text-2xl"></i>
            <span class="font-semibold"><strong>${i.stock}</strong></span>
          </div>
          <div class="flex items-center gap-1">
            <i class="fa-solid fa-dollar-sign text-green-500 text-2xl"></i>
            <span class="font-semibold"><strong>${S(i.price)}</strong></span>
          </div>
        </div>
        <div class="flex gap-2">
          <button data-id="${i.id}" class="salesHistoryBtn flex-1 px-1 py-1 bg-blue-500 text-white rounded flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors font-semibold">
            <i class="fa fa-history text-lg"></i>
            Historial
          </button>
          <button data-id="${i.id}" class="editFood flex-1 px-1 py-1 bg-yellow-500 text-white rounded flex items-center justify-center gap-2 hover:bg-yellow-600 transition-colors font-semibold">
            <i class="fa-solid fa-store text-lg"></i>
            Venta
          </button>
        </div>`,s.appendChild(l)}),s.querySelectorAll(".editFood").forEach(i=>{i.addEventListener("click",l=>{document.dispatchEvent(new CustomEvent("openFoodForm",{detail:{id:l.currentTarget.dataset.id}}))})}),s.querySelectorAll(".salesHistoryBtn").forEach(i=>{i.addEventListener("click",l=>{const c=l.currentTarget.dataset.id;Ie(c)})})};e.addEventListener("input",a),(o=t.querySelector("#btnAddFood"))==null||o.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("openFoodForm"))}),document.addEventListener("refreshViews",a),a()}function Fe(t){const e=localStorage.getItem("fd_meta_v1")||"{}";let s={};try{s=JSON.parse(e)||{}}catch{s={}}const a=s.deliveryGapMinutes??15,r=!!s.darkMode;t.innerHTML=`
    <div class="bg-white rounded-xl p-4 border space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-16 h-12 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-50 flex items-center justify-center text-yellow-600 shadow-sm">
          <i class="fa fa-gear text-2xl"></i>
        </div>
        <div>
          <h2 class="text-lg font-semibold">Ajustes</h2>
          <p class="text-sm text-gray-500">Personaliza la configuración del sistema.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <!-- Sección Intervalo -->
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl">
              <i class="fa-solid fa-clock fa-lg"></i>
            </div>
            <div>
              <div class="text-lg font-medium">Intervalo</div>
              <div class="text-sm text-gray-500">De entrega</div>
            </div>
          </div>
          <div>
            <input id="inputGap" type="number" min="0" value="${a}" 
                   class="px-3 py-2 border rounded-lg w-20 text-center" />
          </div>
        </div>

        <!-- Sección Modo Oscuro -->
        <div class="flex items-center justify-between md:justify-end gap-3">
          <div class="flex items-center gap-3">
            <div id="themeIcon" class="w-10 h-10 rounded-full flex items-center justify-center text-xl">
              <i class="${r?"fa fa-moon fa-lg":"fa fa-sun fa-lg"}"></i>
            </div>
            <div>
              <div class="text-lg font-medium">Modo</div>
              <div class="text-sm text-gray-500">Oscuro o Claro</div>
            </div>
          </div>

          <div>
            <button id="themeToggle" aria-pressed="${r}" title="${r?"Desactivar modo oscuro":"Activar modo oscuro"}" class="toggle-btn inline-flex items-center gap-2 px-3 py-2 rounded-full border">
              <span id="sunIcon" class="text-yellow-500 ${r?"opacity-40":"opacity-100"}"><i class="fa fa-sun fa-lg"></i></span>
              <span id="slider" class="w-10 h-6 rounded-full flex items-center p-1 ${r?"justify-end bg-gray-700":"justify-start bg-gray-200"}">
                <span id="dot" class="w-4 h-4 bg-white rounded-full shadow"></span>
              </span>
              <span id="moonIcon" class="text-indigo-600 ${r?"opacity-100":"opacity-40"}"><i class="fa fa-moon fa-lg"></i></span>
            </button>
          </div>
        </div>
      </div>

      <!--<div class="flex justify-end gap-2 pt-2">
        <button id="btnClearAudit" class="px-3 py-2 border rounded">Limpiar logs</button>
      </div>-->
    </div>
  `;const o=t.querySelector("#inputGap"),n=t.querySelector("#themeToggle"),i=t.querySelector("#themeIcon"),l=t.querySelector("#sunIcon"),c=t.querySelector("#moonIcon"),m=t.querySelector("#slider"),f=t.querySelector("#dot"),u=t.querySelector("#btnClearAudit"),p=w=>{w?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark"),i&&(i.innerHTML=`<i class="${w?"fa-solid fa-cloud-moon fa-lg":"fa-solid fa-cloud-sun fa-lg"}"></i>`),l&&(l.style.opacity=w?"0.4":"1"),c&&(c.style.opacity=w?"1":"0.4"),m&&(m.className=`w-10 h-6 rounded-full flex items-center p-1 ${w?"justify-end bg-gray-700":"justify-start bg-gray-200"}`),f&&(f.style.transform="translateX(0)");const b=localStorage.getItem("fd_meta_v1")||"{}";let v={};try{v=JSON.parse(b)||{}}catch{v={}}v.darkMode=!!w,localStorage.setItem("fd_meta_v1",JSON.stringify(v))},L=w=>{const b=Number(w.currentTarget.value||0),v=localStorage.getItem("fd_meta_v1")||"{}";let $={};try{$=JSON.parse(v)||{}}catch{$={}}$.deliveryGapMinutes=b,localStorage.setItem("fd_meta_v1",JSON.stringify($)),d.toast("Brecha actualizada")},A=()=>{const b=!!!JSON.parse(localStorage.getItem("fd_meta_v1")||"{}").darkMode;p(b),d.toast(`Modo ${b?"oscuro":"claro"} activado`),Y()},C=()=>{localStorage.removeItem("fd_audit_v1"),d.toast("Logs limpiados")};o==null||o.addEventListener("change",L),n==null||n.addEventListener("click",A),u==null||u.addEventListener("click",C),p(r)}function ge(t,e,s,a){e.checked?(e.checked=!1,s(!1),d.confirm(`🟢 Quiere confirmar la entrega al Cliente <strong>${t.fullName}</strong> ❓ <br> ✅ Perteneciente al teléfono <strong>${t.phone}</strong>`,()=>{const o={...t,delivered:!0,deliveredAt:new Date().toISOString()};k.update(o),d.toast("Pedido marcado como entregado"),Y(),e.checked=!0,s(!0),a()})):(e.checked=!0,s(!0),d.confirm(`🔴 Quiere revertir la entrega al Cliente <strong>${t.fullName}</strong> ❓ <br> Perteneciente al teléfono <strong>${t.phone}</strong> 〽️`,()=>{const o={...t,delivered:!1,deliveredAt:null};k.update(o),d.toast("Entrega revertida"),Y(),e.checked=!1,s(!1),a()}))}function De(t){var o;t.innerHTML='<div class="bg-white rounded-xl p-3 border space-y-3 mb-20"> <div class="flex gap-2 items-center"> <input id="inputFilterPhone" placeholder="Buscar por nombre o teléfono..." class="flex-1 px-3 py-2 border rounded-lg" inputmode="text" /> <button id="btnAddOrder" class="px-3 py-2 bg-accent text-white rounded-lg"><i class="fa-solid fa-plus fa-lg"></i></button> </div> <div id="ordersList" class="space-y-2"></div> </div>';const e=t.querySelector("#inputFilterPhone"),s=t.querySelector("#ordersList");function a(){const n=k.getSorted(),i=e.value.toLowerCase().trim();if(!i){r(n);return}const l=ne(i),c=n.filter(m=>{const f=P(m.fullName).toLowerCase().includes(i);let u=!1;return l.length>0&&(u=ne(m.phone).includes(l)),f||u});r(c)}const r=n=>{if(s.innerHTML="",!n.length){s.innerHTML=`
        <div class="text-gray-500 text-center py-8">
          <i class="fa-solid fa-bag-shopping text-4xl mb-2 opacity-50"></i>
          <p>Sin resultados o los últimos 9 dígitos telefónico.</p>
        </div>`;return}n.forEach(i=>{const l=document.createElement("div");l.className="p-3 bg-gray-50 rounded-lg border",l.innerHTML=`
        <div class="font-bold text-xl flex items-center"><i class="fa fa-user mr-2"></i> ${i.fullName}</div>
        <div class="text-base text-gray-600 mt-2 flex items-center">
        <i class="fa fa-clock mr-2"></i><span class="font-semibold">Hora de entrega:</span>&nbsp;${new Date(i.deliveryTime).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:!0}).replace("AM","a. m.").replace("PM","p. m.")}
        </div>
        <div class="text-base text-gray-600 mt-1 flex items-center">
        <i class="fa fa-mobile mr-2"></i><span class="font-semibold">Teléfono:</span> &nbsp;${i.phone}
        </div>
        <div class="flex items-center gap-2 justify-between mt-2">
        <div class="flex gap-5">
            <button data-phone="${i.phone}" class="callBtn p-2 text-gray-600 hover:text-blue-600 border-2 rounded">
            <i class="fa fa-phone fa-lg"></i>
            </button>
            <button data-id="${i.id}" class="viewOrder p-2 text-gray-600 hover:text-blue-600 border-2 rounded">
            <i class="fa fa-eye fa-lg"></i>
            </button>
            <button data-id="${i.id}" class="editOrder p-2 text-gray-600 hover:text-yellow-600 border-2 rounded">
            <i class="fa-solid fa-pencil fa-lg text-yellow-500 opacity-80"></i>
            </button>
        </div>
        <div class="flex items-center">
            <label class="relative inline-flex items-center cursor-pointer">
            <input data-id="${i.id}" type="checkbox" ${i.delivered?"checked":""} class="sr-only deliveredToggle">
            <div class="toggle-bg w-11 h-6 ${i.delivered?"bg-green-600":"bg-red-500"} rounded-full">
                <div class="toggle-dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${i.delivered?"translate-x-5":"translate-x-0"}"></div>
            </div>
            </label>
        </div>
        </div>
    `,s.appendChild(l)}),s.querySelectorAll(".deliveredToggle").forEach(i=>{i.addEventListener("change",l=>{const c=l.currentTarget,m=c.dataset.id,f=k.findById(m);f&&ge(f,c,p=>{const L=c.nextElementSibling,A=L.firstElementChild;L.className=`toggle-bg w-11 h-6 ${p?"bg-green-600":"bg-red-500"} rounded-full`,A.className=`toggle-dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${p?"translate-x-5":"translate-x-0"}`},a)})}),s.querySelectorAll(".callBtn").forEach(i=>i.addEventListener("click",l=>{me(l.currentTarget.dataset.phone)})),s.querySelectorAll(".viewOrder").forEach(i=>i.addEventListener("click",l=>{Ae(l.currentTarget.dataset.id,a)})),s.querySelectorAll(".editOrder").forEach(i=>i.addEventListener("click",l=>{document.dispatchEvent(new CustomEvent("openOrderForm",{detail:{id:l.currentTarget.dataset.id}}))}))};e.addEventListener("input",a),(o=t.querySelector("#btnAddOrder"))==null||o.addEventListener("click",()=>document.dispatchEvent(new CustomEvent("openOrderForm"))),a()}let T="dashboard",D,F=60;function Y(){D&&(clearInterval(D),D=void 0);const t=k.getAll(),e=t.filter(a=>!a.delivered).length,s=t.length-e;e>0?(d.updateHeaderContent(`<div class="pulse-animation bg-red-500 text-white text-base font-bold w-8 h-8 flex items-center justify-center rounded-full">${e}</div>`),F=60):s>0?Oe():(d.updateHeaderContent(""),F=60)}function Oe(){const t=()=>{const s='<button id="archive-btn" title="Archivar pedidos entregados" class="bg-red-500 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-600"><i class="fa fa-trash-can fa-lg"></i></button>';if(T==="clients"){d.updateHeaderContent(s);const a=document.getElementById("archive-btn");a&&a.addEventListener("click",()=>{d.confirm("¿Deseas archivar todos los pedidos ya entregados?",()=>{k.archiveDeliveredOrders(),_()})},{once:!0})}else d.updateHeaderContent("")},e=()=>{const s=Math.floor(F/60),a=F%60,r=`<div class="bg-gray-400 text-white text-sm font-mono w-12 h-8 flex items-center justify-center rounded-lg">${s}:${a.toString().padStart(2,"0")}</div>`;T==="clients"?d.updateHeaderContent(r):d.updateHeaderContent("")};if(F<=0){t();return}e(),D=window.setInterval(()=>{F--,F<=0?(D&&(clearInterval(D),D=void 0),t()):e()},1e3)}function _(){d.updateTitle(T),d.renderNavActive(T),Y();const t=document.getElementById("mainArea");t.innerHTML="";const e=document.createElement("div");t.appendChild(e),T==="dashboard"?Ee(e):T==="clients"?De(e):T==="foods"?qe(e):T==="settings"&&Fe(e)}function Me(){d.renderShell(),document.querySelectorAll("#bottomNav .nav-item").forEach(t=>{t.setAttribute("tabindex","0"),t.addEventListener("click",e=>{const s=e.currentTarget.dataset.screen;s&&s!==T&&(T=s,_())})}),document.addEventListener("openOrderForm",t=>{var s;const e=(s=t.detail)==null?void 0:s.id;Pe(e)}),document.addEventListener("openFoodForm",t=>{var s;const e=(s=t.detail)==null?void 0:s.id;je(e)}),document.addEventListener("openSalesHistory",t=>{var s;const e=(s=t.detail)==null?void 0:s.foodId;e&&Ne(e)}),_()}function He(t){return y.getAll().filter(s=>s.isActive||s.id===t).map(s=>`<option ${t===s.id?"selected":""} value="${s.id}" data-price="${s.price}">${s.name} (Stock: ${s.stock})</option>`).join("")}function Pe(t){const e=t?k.findById(t):null,s=He(e==null?void 0:e.foodId),a=e?new Date(e.deliveryTime).toTimeString().slice(0,5):"",r=`
  <div class="relative max-h-[70vh] overflow-y-auto">
    <div class="pr-8 text-center mb-6">
      <h3 class="text-xl font-bold inline-flex items-center gap-2 justify-center">
        ${e?"Editar pedido":"Agregar pedido"}
        <i class="fa-solid fa-file-invoice-dollar fa-lg"></i>
      </h3>
    </div>
    <form id="orderForm" class="space-y-4">
      <div class="pb-2">
        <label class="text-base text-gray-500 font-bold flex items-center gap-2">
          <i class="fa fa-user"></i>Nombre completo:
        </label>
        <input name="fullName" value="${(e==null?void 0:e.fullName)??""}" required
          class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1"
          placeholder="Ingresa el nombre completo" />
      </div>

      <div class="pb-2">
        <label class="text-base text-gray-500 font-bold flex items-center gap-2">
          <i class="fa fa-phone"></i> Teléfono:
        </label>
        <input name="phone" id="phoneInput" value="${(e==null?void 0:e.phone)??""}" required type="tel" inputmode="tel"
          placeholder="Formatos: 09xxxxxxxx, +593xxxxxxxxx"
          class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1" />
      </div>

      <div class="pb-2">
        <label class="text-base text-gray-500 font-bold flex items-center gap-2">
          <i class="fa fa-map-marker-alt"></i> Dirección de entrega:
        </label>
        <input name="deliveryAddress" value="${(e==null?void 0:e.deliveryAddress)??""}" required
          class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1"
          placeholder="Dirección completa" />
      </div>

      <div class="grid grid-cols-2 gap-4 pb-2">
        <div>
          <label class="text-base text-gray-500 font-bold flex items-center gap-2">
            <i class="fa fa-clock"></i>Hora:
          </label>
          <input name="deliveryTime" type="time" value="${a}" required
            class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1" />
        </div>
        <div class="flex items-end">
          <label class="flex items-center gap-2 cursor-pointer">
            <div class="relative">
              <input name="combo" id="comboCheckbox" type="checkbox" ${e!=null&&e.combo?"checked":""} class="sr-only" />
              <div class="combo-checkbox w-6 h-6 border-2 border-gray-400 rounded flex items-center justify-center transition-colors">
                <i class="fa fa-check text-white text-sm hidden"></i>
              </div>
            </div>
            <span class="text-base text-gray-500 font-bold flex items-center gap-2">
              <i class="fa fa-gift"></i> Combo
            </span>
          </label>
        </div>
      </div>

      <div class="pb-2">
        <label class="text-base text-gray-500 font-bold flex items-center gap-2">
          <i class="fa fa-utensils"></i> Comida:
        </label>
        <select name="foodId" id="foodSelect" class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1">
          <option value="">Seleccionar comida...</option>
          ${s}
        </select>
      </div>

      <div class="grid grid-cols-3 gap-4 pb-2">
        <!-- Cantidad -->
        <div class="text-center">
          <label class="text-base text-gray-500 font-bold flex items-center justify-center gap-2 mb-1">
            <i class="fa fa-sort-numeric-up"></i> Cantidad:
          </label>
          <input 
            name="quantity" 
            id="quantityInput" 
            type="number" 
            min="1" 
            value="${(e==null?void 0:e.quantity)??1}"
            class="w-full text-center text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1" 
          />
        </div>

        <!-- Unidad -->
        <div class="text-center">
          <label class="text-base text-gray-500 font-bold flex items-center justify-center gap-2 mb-1">
            <i class="fa fa-tag"></i> Unidad:
          </label>
          <div id="unitPrice" class="text-gray-800 text-lg font-semibold p-1 -mt-1">$0.00</div>
        </div>

        <!-- Total -->
        <div class="text-center">
          <label class="text-base text-gray-500 font-bold flex items-center justify-center gap-2 mb-1">
            <i class="fa fa-calculator"></i> Total:
          </label>
          <div id="totalPrice" class="font-bold text-2xl text-green-600 p-1 -mt-2">$0.00</div>
        </div>
      </div>

      <div class="flex justify-center gap-4 mt-6">
        <button type="button" id="cancelOrder" class="flex items-center gap-2 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-semibold text-lg">
          <i class="fa fa-times fa-lg"></i> Cancelar
        </button>
        <button type="submit" id="submitOrder" class="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors font-semibold text-lg">
          <i class="fa ${e?"fa-edit":"fa-plus"} fa-lg"></i> ${e?"Actualizar":"Agregar"}
        </button>
      </div>
    </form>
  </div>
`,{close:o,element:n}=d.modal(r,{closeOnBackdropClick:!1}),i=n.querySelector("#phoneInput"),l=n.querySelector("#foodSelect"),c=n.querySelector("#quantityInput"),m=n.querySelector("#comboCheckbox"),f=n.querySelector("#unitPrice"),u=n.querySelector("#totalPrice"),p=n.querySelector("#cancelOrder"),L=n.querySelector("#orderForm"),A=()=>{const g=n.querySelector(".combo-checkbox"),h=g.querySelector(".fa-check");m.checked?(g.classList.add("bg-accent","border-accent"),g.classList.remove("border-gray-400"),h.classList.remove("hidden")):(g.classList.remove("bg-accent","border-accent"),g.classList.add("border-gray-400"),h.classList.add("hidden"))},C=()=>{const g=l.selectedOptions[0],h=g?parseFloat(g.dataset.price||"0"):0,z=Math.max(1,parseInt(c.value||"1",10)),q=h*z;f.textContent=S(h),u.textContent=S(q)},w=g=>{const h=g.target;h.value=oe(h.value)},b=()=>{const g=i.value;g.length===0?(i.classList.remove("border-green-500","border-red-500"),i.classList.add("border-gray-300")):U(g)?(i.classList.remove("border-gray-300","border-red-500"),i.classList.add("border-green-500")):(i.classList.remove("border-green-500","border-red-500"),i.classList.add("border-gray-300"))},v=ke(()=>{const g=$e(i.value);g&&d.toast(g)},3e3),$=g=>{g.preventDefault();const h=new FormData(L),z=P(String(h.get("fullName")||"")),q=oe(String(h.get("phone")||"")),ee=P(String(h.get("deliveryAddress")||"")),J=String(h.get("foodId")||""),te=Math.max(1,Number(h.get("quantity"))||1),be=!!h.get("combo"),se=String(h.get("deliveryTime")||"");let Q="";try{const H=new Date,[V,ve]=se.split(":");H.setHours(parseInt(V,10),parseInt(ve,10),0,0),Q=H.toISOString()}catch{d.toast("Hora de entrega inválida.");return}if(!z||!q||!ee){d.toast("Completa todos los campos requeridos.");return}if(!U(q)){d.toast("El formato del teléfono es inválido."),i.focus(),i.classList.add("border-red-500");return}if(!J){d.toast("Selecciona una comida.");return}if(!se){d.toast("Selecciona una hora de entrega.");return}const W=y.findById(J);if(!W){d.toast("La comida seleccionada no fue encontrada.");return}if(W.stock<te){d.toast(`Stock insuficiente para "${W.name}". Stock actual: ${W.stock}.`);return}const ae=le(q);if(ae){const H=k.getAll().find(V=>e&&V.id===e.id?!1:le(V.phone)===ae);if(H){d.toast(`El teléfono ya está registrado para el cliente '${H.fullName}'.`),i.focus(),i.classList.add("border-red-500");return}}const ie=JSON.parse(localStorage.getItem("fd_meta_v1")||"{}").deliveryGapMinutes??15;if(k.checkConflict(Q,q,ie,e==null?void 0:e.id).conflict){d.toast(`Hay conflicto de horario (gap ${ie} min). Elige otra hora.`);return}const re={fullName:z,phone:q,deliveryAddress:ee,foodId:J,quantity:te,combo:be,deliveryTime:Q};let G=!1;e?(G=k.update({...e,...re}),G&&d.toast("Pedido actualizado exitosamente.")):k.add(re)&&(G=!0,d.toast("Pedido agregado exitosamente.")),G&&(I(),o(),_())},I=()=>{try{L.removeEventListener("submit",$)}catch{}try{p.removeEventListener("click",j)}catch{}try{i.removeEventListener("input",N)}catch{}try{i.removeEventListener("blur",O)}catch{}try{i.removeEventListener("focus",M)}catch{}try{l.removeEventListener("change",B)}catch{}try{c.removeEventListener("input",R)}catch{}try{m.removeEventListener("change",Z)}catch{}},j=()=>{I(),o()},N=g=>{w(g),b(),v()},O=()=>{const g=i.value;g.length>0&&!U(g)&&(i.classList.add("border-red-500"),i.classList.remove("border-gray-300","border-green-500"))},M=()=>{i.classList.contains("border-red-500")&&(i.classList.remove("border-red-500"),i.classList.add("border-gray-300"))},B=()=>C(),R=()=>C(),Z=()=>A();L.addEventListener("submit",$),p.addEventListener("click",j),i.addEventListener("input",N),i.addEventListener("blur",O),i.addEventListener("focus",M),l.addEventListener("change",B),c.addEventListener("input",R),m.addEventListener("change",Z),A(),C(),b()}function je(t){const e=t?y.findById(t):null,s=e?k.isFoodInActiveOrder(e.id):!1,a=e?x.findLatestActiveByFoodId(e.id):null,r=(a==null?void 0:a.startTime)||"08:00",o=(a==null?void 0:a.endTime)||"23:00";let n="";if(e){const b=s,v=b?"disabled":"",$=b?'title="No se puede desactivar: la comida está en un pedido activo."':"",I=b?"cursor-not-allowed opacity-60":"";n=`
      <div class="grid grid-cols-2 gap-4">
        <div class="pb-2">
          <label class="text-base text-gray-500 font-bold flex items-center gap-2">
            <i class="fa fa-sort-numeric-up"></i> Stock:
          </label>
          <input name="stock" type="number" min="0" value="${e.stock}" 
            class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1" />
        </div>
        <div class="flex items-end pb-2">
          <label class="flex items-center gap-2 cursor-pointer ${I}" ${$}>
            <div class="relative">
              <input name="isActive" type="checkbox" ${e.isActive?"checked":""} ${v} class="sr-only" />
              <div class="active-checkbox w-6 h-6 border-2 border-gray-400 rounded flex items-center justify-center transition-colors">
                <i class="fa fa-check text-white text-sm hidden"></i>
              </div>
            </div>
            <span class="text-base text-gray-500 font-bold flex items-center gap-2">
              <i class="fa fa-power-off"></i> Activo
            </span>
          </label>
        </div>
      </div>`}else n=`
      <div class="pb-2">
        <label class="text-base text-gray-500 font-bold flex items-center gap-2">
          <i class="fa fa-sort-numeric-up"></i> Stock inicial:
        </label>
        <input name="stock" type="number" min="0" value="0" 
          class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1" />
      </div>`;const i=`
  <div class="relative max-h-[70vh] overflow-y-auto">
    <div class="pr-8 text-center mb-6">
      <h3 class="text-xl font-bold inline-flex items-center gap-2 justify-center">
        ${e?"Editar Comida":"Agregar Comida"}
        <i class="fa-solid fa-utensils fa-lg"></i>
      </h3>
    </div>
    <form id="foodForm" class="space-y-4">
      <div class="pb-2">
        <label class="text-base text-gray-500 font-bold flex items-center gap-2">
          <i class="fa fa-tag"></i> Nombre:
        </label>
        <input name="name" value="${(e==null?void 0:e.name)??""}" required
          class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1"
          placeholder="Ingresa el nombre de la comida" />
      </div>

      <div class="grid grid-cols-2 gap-4 pb-2">
        <div>
          <label class="text-base text-gray-500 font-bold flex items-center gap-2">
            <i class="fa fa-dollar-sign"></i> Costo:
          </label>
          <input name="cost" type="number" step="0.01" min="0" value="${(e==null?void 0:e.cost)??0}" 
            class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1" />
        </div>
        <div>
          <label class="text-base text-gray-500 font-bold flex items-center gap-2">
            <i class="fa fa-tag"></i> Precio:
          </label>
          <input name="price" type="number" step="0.01" min="0" value="${(e==null?void 0:e.price)??0}" 
            class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1" />
        </div>
      </div>

      ${n}

      <div class="pt-4 pb-2">
        <p class="text-base text-gray-500 font-bold mb-4 flex items-center gap-2">
          <i class="fa fa-clock"></i> Horario de venta para esta sesión
        </p>
        <div class="grid grid-cols-2 gap-4">
          <div class="pb-2">
            <label class="text-base text-gray-500 font-bold flex items-center gap-2">
              <i class="fa fa-play"></i> Desde:
            </label>
            <input name="startTime" type="time" value="${r}" step="60"
              class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1" />
          </div>
          <div class="pb-2">
            <label class="text-base text-gray-500 font-bold flex items-center gap-2">
              <i class="fa fa-stop"></i> Hasta:
            </label>
            <input name="endTime" type="time" value="${o}" step="60"
              class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1" />
          </div>
        </div>
      </div>

      <div class="flex justify-center gap-4 mt-6">
        <button type="button" id="cancelFood" class="flex items-center gap-2 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-semibold text-lg">
          <i class="fa fa-times fa-lg"></i> Cancelar
        </button>
        <button type="submit" id="submitFood" class="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-semibold text-lg">
          <i class="fa ${e?"fa-edit":"fa-plus"} fa-lg"></i> ${e?"Actualizar":"Agregar"}
        </button>
      </div>
    </form>
  </div>`,{close:l,element:c}=d.modal(i,{closeOnBackdropClick:!1}),m=c.querySelector("#cancelFood"),f=c.querySelector("#foodForm"),u=c.querySelector('input[name="isActive"]'),p=()=>{if(!u)return;const b=c.querySelector(".active-checkbox"),v=b.querySelector(".fa-check");u.checked?(b.classList.add("bg-accent","border-accent"),b.classList.remove("border-gray-400"),v.classList.remove("hidden")):(b.classList.remove("bg-accent","border-accent"),b.classList.add("border-gray-400"),v.classList.add("hidden"))},L=()=>{try{f.removeEventListener("submit",w)}catch{}try{m.removeEventListener("click",A)}catch{}if(u)try{u.removeEventListener("change",C)}catch{}},A=()=>{L(),l()},C=()=>p(),w=b=>{b.preventDefault();const v=new FormData(f),$=P(String(v.get("name")||"")),I=Number(v.get("cost"))||0,j=Number(v.get("price"))||0,N=Math.max(0,Number(v.get("stock"))||0),O=String(v.get("startTime")||""),M=String(v.get("endTime")||"");if(!$){d.toast("Nombre requerido");return}if(y.nameExists($,e==null?void 0:e.id)){d.toast("El nombre ya existe");return}if(!O||!M){d.toast("Debe especificar un horario de venta.");return}if(e){const B=!!v.get("isActive");if(s&&!B){d.toast("Actualización bloqueada: pedido activo");return}const R={...e,name:$,cost:+I.toFixed(2),price:+j.toFixed(2),stock:N,isActive:B};y.update(R,{startTime:O,endTime:M}),d.toast("Comida actualizada")}else y.add({name:$,cost:+I.toFixed(2),price:+j.toFixed(2),stock:N},{startTime:O,endTime:M}),d.toast("Comida agregada");L(),l(),_()};f.addEventListener("submit",w),m.addEventListener("click",A),u&&u.addEventListener("change",C),p()}function Ne(t){const e=y.findById(t);if(!e){d.toast("Comida no encontrada");return}let s=null;const a=o=>{const n=`
      <button id="closeHistory" class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 z-20"><i class="fa fa-times text-lg"></i></button>
      <div class="p-1">
        <button id="backToList" class="text-sm text-accent hover:underline mb-3"><i class="fa fa-arrow-left mr-2"></i>Volver a la lista</button>
        <h4 class="text-lg font-bold text-center mb-4 text-gray-800">Detalles del ${o.recordDate}</h4>
        <div class="space-y-3 text-sm bg-gray-50 p-4 rounded-lg border">
          <p class="flex justify-between"><strong><i class="fa fa-calendar-alt w-5 text-gray-500"></i>Fecha:</strong> <span>${o.recordDate}</span></p>
          <p class="flex justify-between"><strong><i class="fa fa-clock w-5 text-gray-500"></i>Horario:</strong> <span>${o.startTime} - ${o.endTime}</span></p>
          <p class="flex justify-between"><strong><i class="fa fa-cubes w-5 text-gray-500"></i>Stock Inicial:</strong> <span>${o.initialStock}</span></p>
          <p class="flex justify-between"><strong><i class="fa fa-tag w-5 text-gray-500"></i>Precio:</strong> <span>${S(o.unitPrice)}</span></p>
          <p class="flex justify-between"><strong><i class="fa fa-dollar-sign w-5 text-gray-500"></i>Costo:</strong> <span>${S(o.unitCost)}</span></p>
          <p class="flex justify-between"><strong><i class="fa fa-chart-line w-5 text-gray-500"></i>Vendidos:</strong> <span>${o.quantitySold}</span></p>
          <p class="flex justify-between"><strong><i class="fa fa-toggle-on w-5 text-gray-500"></i>Estado:</strong> <span class="font-semibold ${o.isActive?"text-green-600":"text-red-500"}">${o.isActive?"Activa":"Finalizada"}</span></p>
        </div>
      </div>`;s&&(s.element.innerHTML=n,s.element.querySelector("#closeHistory").addEventListener("click",s.close),s.element.querySelector("#backToList").addEventListener("click",r))},r=()=>{const o=x.findByFoodId(t);let n;o.length===0?n='<p class="text-gray-500 text-center py-8">No hay historial de ventas para esta comida.</p>':n=`<ul class="bg-white rounded-lg border">${o.map(c=>`
        <li class="border-b last:border-b-0">
          <button data-record-id="${c.id}" class="w-full text-left p-3 hover:bg-gray-100 flex justify-between items-center record-item transition-colors">
            <div class="font-medium"><i class="fa fa-calendar-day mr-2 text-gray-400"></i> ${c.recordDate} <span class="text-xs text-gray-500">(${c.startTime} - ${c.endTime})</span></div>
            <div class="text-sm">Vendidos: <strong>${c.quantitySold}</strong> <span class="text-xs ${Math.abs(c.unitPrice-e.price)>.001?"text-blue-500":""}">(${S(c.unitPrice)})</span></div>
          </button>
        </li>`).join("")}</ul>`;const i=`
      <button id="closeHistory" class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 z-20"><i class="fa fa-times text-lg"></i></button>
      <div class="p-1">
        <h3 class="text-xl font-bold mb-4 text-center">Historial: ${e.name}</h3>
        <div class="modal-content-container max-h-96 overflow-y-auto">
          ${n}
        </div>
      </div>`;s?s.element.innerHTML=i:s=d.modal(i,{closeOnBackdropClick:!1}),s.element.querySelector("#closeHistory").addEventListener("click",s.close),s.element.querySelectorAll(".record-item").forEach(l=>{l.addEventListener("click",c=>{const m=c.currentTarget.dataset.recordId,f=o.find(u=>u.id===m);a(f)})})};r()}Me();
