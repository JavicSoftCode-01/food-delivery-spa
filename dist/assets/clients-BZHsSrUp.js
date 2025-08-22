import{O as y,g as w,n as E}from"./core-CiS44bps.js";import{h as T}from"./orders-DI4iOo3T.js";import"./ui-DeEF8Jzz.js";import"./utils-DWTgWmvX.js";function q(i){var p;setTimeout(()=>window.scrollTo(0,0),0),i.innerHTML=`
    <div class="clients-container bg-white dark:bg-dark-bg-secondary rounded-xl p-3 border dark:border-dark-border space-y-3 mb-32 opacity-0 transform translate-y-4">
      <div class="flex gap-2 items-center">
        <input id="inputFilterPhone" placeholder="Buscar por nombre o teléfono..." class="flex-1 px-3 py-2 border dark:border-dark-border rounded-lg bg-transparent transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" inputmode="text" />
        <button id="btnAddOrder" class="px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-200 hover:scale-105 active:scale-95">
          <i class="fa-solid fa-plus fa-lg"></i>
        </button>
      </div>
      <div id="ordersList" class="space-y-3"></div>
    </div>`;const u=i.querySelector(".clients-container");requestAnimationFrame(()=>{u.style.transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",u.style.opacity="1",u.style.transform="translateY(0)"});const b=i.querySelector("#inputFilterPhone"),s=i.querySelector("#ordersList"),m=(a,n=!1)=>{if(s.innerHTML="",!a.length){const e=document.createElement("div");e.className="text-gray-500 dark:text-gray-400 text-center py-8 opacity-0 transform translate-y-4",e.innerHTML=`
        <i class="fa-solid fa-bag-shopping text-4xl mb-2 opacity-50"></i>
        <p>Sin resultados.</p>`,s.appendChild(e),requestAnimationFrame(()=>{e.style.transition="all 0.4s ease-out",e.style.opacity="1",e.style.transform="translateY(0)"});return}a.forEach((e,r)=>{const t=document.createElement("div");t.className=`order-item p-3 bg-gray-50 dark:bg-dark-bg rounded-lg border dark:border-dark-border hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer ${e.delivered?"opacity-60":""}`,n&&t.classList.add("opacity-0","transform","translate-y-4"),t.innerHTML=`
        <div class="flex items-center justify-between mb-2">
          <div class="font-semibold text-xl flex items-center min-w-0">
            <i class="fa fa-user mr-2 shrink-0 text-blue-500"></i>
            <span class="truncate text-gray-900 dark:text-white" title="${e.fullName}">${e.fullName}</span>
          </div>
          <div class="flex items-center">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium transition-all duration-200 ${e.delivered?"bg-green-100 text-green-800 hover:bg-green-200":"bg-red-100 text-red-800 hover:bg-red-200"}">
              <i class="fa ${e.delivered?"fa-check-circle":"fa-times-circle"} mr-1 text-base"></i>
              ${e.delivered?"Entregado":"Pendiente"}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 text-lg text-gray-600 dark:text-gray-300 mb-3">
          <div class="flex items-center gap-1 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/30">
            <i class="fa fa-clock text-blue-500 text-2xl"></i>
            <span class="font-semibold"><strong>${new Date(e.deliveryTime).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:!1})}</strong></span>
          </div>
          <div class="flex items-center gap-1 p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-900/30">
            <i class="fa fa-mobile text-indigo-500 text-2xl"></i>
            <span class="font-semibold"><strong>${e.phone}</strong></span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button data-phone="${e.phone}" class="callBtn flex-1 px-1 py-[17.5px] bg-green-500 text-white rounded flex items-center justify-center gap-2 hover:bg-green-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold">
            <i class="fa fa-phone fa-lg"></i>
          </button>
          <button data-id="${e.id}" class="viewOrder flex-1 px-1 py-[17.5px] bg-blue-500 text-white rounded flex items-center justify-center gap-2 hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold">
            <i class="fa fa-eye fa-lg"></i>
          </button>
          <button data-id="${e.id}" class="editOrder flex-1 px-1 py-[17.5px] bg-yellow-500 text-white rounded flex items-center justify-center gap-2 hover:bg-yellow-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold">
            <i class="fa-solid fa-pencil fa-lg"></i>
          </button>
          <label class="relative inline-flex items-center cursor-pointer ml-2">
            <input data-id="${e.id}" type="checkbox" ${e.delivered?"checked":""} class="sr-only deliveredToggle">
            <div class="toggle-bg w-11 h-6 ${e.delivered?"bg-green-600":"bg-red-500"} rounded-full transition-all duration-300">
              <div class="toggle-dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${e.delivered?"translate-x-5":"translate-x-0"}"></div>
            </div>
          </label>
        </div>`,s.appendChild(t),n&&setTimeout(()=>{t.style.transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",t.style.opacity=e.delivered?"0.6":"1",t.style.transform="translateY(0)"},r*100)}),setTimeout(()=>{s.querySelectorAll(".deliveredToggle").forEach(e=>{e.addEventListener("change",r=>{const t=r.currentTarget,d=t.dataset.id,c=y.findById(d);c&&T(c,t,l=>{var x;const h=t.nextElementSibling,k=h.firstElementChild;h.className=`toggle-bg w-11 h-6 ${l?"bg-green-600":"bg-red-500"} rounded-full transition-all duration-300`,k.className=`toggle-dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${l?"translate-x-5":"translate-x-0"}`;const f=(x=t.closest(".p-3"))==null?void 0:x.querySelector("span.inline-flex");f&&(f.className=`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium transition-all duration-200 ${l?"bg-green-100 text-green-800 hover:bg-green-200":"bg-red-100 text-red-800 hover:bg-red-200"}`,f.innerHTML=`${l?'<i class="fa fa-check-circle mr-1 text-base"></i>Entregado':'<i class="fa fa-times-circle mr-1 text-base"></i>Pendiente'}`);const v=t.closest(".p-3");v&&(v.className=`order-item p-3 bg-gray-50 dark:bg-dark-bg rounded-lg border dark:border-dark-border hover:shadow-md transition-all duration-300 hover:scale-[1.02] ${l?"opacity-60":""}`)},()=>o(!1))})}),s.querySelectorAll(".callBtn").forEach(e=>{e.addEventListener("click",r=>{const t=r.currentTarget;t.style.transform="scale(0.95)",setTimeout(()=>{t.style.transform="",document.dispatchEvent(new CustomEvent("openCallModal",{detail:{phone:t.dataset.phone}}))},100)})}),s.querySelectorAll(".viewOrder").forEach(e=>{e.addEventListener("click",r=>{const t=r.currentTarget;t.style.transform="scale(0.95)",setTimeout(()=>{t.style.transform="",document.dispatchEvent(new CustomEvent("openOrderDetails",{detail:{id:t.dataset.id}}))},100)})}),s.querySelectorAll(".editOrder").forEach(e=>{e.addEventListener("click",r=>{const t=r.currentTarget;t.style.transform="scale(0.95)",setTimeout(()=>{t.style.transform="",document.dispatchEvent(new CustomEvent("openOrderForm",{detail:{id:t.dataset.id}}))},100)})})},a.length*100+100)},o=(a=!1)=>{const n=y.getSorted(),e=b.value.toLowerCase().trim();if(!e){m(n,a);return}const r=w(e),t=n.filter(d=>{const c=E(d.fullName).toLowerCase().includes(e);let g=!1;return r.length>0&&(g=w(d.phone).includes(r)),c||g});m(t,a)};b.addEventListener("input",()=>o(!1)),(p=i.querySelector("#btnAddOrder"))==null||p.addEventListener("click",a=>{const n=a.currentTarget;n.style.transform="scale(0.95)",setTimeout(()=>{n.style.transform="",document.dispatchEvent(new CustomEvent("openOrderForm"))},100)}),document.addEventListener("refreshViews",()=>o(!1)),o(!0)}export{q as renderClients};
