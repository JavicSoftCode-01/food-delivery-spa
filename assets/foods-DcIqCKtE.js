var se=Object.defineProperty,re=Object.defineProperties;var oe=Object.getOwnPropertyDescriptors;var V=Object.getOwnPropertySymbols;var ie=Object.prototype.hasOwnProperty,le=Object.prototype.propertyIsEnumerable;var Q=(n,e,a)=>e in n?se(n,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):n[e]=a,G=(n,e)=>{for(var a in e||(e={}))ie.call(e,a)&&Q(n,a,e[a]);if(V)for(var a of V(e))le.call(e,a)&&Q(n,a,e[a]);return n},Y=(n,e)=>re(n,oe(e));var K=(n,e,a)=>new Promise((y,i)=>{var g=l=>{try{h(a.next(l))}catch(s){i(s)}},r=l=>{try{h(a.throw(l))}catch(s){i(s)}},h=l=>l.done?y(l.value):Promise.resolve(l.value).then(g,r);h((a=a.apply(n,e)).next())});import{U as m}from"./ui-DeEF8Jzz.js";import{F as j,O as de,a as W,n as ne,f as O}from"./core-BboQpoEq.js";import{f as v}from"./utils-CHR9XXmZ.js";function ce(n){var B,_,R,J;if(document.getElementById("foodForm"))return;const e=n?j.findById(n):null,a=e?de.isFoodInActiveOrder(e.id):!1,y=e?JSON.parse(JSON.stringify(e.combos)):[];let i=e?JSON.parse(JSON.stringify(e.combos)):[];const g=e?W.findLatestActiveByFoodId(e.id):null,r=(g==null?void 0:g.startTime)||"08:00",h=(g==null?void 0:g.endTime)||"23:00",l=a?"opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700":"",s=a?"disabled":"",u=a&&y.length>0,T=`
  <div class="flex flex-col h-full max-h-[calc(90*var(--vh,1vh))] bg-white dark:bg-gray-900 rounded-lg overflow-hidden text-sm sm:text-base">
    <div class="flex-shrink-0 p-2">
      <h3 class="text-xl font-bold text-center flex items-center justify-center gap-2">
        <i class="fa-solid fa-utensils"></i>
        <span>${e?"Editar Comida":"Agregar Comida"}</span>
        ${a?'<span class="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">🔒 EN USO</span>':""}
      </h3>
      ${a?`
        <div class="hidden lg:block text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
          Solo se permite agregar nuevos combos.
        </div>
      `:""}

     <!-- ${a?'<div class="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">Solo se permite agregar nuevos combos.</div>':""}-->
    </div>
    <div class="flex-1 overflow-y-auto p-2 -mt-4">
      <form id="foodForm" class="space-y-3">
        <div>
          <label for="name" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-tag w-4"></i>Nombre</label>
          <input id="name" name="name" value="${(B=e==null?void 0:e.name)!=null?B:""}" required ${s}
            class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${l}"
            placeholder="Ej: Hamburguesa Clásica" />
        </div>
        <div class="${e?"grid grid-cols-3 gap-x-4":"grid grid-cols-2 gap-x-4"}">
          <div>
            <label for="cost" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-dollar-sign w-3"></i>Costo</label>
            <input id="cost" name="cost" type="number" step="0.01" min="0" value="${(_=e==null?void 0:e.cost)!=null?_:0}" ${s}
                   class="text-base text-center w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${l}"/>
          </div>
          <div>
            <label for="price" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-tag w-3"></i>Precio</label>
            <input id="price" name="price" type="number" step="0.01" min="0" value="${(R=e==null?void 0:e.price)!=null?R:0}" ${s}
                   class="text-base text-center w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${l}"/>
          </div>
          ${e?`
            <div class="flex flex-col justify-center ${a?"opacity-60":""}" 
                 title="${a?"No se puede desactivar: la comida está en un pedido activo.":"Activar/desactivar comida"}">
              <label for="isActive" class="flex flex-col gap-2 ${a?"cursor-not-allowed":"cursor-pointer"}">
                <span class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400">
                  <i class="fa fa-power-off w-3"></i> Activa
                </span>
                <div class="relative">
                  <input id="isActive" name="isActive" type="checkbox" ${e.isActive?"checked":""} ${s} class="sr-only peer" />
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
            <input id="stock" name="stock" type="number" min="0" value="${(J=e==null?void 0:e.stock)!=null?J:0}" ${s}
                   class="text-base text-center w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${l}"/>
          </div>
          <div>
            <label for="startTime" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400">
              <i class="fa fa-play w-3"></i>Hora I.
            </label>
            <input id="startTime" name="startTime" type="time" value="${r}" step="60"
                   class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none"/>
          </div>
          <div>
            <label for="endTime" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400">
              <i class="fa fa-stop w-3"></i>Hora F.
            </label>
            <input id="endTime" name="endTime" type="time" value="${h}" step="60"
                   class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none"/>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between">
            <label class="text-lg font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2"><i class="fa fa-gift"></i><span id="combosText">Combos</span></label>
            <label class="relative inline-flex items-center cursor-pointer ${u?"opacity-50 cursor-not-allowed":""}" title="${u?"No se puede desactivar: hay combos en uso.":""}">
              <input id="comboToggle" type="checkbox" class="sr-only peer" ${i.length>0?"checked":""} ${u?"disabled":""}>
              <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
            </label>
          </div>
          <div id="comboFieldsContainer" class="mt-2 space-y-2 ${i.length===0?"hidden":""}">
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
  </div>`,k=()=>{const t=window.innerHeight*.01;document.documentElement.style.setProperty("--vh",`${t}px`)};k(),window.addEventListener("resize",k);const{close:w,element:d}=m.modal(T,{closeOnBackdropClick:!1}),F=()=>{w(),window.removeEventListener("resize",k)},x=d.querySelector("#foodForm"),f=d.querySelector("#submitFood"),E=d.querySelector("#comboToggle"),A=d.querySelector("#comboFieldsContainer"),$=d.querySelector("#addComboBtn"),c=d.querySelector("#comboList"),p=d.querySelector("#comboQuantity"),H=d.querySelector("#comboPrice"),X=d.querySelector("#combosText");let D="";const P=()=>{const t=d.querySelector("#stock"),o=parseInt(t.value,10)||0,b=parseInt(p.value,10)||0;p.classList.remove("border-red-500","border-green-500"),p.classList.add("border-gray-300"),b>0?b>o?(p.classList.remove("border-gray-300"),p.classList.add("border-red-500"),$.disabled=!0,$.classList.add("opacity-50","cursor-not-allowed"),m.toast(`La cantidad del combo (${b}) excede el stock disponible (${o})`,6e3)):(p.classList.remove("border-gray-300"),p.classList.add("border-green-500"),$.disabled=!1,$.classList.remove("opacity-50","cursor-not-allowed")):($.disabled=!1,$.classList.remove("opacity-50","cursor-not-allowed"))},Z=()=>{const t=new FormData(x),o={name:t.get("name"),cost:t.get("cost"),price:t.get("price"),stock:t.get("stock"),isActive:t.get("isActive")==="on",startTime:t.get("startTime"),endTime:t.get("endTime"),combos:JSON.stringify(i)};D=JSON.stringify(o)},ee=()=>{const t=new FormData(x),o={name:t.get("name"),cost:t.get("cost"),price:t.get("price"),stock:t.get("stock"),isActive:t.get("isActive")==="on",startTime:t.get("startTime"),endTime:t.get("endTime"),combos:JSON.stringify(i)};return D!==JSON.stringify(o)},q=()=>{if(!e)return;const t=ee();f.disabled=!t,f.classList.toggle("opacity-50",!t),f.classList.toggle("cursor-not-allowed",!t)},I=()=>{c.innerHTML=i.length?"":'<p class="text-xs text-center text-gray-500">Aún no hay combos.</p>',i.forEach(t=>{const o=y.some(N=>N.id===t.id),b=!a||!o,S=b?"":"disabled",C=b?"bg-red-500 hover:bg-red-600":"bg-gray-400 cursor-not-allowed",L=document.createElement("div");L.className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-base",L.innerHTML=`<div><span class="font-semibold">${t.quantity}</span> unidades por <span class="font-semibold text-green-500">${v(t.price)}</span></div><button data-id="${t.id}" ${S} class="remove-combo-btn w-7 h-7 ${C} text-white rounded-full flex items-center justify-center flex-shrink-0"><i class="fa fa-times text-xs"></i></button>`,c.appendChild(L)}),c.querySelectorAll(".remove-combo-btn").forEach(t=>{t.disabled||t.addEventListener("click",o=>{const b=o.currentTarget.dataset.id;i=i.filter(S=>S.id!==b),I(),q()})}),X.textContent=`Combos${i.length>0?` (${i.length})`:""}`};$.addEventListener("click",()=>{const t=parseInt(p.value,10),o=parseFloat(H.value),b=d.querySelector("#stock"),S=parseInt(b.value,10)||0;if(isNaN(t)||t<2){m.toast("El combo debe tener al menos 2 U.");return}if(t>S){m.toast(`La cantidad del combo (${t}) excede el stock disponible (${S})`);return}if(isNaN(o)||o<=0){m.toast("El precio del combo debe ser positivo.");return}if(i.some(C=>C.quantity===t)){m.toast("Ya existe un combo con esa cantidad.");return}i.push({id:`combo_${Date.now()}`,quantity:t,price:o}),i.sort((C,L)=>C.quantity-L.quantity),I(),p.value="",H.value="",p.focus(),q()});const te=t=>K(null,null,function*(){t.preventDefault(),f.disabled=!0,m.showSpinner("Guardando...");try{const o=new FormData(x),b=a?e.name:ne(String(o.get("name")||"")),S=a?e.cost:parseFloat(String(o.get("cost")||"0")),C=a?e.price:parseFloat(String(o.get("price")||"0")),L=a?e.stock:parseInt(String(o.get("stock")||"0"),10),N=a?e.isActive:o.get("isActive")==="on",M=String(o.get("startTime")||""),U=String(o.get("endTime")||"");if(!b){m.toast("Nombre requerido");return}if(j.nameExists(b,e==null?void 0:e.id)){m.toast("Comida existente",5e3);return}const z=E.checked?i:[];if(e){const ae=Y(G({},e),{name:b,cost:S,price:C,stock:L,isActive:N,combos:z});yield j.update(ae,{startTime:M,endTime:U}),m.toast("Comida actualizada.")}else yield j.add({name:b,cost:S,price:C,stock:L,combos:z},{startTime:M,endTime:U}),m.toast("Comida agregada.");F(),setTimeout(()=>document.dispatchEvent(new CustomEvent("refreshViews")),0)}finally{f.disabled=!1,m.hideSpinner()}});x.addEventListener("submit",te),d.querySelector("#cancelFood").addEventListener("click",F),E.addEventListener("change",()=>{A.classList.toggle("hidden",!E.checked),E.checked||(i=[]),I(),q()}),d.querySelector("#stock").addEventListener("input",P),p.addEventListener("input",P),I(),e&&(setTimeout(()=>{Z(),q()},50),x.querySelectorAll("input, select").forEach(t=>{t.disabled||(t.addEventListener("input",q),t.addEventListener("change",q))}))}const xe=Object.freeze(Object.defineProperty({__proto__:null,openFoodForm:ce},Symbol.toStringTag,{value:"Module"}));function be(n){const e=j.findById(n);if(!e){m.toast("Comida no encontrada");return}const a=W.findByFoodId(n);let y=null;const i=(r,h)=>{const l=r.quantitySoldSingle||0,s=Object.entries(r.comboSales||{}),u=l*r.unitPrice;let T=0,k=0;s.forEach(([$,c])=>{T+=c.quantity*c.count,k+=c.price*c.count});const w=l+T,d=u+k,F=d-w*r.unitCost,x=`
      <tr class="border-b dark:border-dark-border">
        <td class="py-2 pr-2">Venta Unitaria</td>
        <td class="py-2 text-center">${l}</td>
        <td class="py-2 text-center">${v(r.unitPrice)}</td>
        <td class="py-2 text-right font-semibold">${v(u)}</td>
      </tr>
      ${s.map(([$,c])=>`
        <tr class="border-b dark:border-dark-border">
          <td class="py-2 pr-2">Combo (${c.quantity}u) x ${c.count}</td>
          <td class="py-2 text-center">${c.quantity*c.count}</td>
          <td class="py-2 text-center">${v(c.price)}</td>
          <td class="py-2 text-right font-semibold">${v(c.price*c.count)}</td>
        </tr>
      `).join("")}
    `,f=`
      <div class="flex flex-col h-full max-h-[90vh] text-sm sm:text-base bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
        <div class="flex-shrink-0 p-3 sm:p-4 border-b dark:border-dark-border flex items-center justify-between gap-4">
          <button id="backToHistoryList" class="text-accent hover:underline flex items-center gap-1.5 text-sm">
            <i class="fa fa-arrow-left"></i>
            <span class="hidden sm:inline">Volver</span>
          </button>
          <h3 class="text-base sm:text-xl font-bold text-center truncate">Detalles ${r.recordDate}</h3>
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
                <div class="text-gray-900 dark:text-dark-text font-medium pl-6">${O(r.startTime)} - ${O(r.endTime)}</div>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-2 sm:gap-4 text-center mt-3">
              <div>
                <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold">
                  <i class="fa-solid fa-boxes-stacked"></i> Stock
                </label>
                <div class="text-gray-900 dark:text-dark-text text-lg sm:text-xl font-bold">${r.initialStock}</div>
              </div>
              <div>
                <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold">
                  <i class="fa fa-shopping-cart"></i> Vendido
                </label>
                <div class="text-gray-900 dark:text-dark-text text-lg sm:text-xl font-bold">${w}</div>
              </div>
              <div>
                <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold">
                  <i class="fa-solid fa-box"></i> Disponible
                </label>
                <div class="text-gray-900 dark:text-dark-text text-lg sm:text-xl font-bold">${r.initialStock-w}</div>
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
                  <tbody>${x}</tbody>
                </table>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
              <div class="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div>
                  <label class="text-xs sm:text-sm text-gray-500">Costo Unit.</label>
                  <div class="font-semibold text-sm sm:text-base">${v(r.unitCost)}</div>
                </div>
                <div>
                  <label class="text-xs sm:text-sm text-gray-500">Precio Unit.</label>
                  <div class="font-semibold text-sm sm:text-base">${v(r.unitPrice)}</div>
                </div>
                <div>
                  <label class="text-xs sm:text-sm text-gray-500">Lucro Unit.</label>
                  <div class="font-bold text-sm sm:text-base text-blue-600 dark:text-blue-400">${v(r.unitPrice-r.unitCost)}</div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 sm:gap-4 pt-3 border-t dark:border-dark-border text-center">
                <div>
                  <label class="flex items-center justify-center gap-2 text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-300"><i class="fa fa-piggy-bank"></i>Lucro Total</label>
                  <div class="font-bold text-blue-700 dark:text-blue-400 text-xl sm:text-2xl">${v(F)}</div>
                </div>
                <div>
                  <label class="flex items-center justify-center gap-2 text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-300"><i class="fa fa-coins"></i>Venta Total</label>
                  <div class="font-bold text-green-700 dark:text-green-400 text-xl sm:text-2xl">${v(d)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`,{close:E,element:A}=m.modal(f,{closeOnBackdropClick:!1});A.querySelector("#closeRecordDetails").addEventListener("click",E),A.querySelector("#backToHistoryList").addEventListener("click",()=>{E(),h()})},g=()=>{let r;a.length===0?r='<div class="text-gray-500 dark:text-gray-400 text-center py-8 flex flex-col items-center gap-2"><i class="fa fa-inbox text-3xl opacity-50"></i><p>No hay historial de ventas para esta comida.</p></div>':r=`<div class="bg-white dark:bg-dark-bg rounded-lg border dark:border-dark-border divide-y dark:divide-dark-border">${a.map(s=>{const u=s.quantitySoldSingle||0,T=Object.values(s.comboSales||{}).reduce((x,f)=>x+f.count*f.quantity,0),k=u+T,w=u*s.unitPrice,d=Object.values(s.comboSales||{}).reduce((x,f)=>x+f.count*f.price,0),F=w+d;return`
          <div class="border-b dark:border-dark-border last:border-b-0">
            <button data-record-id="${s.id}" class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 record-detail-btn transition-colors">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full ${s.isActive?"bg-green-500":"bg-gray-400"}"></div>
                  <div>
                    <div class="font-medium text-gray-900 dark:text-dark-text"><i class="fa fa-calendar-day mr-2 text-gray-400"></i>${s.recordDate}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">${O(s.startTime)} - ${O(s.endTime)}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-gray-900 dark:text-dark-text">Vendí: <span class="text-gray-600 dark:text-gray-300">${k}</span></div>
                  <div class="text-base font-bold text-green-600">${v(F)}</div>
                </div>
              </div>
            </button>
          </div>`}).join("")}</div>`;const h=`
      <div class="relative max-h-[80vh] overflow-y-auto">
        <button id="closeHistoryModal" class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 z-20">
          <i class="fa fa-times text-lg"></i>
        </button>
        <div class="pr-8 p-4">
          <h3 class="text-xl font-bold mb-4 text-center">
            <i class="fa fa-history mr-2"></i>Historial: ${e.name}
          </h3>
          <div class="max-h-96 overflow-y-auto">${r}</div>
        </div>
      </div>`;y=m.modal(h,{closeOnBackdropClick:!1}),y.element.querySelector("#closeHistoryModal").addEventListener("click",y.close),y.element.querySelectorAll(".record-detail-btn").forEach(l=>{l.addEventListener("click",s=>{const u=s.currentTarget.dataset.recordId,T=a.find(w=>w.id===u),k=y.close;k(),i(T,g)})})};g()}const pe=Object.freeze(Object.defineProperty({__proto__:null,openSalesHistoryModal:be},Symbol.toStringTag,{value:"Module"}));export{xe as f,pe as s};
