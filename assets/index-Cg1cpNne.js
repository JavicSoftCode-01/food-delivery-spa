(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const l of i)if(l.type==="childList")for(const r of l.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function s(i){const l={};return i.integrity&&(l.integrity=i.integrity),i.referrerPolicy&&(l.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?l.credentials="include":i.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function a(i){if(i.ep)return;i.ep=!0;const l=s(i);fetch(i.href,l)}})();const pe=document.getElementById("app"),n={toastTimer:0,renderShell(){pe.innerHTML=`
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
      <nav id="bottomNav" class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-border safe-bottom p-2 md:bottom-4 md:left-1/2 md:-translate-x-1/2 rounded-lg md:px-2 md:py-1 md:w-auto flex items-center justify-between gap-2" role="navigation" aria-label="Navegación principal">
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
    `,document.querySelectorAll("#bottomNav .nav-item").forEach(e=>{e.setAttribute("tabindex","0"),e.addEventListener("keydown",t=>{(t.key==="Enter"||t.key===" ")&&(t.currentTarget.click(),t.preventDefault())})})},toast(e){const t=document.getElementById("toastRoot");t.innerHTML=`<div class="toast bg-gray-900 text-white rounded-lg p-3 shadow">${e}</div>`,n.toastTimer&&window.clearTimeout(n.toastTimer),n.toastTimer=window.setTimeout(()=>{t.innerHTML=""},3500)},modal(e,t={}){const{closeOnBackdropClick:s=!0}=t,a=document.getElementById("modalRoot"),i=document.createElement("div");i.className="modal-instance";const l=20+a.children.length*10;i.innerHTML=`
      <div class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center p-4" style="z-index: ${l};">
        <div class="modal-content bg-white rounded-xl w-full max-w-xl p-4 shadow-lg relative
            -mt-[80px] sm:-mt-[60px] md:-mt-[80px] lg:-mt-[100px]">
          ${e}
        </div>
      </div>
    `,a.appendChild(i);const r=()=>{i.parentNode&&i.parentNode.removeChild(i)};if(s){const o=i.querySelector(".modal-backdrop");o?.addEventListener("click",d=>{d.target===o&&r()})}return{close:r,element:i}},confirm(e,t){const{close:s,element:a}=n.modal(`<div>
        <p class="text-gray-700">${e}</p>
        <div class="mt-4 flex justify-end gap-2">
          <button class="confirm-no-btn px-4 py-2 rounded-lg border">No</button>
          <button class="confirm-yes-btn px-4 py-2 rounded-lg bg-accent text-white">Sí</button>
        </div>
      </div>`,{closeOnBackdropClick:!1}),i=a.querySelector(".confirm-no-btn"),l=a.querySelector(".confirm-yes-btn");i?.addEventListener("click",s),l?.addEventListener("click",()=>{s(),t()})},updateTitle(e){const t=document.getElementById("main-title");let s="Gestión Delivery";e==="clients"?s+=" -- Clientes":e==="foods"?s+=" -- Comidas":e==="settings"&&(s+=" -- Ajustes"),t.textContent=s},updateHeaderContent(e){const t=document.getElementById("header-extra");t&&(t.innerHTML=e)},renderNavActive(e="dashboard"){document.querySelectorAll("#bottomNav .nav-item").forEach(t=>{const a=t.dataset.screen===e;t.classList.toggle("bg-accent",a),t.classList.toggle("text-white",a),t.classList.toggle("shadow-lg",a),a?t.setAttribute("aria-current","page"):t.removeAttribute("aria-current")})}},xe="fd_meta_v1",ye="fd_foods_v1",he="fd_orders_v1",we="fd_audit_v1",Se="fd_food_sale_records_v1",A={read(e){try{const t=localStorage.getItem(e);return t?JSON.parse(t):null}catch(t){return console.warn("Storage.read error",t),null}},write(e,t){try{return localStorage.setItem(e,JSON.stringify(t)),!0}catch(s){return console.error("Storage.write failed",s),!1}},keys:{KEY_META:xe,KEY_FOODS:ye,KEY_ORDERS:he,KEY_AUDIT:we,KEY_FOOD_SALE_RECORDS:Se}},X=(e="")=>e+Math.random().toString(36).slice(2,9),ue=()=>Date.now(),P=e=>(e||"").toString().trim(),S=e=>"$ "+Number(e||0).toFixed(2),ke=(e,t=300)=>{let s;return(...a)=>{s&&window.clearTimeout(s),s=window.setTimeout(()=>e(...a),t)}},re=e=>{const t=(e||"").toString();let s="";if(t.startsWith("+")){const a=t.substring(1);if(a.startsWith("593")){const i=a.substring(3);if(i.startsWith(" ")){const l=i.substring(1);let r="+593 ",o=0;for(let d=0;d<l.length&&o<9;d++){const c=l[d];/[0-9]/.test(c)&&((o===2||o===5)&&(r+=" "),r+=c,o++)}s=r}else s="+593"+i.replace(/[^0-9]/g,"")}else s="+"+a.replace(/[^0-9]/g,"")}else s=t.replace(/[^0-9]/g,"");return s.startsWith("09")?s.length>10&&(s=s.substring(0,10)):s.startsWith("+593 9")?s.length>16&&(s=s.substring(0,16)):s.startsWith("+593")&&s.length>13&&(s=s.substring(0,13)),s},$e=e=>{const t=(e||"").toString().trim();if(!t||t.length<2)return null;const s=t.replace(/\s/g,"");return s.startsWith("09")||s.startsWith("+5939")?null:"Formato válido: '09xxxxxxxx' o '+5939xxxxxxxx'"},U=e=>!!(/^09\d{8}$/.test(e)||/^\+5939\d{8}$/.test(e)||/^\+593 9\d \d{3} \d{4}$/.test(e)),le=e=>{if(!e)return"";const t=e.replace(/\s/g,"");return t.startsWith("09")&&t.length===10?`+593${t.substring(1)}`:t.startsWith("+5939")&&t.length===13?t:""},ne=e=>e?e.toString().replace(/\D/g,""):"";function Te(e){const t=e.replace(/\D/g,"");if(t.startsWith("0")){const s=t.substring(1);if(s.length===9)return`+593${s.substring(0,2)}${s.substring(2,5)}${s.substring(5)}`}if(t.startsWith("593")){const s=t.substring(3);if(s.length===9)return`+593${s.substring(0,2)}${s.substring(2,5)}${s.substring(5)}`}return e}function Le(e){return new Date(e).toLocaleTimeString("es-EC",{hour:"2-digit",minute:"2-digit",hour12:!0}).replace("AM","a. m.").replace("PM","p. m.")}function K(e){if(!e||!e.includes(":"))return e;const[t,s]=e.split(":");let a=parseInt(t,10);const i=a>=12?"p.m.":"a.m.";return a=a%12,a=a||12,`${a<10?"0"+a:a.toString()}:${s} ${i}`}const de=A.keys.KEY_FOODS,ce=A.keys.KEY_FOOD_SALE_RECORDS,p={getAll(){return A.read(ce)||[]},saveAll(e){A.write(ce,e)},add(e){const t={id:X("record_"),...e},s=this.getAll();return s.push(t),this.saveAll(s),t},update(e){const t=this.getAll().map(s=>s.id===e.id?{...s,...e}:s);this.saveAll(t)},findByFoodId(e){return this.getAll().filter(t=>t.foodId===e).sort((t,s)=>{const a=new Date(s.recordDate).getTime()-new Date(t.recordDate).getTime();return a!==0?a:s.id.localeCompare(t.id)})},findLatestActiveByFoodId(e){return this.findByFoodId(e).find(t=>t.isActive)}},x={getAll(){return A.read(de)||[]},saveAll(e){A.write(de,e)},add(e,t){const s={id:X("food_"),amountSold:0,createdAt:ue(),isActive:!0,...e},a=this.getAll();a.push(s),this.saveAll(a);const i=new Date().toISOString().slice(0,10);return p.add({foodId:s.id,recordDate:i,startTime:t.startTime,endTime:t.endTime,initialStock:s.stock,unitPrice:s.price,unitCost:s.cost,quantitySold:0,isActive:!0}),console.log("Food created",{id:s.id,name:s.name}),s},update(e,t){const s=this.findById(e.id);if(!s)return;const a=new Date().toISOString().slice(0,10),i=p.findLatestActiveByFoodId(e.id),l=Math.abs(e.price-s.price)>.001||Math.abs(e.cost-s.cost)>.001;if(e.isActive&&l)i&&i.recordDate===a&&(i.isActive=!1,p.update(i)),e.amountSold=0,p.add({foodId:e.id,recordDate:a,startTime:t?.startTime||"08:00",endTime:t?.endTime||"23:00",initialStock:e.stock,unitPrice:e.price,unitCost:e.cost,quantitySold:0,isActive:!0});else if(e.isActive&&!s.isActive){const o=p.findByFoodId(e.id).find(d=>d.recordDate===a);o&&!l?(o.isActive=!0,e.stock>s.stock&&(o.initialStock+=e.stock-s.stock),t?.startTime&&(o.startTime=t.startTime),t?.endTime&&(o.endTime=t.endTime),p.update(o)):(e.amountSold=0,p.add({foodId:e.id,recordDate:a,startTime:t?.startTime||"08:00",endTime:t?.endTime||"23:00",initialStock:e.stock,unitPrice:e.price,unitCost:e.cost,quantitySold:0,isActive:!0}))}else if(!e.isActive&&s.isActive)i&&(i.isActive=!1,p.update(i));else if(e.isActive&&i){if(e.stock>s.stock){const o=e.stock-s.stock;i.initialStock+=o}t?.startTime&&(i.startTime=t.startTime),t?.endTime&&(i.endTime=t.endTime),p.update(i)}const r=this.getAll().map(o=>o.id===e.id?{...o,...e}:o);this.saveAll(r),console.log("Food updated",{id:e.id,name:e.name})},findById(e){return this.getAll().find(t=>t.id===e)},nameExists(e,t){const s=e.trim().toLowerCase();return this.getAll().some(a=>a.id!==t&&a.name.trim().toLowerCase()===s)},totalProfit(){return this.getAll().reduce((e,t)=>e+(t.amountSold||0)*((t.price||0)-(t.cost||0)),0)},decreaseStock(e,t){const s=this.getAll(),a=s.findIndex(i=>i.id===e);if(a>-1){s[a].stock=Math.max(0,s[a].stock-t),s[a].amountSold+=t,this.saveAll(s);const i=p.findLatestActiveByFoodId(e);i&&(i.quantitySold+=t,p.update(i))}},increaseStock(e,t){const s=this.getAll(),a=s.findIndex(i=>i.id===e);if(a>-1){s[a].stock+=t,s[a].amountSold=Math.max(0,s[a].amountSold-t),this.saveAll(s);const i=p.findLatestActiveByFoodId(e);i&&(i.quantitySold=Math.max(0,i.quantitySold-t),p.update(i))}}},fe=A.keys.KEY_ORDERS,k={_internalGetAll(){return A.read(fe)||[]},getAll(){return this._internalGetAll().filter(e=>e.state!==!1)},saveAll(e){A.write(fe,e)},add(e){const t=p.findLatestActiveByFoodId(e.foodId);if(t){const i=new Date(e.deliveryTime),[l,r]=[i.getHours(),i.getMinutes()],o=l*60+r,[d,c]=t.startTime.split(":").map(Number),u=d*60+c,[f,g]=t.endTime.split(":").map(Number),y=f*60+g;if(o<u||o>y)return n.toast(`Pedido fuera de horario. Disponible de ${t.startTime} a ${t.endTime}.`),null}else return n.toast("La comida no está disponible para la venta en este momento."),null;const s={id:X("order_"),createdAt:ue(),delivered:!1,deliveredAt:null,state:!0,...e},a=this._internalGetAll();return a.push(s),this.saveAll(a),s},update(e){const t=this._internalGetAll(),s=t.find(l=>l.id===e.id),a=p.findLatestActiveByFoodId(e.foodId);if(a){const l=new Date(e.deliveryTime),[r,o]=[l.getHours(),l.getMinutes()],d=r*60+o,[c,u]=a.startTime.split(":").map(Number),f=c*60+u,[g,y]=a.endTime.split(":").map(Number),T=g*60+y;if(d<f||d>T)return n.toast(`Pedido fuera de horario. Disponible de ${a.startTime} a ${a.endTime}.`),!1}else if(s?.foodId!==e.foodId)return n.toast("La nueva comida seleccionada no está disponible para la venta."),!1;if(s){if(s.delivered!==e.delivered)e.delivered?x.decreaseStock(e.foodId,e.quantity):x.increaseStock(e.foodId,e.quantity);else if(s.delivered&&e.delivered)if(s.foodId!==e.foodId)x.increaseStock(s.foodId,s.quantity),x.decreaseStock(e.foodId,e.quantity);else{const l=e.quantity-s.quantity;l>0?x.decreaseStock(e.foodId,l):l<0&&x.increaseStock(e.foodId,Math.abs(l))}}const i=t.map(l=>l.id===e.id?{...l,...e}:l);return this.saveAll(i),!0},archiveDeliveredOrders(){const e=this._internalGetAll().map(t=>t.delivered?{...t,state:!1}:t);this.saveAll(e),n.toast("Pedidos entregados archivados.")},isFoodInActiveOrder(e){return this.getAll().some(t=>t.foodId===e)},getSorted(){const e=this.getAll(),t=e.filter(a=>!a.delivered),s=e.filter(a=>a.delivered);return t.sort((a,i)=>new Date(a.deliveryTime).getTime()-new Date(i.deliveryTime).getTime()),s.sort((a,i)=>a.deliveredAt&&i.deliveredAt?new Date(a.deliveredAt).getTime()-new Date(i.deliveredAt).getTime():-1),[...t,...s]},findById(e){return this.getAll().find(t=>t.id===e)},checkConflict(e,t,s,a){const i=Math.abs(s)*60*1e3,l=new Date(e).getTime(),r=this.getAll().filter(o=>o.id!==a);for(const o of r)if(Math.abs(l-new Date(o.deliveryTime).getTime())<i)return{conflict:!0,other:o};return{conflict:!1}}};function ge(e){const t=Te(e),s=`<div class="relative">
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
  </div>`,{close:a,element:i}=n.modal(s,{closeOnBackdropClick:!1});i.querySelector("#closeCall").addEventListener("click",a),i.querySelector("#callPhone").addEventListener("click",()=>{window.open(`tel:${e}`),a()}),i.querySelector("#callWhatsApp").addEventListener("click",()=>{window.open(`https://wa.me/${t.replace(/\s/g,"")}`),a()})}function Ae(e,t){const s=k.findById(e);if(!s){n.toast("Pedido no encontrado");return}const a=x.findById(s.foodId),i=a?.price||0,l=i*s.quantity,r=`<button id="closeDetails" class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 z-20"><i class="fa fa-times text-lg"></i></button>
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
            <div class="text-gray-800">${Le(s.deliveryTime)}</div>
          </div>
          <div class="border-b pb-2">
            <label class="text-base text-gray-500 font-bold">Dirección:</label>
            <div class="text-gray-800">${s.deliveryAddress}</div>
          </div>
          <div class="border-b pb-2">
            <label class="text-base text-gray-500 font-bold">Comida:</label>
            <div class="text-gray-800">${a?.name||"No encontrado"}</div>
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
              <div class="text-gray-800">${S(i)}</div>
            </div>
            <div>
              <label class="text-base text-gray-500 font-bold">Total:</label>
              <div class="font-bold text-lg text-green-600">${S(l)}</div>
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
    </div>`,{close:o,element:d}=n.modal(r,{closeOnBackdropClick:!1});d.querySelector("#closeDetails").addEventListener("click",o),d.querySelector("#callFromDetails").addEventListener("click",f=>ge(f.currentTarget.dataset.phone));const c=d.querySelector("#detailsToggle"),u=f=>{const g=d.querySelector("#toggleBg"),y=d.querySelector("#toggleDot");g.className=`toggle-bg-details w-11 h-6 ${f?"bg-green-600":"bg-red-500"} rounded-full relative`,y.className=`toggle-dot-details absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${f?"translate-x-5":"translate-x-0"}`};c.addEventListener("change",()=>{const f=k.findById(e);f&&me(f,c,u,()=>{t()})})}function Ee(e){const t=x.getAll(),s=k.getSorted().filter(r=>r.state),a=s.filter(r=>!r.delivered).length,i=s.filter(r=>r.delivered).length,l=x.totalProfit();e.innerHTML=`<section class="space-y-4">
    <div class="grid grid-cols-2 gap-3">
      <div class="p-3 bg-white rounded-xl border border-border shadow">
        <div class="text-sm text-gray-500">Pedidos pendientes</div>
        <div class="text-2xl font-semibold">${a}</div>
      </div>
      <div class="p-3 bg-white rounded-xl border border-border shadow">
        <div class="text-sm text-gray-500">Entregas realizadas</div>
        <div class="text-2xl font-semibold">${i}</div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="p-3 bg-white rounded-xl border border-border shadow">
        <div class="text-sm text-gray-500">Variedades</div>
        <div class="text-xl font-semibold">${t.length}</div>
      </div>
      <div class="p-3 bg-white rounded-xl border border-border shadow">
        <div class="text-sm text-gray-500">Beneficio total</div>
        <div class="text-xl font-semibold">${S(l)}</div>
      </div>
    </div>
    <div class="flex gap-2">
      <button id="btnAddOrderQuick" class="flex-1 px-3 py-2 bg-accent text-white rounded-lg">Nuevo pedido</button>
      <button id="btnAddFoodQuick" class="flex-1 px-3 py-2 border rounded-lg">Nueva comida</button>
    </div>
  </section>`,e.querySelector("#btnAddOrderQuick")?.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("openOrderForm"))}),e.querySelector("#btnAddFoodQuick")?.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("openFoodForm"))})}function Ce(e,t,s){const a=`<div class="relative max-h-[90vh] overflow-y-auto">
  <button id="closeRecordDetails" class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 z-20">
    <i class="fa fa-times text-lg"></i>
  </button>
  <div class="pr-8 p-4">
    <button id="backToHistoryList" class="text-sm text-accent hover:underline mb-4 flex items-center gap-2">
      <i class="fa fa-arrow-left"></i>Volver a la lista
    </button>
    <h3 class="text-2xl font-bold mb-4 text-center">Detalles ${e.recordDate}</h3>
    <div class="space-y-4">

      <div class="border-b pb-2">
        <label class="flex items-center gap-2 text-lg text-gray-600 font-semibold">
          <i class="fa fa-bowl-food"></i> Comida:
        </label>
        <div class="text-gray-900 text-lg">${t.name}</div>
      </div>

      <div class="border-b pb-2">
        <label class="flex items-center gap-2 text-lg text-gray-600 font-semibold">
          <i class="fa fa-clock"></i> Horario:
        </label>
        <div class="text-gray-900 text-lg">${K(e.startTime)} - ${K(e.endTime)}</div>
      </div>

      <div class="grid grid-cols-3 gap-4 border-b pb-2">
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 font-semibold">
            <i class="fa-solid fa-boxes-stacked"></i> Stock:
          </label>
          <div class="text-gray-900 text-lg flex items-center justify-center h-full -mt-2">${e.initialStock}</div>
        </div>
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 font-semibold">
            <i class="fa fa-shopping-cart"></i> Vend.:
          </label>
          <div class="text-gray-900 text-lg flex items-center justify-center h-full -mt-2">${e.quantitySold}</div>
        </div>
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 font-semibold">
            <i class="fa-solid fa-boxes-stacked"></i> Resto:
          </label>
          <div class="text-gray-900 text-lg flex items-center justify-center h-full -mt-2">${e.initialStock-e.quantitySold}</div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4 border-b pb-2">
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 font-semibold">
            <i class="fa fa-dollar-sign"></i> Precio:
          </label>
          <div class="text-gray-900 text-lg flex items-center justify-center h-full -mt-2">${S(e.unitPrice)}</div>
        </div>
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 font-semibold">
            <i class="fa fa-money-bill"></i> Costo:
          </label>
          <div class="text-gray-900 text-lg flex items-center justify-center h-full -mt-2">${S(e.unitCost)}</div>
        </div>
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 font-semibold">
            <i class="fa fa-chart-line"></i> Lucro:
          </label>
          <div class="font-bold text-blue-700 text-lg flex items-center justify-center h-full -mt-2">${S(e.unitPrice-e.unitCost)}</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 border-b pb-2">
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 font-semibold">
            <i class="fa fa-piggy-bank"></i> Lucro T.:
          </label>
          <div class="font-bold text-blue-700 text-xl flex h-full -mt-1">${S((e.unitPrice-e.unitCost)*e.quantitySold)}</div>
        </div>
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 font-semibold">
            <i class="fa fa-coins"></i> Total:
          </label>
          <div class="font-bold text-green-700 text-xl flex h-full -mt-1">${S(e.quantitySold*e.unitPrice)}</div>
        </div>
      </div>

    </div>
  </div>
</div>`,{close:i,element:l}=n.modal(a,{closeOnBackdropClick:!1});l.querySelector("#closeRecordDetails").addEventListener("click",i),l.querySelector("#backToHistoryList").addEventListener("click",()=>{i(),s()})}function Ie(e){const t=x.findById(e);if(!t){n.toast("Comida no encontrada");return}const s=p.findByFoodId(e);let a=null;const i=()=>{let l;s.length===0?l='<div class="text-gray-500 text-center py-8 flex flex-col items-center gap-2"><i class="fa fa-inbox text-3xl opacity-50"></i><p>No hay historial de ventas para esta comida.</p></div>':l=`<div class="bg-white rounded-lg border divide-y">${s.map(d=>{const c=d.quantitySold*d.unitPrice;return`
            <div class="border-b last:border-b-0">
              <button data-record-id="${d.id}" class="w-full text-left p-3 hover:bg-gray-50 record-detail-btn transition-colors">
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-3">
                    <div class="w-2 h-2 rounded-full ${d.isActive?"bg-green-500":"bg-gray-400"}"></div>
                    <div>
                      <div class="font-medium text-gray-900">
                        <i class="fa fa-calendar-day mr-2 text-gray-400"></i>
                        ${d.recordDate}
                      </div>
                      <div class="text-sm text-gray-500">
                        ${K(d.startTime)} - ${K(d.endTime)}
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold text-gray-900">
                      Vendidos: <span class="text-gray-600">${d.quantitySold}</span>
                    </div>
                    <div class="text-sm text-green-600">
                      ${S(c)}
                    </div>
                  </div>
                </div>
              </button>
            </div>`}).join("")}</div>`;const r=`
      <div class="relative max-h-[80vh] overflow-y-auto">
        <button id="closeHistoryModal" class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 z-20">
          <i class="fa fa-times text-lg"></i>
        </button>
        <div class="pr-8 p-4">
          <h3 class="text-xl font-bold mb-4 text-center">
            <i class="fa fa-history mr-2"></i>Historial: ${t.name}
          </h3>
          <div class="max-h-96 overflow-y-auto">
            ${l}
          </div>
        </div>
      </div>`;a=n.modal(r,{closeOnBackdropClick:!1}),a.element.querySelector("#closeHistoryModal").addEventListener("click",a.close),a.element.querySelectorAll(".record-detail-btn").forEach(o=>{o.addEventListener("click",d=>{const c=d.currentTarget.dataset.recordId,u=s.find(g=>g.id===c),f=a.close;f(),Ce(u,t,i)})})};i()}function qe(e){e.innerHTML=`<div class="bg-white rounded-xl p-3 border space-y-3 mb-20">
    <div class="flex gap-2 items-center">
      <input id="inputFilterFood" placeholder="Buscar por comida..." class="flex-1 px-3 py-2 border rounded-lg" />
      <button id="btnAddFood" class="px-3 py-2 bg-accent text-white rounded-lg hover:bg-green-600 transition-colors">
        <i class="fa-solid fa-plus fa-lg"></i>
      </button>
    </div>
    <div id="foodsList" class="space-y-3"></div>
  </div>`;const t=e.querySelector("#inputFilterFood"),s=e.querySelector("#foodsList");function a(){const l=x.getAll(),r=P(t.value).toLowerCase(),o=r?l.filter(d=>P(d.name).toLowerCase().includes(r)):l;i(o)}const i=l=>{if(s.innerHTML="",l.length===0){s.innerHTML=`
        <div class="text-gray-500 text-center py-8">
          <i class="fa fa-bowl-food text-4xl mb-2 opacity-50"></i>
          <p>Sin resultados.</p>
        </div>`;return}l.forEach(r=>{const o=document.createElement("div");o.className=`p-3 bg-gray-50 rounded-lg border hover:shadow-sm transition-shadow ${r.isActive?"":"opacity-60"}`,o.innerHTML=`
        <div class="flex items-center justify-between mb-2">
          <div class="font-semibold text-xl">${r.name}</div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${r.isActive?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}">
              <i class="fa ${r.isActive?"fa-check-circle":"fa-times-circle"} mr-1 text-base"></i>
              ${r.isActive?"Activo":"Inactivo"}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-lg text-gray-600 mb-3">
          <div class="flex items-center gap-1">
            <i class="fa-solid fa-shopping-cart text-blue-500 text-2xl"></i>
            <span class="font-semibold"><strong>${r.amountSold||0}</strong></span>
          </div>
          <div class="flex items-center gap-1">
            <i class="fa-solid fa-boxes-stacked text-orange-500 text-2xl"></i>
            <span class="font-semibold"><strong>${r.stock}</strong></span>
          </div>
          <div class="flex items-center gap-1">
            <i class="fa-solid fa-dollar-sign text-green-500 text-2xl"></i>
            <span class="font-semibold"><strong>${S(r.price)}</strong></span>
          </div>
        </div>
        <div class="flex gap-2">
          <button data-id="${r.id}" class="salesHistoryBtn flex-1 px-1 py-1 bg-blue-500 text-white rounded flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors font-semibold">
            <i class="fa fa-history text-lg"></i>
            Historial
          </button>
          <button data-id="${r.id}" class="editFood flex-1 px-1 py-1 bg-yellow-500 text-white rounded flex items-center justify-center gap-2 hover:bg-yellow-600 transition-colors font-semibold">
            <i class="fa-solid fa-store text-lg"></i>
            Venta
          </button>
        </div>`,s.appendChild(o)}),s.querySelectorAll(".editFood").forEach(r=>{r.addEventListener("click",o=>{document.dispatchEvent(new CustomEvent("openFoodForm",{detail:{id:o.currentTarget.dataset.id}}))})}),s.querySelectorAll(".salesHistoryBtn").forEach(r=>{r.addEventListener("click",o=>{const d=o.currentTarget.dataset.id;Ie(d)})})};t.addEventListener("input",a),e.querySelector("#btnAddFood")?.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("openFoodForm"))}),document.addEventListener("refreshViews",a),a()}function Fe(e){const t=localStorage.getItem("fd_meta_v1")||"{}";let s={};try{s=JSON.parse(t)||{}}catch{s={}}const a=s.deliveryGapMinutes??15,i=!!s.darkMode;e.innerHTML=`
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
              <i class="${i?"fa fa-moon fa-lg":"fa fa-sun fa-lg"}"></i>
            </div>
            <div>
              <div class="text-lg font-medium">Modo</div>
              <div class="text-sm text-gray-500">Oscuro o Claro</div>
            </div>
          </div>

          <div>
            <button id="themeToggle" aria-pressed="${i}" title="${i?"Desactivar modo oscuro":"Activar modo oscuro"}" class="toggle-btn inline-flex items-center gap-2 px-3 py-2 rounded-full border">
              <span id="sunIcon" class="text-yellow-500 ${i?"opacity-40":"opacity-100"}"><i class="fa fa-sun fa-lg"></i></span>
              <span id="slider" class="w-10 h-6 rounded-full flex items-center p-1 ${i?"justify-end bg-gray-700":"justify-start bg-gray-200"}">
                <span id="dot" class="w-4 h-4 bg-white rounded-full shadow"></span>
              </span>
              <span id="moonIcon" class="text-indigo-600 ${i?"opacity-100":"opacity-40"}"><i class="fa fa-moon fa-lg"></i></span>
            </button>
          </div>
        </div>
      </div>

      <!--<div class="flex justify-end gap-2 pt-2">
        <button id="btnClearAudit" class="px-3 py-2 border rounded">Limpiar logs</button>
      </div>-->
    </div>
  `;const l=e.querySelector("#inputGap"),r=e.querySelector("#themeToggle"),o=e.querySelector("#themeIcon"),d=e.querySelector("#sunIcon"),c=e.querySelector("#moonIcon"),u=e.querySelector("#slider"),f=e.querySelector("#dot"),g=e.querySelector("#btnClearAudit"),y=w=>{w?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark"),o&&(o.innerHTML=`<i class="${w?"fa-solid fa-cloud-moon fa-lg":"fa-solid fa-cloud-sun fa-lg"}"></i>`),d&&(d.style.opacity=w?"0.4":"1"),c&&(c.style.opacity=w?"1":"0.4"),u&&(u.className=`w-10 h-6 rounded-full flex items-center p-1 ${w?"justify-end bg-gray-700":"justify-start bg-gray-200"}`),f&&(f.style.transform="translateX(0)");const b=localStorage.getItem("fd_meta_v1")||"{}";let v={};try{v=JSON.parse(b)||{}}catch{v={}}v.darkMode=!!w,localStorage.setItem("fd_meta_v1",JSON.stringify(v))},T=w=>{const b=Number(w.currentTarget.value||0),v=localStorage.getItem("fd_meta_v1")||"{}";let $={};try{$=JSON.parse(v)||{}}catch{$={}}$.deliveryGapMinutes=b,localStorage.setItem("fd_meta_v1",JSON.stringify($)),n.toast("Brecha actualizada")},C=()=>{const b=!!!JSON.parse(localStorage.getItem("fd_meta_v1")||"{}").darkMode;y(b),n.toast(`Modo ${b?"oscuro":"claro"} activado`),Y()},E=()=>{localStorage.removeItem("fd_audit_v1"),n.toast("Logs limpiados")};l?.addEventListener("change",T),r?.addEventListener("click",C),g?.addEventListener("click",E),y(i)}function me(e,t,s,a){t.checked?(t.checked=!1,s(!1),n.confirm(`🟢 Quiere confirmar la entrega al Cliente <strong>${e.fullName}</strong> ❓ <br> ✅ Perteneciente al teléfono <strong>${e.phone}</strong>`,()=>{const l={...e,delivered:!0,deliveredAt:new Date().toISOString()};k.update(l),n.toast("Pedido marcado como entregado"),Y(),t.checked=!0,s(!0),a()})):(t.checked=!0,s(!0),n.confirm(`🔴 Quiere revertir la entrega al Cliente <strong>${e.fullName}</strong> ❓ <br> Perteneciente al teléfono <strong>${e.phone}</strong> 〽️`,()=>{const l={...e,delivered:!1,deliveredAt:null};k.update(l),n.toast("Entrega revertida"),Y(),t.checked=!1,s(!1),a()}))}function De(e){e.innerHTML='<div class="bg-white rounded-xl p-3 border space-y-3 mb-20"> <div class="flex gap-2 items-center"> <input id="inputFilterPhone" placeholder="Buscar por nombre o teléfono..." class="flex-1 px-3 py-2 border rounded-lg" inputmode="text" /> <button id="btnAddOrder" class="px-3 py-2 bg-accent text-white rounded-lg"><i class="fa-solid fa-plus fa-lg"></i></button> </div> <div id="ordersList" class="space-y-2"></div> </div>';const t=e.querySelector("#inputFilterPhone"),s=e.querySelector("#ordersList");function a(){const l=k.getSorted(),r=t.value.toLowerCase().trim();if(!r){i(l);return}const o=ne(r),d=l.filter(c=>{const u=P(c.fullName).toLowerCase().includes(r);let f=!1;return o.length>0&&(f=ne(c.phone).includes(o)),u||f});i(d)}const i=l=>{if(s.innerHTML="",!l.length){s.innerHTML=`
        <div class="text-gray-500 text-center py-8">
          <i class="fa-solid fa-bag-shopping text-4xl mb-2 opacity-50"></i>
          <p>Sin resultados o los últimos 9 dígitos telefónico.</p>
        </div>`;return}l.forEach(r=>{const o=document.createElement("div");o.className="p-3 bg-gray-50 rounded-lg border",o.innerHTML=`
        <div class="font-bold text-xl flex items-center"><i class="fa fa-user mr-2"></i> ${r.fullName}</div>
        <div class="text-base text-gray-600 mt-2 flex items-center">
        <i class="fa fa-clock mr-2"></i><span class="font-semibold">Hora de entrega:</span>&nbsp;${new Date(r.deliveryTime).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:!0}).replace("AM","a. m.").replace("PM","p. m.")}
        </div>
        <div class="text-base text-gray-600 mt-1 flex items-center">
        <i class="fa fa-mobile mr-2"></i><span class="font-semibold">Teléfono:</span> &nbsp;${r.phone}
        </div>
        <div class="flex items-center gap-2 justify-between mt-2">
        <div class="flex gap-5">
            <button data-phone="${r.phone}" class="callBtn p-2 text-gray-600 hover:text-blue-600 border-2 rounded">
            <i class="fa fa-phone fa-lg"></i>
            </button>
            <button data-id="${r.id}" class="viewOrder p-2 text-gray-600 hover:text-blue-600 border-2 rounded">
            <i class="fa fa-eye fa-lg"></i>
            </button>
            <button data-id="${r.id}" class="editOrder p-2 text-gray-600 hover:text-yellow-600 border-2 rounded">
            <i class="fa-solid fa-pencil fa-lg text-yellow-500 opacity-80"></i>
            </button>
        </div>
        <div class="flex items-center">
            <label class="relative inline-flex items-center cursor-pointer">
            <input data-id="${r.id}" type="checkbox" ${r.delivered?"checked":""} class="sr-only deliveredToggle">
            <div class="toggle-bg w-11 h-6 ${r.delivered?"bg-green-600":"bg-red-500"} rounded-full">
                <div class="toggle-dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${r.delivered?"translate-x-5":"translate-x-0"}"></div>
            </div>
            </label>
        </div>
        </div>
    `,s.appendChild(o)}),s.querySelectorAll(".deliveredToggle").forEach(r=>{r.addEventListener("change",o=>{const d=o.currentTarget,c=d.dataset.id,u=k.findById(c);u&&me(u,d,g=>{const y=d.nextElementSibling,T=y.firstElementChild;y.className=`toggle-bg w-11 h-6 ${g?"bg-green-600":"bg-red-500"} rounded-full`,T.className=`toggle-dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${g?"translate-x-5":"translate-x-0"}`},a)})}),s.querySelectorAll(".callBtn").forEach(r=>r.addEventListener("click",o=>{ge(o.currentTarget.dataset.phone)})),s.querySelectorAll(".viewOrder").forEach(r=>r.addEventListener("click",o=>{Ae(o.currentTarget.dataset.id,a)})),s.querySelectorAll(".editOrder").forEach(r=>r.addEventListener("click",o=>{document.dispatchEvent(new CustomEvent("openOrderForm",{detail:{id:o.currentTarget.dataset.id}}))}))};t.addEventListener("input",a),e.querySelector("#btnAddOrder")?.addEventListener("click",()=>document.dispatchEvent(new CustomEvent("openOrderForm"))),a()}let L="dashboard",D,F=60;function Y(){D&&(clearInterval(D),D=void 0);const e=k.getAll(),t=e.filter(a=>!a.delivered).length,s=e.length-t;t>0?(n.updateHeaderContent(`<div class="pulse-animation bg-red-500 text-white text-base font-bold w-8 h-8 flex items-center justify-center rounded-full">${t}</div>`),F=60):s>0?Oe():(n.updateHeaderContent(""),F=60)}function Oe(){const e=()=>{const s='<button id="archive-btn" title="Archivar pedidos entregados" class="bg-red-500 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-600"><i class="fa fa-trash-can fa-lg"></i></button>';if(L==="clients"){n.updateHeaderContent(s);const a=document.getElementById("archive-btn");a&&a.addEventListener("click",()=>{n.confirm("¿Deseas archivar todos los pedidos ya entregados?",()=>{k.archiveDeliveredOrders(),_()})})}else n.updateHeaderContent("")},t=()=>{const s=Math.floor(F/60),a=F%60,i=`<div class="bg-gray-400 text-white text-sm font-mono w-12 h-8 flex items-center justify-center rounded-lg">${s}:${a.toString().padStart(2,"0")}</div>`;L==="clients"?n.updateHeaderContent(i):n.updateHeaderContent("")};if(F<=0){e();return}t(),D=window.setInterval(()=>{F--,F<=0?(D&&(clearInterval(D),D=void 0),e()):t()},1e3)}function _(){n.updateTitle(L),n.renderNavActive(L),Y();const e=document.getElementById("mainArea");e.innerHTML="";const t=document.createElement("div");e.appendChild(t),L==="dashboard"?Ee(t):L==="clients"?De(t):L==="foods"?qe(t):L==="settings"&&Fe(t)}function Me(){n.renderShell(),document.querySelectorAll("#bottomNav .nav-item").forEach(e=>{e.setAttribute("tabindex","0"),e.addEventListener("click",t=>{const s=t.currentTarget.dataset.screen;s&&s!==L&&(L=s,_())})}),document.addEventListener("openOrderForm",e=>{const t=e.detail?.id;Pe(t)}),document.addEventListener("openFoodForm",e=>{const t=e.detail?.id;je(t)}),document.addEventListener("openSalesHistory",e=>{const t=e.detail?.foodId;t&&Ne(t)}),_()}function He(e){return x.getAll().filter(s=>s.isActive||s.id===e).map(s=>`<option ${e===s.id?"selected":""} value="${s.id}" data-price="${s.price}">${s.name} (Stock: ${s.stock})</option>`).join("")}function Pe(e){const t=e?k.findById(e):null,s=He(t?.foodId),a=t?new Date(t.deliveryTime).toTimeString().slice(0,5):"",i=`
  <div class="relative max-h-[70vh] overflow-y-auto">
    <div class="pr-8 text-center mb-6">
      <h3 class="text-xl font-bold inline-flex items-center gap-2 justify-center">
        ${t?"Editar pedido":"Agregar pedido"}
        <i class="fa-solid fa-file-invoice-dollar fa-lg"></i>
      </h3>
    </div>
    <form id="orderForm" class="space-y-4">
      <div class="pb-2">
        <label class="text-base text-gray-500 font-bold flex items-center gap-2">
          <i class="fa fa-user"></i>Nombre completo:
        </label>
        <input name="fullName" value="${t?.fullName??""}" required
          class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1"
          placeholder="Ingresa el nombre completo" />
      </div>

      <div class="pb-2">
        <label class="text-base text-gray-500 font-bold flex items-center gap-2">
          <i class="fa fa-phone"></i> Teléfono:
        </label>
        <input name="phone" id="phoneInput" value="${t?.phone??""}" required type="tel" inputmode="tel"
          placeholder="Formatos: 09xxxxxxxx, +593xxxxxxxxx"
          class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1" />
      </div>

      <div class="pb-2">
        <label class="text-base text-gray-500 font-bold flex items-center gap-2">
          <i class="fa fa-map-marker-alt"></i> Dirección de entrega:
        </label>
        <input name="deliveryAddress" value="${t?.deliveryAddress??""}" required
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
              <input name="combo" id="comboCheckbox" type="checkbox" ${t?.combo?"checked":""} class="sr-only" />
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
            value="${t?.quantity??1}"
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
          <i class="fa ${t?"fa-edit":"fa-plus"} fa-lg"></i> ${t?"Actualizar":"Agregar"}
        </button>
      </div>
    </form>
  </div>
`,{close:l,element:r}=n.modal(i,{closeOnBackdropClick:!1}),o=r.querySelector("#phoneInput"),d=r.querySelector("#foodSelect"),c=r.querySelector("#quantityInput"),u=r.querySelector("#comboCheckbox"),f=r.querySelector("#unitPrice"),g=r.querySelector("#totalPrice"),y=r.querySelector("#cancelOrder"),T=r.querySelector("#orderForm"),C=()=>{const m=r.querySelector(".combo-checkbox"),h=m.querySelector(".fa-check");u.checked?(m.classList.add("bg-accent","border-accent"),m.classList.remove("border-gray-400"),h.classList.remove("hidden")):(m.classList.remove("bg-accent","border-accent"),m.classList.add("border-gray-400"),h.classList.add("hidden"))},E=()=>{const m=d.selectedOptions[0],h=m?parseFloat(m.dataset.price||"0"):0,z=Math.max(1,parseInt(c.value||"1",10)),q=h*z;f.textContent=S(h),g.textContent=S(q)},w=m=>{const h=m.target;h.value=re(h.value)},b=()=>{const m=o.value;m.length===0?(o.classList.remove("border-green-500","border-red-500"),o.classList.add("border-gray-300")):U(m)?(o.classList.remove("border-gray-300","border-red-500"),o.classList.add("border-green-500")):(o.classList.remove("border-green-500","border-red-500"),o.classList.add("border-gray-300"))},v=ke(()=>{const m=$e(o.value);m&&n.toast(m)},3e3),$=m=>{m.preventDefault();const h=new FormData(T),z=P(String(h.get("fullName")||"")),q=re(String(h.get("phone")||"")),ee=P(String(h.get("deliveryAddress")||"")),J=String(h.get("foodId")||""),te=Math.max(1,Number(h.get("quantity"))||1),be=!!h.get("combo"),se=String(h.get("deliveryTime")||"");let Q="";try{const H=new Date,[V,ve]=se.split(":");H.setHours(parseInt(V,10),parseInt(ve,10),0,0),Q=H.toISOString()}catch{n.toast("Hora de entrega inválida.");return}if(!z||!q||!ee){n.toast("Completa todos los campos requeridos.");return}if(!U(q)){n.toast("El formato del teléfono es inválido."),o.focus(),o.classList.add("border-red-500");return}if(!J){n.toast("Selecciona una comida.");return}if(!se){n.toast("Selecciona una hora de entrega.");return}const W=x.findById(J);if(!W){n.toast("La comida seleccionada no fue encontrada.");return}if(W.stock<te){n.toast(`Stock insuficiente para "${W.name}". Stock actual: ${W.stock}.`);return}const ae=le(q);if(ae){const H=k.getAll().find(V=>t&&V.id===t.id?!1:le(V.phone)===ae);if(H){n.toast(`El teléfono ya está registrado para el cliente '${H.fullName}'.`),o.focus(),o.classList.add("border-red-500");return}}const ie=JSON.parse(localStorage.getItem("fd_meta_v1")||"{}").deliveryGapMinutes??15;if(k.checkConflict(Q,q,ie,t?.id).conflict){n.toast(`Hay conflicto de horario (gap ${ie} min). Elige otra hora.`);return}const oe={fullName:z,phone:q,deliveryAddress:ee,foodId:J,quantity:te,combo:be,deliveryTime:Q};let G=!1;t?(G=k.update({...t,...oe}),G&&n.toast("Pedido actualizado exitosamente.")):k.add(oe)&&(G=!0,n.toast("Pedido agregado exitosamente.")),G&&(I(),l(),_())},I=()=>{try{T.removeEventListener("submit",$)}catch{}try{y.removeEventListener("click",j)}catch{}try{o.removeEventListener("input",N)}catch{}try{o.removeEventListener("blur",O)}catch{}try{o.removeEventListener("focus",M)}catch{}try{d.removeEventListener("change",B)}catch{}try{c.removeEventListener("input",R)}catch{}try{u.removeEventListener("change",Z)}catch{}},j=()=>{I(),l()},N=m=>{w(m),b(),v()},O=()=>{const m=o.value;m.length>0&&!U(m)&&(o.classList.add("border-red-500"),o.classList.remove("border-gray-300","border-green-500"))},M=()=>{o.classList.contains("border-red-500")&&(o.classList.remove("border-red-500"),o.classList.add("border-gray-300"))},B=()=>E(),R=()=>E(),Z=()=>C();T.addEventListener("submit",$),y.addEventListener("click",j),o.addEventListener("input",N),o.addEventListener("blur",O),o.addEventListener("focus",M),d.addEventListener("change",B),c.addEventListener("input",R),u.addEventListener("change",Z),C(),E(),b()}function je(e){const t=e?x.findById(e):null,s=t?k.isFoodInActiveOrder(t.id):!1,a=t?p.findLatestActiveByFoodId(t.id):null,i=a?.startTime||"08:00",l=a?.endTime||"23:00";let r="";if(t){const b=s,v=b?"disabled":"",$=b?'title="No se puede desactivar: la comida está en un pedido activo."':"",I=b?"cursor-not-allowed opacity-60":"";r=`
      <div class="grid grid-cols-2 gap-4">
        <div class="pb-2">
          <label class="text-base text-gray-500 font-bold flex items-center gap-2">
            <i class="fa fa-sort-numeric-up"></i> Stock:
          </label>
          <input name="stock" type="number" min="0" value="${t.stock}" 
            class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1" />
        </div>
        <div class="flex items-end pb-2">
          <label class="flex items-center gap-2 cursor-pointer ${I}" ${$}>
            <div class="relative">
              <input name="isActive" type="checkbox" ${t.isActive?"checked":""} ${v} class="sr-only" />
              <div class="active-checkbox w-6 h-6 border-2 border-gray-400 rounded flex items-center justify-center transition-colors">
                <i class="fa fa-check text-white text-sm hidden"></i>
              </div>
            </div>
            <span class="text-base text-gray-500 font-bold flex items-center gap-2">
              <i class="fa fa-power-off"></i> Activo
            </span>
          </label>
        </div>
      </div>`}else r=`
      <div class="pb-2">
        <label class="text-base text-gray-500 font-bold flex items-center gap-2">
          <i class="fa fa-sort-numeric-up"></i> Stock inicial:
        </label>
        <input name="stock" type="number" min="0" value="0" 
          class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1" />
      </div>`;const o=`
  <div class="relative max-h-[70vh] overflow-y-auto">
    <div class="pr-8 text-center mb-6">
      <h3 class="text-xl font-bold inline-flex items-center gap-2 justify-center">
        ${t?"Editar Comida":"Agregar Comida"}
        <i class="fa-solid fa-utensils fa-lg"></i>
      </h3>
    </div>
    <form id="foodForm" class="space-y-4">
      <div class="pb-2">
        <label class="text-base text-gray-500 font-bold flex items-center gap-2">
          <i class="fa fa-tag"></i> Nombre:
        </label>
        <input name="name" value="${t?.name??""}" required
          class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1"
          placeholder="Ingresa el nombre de la comida" />
      </div>

      <div class="grid grid-cols-2 gap-4 pb-2">
        <div>
          <label class="text-base text-gray-500 font-bold flex items-center gap-2">
            <i class="fa fa-dollar-sign"></i> Costo:
          </label>
          <input name="cost" type="number" step="0.01" min="0" value="${t?.cost??0}" 
            class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1" />
        </div>
        <div>
          <label class="text-base text-gray-500 font-bold flex items-center gap-2">
            <i class="fa fa-tag"></i> Precio:
          </label>
          <input name="price" type="number" step="0.01" min="0" value="${t?.price??0}" 
            class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1" />
        </div>
      </div>

      ${r}

      <div class="pt-4 pb-2">
        <p class="text-base text-gray-500 font-bold mb-4 flex items-center gap-2">
          <i class="fa fa-clock"></i> Horario de venta para esta sesión
        </p>
        <div class="grid grid-cols-2 gap-4">
          <div class="pb-2">
            <label class="text-base text-gray-500 font-bold flex items-center gap-2">
              <i class="fa fa-play"></i> Desde:
            </label>
            <input name="startTime" type="time" value="${i}" step="60"
              class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1" />
          </div>
          <div class="pb-2">
            <label class="text-base text-gray-500 font-bold flex items-center gap-2">
              <i class="fa fa-stop"></i> Hasta:
            </label>
            <input name="endTime" type="time" value="${l}" step="60"
              class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1" />
          </div>
        </div>
      </div>

      <div class="flex justify-center gap-4 mt-6">
        <button type="button" id="cancelFood" class="flex items-center gap-2 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-semibold text-lg">
          <i class="fa fa-times fa-lg"></i> Cancelar
        </button>
        <button type="submit" id="submitFood" class="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-semibold text-lg">
          <i class="fa ${t?"fa-edit":"fa-plus"} fa-lg"></i> ${t?"Actualizar":"Agregar"}
        </button>
      </div>
    </form>
  </div>`,{close:d,element:c}=n.modal(o,{closeOnBackdropClick:!1}),u=c.querySelector("#cancelFood"),f=c.querySelector("#foodForm"),g=c.querySelector('input[name="isActive"]'),y=()=>{if(!g)return;const b=c.querySelector(".active-checkbox"),v=b.querySelector(".fa-check");g.checked?(b.classList.add("bg-accent","border-accent"),b.classList.remove("border-gray-400"),v.classList.remove("hidden")):(b.classList.remove("bg-accent","border-accent"),b.classList.add("border-gray-400"),v.classList.add("hidden"))},T=()=>{try{f.removeEventListener("submit",w)}catch{}try{u.removeEventListener("click",C)}catch{}if(g)try{g.removeEventListener("change",E)}catch{}},C=()=>{T(),d()},E=()=>y(),w=b=>{b.preventDefault();const v=new FormData(f),$=P(String(v.get("name")||"")),I=Number(v.get("cost"))||0,j=Number(v.get("price"))||0,N=Math.max(0,Number(v.get("stock"))||0),O=String(v.get("startTime")||""),M=String(v.get("endTime")||"");if(!$){n.toast("Nombre requerido");return}if(x.nameExists($,t?.id)){n.toast("El nombre ya existe");return}if(!O||!M){n.toast("Debe especificar un horario de venta.");return}if(t){const B=!!v.get("isActive");if(s&&!B){n.toast("Actualización bloqueada: pedido activo");return}const R={...t,name:$,cost:+I.toFixed(2),price:+j.toFixed(2),stock:N,isActive:B};x.update(R,{startTime:O,endTime:M}),n.toast("Comida actualizada")}else x.add({name:$,cost:+I.toFixed(2),price:+j.toFixed(2),stock:N},{startTime:O,endTime:M}),n.toast("Comida agregada");T(),d(),_()};f.addEventListener("submit",w),u.addEventListener("click",C),g&&g.addEventListener("change",E),y()}function Ne(e){const t=x.findById(e);if(!t){n.toast("Comida no encontrada");return}let s=null;const a=l=>{const r=`
      <button id="closeHistory" class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 z-20"><i class="fa fa-times text-lg"></i></button>
      <div class="p-1">
        <button id="backToList" class="text-sm text-accent hover:underline mb-3"><i class="fa fa-arrow-left mr-2"></i>Volver a la lista</button>
        <h4 class="text-lg font-bold text-center mb-4 text-gray-800">Detalles del ${l.recordDate}</h4>
        <div class="space-y-3 text-sm bg-gray-50 p-4 rounded-lg border">
          <p class="flex justify-between"><strong><i class="fa fa-calendar-alt w-5 text-gray-500"></i>Fecha:</strong> <span>${l.recordDate}</span></p>
          <p class="flex justify-between"><strong><i class="fa fa-clock w-5 text-gray-500"></i>Horario:</strong> <span>${l.startTime} - ${l.endTime}</span></p>
          <p class="flex justify-between"><strong><i class="fa fa-cubes w-5 text-gray-500"></i>Stock Inicial:</strong> <span>${l.initialStock}</span></p>
          <p class="flex justify-between"><strong><i class="fa fa-tag w-5 text-gray-500"></i>Precio:</strong> <span>${S(l.unitPrice)}</span></p>
          <p class="flex justify-between"><strong><i class="fa fa-dollar-sign w-5 text-gray-500"></i>Costo:</strong> <span>${S(l.unitCost)}</span></p>
          <p class="flex justify-between"><strong><i class="fa fa-chart-line w-5 text-gray-500"></i>Vendidos:</strong> <span>${l.quantitySold}</span></p>
          <p class="flex justify-between"><strong><i class="fa fa-toggle-on w-5 text-gray-500"></i>Estado:</strong> <span class="font-semibold ${l.isActive?"text-green-600":"text-red-500"}">${l.isActive?"Activa":"Finalizada"}</span></p>
        </div>
      </div>`;s&&(s.element.innerHTML=r,s.element.querySelector("#closeHistory").addEventListener("click",s.close),s.element.querySelector("#backToList").addEventListener("click",i))},i=()=>{const l=p.findByFoodId(e);let r;l.length===0?r='<p class="text-gray-500 text-center py-8">No hay historial de ventas para esta comida.</p>':r=`<ul class="bg-white rounded-lg border">${l.map(c=>`
        <li class="border-b last:border-b-0">
          <button data-record-id="${c.id}" class="w-full text-left p-3 hover:bg-gray-100 flex justify-between items-center record-item transition-colors">
            <div class="font-medium"><i class="fa fa-calendar-day mr-2 text-gray-400"></i> ${c.recordDate} <span class="text-xs text-gray-500">(${c.startTime} - ${c.endTime})</span></div>
            <div class="text-sm">Vendidos: <strong>${c.quantitySold}</strong> <span class="text-xs ${Math.abs(c.unitPrice-t.price)>.001?"text-blue-500":""}">(${S(c.unitPrice)})</span></div>
          </button>
        </li>`).join("")}</ul>`;const o=`
      <button id="closeHistory" class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 z-20"><i class="fa fa-times text-lg"></i></button>
      <div class="p-1">
        <h3 class="text-xl font-bold mb-4 text-center">Historial: ${t.name}</h3>
        <div class="modal-content-container max-h-96 overflow-y-auto">
          ${r}
        </div>
      </div>`;s?s.element.innerHTML=o:s=n.modal(o,{closeOnBackdropClick:!1}),s.element.querySelector("#closeHistory").addEventListener("click",s.close),s.element.querySelectorAll(".record-item").forEach(d=>{d.addEventListener("click",c=>{const u=c.currentTarget.dataset.recordId,f=l.find(g=>g.id===u);a(f)})})};i()}Me();
