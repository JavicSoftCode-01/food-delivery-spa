var ae=Object.defineProperty,se=Object.defineProperties;var re=Object.getOwnPropertyDescriptors;var z=Object.getOwnPropertySymbols;var oe=Object.prototype.hasOwnProperty,ie=Object.prototype.propertyIsEnumerable;var V=(d,e,a)=>e in d?ae(d,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):d[e]=a,Q=(d,e)=>{for(var a in e||(e={}))oe.call(e,a)&&V(d,a,e[a]);if(z)for(var a of z(e))ie.call(e,a)&&V(d,a,e[a]);return d},G=(d,e)=>se(d,re(e));var Y=(d,e,a)=>new Promise((v,o)=>{var g=i=>{try{k(a.next(i))}catch(s){o(s)}},r=i=>{try{k(a.throw(i))}catch(s){o(s)}},k=i=>i.done?v(i.value):Promise.resolve(i.value).then(g,r);k((a=a.apply(d,e)).next())});import{U as f}from"./ui-DeEF8Jzz.js";import{F as E,O as le,a as K,n as de,f as A}from"./core-CiS44bps.js";import{f as p}from"./utils-DWTgWmvX.js";function ne(d){var P,B,_,R;if(document.getElementById("foodForm"))return;const e=d?E.findById(d):null,a=e?le.isFoodInActiveOrder(e.id):!1,v=e?JSON.parse(JSON.stringify(e.combos)):[];let o=e?JSON.parse(JSON.stringify(e.combos)):[];const g=e?K.findLatestActiveByFoodId(e.id):null,r=(g==null?void 0:g.startTime)||"08:00",k=(g==null?void 0:g.endTime)||"23:00",i=a?"opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700":"",s=a?"disabled":"",x=a&&v.length>0,w=`
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
          <input id="name" name="name" value="${(P=e==null?void 0:e.name)!=null?P:""}" required ${s}
            class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${i}"
            placeholder="Ej: Hamburguesa Clásica" />
        </div>
        <div class="${e?"grid grid-cols-3 gap-x-4":"grid grid-cols-2 gap-x-4"}">
          <div>
            <label for="cost" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-dollar-sign w-3"></i>Costo</label>
            <input id="cost" name="cost" type="number" step="0.01" min="0" value="${(B=e==null?void 0:e.cost)!=null?B:0}" ${s}
                   class="text-base text-center w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${i}"/>
          </div>
          <div>
            <label for="price" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-tag w-3"></i>Precio</label>
            <input id="price" name="price" type="number" step="0.01" min="0" value="${(_=e==null?void 0:e.price)!=null?_:0}" ${s}
                   class="text-base text-center w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${i}"/>
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
            <input id="stock" name="stock" type="number" min="0" value="${(R=e==null?void 0:e.stock)!=null?R:0}" ${s}
                   class="text-base text-center w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${i}"/>
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
            <input id="endTime" name="endTime" type="time" value="${k}" step="60"
                   class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none"/>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between">
            <label class="text-lg font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2"><i class="fa fa-gift"></i><span id="combosText">Combos</span></label>
            <label class="relative inline-flex items-center cursor-pointer ${x?"opacity-50 cursor-not-allowed":""}" title="${x?"No se puede desactivar: hay combos en uso.":""}">
              <input id="comboToggle" type="checkbox" class="sr-only peer" ${o.length>0?"checked":""} ${x?"disabled":""}>
              <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
            </label>
          </div>
          <div id="comboFieldsContainer" class="mt-2 space-y-2 ${o.length===0?"hidden":""}">
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
  </div>`,y=()=>{const t=window.innerHeight*.01;document.documentElement.style.setProperty("--vh",`${t}px`)};y(),window.addEventListener("resize",y);const{close:h,element:c}=f.modal(w,{closeOnBackdropClick:!1}),T=()=>{h(),window.removeEventListener("resize",y)},u=c.querySelector("#foodForm"),b=c.querySelector("#submitFood"),S=c.querySelector("#comboToggle"),q=c.querySelector("#comboFieldsContainer"),O=c.querySelector("#addComboBtn"),n=c.querySelector("#comboList"),I=c.querySelector("#comboQuantity"),H=c.querySelector("#comboPrice"),W=c.querySelector("#combosText");let D="";const X=()=>{const t=new FormData(u),l={name:t.get("name"),cost:t.get("cost"),price:t.get("price"),stock:t.get("stock"),isActive:t.get("isActive")==="on",startTime:t.get("startTime"),endTime:t.get("endTime"),combos:JSON.stringify(o)};D=JSON.stringify(l)},Z=()=>{const t=new FormData(u),l={name:t.get("name"),cost:t.get("cost"),price:t.get("price"),stock:t.get("stock"),isActive:t.get("isActive")==="on",startTime:t.get("startTime"),endTime:t.get("endTime"),combos:JSON.stringify(o)};return D!==JSON.stringify(l)},C=()=>{if(!e)return;const t=Z();b.disabled=!t,b.classList.toggle("opacity-50",!t),b.classList.toggle("cursor-not-allowed",!t)},j=()=>{n.innerHTML=o.length?"":'<p class="text-xs text-center text-gray-500">Aún no hay combos.</p>',o.forEach(t=>{const l=v.some(N=>N.id===t.id),m=!a||!l,$=m?"":"disabled",L=m?"bg-red-500 hover:bg-red-600":"bg-gray-400 cursor-not-allowed",F=document.createElement("div");F.className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-base",F.innerHTML=`<div><span class="font-semibold">${t.quantity}</span> unidades por <span class="font-semibold text-green-500">${p(t.price)}</span></div><button data-id="${t.id}" ${$} class="remove-combo-btn w-7 h-7 ${L} text-white rounded-full flex items-center justify-center flex-shrink-0"><i class="fa fa-times text-xs"></i></button>`,n.appendChild(F)}),n.querySelectorAll(".remove-combo-btn").forEach(t=>{t.disabled||t.addEventListener("click",l=>{const m=l.currentTarget.dataset.id;o=o.filter($=>$.id!==m),j(),C()})}),W.textContent=`Combos${o.length>0?` (${o.length})`:""}`};O.addEventListener("click",()=>{const t=parseInt(I.value,10),l=parseFloat(H.value);if(isNaN(t)||t<2){f.toast("El combo debe tener al menos 2 U.");return}if(isNaN(l)||l<=0){f.toast("El precio del combo debe ser positivo.");return}if(o.some(m=>m.quantity===t)){f.toast("Ya existe un combo con esa cantidad.");return}o.push({id:`combo_${Date.now()}`,quantity:t,price:l}),o.sort((m,$)=>m.quantity-$.quantity),j(),I.value="",H.value="",I.focus(),C()});const ee=t=>Y(null,null,function*(){t.preventDefault(),b.disabled=!0,f.showSpinner("Guardando...");try{const l=new FormData(u),m=a?e.name:de(String(l.get("name")||"")),$=a?e.cost:parseFloat(String(l.get("cost")||"0")),L=a?e.price:parseFloat(String(l.get("price")||"0")),F=a?e.stock:parseInt(String(l.get("stock")||"0"),10),N=a?e.isActive:l.get("isActive")==="on",J=String(l.get("startTime")||""),M=String(l.get("endTime")||"");if(!m){f.toast("Nombre requerido");return}if(E.nameExists(m,e==null?void 0:e.id)){f.toast("Comida existente",5e3);return}const U=S.checked?o:[];if(e){const te=G(Q({},e),{name:m,cost:$,price:L,stock:F,isActive:N,combos:U});yield E.update(te,{startTime:J,endTime:M}),f.toast("Comida actualizada.")}else yield E.add({name:m,cost:$,price:L,stock:F,combos:U},{startTime:J,endTime:M}),f.toast("Comida agregada.");T(),setTimeout(()=>document.dispatchEvent(new CustomEvent("refreshViews")),0)}finally{b.disabled=!1,f.hideSpinner()}});u.addEventListener("submit",ee),c.querySelector("#cancelFood").addEventListener("click",T),S.addEventListener("change",()=>{q.classList.toggle("hidden",!S.checked),S.checked||(o=[]),j(),C()}),j(),e&&(setTimeout(()=>{X(),C()},50),u.querySelectorAll("input, select").forEach(t=>{t.disabled||(t.addEventListener("input",C),t.addEventListener("change",C))}))}const xe=Object.freeze(Object.defineProperty({__proto__:null,openFoodForm:ne},Symbol.toStringTag,{value:"Module"}));function ce(d){const e=E.findById(d);if(!e){f.toast("Comida no encontrada");return}const a=K.findByFoodId(d);let v=null;const o=(r,k)=>{const i=r.quantitySoldSingle||0,s=Object.entries(r.comboSales||{}),x=i*r.unitPrice;let w=0,y=0;s.forEach(([O,n])=>{w+=n.quantity*n.count,y+=n.price*n.count});const h=i+w,c=x+y,T=c-h*r.unitCost,u=`
      <tr class="border-b dark:border-dark-border">
        <td class="py-2 pr-2">Venta Unitaria</td>
        <td class="py-2 text-center">${i}</td>
        <td class="py-2 text-center">${p(r.unitPrice)}</td>
        <td class="py-2 text-right font-semibold">${p(x)}</td>
      </tr>
      ${s.map(([O,n])=>`
        <tr class="border-b dark:border-dark-border">
          <td class="py-2 pr-2">Combo (${n.quantity}u) x ${n.count}</td>
          <td class="py-2 text-center">${n.quantity*n.count}</td>
          <td class="py-2 text-center">${p(n.price)}</td>
          <td class="py-2 text-right font-semibold">${p(n.price*n.count)}</td>
        </tr>
      `).join("")}
    `,b=`
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
                <div class="text-gray-900 dark:text-dark-text font-medium pl-6">${A(r.startTime)} - ${A(r.endTime)}</div>
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
                <div class="text-gray-900 dark:text-dark-text text-lg sm:text-xl font-bold">${h}</div>
              </div>
              <div>
                <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold">
                  <i class="fa-solid fa-box"></i> Disponible
                </label>
                <div class="text-gray-900 dark:text-dark-text text-lg sm:text-xl font-bold">${r.initialStock-h}</div>
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
                  <tbody>${u}</tbody>
                </table>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
              <div class="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div>
                  <label class="text-xs sm:text-sm text-gray-500">Costo Unit.</label>
                  <div class="font-semibold text-sm sm:text-base">${p(r.unitCost)}</div>
                </div>
                <div>
                  <label class="text-xs sm:text-sm text-gray-500">Precio Unit.</label>
                  <div class="font-semibold text-sm sm:text-base">${p(r.unitPrice)}</div>
                </div>
                <div>
                  <label class="text-xs sm:text-sm text-gray-500">Lucro Unit.</label>
                  <div class="font-bold text-sm sm:text-base text-blue-600 dark:text-blue-400">${p(r.unitPrice-r.unitCost)}</div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 sm:gap-4 pt-3 border-t dark:border-dark-border text-center">
                <div>
                  <label class="flex items-center justify-center gap-2 text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-300"><i class="fa fa-piggy-bank"></i>Lucro Total</label>
                  <div class="font-bold text-blue-700 dark:text-blue-400 text-xl sm:text-2xl">${p(T)}</div>
                </div>
                <div>
                  <label class="flex items-center justify-center gap-2 text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-300"><i class="fa fa-coins"></i>Venta Total</label>
                  <div class="font-bold text-green-700 dark:text-green-400 text-xl sm:text-2xl">${p(c)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`,{close:S,element:q}=f.modal(b,{closeOnBackdropClick:!1});q.querySelector("#closeRecordDetails").addEventListener("click",S),q.querySelector("#backToHistoryList").addEventListener("click",()=>{S(),k()})},g=()=>{let r;a.length===0?r='<div class="text-gray-500 dark:text-gray-400 text-center py-8 flex flex-col items-center gap-2"><i class="fa fa-inbox text-3xl opacity-50"></i><p>No hay historial de ventas para esta comida.</p></div>':r=`<div class="bg-white dark:bg-dark-bg rounded-lg border dark:border-dark-border divide-y dark:divide-dark-border">${a.map(s=>{const x=s.quantitySoldSingle||0,w=Object.values(s.comboSales||{}).reduce((u,b)=>u+b.count*b.quantity,0),y=x+w,h=x*s.unitPrice,c=Object.values(s.comboSales||{}).reduce((u,b)=>u+b.count*b.price,0),T=h+c;return`
          <div class="border-b dark:border-dark-border last:border-b-0">
            <button data-record-id="${s.id}" class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 record-detail-btn transition-colors">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full ${s.isActive?"bg-green-500":"bg-gray-400"}"></div>
                  <div>
                    <div class="font-medium text-gray-900 dark:text-dark-text"><i class="fa fa-calendar-day mr-2 text-gray-400"></i>${s.recordDate}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">${A(s.startTime)} - ${A(s.endTime)}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-gray-900 dark:text-dark-text">Vendí: <span class="text-gray-600 dark:text-gray-300">${y}</span></div>
                  <div class="text-base font-bold text-green-600">${p(T)}</div>
                </div>
              </div>
            </button>
          </div>`}).join("")}</div>`;const k=`
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
      </div>`;v=f.modal(k,{closeOnBackdropClick:!1}),v.element.querySelector("#closeHistoryModal").addEventListener("click",v.close),v.element.querySelectorAll(".record-detail-btn").forEach(i=>{i.addEventListener("click",s=>{const x=s.currentTarget.dataset.recordId,w=a.find(h=>h.id===x),y=v.close;y(),o(w,g)})})};g()}const ue=Object.freeze(Object.defineProperty({__proto__:null,openSalesHistoryModal:ce},Symbol.toStringTag,{value:"Module"}));export{xe as f,ue as s};
