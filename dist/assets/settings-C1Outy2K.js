import{U as f}from"./ui-DeEF8Jzz.js";import{u as x}from"./core-CP5HSxHI.js";import"./vendor-D67DkiDD.js";import"fs";import"path";import"crypto";import"child_process";import"os";function M(s){var m;const b=localStorage.getItem("fd_meta_v1")||"{}";let i={};try{i=JSON.parse(b)||{}}catch(t){i={}}const p=(m=i.deliveryGapMinutes)!=null?m:15,o=!!i.darkMode;s.innerHTML=`
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
              <input id="inputGap" type="number" min="0" max="120" value="${p}" class="w-16 px-2 py-1.5 border dark:border-dark-border rounded-lg text-center text-sm bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />
            </div>
          </div>
        </div>
        <div class="settings-card bg-white dark:bg-dark-bg-secondary rounded-xl p-4 border dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-300 opacity-0 transform translate-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div id="themeIconContainer" class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <i id="themeIcon" class="${o?"fa-solid fa-cloud-moon text-purple-600 dark:text-purple-400":"fa-solid fa-cloud-sun text-purple-600 dark:text-purple-400"}"></i>
              </div> 
              <div>
                <div class="font-medium text-base text-gray-900 dark:text-white">Tema</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Oscuro o Claro</div>
              </div>
            </div>
            <div>
              <button id="themeToggle" aria-pressed="${o}" title="${o?"Cambiar a modo claro":"Cambiar a modo oscuro"}" class="relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${o?"bg-blue-600":"bg-gray-300"}">
                <span class="sr-only">Cambiar tema</span>
                <span id="toggleDot" class="inline-block w-4 h-4 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${o?"translate-x-6":"translate-x-1"}"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>`,s.querySelectorAll(".settings-header, .settings-card").forEach((t,e)=>{const r=t;setTimeout(()=>{r.style.transition="all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",r.style.opacity="1",r.style.transform="translateY(0)"},e*100)});const l=s.querySelector("#inputGap"),a=s.querySelector("#themeToggle"),d=s.querySelector("#themeIcon"),c=s.querySelector("#toggleDot"),u=t=>{t?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark"),a&&c&&(a.classList.toggle("bg-blue-600",t),a.classList.toggle("bg-gray-300",!t),c.classList.toggle("translate-x-6",t),c.classList.toggle("translate-x-1",!t)),d&&(d.style.transform="scale(0.8)",d.style.opacity="0.5",setTimeout(()=>{d.className=t?"fa-solid fa-cloud-moon fa-lg text-purple-600 dark:text-purple-400":"fa-solid fa-cloud-sun fa-lg text-purple-600 dark:text-purple-400",d.style.transform="scale(1)",d.style.opacity="1"},150));const e=localStorage.getItem("fd_meta_v1")||"{}";let r={};try{r=JSON.parse(e)||{}}catch(g){r={}}r.darkMode=!!t,localStorage.setItem("fd_meta_v1",JSON.stringify(r))},y=t=>{const e=t.currentTarget,r=Number(e.value||0);if(r<0||r>120){e.style.borderColor="#ef4444",setTimeout(()=>{e.style.borderColor=""},1500);return}e.style.borderColor="#10b981",e.style.backgroundColor="#f0fdf4",setTimeout(()=>{e.style.borderColor="",e.style.backgroundColor=""},1e3);const g=localStorage.getItem("fd_meta_v1")||"{}";let n={};try{n=JSON.parse(g)||{}}catch(k){n={}}n.deliveryGapMinutes=r,localStorage.setItem("fd_meta_v1",JSON.stringify(n)),f.toast("Intervalo actualizado correctamente")},v=()=>{const e=!document.documentElement.classList.contains("dark");a&&(a.style.transform="scale(0.95)",setTimeout(()=>{a.style.transform="scale(1)"},100)),u(e),f.toast(`Modo ${e?"oscuro":"claro"} activado`),x()};l==null||l.addEventListener("change",y),l==null||l.addEventListener("input",t=>{const e=t.currentTarget,r=Number(e.value);r<0||r>120?e.style.borderColor="#ef4444":e.style.borderColor=""}),a==null||a.addEventListener("click",v),u(o)}export{M as renderSettings};
