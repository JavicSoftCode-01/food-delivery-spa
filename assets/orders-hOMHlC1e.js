var Me=Object.defineProperty;var $e=Object.getOwnPropertySymbols;var Qe=Object.prototype.hasOwnProperty,Be=Object.prototype.propertyIsEnumerable;var Se=(r,e,t)=>e in r?Me(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,K=(r,e)=>{for(var t in e||(e={}))Qe.call(e,t)&&Se(r,t,e[t]);if($e)for(var t of $e(e))Be.call(e,t)&&Se(r,t,e[t]);return r};var X=(r,e,t)=>new Promise((c,l)=>{var b=y=>{try{f(t.next(y))}catch(I){l(I)}},m=y=>{try{f(t.throw(y))}catch(I){l(I)}},f=y=>y.done?c(y.value):Promise.resolve(y.value).then(b,m);f((t=t.apply(r,e)).next())});import{U as s}from"./ui-DeEF8Jzz.js";import{O as w,u as _e,F as _,n as Ee,b as Ie,i as Y,t as Te,d as Re}from"./core-BboQpoEq.js";import{a as Le,f as E}from"./utils-CHR9XXmZ.js";function Ce(r,e,t,c){const l=e.checked,b=l?"ENTREGAR":"REVERTIR ENTREGA";e.checked=!l,t(!l);const m=`
    <div class="">
      <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <div class="font-bold text-lg text-gray-900 dark:text-white"><i class="fa fa-user text-blue-500"></i> ${r.fullName}</div>
        <div class="font-semibold text-gray-600 dark:text-gray-400"><i class="fa-solid fa-location-dot text-red-500"></i> ${r.deliveryAddress}</div>
        <div class="font-semibold text-gray-600 dark:text-gray-400 pb-3"><i class="fa fa-clock text-blue-500"></i> ${Le(r.deliveryTime)}</div>
        <div class="font-semibold text-gray-600 dark:text-gray-400 pb-3"><i class="fa fa-mobile text-indigo-500"></i> ${r.phone}</div>
        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
          <div class="flex items-center justify-center gap-2 text-yellow-800 dark:text-yellow-200">
            <i class="fa fa-info-circle fa-lg"></i>
            <span class="font-medium"><div class="text-lg font-bold">${b} PEDIDO</div></span>
          </div>
        </div>
      </div>
    </div>`;s.confirm(m,()=>{s.showSpinner(`${l?"Entregando":"Revirtiendo"} pedido...`),setTimeout(()=>X(null,null,function*(){try{(yield w.updateDeliveryStatus(r.id,l))?(e.checked=l,t(l),_e(),c(),s.toast(l?`Pedido ENTREGADO a ${r.fullName}`:`Entrega REVERTIDA para ${r.fullName}`)):s.toast("❌ Error: No se pudo actualizar el pedido")}catch(f){s.toast("❌ Error crítico al actualizar el pedido")}finally{s.hideSpinner()}}),150)},()=>{})}const Xe=Object.freeze(Object.defineProperty({__proto__:null,handleDeliveryToggle:Ce},Symbol.toStringTag,{value:"Module"}));function ze(r){var be,me,ge,pe,ve;if(document.getElementById("orderForm"))return;const e=r?w.findById(r):null,c=_.getAll().filter(a=>a.isActive||e&&a.id===e.foodId).map(a=>{const n=w.getReservedStockForFood(a.id),i=a.stock-n;return`<option ${(e==null?void 0:e.foodId)===a.id?"selected":""} value="${a.id}" data-price="${a.price}">${a.name} (Disp: ${i})</option>`}).join(""),l=e?new Date(e.deliveryTime).toTimeString().slice(0,5):"",b=e?e.delivered:!1,m=b?"disabled":"",f=b?"opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700":"",y=`
  <div class="flex flex-col h-full max-h-[calc(90*var(--vh,1vh))] bg-white dark:bg-gray-900 rounded-lg overflow-hidden text-sm sm:text-base">
    <div class="flex-shrink-0 p-2">
      <h3 class="text-xl font-bold text-center flex items-center justify-center gap-2">
        <i class="fa-solid fa-file-invoice-dollar"></i>
        <span>${e?"Editar Pedido":"Agregar Pedido"}</span>
        ${b?'<span class="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">🔒 ENTREGADO</span>':""}
      </h3>
    </div>
    <div class="flex-1 overflow-y-auto p-2 -mt-1">
      <form id="orderForm" class="space-y-4">
        <div>
          <label for="fullName" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-user w-4"></i>Nombres</label>
          <input id="fullName" name="fullName" value="${(be=e==null?void 0:e.fullName)!=null?be:""}" required ${m}
            class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${f}"
            placeholder="Ingresar nombres completos" />
        </div>
        <div>
          <label for="deliveryAddress" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-map-marker-alt w-4"></i>Dirección</label>
          <input id="deliveryAddress" name="deliveryAddress" value="${(me=e==null?void 0:e.deliveryAddress)!=null?me:""}" required ${m}
            class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${f}"
            placeholder="Ingresar dirección" />
        </div>
        <div class="grid grid-cols-2 gap-x-4">
          <div>
            <label for="phone" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-phone w-4"></i>Teléfono</label>
            <input id="phone" name="phone" value="${(ge=e==null?void 0:e.phone)!=null?ge:""}" required type="tel" inputmode="tel" ${m}
              placeholder="Formato 09 o +593"
              class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${f}" />
          </div>
          <div>
            <label for="deliveryTime" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-clock w-4"></i>Hora</label>
            <input id="deliveryTime" name="deliveryTime" type="time" value="${l}" required ${m}
              class="text-base w-full bg-transparent p-1 mb-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${f}" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-x-4">
          <div>
            <div class="flex justify-between items-center">
              <label for="foodId" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-utensils w-4"></i>Comida</label>
              <div id="unitPriceDisplay" class="text-sm text-gray-500 dark:text-gray-400 font-semibold"></div>
            </div>
            <select id="foodId" name="foodId" ${m} class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${f}">
              <option value="">Elegir comida</option>
              ${c}
            </select>
          </div>
          <div id="comboContainer">
            <label for="comboId" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-gift w-4"></i>Combo</label>
            <select id="comboId" name="comboId" ${m} class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${f}">
              <option value="">Sin combo</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-x-4">
          <div class="text-center">
            <label for="quantity" class="flex items-center justify-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-sort-numeric-up w-4"></i>Cant. U.</label>
            <input id="quantity" name="quantity" type="number" min="0" value="${(pe=e==null?void 0:e.quantity)!=null?pe:0}" ${m}
              class="text-base text-center w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${f}"/>
          </div>
          <div class="text-center">
            <label for="comboQuantity" class="flex items-center justify-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-gift w-4"></i>Combos</label>
            <input id="comboQuantity" name="comboQuantity" type="number" min="0" value="${(ve=e==null?void 0:e.comboQuantity)!=null?ve:0}" ${m}
              class="text-base text-center w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${f}"/>
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
              class="flex items-center gap-2 p-2 bg-accent text-white rounded-lg font-semibold text-base transition-all duration-200 ${e&&!b?"opacity-50 cursor-not-allowed":"hover:bg-accent/90"}" 
              ${e&&!b?"disabled":""}>
        <i class="fa ${e?"fa-save":"fa-plus"} fa-lg"></i> 
        ${e?"Actualizar":"Agregar"}
      </button>
    </div>
  </div>`,I=()=>{const a=window.innerHeight*.01;document.documentElement.style.setProperty("--vh",`${a}px`)};I(),window.addEventListener("resize",I);const{close:U,element:u}=s.modal(y,{closeOnBackdropClick:!1}),M=()=>{U(),window.removeEventListener("resize",I)},o=u.querySelector('input[name="phone"]'),d=u.querySelector('select[name="foodId"]'),v=u.querySelector('select[name="comboId"]'),T=u.querySelector('input[name="quantity"]'),g=u.querySelector('input[name="comboQuantity"]'),N=u.querySelector("#totalPrice"),Q=u.querySelector("#unitPriceDisplay"),Z=u.querySelector("#cancelOrder"),q=u.querySelector("#orderForm"),D=q.querySelector('input[name="fullName"]'),B=q.querySelector('input[name="deliveryAddress"]'),O=q.querySelector('input[name="deliveryTime"]'),$=u.querySelector("#submitOrder");let W=null;const Pe=()=>{e&&(W={fullName:D.value,phone:o.value,deliveryAddress:B.value,deliveryTime:O.value,foodId:d.value,quantity:parseInt(T.value,10)||0,comboId:v.value,comboQuantity:parseInt(g.value,10)||0})},Ne=()=>({fullName:D.value,phone:o.value,deliveryAddress:B.value,deliveryTime:O.value,foodId:d.value,quantity:parseInt(T.value,10)||0,comboId:v.value,comboQuantity:parseInt(g.value,10)||0}),ee=()=>{if(!e||!W)return!0;const a=Ne();return JSON.stringify(W)!==JSON.stringify(a)},L=()=>{if(!e)return;if(b){$.disabled=!0,$.className="flex items-center gap-2 p-2 bg-gray-400 text-white rounded-lg cursor-not-allowed font-semibold text-base opacity-50",$.title="No se puede modificar un pedido entregado";return}const a=ee();$.disabled=!a,a?($.className="flex items-center gap-2 p-2 bg-accent text-white rounded-lg hover:bg-accent/90 font-semibold text-base transition-all duration-200",$.title="Guardar cambios"):($.className="flex items-center gap-2 p-2 bg-gray-400 text-white rounded-lg cursor-not-allowed font-semibold text-base opacity-50 transition-all duration-200",$.title="No hay cambios para guardar")},R=()=>{const a=d.selectedOptions[0],n=a?_.findById(a.value):null;if(!n){N.textContent=E(0),Q.textContent="",v.innerHTML='<option value="">Elegir combo</option>',g.disabled=!0;return}Q.textContent=`${E(n.price)}`;const i=v.value,h=parseInt(T.value,10)||0,k=parseInt(g.value,10)||0;let C=h*n.price;if(i){const x=n.combos.find(P=>P.id===i);x&&(C+=k*x.price),g.disabled=b}else g.disabled=!0;N.textContent=E(C)},te=a=>{const n=_.findById(a);v.innerHTML='<option value="">Sin combo</option>',n&&n.combos.length>0&&n.combos.forEach(i=>{const h=document.createElement("option");h.value=i.id,h.textContent=`${i.quantity} Uds. x ${E(i.price)}`,e&&e.comboId===i.id&&(h.selected=!0),v.appendChild(h)}),v.value&&(g.value=(e==null?void 0:e.comboQuantity.toString())||"1"),R(),L()},De=Re(()=>{const a=(()=>{const n=o.value.replace(/\s/g,"");return n.startsWith("09")||n.startsWith("+5939")||!n?null:"Formato válido: '09xxxxxxxx' o '+5939xxxxxxxx'"})();a&&s.toast(a)},3e3),Oe=(a,n)=>{const i=Math.abs(n)*60*1e3,h=w.getAll().filter(x=>!(e&&x.id===e.id)).map(x=>new Date(x.deliveryTime).getTime());let k=a,C=0;for(;;){const x=h.filter(j=>Math.abs(k-j)<i);if(x.length===0)break;const P=Math.max(...x);if(k=Math.max(k,P+i),C++,C>50)break}return k},ae=a=>X(null,null,function*(){var n;if(a.preventDefault(),e&&e.delivered){s.toast("❌ No se puede modificar un pedido que ya fue entregado");return}if(e&&!ee()){s.toast("ℹ️ No hay cambios para guardar");return}$.disabled=!0,s.showSpinner("Espere un momento...");try{const i=new FormData(q),h=Ee(String(i.get("fullName")||"")),k=Ie(String(i.get("phone")||"")),C=Ee(String(i.get("deliveryAddress")||"")),x=String(i.get("foodId")||""),P=parseInt(String(i.get("quantity")||"0"),10),j=String(i.get("comboId")||"")||null,xe=parseInt(String(i.get("comboQuantity")||"0"),10),ye=String(i.get("deliveryTime")||"");if(!ye){s.toast("Selecciona una hora de entrega.");return}let H="";try{const p=new Date,[S,F]=ye.split(":");p.setHours(parseInt(S,10),parseInt(F,10),0,0),H=p.toISOString()}catch(p){s.toast("Hora de entrega inválida.");return}if(!h||!k||!C){s.toast("Completa todos los campos requeridos.");return}if(!Y(k)){s.toast("El formato del teléfono es inválido."),o.focus(),o.classList.add("border-red-500");return}if(!x){s.toast("Selecciona una comida.");return}const V=_.findById(x);if(!V){s.toast("La comida seleccionada no fue encontrada.");return}let he=P;if(j){const p=V.combos.find(S=>S.id===j);p&&(he+=p.quantity*xe)}if(V.stock<he){s.toast(`Stock insuficiente para "${V.name}".`);return}if(P===0&&!j){s.toast("Agrega al menos un item o un combo al pedido.");return}const ke=Te(k);if(ke){const p=w.getAll().find(S=>e&&S.id===e.id?!1:Te(S.phone)===ke);if(p){s.toast(`El teléfono ya está registrado para el cliente '${p.fullName}'.`),o.focus(),o.classList.add("border-red-500");return}}const J=(n=JSON.parse(localStorage.getItem("fd_meta_v1")||"{}").deliveryGapMinutes)!=null?n:15;if(w.checkConflict(H,J,e==null?void 0:e.id).conflict){const p=new Date(H).getTime(),S=Oe(p,J),F=new Date(S),je=String(F.getHours()).padStart(2,"0"),Fe=String(F.getMinutes()).padStart(2,"0");O.value=`${je}:${Fe}`,s.toast(`Conflicto de entrega. Hora ajustada para cumplir ${J} min de intervalo.`,7e3),L();return}const we={fullName:h,phone:k,deliveryAddress:C,foodId:x,quantity:P,comboId:j,comboQuantity:xe,deliveryTime:H};let G=!1;if(e){G=yield w.update(K(K({},e),we)),G&&(s.toast("Pedido actualizado."),re(),M(),document.dispatchEvent(new CustomEvent("refreshViews")));return}else(yield w.add(we))&&(G=!0,s.toast("Pedido agregado."));if(G){document.dispatchEvent(new CustomEvent("refreshViews")),q.reset(),T.value="0",g.value="0",d.value="",v.innerHTML='<option value="">Sin combo</option>',o.value="",D.value="",B.value="";const p=new Date,S=String(p.getHours()).padStart(2,"0"),F=String(p.getMinutes()).padStart(2,"0");O.value=`${S}:${F}`,R(),L(),D.focus()}}finally{(!e||!b)&&($.disabled=!1),s.hideSpinner()}}),re=()=>{q.removeEventListener("submit",ae),Z.removeEventListener("click",oe),o.removeEventListener("input",le),o.removeEventListener("blur",ne),o.removeEventListener("focus",ie),d.removeEventListener("change",de),v.removeEventListener("change",ce),T.removeEventListener("input",ue),g.removeEventListener("input",fe),D.removeEventListener("input",A),B.removeEventListener("input",A),O.removeEventListener("change",A)},oe=()=>{re(),M()},Ae=a=>{const n=a.target;n.value=Ie(n.value)},se=()=>{const a=o.value;a.length===0?(o.classList.remove("border-green-500","border-red-500"),o.classList.add("border-gray-300")):Y(a)?(o.classList.remove("border-gray-300","border-red-500"),o.classList.add("border-green-500")):(o.classList.remove("border-green-500","border-red-500"),o.classList.add("border-gray-300"))},le=a=>{Ae(a),se(),De(),L()},ne=()=>{const a=o.value;a.length>0&&!Y(a)&&(o.classList.add("border-red-500"),o.classList.remove("border-gray-300","border-green-500"))},ie=()=>{o.classList.contains("border-red-500")&&(o.classList.remove("border-red-500"),o.classList.add("border-gray-300"))},de=()=>{te(d.value),z()},ce=()=>{g.value=v.value?"1":"0",z()},ue=()=>z(),fe=()=>{parseInt(g.value,10)===0&&s.toast("La cantidad de combos debe ser mayor a 0."),z()},A=()=>L(),z=()=>{R(),L()};q.addEventListener("submit",ae),Z.addEventListener("click",oe),o.addEventListener("input",le),o.addEventListener("blur",ne),o.addEventListener("focus",ie),d.addEventListener("change",de),v.addEventListener("change",ce),T.addEventListener("input",ue),g.addEventListener("input",fe),D.addEventListener("input",A),B.addEventListener("input",A),O.addEventListener("change",A),e&&(te(e.foodId),setTimeout(()=>{Pe(),L()},100)),R(),se(),L()}const Ye=Object.freeze(Object.defineProperty({__proto__:null,openOrderForm:ze},Symbol.toStringTag,{value:"Module"}));function qe(r){const e=r.replace(/\D/g,"").startsWith("0")?`+593${r.replace(/\D/g,"").substring(1)}`:r.replace(/\s/g,""),t=`<div class="relative">
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
  </div>`,{close:c,element:l}=s.modal(t,{closeOnBackdropClick:!1});l.querySelector("#closeCall").addEventListener("click",c),l.querySelector("#callPhone").addEventListener("click",()=>{window.open(`tel:${r}`),c()}),l.querySelector("#callWhatsApp").addEventListener("click",()=>{window.open(`https://wa.me/${e.replace(/\s/g,"")}`),c()})}const Ze=Object.freeze(Object.defineProperty({__proto__:null,showCallModal:qe},Symbol.toStringTag,{value:"Module"}));function He(r,e){const t=w.findById(r);if(!t){s.toast("Pedido no encontrado");return}const c=_.findById(t.foodId);if(!c){s.toast("Comida no encontrada para este pedido.");return}const l=t.comboId?c.combos.find(d=>d.id===t.comboId):null,b=t.quantity*c.price,m=l&&t.comboQuantity>0?t.comboQuantity*l.price:0,f=b+m,y=t.quantity+(t.comboQuantity||0),I=`
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
                <i class="fa fa-clock w-4 text-center"></i>Entrega: 
              </label>
              <div class="text-gray-900 dark:text-dark-text font-medium pl-6 text-sm">${Le(t.delivered&&t.deliveredAt?t.deliveredAt:t.deliveryTime)}</div>
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
              <span class="text-base text-gray-500">${E(c.price)} c/u</span>
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
                  <td class="py-1 text-center text-xs">${E(c.price)}</td>
                  <td class="py-1 text-right font-semibold text-xs">${E(b)}</td>
                </tr>
                ${l&&t.comboQuantity>0?`
                <tr class="border-b dark:border-dark-border">
                  <td class="py-1 pr-2 text-xs">Combo (${l.quantity}u)</td>
                  <td class="py-1 text-center text-xs">${t.comboQuantity}</td>
                  <td class="py-1 text-center text-xs">${E(l.price)}</td>
                  <td class="py-1 text-right font-semibold text-xs">${E(m)}</td>
                </tr>`:""}
              </tbody>
            </table>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg border-t dark:border-dark-border p-2">
          <div class="text-center border-b dark:border-dark-border pb-2 mb-2">
            <label class="flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300"><i class="fa fa-coins"></i>Total del Pedido</label>
            <div class="font-bold text-green-700 dark:text-green-400 text-xl">${E(f)}</div>
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
  </div>`,{close:U,element:u}=s.modal(I,{closeOnBackdropClick:!1});u.querySelector("#closeDetails").addEventListener("click",U),u.querySelector("#callFromDetails").addEventListener("click",d=>{const v=d.currentTarget.dataset.phone;qe(v)});const M=u.querySelector("#detailsToggle"),o=d=>{var Q;if(!w.findById(r))return;const T=u.querySelector("#toggleBg"),g=u.querySelector("#toggleDot"),N=(Q=u.querySelector("#detailsToggle").parentElement)==null?void 0:Q.previousElementSibling;N&&(N.textContent=d?"Entregado":"Pendiente",N.className=`text-sm font-medium ${d?"text-green-600":"text-red-600"}`),T&&g&&(T.className=`w-10 h-5 ${d?"bg-green-600":"bg-red-500"} rounded-full relative transition-colors`,g.className=`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${d?"translate-x-5":"translate-x-0"}`)};M.addEventListener("change",()=>{const d=w.findById(r);d&&Ce(d,M,o,()=>e())})}const et=Object.freeze(Object.defineProperty({__proto__:null,showOrderDetails:He},Symbol.toStringTag,{value:"Module"}));export{et as a,Ze as c,Xe as d,Ce as h,Ye as o};
