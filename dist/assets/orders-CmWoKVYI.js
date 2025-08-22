var Me=Object.defineProperty;var Se=Object.getOwnPropertySymbols;var Qe=Object.prototype.hasOwnProperty,Be=Object.prototype.propertyIsEnumerable;var Ee=(r,e,t)=>e in r?Me(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,X=(r,e)=>{for(var t in e||(e={}))Qe.call(e,t)&&Ee(r,t,e[t]);if(Se)for(var t of Se(e))Be.call(e,t)&&Ee(r,t,e[t]);return r};var Y=(r,e,t)=>new Promise((c,l)=>{var m=y=>{try{b(t.next(y))}catch(T){l(T)}},g=y=>{try{b(t.throw(y))}catch(T){l(T)}},b=y=>y.done?c(y.value):Promise.resolve(y.value).then(m,g);b((t=t.apply(r,e)).next())});import{U as s}from"./ui-DeEF8Jzz.js";import{O as w,u as _e,F as H,n as Ie,b as Te,i as Z,t as Le,d as He}from"./core-CP5HSxHI.js";import{a as ee,f as I}from"./utils-OsXyF5Oc.js";function Ce(r,e,t,c){const l=e.checked,m=l?"ENTREGAR":"REVERTIR ENTREGA";e.checked=!l,t(!l);const g=`
    <div class="">
      <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <div class="font-bold text-lg text-gray-900 dark:text-white"><i class="fa fa-user text-blue-500"></i> ${r.fullName}</div>
        <div class="font-semibold text-gray-600 dark:text-gray-400"><i class="fa-solid fa-location-dot text-red-500"></i> ${r.deliveryAddress}</div>
        <div class="font-semibold text-gray-600 dark:text-gray-400 pb-3"><i class="fa fa-clock text-blue-500"></i> ${ee(r.deliveryTime)}</div>
        <div class="font-semibold text-gray-600 dark:text-gray-400 pb-3"><i class="fa fa-mobile text-indigo-500"></i> ${r.phone}</div>
        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
          <div class="flex items-center justify-center gap-2 text-yellow-800 dark:text-yellow-200">
            <i class="fa fa-info-circle fa-lg"></i>
            <span class="font-medium"><div class="text-lg font-bold">${m} PEDIDO</div></span>
          </div>
        </div>
      </div>
    </div>`;s.confirm(g,()=>{s.showSpinner(`${l?"Entregando":"Revirtiendo"} pedido...`),setTimeout(()=>Y(null,null,function*(){try{(yield w.updateDeliveryStatus(r.id,l))?(e.checked=l,t(l),_e(),c(),s.toast(l?`Pedido ENTREGADO a ${r.fullName}`:`Entrega REVERTIDA para ${r.fullName}`)):s.toast("❌ Error: No se pudo actualizar el pedido")}catch(b){s.toast("❌ Error crítico al actualizar el pedido")}finally{s.hideSpinner()}}),150)},()=>{})}const Xe=Object.freeze(Object.defineProperty({__proto__:null,handleDeliveryToggle:Ce},Symbol.toStringTag,{value:"Module"}));function Re(r){var me,ge,pe,ve,xe;if(document.getElementById("orderForm"))return;const e=r?w.findById(r):null,c=H.getAll().filter(a=>a.isActive||e&&a.id===e.foodId).map(a=>{const i=w.getReservedStockForFood(a.id),d=a.stock-i;return`<option ${(e==null?void 0:e.foodId)===a.id?"selected":""} value="${a.id}" data-price="${a.price}">${a.name} (Disp: ${d})</option>`}).join(""),l=e?new Date(e.deliveryTime).toTimeString().slice(0,5):"",m=e?e.delivered:!1,g=m?"disabled":"",b=m?"opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700":"",y=`
  <div class="flex flex-col h-full max-h-[calc(90*var(--vh,1vh))] bg-white dark:bg-gray-900 rounded-lg overflow-hidden text-sm sm:text-base">
    <div class="flex-shrink-0 p-2">
      <h3 class="text-xl font-bold text-center flex items-center justify-center gap-2">
        <i class="fa-solid fa-file-invoice-dollar"></i>
        <span>${e?"Editar Pedido":"Agregar Pedido"}</span>
        ${m?'<span class="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">🔒 ENTREGADO</span>':""}
      </h3>
    </div>
    <div class="flex-1 overflow-y-auto p-2 -mt-1">
      <form id="orderForm" class="space-y-4">
        <div>
          <label for="fullName" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-user w-4"></i>Nombres</label>
          <input id="fullName" name="fullName" value="${(me=e==null?void 0:e.fullName)!=null?me:""}" required ${g}
            class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${b}"
            placeholder="Ingresar nombres completos" />
        </div>
        <div>
          <label for="deliveryAddress" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-map-marker-alt w-4"></i>Dirección</label>
          <input id="deliveryAddress" name="deliveryAddress" value="${(ge=e==null?void 0:e.deliveryAddress)!=null?ge:""}" required ${g}
            class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${b}"
            placeholder="Ingresar dirección" />
        </div>
        <div class="grid grid-cols-2 gap-x-4">
          <div>
            <label for="phone" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-phone w-4"></i>Teléfono</label>
            <input id="phone" name="phone" value="${(pe=e==null?void 0:e.phone)!=null?pe:""}" required type="tel" inputmode="tel" ${g}
              placeholder="Formato 09 o +593"
              class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${b}" />
          </div>
          <div>
            <label for="deliveryTime" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-clock w-4"></i>Hora</label>
            <input id="deliveryTime" name="deliveryTime" type="time" value="${l}" required ${g}
              class="text-base w-full bg-transparent p-1 mb-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${b}" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-x-4">
          <div>
            <div class="flex justify-between items-center">
              <label for="foodId" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-utensils w-4"></i>Comida</label>
              <div id="unitPriceDisplay" class="text-sm text-gray-500 dark:text-gray-400 font-semibold"></div>
            </div>
            <select id="foodId" name="foodId" ${g} class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${b}">
              <option value="">Elegir comida</option>
              ${c}
            </select>
          </div>
          <div id="comboContainer">
            <label for="comboId" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-gift w-4"></i>Combo</label>
            <select id="comboId" name="comboId" ${g} class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${b}">
              <option value="">Sin combo</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-x-4">
          <div class="text-center">
            <label for="quantity" class="flex items-center justify-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-sort-numeric-up w-4"></i>Cant. U.</label>
            <input id="quantity" name="quantity" type="number" min="0" value="${(ve=e==null?void 0:e.quantity)!=null?ve:0}" ${g}
              class="text-base text-center w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${b}"/>
          </div>
          <div class="text-center">
            <label for="comboQuantity" class="flex items-center justify-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-gift w-4"></i>Combos</label>
            <input id="comboQuantity" name="comboQuantity" type="number" min="0" value="${(xe=e==null?void 0:e.comboQuantity)!=null?xe:0}" ${g}
              class="text-base text-center w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${b}"/>
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
              class="flex items-center gap-2 p-2 bg-accent text-white rounded-lg font-semibold text-base transition-all duration-200 ${e&&!m?"opacity-50 cursor-not-allowed":"hover:bg-accent/90"}" 
              ${e&&!m?"disabled":""}>
        <i class="fa ${e?"fa-save":"fa-plus"} fa-lg"></i> 
        ${e?"Actualizar":"Agregar"}
      </button>
    </div>
  </div>`,T=()=>{const a=window.innerHeight*.01;document.documentElement.style.setProperty("--vh",`${a}px`)};T(),window.addEventListener("resize",T);const{close:W,element:u}=s.modal(y,{closeOnBackdropClick:!1}),Q=()=>{W(),window.removeEventListener("resize",T)},o=u.querySelector('input[name="phone"]'),n=u.querySelector('select[name="foodId"]'),f=u.querySelector('select[name="comboId"]'),L=u.querySelector('input[name="quantity"]'),v=u.querySelector('input[name="comboQuantity"]'),O=u.querySelector("#totalPrice"),A=u.querySelector("#unitPriceDisplay"),B=u.querySelector("#cancelOrder"),$=u.querySelector("#orderForm"),C=$.querySelector('input[name="fullName"]'),_=$.querySelector('input[name="deliveryAddress"]'),D=$.querySelector('input[name="deliveryTime"]'),S=u.querySelector("#submitOrder");let J=null;const Pe=()=>{e&&(J={fullName:C.value,phone:o.value,deliveryAddress:_.value,deliveryTime:D.value,foodId:n.value,quantity:parseInt(L.value,10)||0,comboId:f.value,comboQuantity:parseInt(v.value,10)||0})},Ne=()=>({fullName:C.value,phone:o.value,deliveryAddress:_.value,deliveryTime:D.value,foodId:n.value,quantity:parseInt(L.value,10)||0,comboId:f.value,comboQuantity:parseInt(v.value,10)||0}),te=()=>{if(!e||!J)return!0;const a=Ne();return JSON.stringify(J)!==JSON.stringify(a)},q=()=>{if(!e)return;if(m){S.disabled=!0,S.className="flex items-center gap-2 p-2 bg-gray-400 text-white rounded-lg cursor-not-allowed font-semibold text-base opacity-50",S.title="No se puede modificar un pedido entregado";return}const a=te();S.disabled=!a,a?(S.className="flex items-center gap-2 p-2 bg-accent text-white rounded-lg hover:bg-accent/90 font-semibold text-base transition-all duration-200",S.title="Guardar cambios"):(S.className="flex items-center gap-2 p-2 bg-gray-400 text-white rounded-lg cursor-not-allowed font-semibold text-base opacity-50 transition-all duration-200",S.title="No hay cambios para guardar")},R=()=>{const a=n.selectedOptions[0],i=a?H.findById(a.value):null;if(!i){O.textContent=I(0),A.textContent="",f.innerHTML='<option value="">Elegir combo</option>',v.disabled=!0;return}A.textContent=`${I(i.price)}`;const d=f.value,h=parseInt(L.value,10)||0,k=parseInt(v.value,10)||0;let P=h*i.price;if(d){const x=i.combos.find(N=>N.id===d);x&&(P+=k*x.price),v.disabled=m}else v.disabled=!0;O.textContent=I(P)},ae=a=>{const i=H.findById(a);f.innerHTML='<option value="">Sin combo</option>',i&&i.combos.length>0&&i.combos.forEach(d=>{const h=document.createElement("option");h.value=d.id,h.textContent=`${d.quantity} Uds. x ${I(d.price)}`,e&&e.comboId===d.id&&(h.selected=!0),f.appendChild(h)}),f.value&&(v.value=(e==null?void 0:e.comboQuantity.toString())||"1"),R(),q()},Oe=He(()=>{const a=(()=>{const i=o.value.replace(/\s/g,"");return i.startsWith("09")||i.startsWith("+5939")||!i?null:"Formato válido: '09xxxxxxxx' o '+5939xxxxxxxx'"})();a&&s.toast(a)},3e3),Ae=(a,i)=>{const d=Math.abs(i)*60*1e3,h=w.getAll().filter(x=>!(e&&x.id===e.id)).map(x=>new Date(x.deliveryTime).getTime());let k=a,P=0;for(;;){const x=h.filter(F=>Math.abs(k-F)<d);if(x.length===0)break;const N=Math.max(...x);if(k=Math.max(k,N+d),P++,P>50)break}return k},re=a=>Y(null,null,function*(){var i;if(a.preventDefault(),e&&e.delivered){s.toast("❌ No se puede modificar un pedido que ya fue entregado");return}if(e&&!te()){s.toast("ℹ️ No hay cambios para guardar");return}S.disabled=!0,s.showSpinner("Espere un momento...");try{const d=new FormData($),h=Ie(String(d.get("fullName")||"")),k=Te(String(d.get("phone")||"")),P=Ie(String(d.get("deliveryAddress")||"")),x=String(d.get("foodId")||""),N=parseInt(String(d.get("quantity")||"0"),10),F=String(d.get("comboId")||"")||null,ye=parseInt(String(d.get("comboQuantity")||"0"),10),he=String(d.get("deliveryTime")||"");if(!he){s.toast("Selecciona una hora de entrega.");return}let V="";try{const p=new Date,[E,M]=he.split(":");p.setHours(parseInt(E,10),parseInt(M,10),0,0),V=p.toISOString()}catch(p){s.toast("Hora de entrega inválida.");return}if(!h||!k||!P){s.toast("Completa todos los campos requeridos.");return}if(!Z(k)){s.toast("El formato del teléfono es inválido."),o.focus(),o.classList.add("border-red-500");return}if(!x){s.toast("Selecciona una comida.");return}const G=H.findById(x);if(!G){s.toast("La comida seleccionada no fue encontrada.");return}let ke=N;if(F){const p=G.combos.find(E=>E.id===F);p&&(ke+=p.quantity*ye)}if(G.stock<ke){s.toast(`Stock insuficiente para "${G.name}".`);return}if(N===0&&!F){s.toast("Agrega al menos un item o un combo al pedido.");return}const we=Le(k);if(we){const p=w.getAll().find(E=>e&&E.id===e.id?!1:Le(E.phone)===we);if(p){s.toast(`El teléfono ya está registrado para el cliente '${p.fullName}'.`),o.focus(),o.classList.add("border-red-500");return}}const K=(i=JSON.parse(localStorage.getItem("fd_meta_v1")||"{}").deliveryGapMinutes)!=null?i:15;if(w.checkConflict(V,K,e==null?void 0:e.id).conflict){const p=new Date(V).getTime(),E=Ae(p,K),M=new Date(E),je=String(M.getHours()).padStart(2,"0"),Fe=String(M.getMinutes()).padStart(2,"0");D.value=`${je}:${Fe}`,s.toast(`Conflicto de entrega. Hora ajustada para cumplir ${K} min de intervalo.`,7e3),q();return}const $e={fullName:h,phone:k,deliveryAddress:P,foodId:x,quantity:N,comboId:F,comboQuantity:ye,deliveryTime:V};let U=!1;if(e){U=yield w.update(X(X({},e),$e)),U&&(s.toast("Pedido actualizado."),oe(),Q(),document.dispatchEvent(new CustomEvent("refreshViews")));return}else(yield w.add($e))&&(U=!0,s.toast("Pedido agregado."));if(U){document.dispatchEvent(new CustomEvent("refreshViews")),$.reset(),L.value="0",v.value="0",n.value="",f.innerHTML='<option value="">Sin combo</option>',o.value="",C.value="",_.value="";const p=new Date,E=String(p.getHours()).padStart(2,"0"),M=String(p.getMinutes()).padStart(2,"0");D.value=`${E}:${M}`,R(),q(),C.focus()}}finally{(!e||!m)&&(S.disabled=!1),s.hideSpinner()}}),oe=()=>{$.removeEventListener("submit",re),B.removeEventListener("click",se),o.removeEventListener("input",ne),o.removeEventListener("blur",ie),o.removeEventListener("focus",de),n.removeEventListener("change",ce),f.removeEventListener("change",ue),L.removeEventListener("input",fe),v.removeEventListener("input",be),C.removeEventListener("input",j),_.removeEventListener("input",j),D.removeEventListener("change",j)},se=()=>{oe(),Q()},De=a=>{const i=a.target;i.value=Te(i.value)},le=()=>{const a=o.value;a.length===0?(o.classList.remove("border-green-500","border-red-500"),o.classList.add("border-gray-300")):Z(a)?(o.classList.remove("border-gray-300","border-red-500"),o.classList.add("border-green-500")):(o.classList.remove("border-green-500","border-red-500"),o.classList.add("border-gray-300"))},ne=a=>{De(a),le(),Oe(),q()},ie=()=>{const a=o.value;a.length>0&&!Z(a)&&(o.classList.add("border-red-500"),o.classList.remove("border-gray-300","border-green-500"))},de=()=>{o.classList.contains("border-red-500")&&(o.classList.remove("border-red-500"),o.classList.add("border-gray-300"))},ce=()=>{ae(n.value),z()},ue=()=>z(),fe=()=>z(),be=()=>{parseInt(v.value,10)===0&&s.toast("La cantidad de combos debe ser mayor a 0."),z()},j=()=>q(),z=()=>{R(),q()};$.addEventListener("submit",re),B.addEventListener("click",se),o.addEventListener("input",ne),o.addEventListener("blur",ie),o.addEventListener("focus",de),n.addEventListener("change",ce),f.addEventListener("change",ue),L.addEventListener("input",fe),v.addEventListener("input",be),C.addEventListener("input",j),_.addEventListener("input",j),D.addEventListener("change",j),e&&(ae(e.foodId),setTimeout(()=>{Pe(),q()},100)),R(),le(),q()}const Ye=Object.freeze(Object.defineProperty({__proto__:null,openOrderForm:Re},Symbol.toStringTag,{value:"Module"}));function qe(r){const e=r.replace(/\D/g,"").startsWith("0")?`+593${r.replace(/\D/g,"").substring(1)}`:r.replace(/\s/g,""),t=`<div class="relative">
    <button id="closeCall" class="absolute right-1 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-55 z-10"><i class="fa fa-times text-lg"></i></button>
    <div class="text-center">
      <h3 class="text-lg font-semibold mb-4">Contactar Cliente <i class="fa fa-user"></i></h3>
      <div class="flex gap-3 justify-center">
        <button id="callPhone" class="flex flex-col items-center gap-2 p-4 border-2 dark:border-dark-border rounded-lg hover:bg-gray-75 dark:hover:bg-gray-700">
          <i class="fa-solid fa-phone-volume text-3xl text-blue-600"></i><span class="text-sm">Teléfono</span>
        </button>
        <button id="callWhatsApp" class="flex flex-col items-center gap-2 p-4 border-2 dark:border-dark-border rounded-lg hover:bg-gray-75 dark:hover:bg-gray-700">
          <i class="fab fa-whatsapp text-4xl text-green-600"></i><span class="text-sm">WhatsApp</span>
        </button>
      </div>
    </div>
  </div>`,{close:c,element:l}=s.modal(t,{closeOnBackdropClick:!1});l.querySelector("#closeCall").addEventListener("click",c),l.querySelector("#callPhone").addEventListener("click",()=>{window.open(`tel:${r}`),c()}),l.querySelector("#callWhatsApp").addEventListener("click",()=>{window.open(`https://wa.me/${e.replace(/\s/g,"")}`),c()})}const Ze=Object.freeze(Object.defineProperty({__proto__:null,showCallModal:qe},Symbol.toStringTag,{value:"Module"}));function ze(r,e){const t=w.findById(r);if(!t){s.toast("Pedido no encontrado");return}const c=H.findById(t.foodId);if(!c){s.toast("Comida no encontrada para este pedido.");return}const l=t.comboId?c.combos.find(n=>n.id===t.comboId):null,m=t.quantity*c.price,g=l&&t.comboQuantity>0?t.comboQuantity*l.price:0,b=m+g,y=t.quantity+(t.comboQuantity||0),T=`
  <div class="flex flex-col h-full max-h-[90vh] text-sm sm:text-base bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
    <div class="flex-shrink-0 p-3 sm:p-4 border-b dark:border-dark-border flex items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-file-invoice-dollar text-accent fa-2x"></i>
        <h3 class="text-base sm:text-xl font-bold truncate">Pedido de ${t.fullName}</h3>
      </div>
      <button id="closeDetails" class="w-7 h-7 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 flex-shrink-0">
        <i class="fa fa-times text-base"></i>
      </button>
    </div>
    <div class="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6">
      <div class="space-y-4">
        <div class="space-y-2 border-b dark:border-dark-border pb-2">
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold text-sm">
                <i class="fa ${t.delivered?"fa-check-circle text-green-500":"fa-clock"} w-4 text-center"></i>${t.delivered?"Entregado a las:":"Entrega:"}
              </label>
              <div class="text-gray-900 dark:text-dark-text font-medium pl-6 text-sm">${ee(t.delivered&&t.deliveredAt?t.deliveredAt:t.deliveryTime)}</div>
            </div>
            <div>
              <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold text-sm"><i class="fa fa-map-marker-alt w-4 text-center"></i>Dirección:</label>
              <div class="text-gray-900 dark:text-dark-text font-medium pl-6 text-sm">${t.deliveryAddress}</div>
            </div>
          </div>
        </div>
        <div class="border-b dark:border-dark-border">
          <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold text-sm"><i class="fa fa-bowl-food w-4 text-center"></i>Producto:</label>
          <div class="ml-6 py-1">
            <div class="flex justify-between items-center">
              <span class="font-medium text-sm">${(c==null?void 0:c.name)||"No encontrado"}</span>
              <span class="text-base text-gray-500">${I(c.price)} c/u</span>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center border-b dark:border-dark-border">
          <div>
            <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold"><i class="fa fa-shopping-cart text-sm"></i><span class="text-xs">Unitarios</span></label>
            <div class="text-gray-900 dark:text-dark-text text-lg font-bold">${t.quantity}</div>
          </div>
          <div>
            <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold"><i class="fa fa-boxes-stacked text-sm"></i><span class="text-xs">Combos</span></label>
            <div class="text-gray-900 dark:text-dark-text text-lg font-bold">${t.comboQuantity||0}</div>
          </div>
          <div>
            <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold"><i class="fa fa-calculator text-sm"></i><span class="text-xs">Total Items</span></label>
            <div class="text-gray-900 dark:text-dark-text text-lg font-bold">${y}</div>
          </div>
        </div>
        <div>
          <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-semibold"><i class="fa fa-receipt"></i>Desglose de Precios</label>
          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="text-left text-gray-500 dark:text-gray-400">
                  <th class="py-1 font-semibold">Tipo</th>
                  <th class="py-1 font-semibold text-center">Cant.</th>
                  <th class="py-1 font-semibold text-center">Precio</th>
                  <th class="py-1 font-semibold text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b dark:border-dark-border">
                  <td class="py-1 pr-2 text-xs">Venta Unitaria</td>
                  <td class="py-1 text-center text-xs">${t.quantity}</td>
                  <td class="py-1 text-center text-xs">${I(c.price)}</td>
                  <td class="py-1 text-right font-semibold text-xs">${I(m)}</td>
                </tr>
                ${l&&t.comboQuantity>0?`
                <tr class="border-b dark:border-dark-border">
                  <td class="py-1 pr-2 text-xs">Combo (${l.quantity}u)</td>
                  <td class="py-1 text-center text-xs">${t.comboQuantity}</td>
                  <td class="py-1 text-center text-xs">${I(l.price)}</td>
                  <td class="py-1 text-right font-semibold text-xs">${I(g)}</td>
                </tr>`:""}
              </tbody>
            </table>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg border-t dark:border-dark-border p-2">
          <div class="text-center border-b dark:border-dark-border pb-2 mb-2">
            <label class="flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300"><i class="fa fa-coins"></i>Total del Pedido</label>
            <div class="font-bold text-green-700 dark:text-green-400 text-xl">${I(b)}</div>
          </div>
          <div class="flex flex-col sm:flex-row justify-between items-center gap-2">
            <button id="callFromDetails" data-phone="${t.phone}" class="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors text-sm">
              <i class="fa fa-phone"></i><span class="font-bold">Llamar</span>
            </button>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600 dark:text-gray-300 font-semibold">Estado:</span>
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium ${t.delivered?"text-green-600":"text-red-600"}">${t.delivered?"Entregado":"Pendiente"}</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input id="detailsToggle" data-id="${t.id}" type="checkbox" ${t.delivered?"checked":""} class="sr-only">
                  <div id="toggleBg" class="w-10 h-5 ${t.delivered?"bg-green-600":"bg-red-500"} rounded-full relative transition-colors">
                    <div id="toggleDot" class="absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${t.delivered?"translate-x-5":"translate-x-0"}"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`,{close:W,element:u}=s.modal(T,{closeOnBackdropClick:!1});u.querySelector("#closeDetails").addEventListener("click",W),u.querySelector("#callFromDetails").addEventListener("click",n=>{const f=n.currentTarget.dataset.phone;qe(f)});const Q=u.querySelector("#detailsToggle"),o=n=>{var B,$;const f=w.findById(r);if(!f)return;const L=u.querySelector("#toggleBg"),v=u.querySelector("#toggleDot"),O=(B=u.querySelector("#detailsToggle").parentElement)==null?void 0:B.previousElementSibling;O&&(O.textContent=n?"Entregado":"Pendiente",O.className=`text-sm font-medium ${n?"text-green-600":"text-red-600"}`),L&&v&&(L.className=`w-10 h-5 ${n?"bg-green-600":"bg-red-500"} rounded-full relative transition-colors`,v.className=`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${n?"translate-x-5":"translate-x-0"}`);const A=($=u.querySelector(".fa-clock, .fa-check-circle"))==null?void 0:$.parentElement;if(A){const C=A.nextElementSibling;A.innerHTML=`<i class="fa ${n?"fa-check-circle text-green-500":"fa-clock"} w-4 text-center"></i>${n?"Entregado a las:":"Entrega:"}`,C&&(C.textContent=ee(n&&f.deliveredAt?f.deliveredAt:f.deliveryTime))}};Q.addEventListener("change",()=>{const n=w.findById(r);n&&Ce(n,Q,o,()=>e())})}const et=Object.freeze(Object.defineProperty({__proto__:null,showOrderDetails:ze},Symbol.toStringTag,{value:"Module"}));export{et as a,Ze as c,Xe as d,Ce as h,Ye as o};
