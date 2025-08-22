import{U as g}from"./ui-DeEF8Jzz.js";import{F as l,O as x}from"./core-CP5HSxHI.js";import{f as m}from"./utils-OsXyF5Oc.js";import"./vendor-D67DkiDD.js";import"fs";import"path";import"crypto";import"child_process";import"os";function A(r){setTimeout(()=>window.scrollTo(0,0),0);const a=n=>{var o,i;const c=l.getAll(),s=x.getSorted().filter(e=>e.state),f=s.filter(e=>!e.delivered).length,u=s.filter(e=>e.delivered).length,b=l.totalProfit();r.innerHTML=`<section class="space-y-4">
    <div class="grid grid-cols-2 gap-3">
      <div class="dashboard-card cursor-pointer p-3 bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border dark:border-dark-border">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <i class="fa fa-clock text-white fa-lg"></i>
          </div>
          <div class="text-lg font-bold text-gray-600 dark:text-gray-400">Pendientes</div>
        </div>
        <div class="text-2xl text-center font-bold text-gray-900 dark:text-white">${f}</div>
      </div>
      <div class="dashboard-card cursor-pointer p-3 bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border dark:border-dark-border">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <i class="fa fa-check text-white fa-lg"></i>
          </div>
          <div class="text-lg font-bold text-gray-600 dark:text-gray-400">Entregados</div>
        </div>
        <div class="text-2xl text-center font-bold text-gray-900 dark:text-white">${u}</div>
      </div>
      <div class="dashboard-card cursor-pointer p-3 bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border dark:border-dark-border">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
            <i class="fa fa-utensils text-white fa-lg"></i>
          </div>
          <div class="text-lg font-bold text-gray-600 dark:text-gray-400">Productos</div>
        </div>
        <div class="text-2xl text-center font-bold text-gray-900 dark:text-white">${c.length}</div>
      </div>
      <div class="dashboard-card cursor-pointer p-3 bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border dark:border-dark-border">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <i class="fa fa-dollar-sign text-white fa-lg"></i>
          </div>
          <div class="text-lg font-bold text-gray-600 dark:text-gray-400">Beneficios</div>
        </div>
        <div class="text-2xl text-center font-bold text-gray-900 dark:text-white">${m(b)}</div>
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
  </section>`,n&&r.querySelectorAll(".dashboard-card").forEach((t,v)=>{const d=t;d.style.opacity="0",d.style.transform="translateY(20px)",setTimeout(()=>{d.style.transition="all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",d.style.opacity="1",d.style.transform="translateY(0)"},v*100)}),(o=r.querySelector("#btnAddOrderQuick"))==null||o.addEventListener("click",e=>{const t=e.currentTarget;t.style.transform="scale(0.95)",setTimeout(()=>{t.style.transform="",document.dispatchEvent(new CustomEvent("openOrderForm"))},100)}),(i=r.querySelector("#btnAddFoodQuick"))==null||i.addEventListener("click",e=>{const t=e.currentTarget;t.style.transform="scale(0.95)",setTimeout(()=>{t.style.transform="",document.dispatchEvent(new CustomEvent("openFoodForm"))},100)})};a(!0),document.addEventListener("refreshViews",()=>{r.querySelector(".dashboard-card")&&a(!1)}),g.updateHeaderContent}export{A as renderDashboard};
