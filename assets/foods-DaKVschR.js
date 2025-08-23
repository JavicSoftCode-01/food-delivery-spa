import{F as f,n as g,O as p}from"./core-BboQpoEq.js";import{f as b}from"./utils-CHR9XXmZ.js";import"./ui-DeEF8Jzz.js";function h(a){var u;setTimeout(()=>window.scrollTo(0,0),0),a.innerHTML=`<div class="food-container bg-white dark:bg-dark-bg-secondary rounded-xl p-3 border dark:border-dark-border space-y-3 mb-32 opacity-0 transform translate-y-4">
    <div class="flex gap-2 items-center">
      <input id="inputFilterFood" placeholder="Buscar por comida..." class="flex-1 px-3 py-2 border dark:border-dark-border rounded-lg bg-transparent transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-1 focus:ring-blue-500" />
      <button id="btnAddFood" class="px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-200 hover:scale-105 active:scale-95">
        <i class="fa-solid fa-plus fa-lg"></i>
      </button>
    </div>
    <div id="foodsList" class="space-y-3"></div>
  </div>`;const l=a.querySelector(".food-container");requestAnimationFrame(()=>{l.style.transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",l.style.opacity="1",l.style.transform="translateY(0)"});const c=a.querySelector("#inputFilterFood"),i=a.querySelector("#foodsList"),m=(o,r=!1)=>{if(i.innerHTML="",o.length===0){const e=document.createElement("div");e.className="text-gray-500 dark:text-gray-400 text-center py-8 opacity-0 transform translate-y-4",e.innerHTML=`
        <i class="fa fa-bowl-food text-4xl mb-2 opacity-50"></i>
        <p>Sin resultados.</p>`,i.appendChild(e),requestAnimationFrame(()=>{e.style.transition="all 0.4s ease-out",e.style.opacity="1",e.style.transform="translateY(0)"});return}o.forEach((e,s)=>{const t=document.createElement("div");t.className=`food-item p-3 bg-gray-50 dark:bg-dark-bg rounded-lg border dark:border-dark-border hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer ${e.isActive?"":"opacity-60"}`,r&&t.classList.add("opacity-0","transform","translate-y-4"),t.innerHTML=`
        <div class="flex items-center justify-between mb-2">
          <div class="font-semibold text-xl text-gray-900 dark:text-white">${e.name}</div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium transition-all duration-200 ${e.isActive?"bg-green-100 text-green-800 hover:bg-green-200":"bg-red-100 text-red-800 hover:bg-red-200"}">
              <i class="fa ${e.isActive?"fa-check-circle":"fa-times-circle"} mr-1 text-base"></i>
              ${e.isActive?"Activo":"Inactivo"}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-lg text-gray-600 dark:text-gray-300 mb-3">
          <div class="flex items-center gap-1 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/30">
            <i class="fa-solid fa-shopping-cart text-blue-500 text-2xl"></i>
            <span class="font-semibold"><strong>${e.amountSold||0}</strong></span>
          </div>
          <div class="flex items-center gap-1 p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 transition-colors hover:bg-orange-100 dark:hover:bg-orange-900/30">
            <i class="fa-solid fa-boxes-stacked text-orange-500 text-2xl"></i>
            <span class="font-semibold"><strong>${e.stock-p.getReservedStockForFood(e.id)}</strong></span>
          </div>
          <div class="flex items-center gap-1 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 transition-colors hover:bg-green-100 dark:hover:bg-green-900/30">
            <i class="fa-solid fa-dollar-sign text-green-500 text-2xl"></i>
            <span class="font-semibold"><strong>${b(e.price)}</strong></span>
          </div>
        </div>
        <div class="flex gap-2">
          <button data-id="${e.id}" class="salesHistoryBtn flex-1 px-1 py-1 bg-blue-500 text-white rounded flex items-center justify-center gap-2 hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold">
            <i class="fa fa-history text-lg"></i>
            Historial
          </button>
          <button data-id="${e.id}" class="editFood flex-1 px-1 py-1 bg-yellow-500 text-white rounded flex items-center justify-center gap-2 hover:bg-yellow-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold">
            <i class="fa-solid fa-store text-lg"></i>
            Venta
          </button>
        </div>`,i.appendChild(t),r&&setTimeout(()=>{t.style.transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",t.style.opacity=e.isActive?"1":"0.6",t.style.transform="translateY(0)"},s*100)}),setTimeout(()=>{i.querySelectorAll(".editFood").forEach(e=>{e.addEventListener("click",s=>{const t=s.currentTarget;t.style.transform="scale(0.95)",setTimeout(()=>{t.style.transform="",document.dispatchEvent(new CustomEvent("openFoodForm",{detail:{id:t.dataset.id}}))},100)})}),i.querySelectorAll(".salesHistoryBtn").forEach(e=>{e.addEventListener("click",s=>{const t=s.currentTarget,n=t.dataset.id;t.style.transform="scale(0.95)",setTimeout(()=>{t.style.transform="",document.dispatchEvent(new CustomEvent("openSalesHistory",{detail:{foodId:n}}))},100)})})},o.length*100+100)},d=(o=!1)=>{const r=f.getAll();r.sort((t,n)=>t.isActive&&!n.isActive?-1:!t.isActive&&n.isActive?1:t.name.localeCompare(n.name));const e=g(c.value).toLowerCase(),s=e?r.filter(t=>g(t.name).toLowerCase().includes(e)):r;m(s,o)};c.addEventListener("input",()=>d(!1)),(u=a.querySelector("#btnAddFood"))==null||u.addEventListener("click",o=>{const r=o.currentTarget;r.style.transform="scale(0.95)",setTimeout(()=>{r.style.transform="",document.dispatchEvent(new CustomEvent("openFoodForm"))},100)}),document.addEventListener("refreshViews",()=>d(!1)),d(!0)}export{h as renderFoods};
