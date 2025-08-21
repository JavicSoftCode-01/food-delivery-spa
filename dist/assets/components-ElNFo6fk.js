import{O as b,U as i,F as E,f as y,a as o,h as q}from"./index-1_vu5Dkx.js";import{e as D,g as L,o as A,c as F,r as I,b as O,d as Q}from"./index-1_vu5Dkx.js";function j(r,n){const e=b.findById(r);if(!e){i.toast("Pedido no encontrado");return}const a=E.findById(e.foodId);if(!a){i.toast("Comida no encontrada para este pedido.");return}const s=e.comboId?a.combos.find(t=>t.id===e.comboId):null,f=e.quantity*a.price,g=s&&e.comboQuantity>0?e.comboQuantity*s.price:0,h=f+g,k=e.quantity+(e.comboQuantity||0),w=`
  <div class="flex flex-col h-full max-h-[90vh] text-sm sm:text-base bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
    <div class="flex-shrink-0 p-3 sm:p-4 border-b dark:border-dark-border flex items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-file-invoice-dollar text-accent fa-2x"></i>
        <h3 class="text-base sm:text-xl font-bold truncate">Pedido de ${e.fullName}</h3>
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
                <i class="fa ${e.delivered?"fa-check-circle text-green-500":"fa-clock"} w-4 text-center"></i>${e.delivered?"Entregado a las:":"Entrega:"}
              </label>
              <div class="text-gray-900 dark:text-dark-text font-medium pl-6 text-sm">${y(e.delivered&&e.deliveredAt?e.deliveredAt:e.deliveryTime)}</div>
            </div>
            <div>
              <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold text-sm"><i class="fa fa-map-marker-alt w-4 text-center"></i>Dirección:</label>
              <div class="text-gray-900 dark:text-dark-text font-medium pl-6 text-sm">${e.deliveryAddress}</div>
            </div>
          </div>
        </div>
        <div class="border-b dark:border-dark-border">
          <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold text-sm"><i class="fa fa-bowl-food w-4 text-center"></i>Producto:</label>
          <div class="ml-6 py-1">
            <div class="flex justify-between items-center">
              <span class="font-medium text-sm">${a?.name||"No encontrado"}</span>
              <span class="text-base text-gray-500">${o(a.price)} c/u</span>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center border-b dark:border-dark-border">
          <div>
            <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold"><i class="fa fa-shopping-cart text-sm"></i><span class="text-xs">Unitarios</span></label>
            <div class="text-gray-900 dark:text-dark-text text-lg font-bold">${e.quantity}</div>
          </div>
          <div>
            <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold"><i class="fa fa-boxes-stacked text-sm"></i><span class="text-xs">Combos</span></label>
            <div class="text-gray-900 dark:text-dark-text text-lg font-bold">${e.comboQuantity||0}</div>
          </div>
          <div>
            <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold"><i class="fa fa-calculator text-sm"></i><span class="text-xs">Total Items</span></label>
            <div class="text-gray-900 dark:text-dark-text text-lg font-bold">${k}</div>
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
                  <td class="py-1 text-center text-xs">${e.quantity}</td>
                  <td class="py-1 text-center text-xs">${o(a.price)}</td>
                  <td class="py-1 text-right font-semibold text-xs">${o(f)}</td>
                </tr>
                ${s&&e.comboQuantity>0?`
                <tr class="border-b dark:border-dark-border">
                  <td class="py-1 pr-2 text-xs">Combo (${s.quantity}u)</td>
                  <td class="py-1 text-center text-xs">${e.comboQuantity}</td>
                  <td class="py-1 text-center text-xs">${o(s.price)}</td>
                  <td class="py-1 text-right font-semibold text-xs">${o(g)}</td>
                </tr>`:""}
              </tbody>
            </table>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg border-t dark:border-dark-border p-2">
          <div class="text-center border-b dark:border-dark-border pb-2 mb-2">
            <label class="flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300"><i class="fa fa-coins"></i>Total del Pedido</label>
            <div class="font-bold text-green-700 dark:text-green-400 text-xl">${o(h)}</div>
          </div>
          <div class="flex flex-col sm:flex-row justify-between items-center gap-2">
            <button id="callFromDetails" data-phone="${e.phone}" class="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors text-sm">
              <i class="fa fa-phone"></i><span class="font-bold">Llamar</span>
            </button>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600 dark:text-gray-300 font-semibold">Estado:</span>
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium ${e.delivered?"text-green-600":"text-red-600"}">${e.delivered?"Entregado":"Pendiente"}</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input id="detailsToggle" data-id="${e.id}" type="checkbox" ${e.delivered?"checked":""} class="sr-only">
                  <div id="toggleBg" class="w-10 h-5 ${e.delivered?"bg-green-600":"bg-red-500"} rounded-full relative transition-colors">
                    <div id="toggleDot" class="absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${e.delivered?"translate-x-5":"translate-x-0"}"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`,{close:$,element:l}=i.modal(w,{closeOnBackdropClick:!1});l.querySelector("#closeDetails").addEventListener("click",$),l.querySelector("#callFromDetails").addEventListener("click",t=>{const d=t.currentTarget.dataset.phone;C(d)});const m=l.querySelector("#detailsToggle"),T=t=>{const d=b.findById(r);if(!d)return;const p=l.querySelector("#toggleBg"),v=l.querySelector("#toggleDot"),c=l.querySelector("#detailsToggle").parentElement?.previousElementSibling;c&&(c.textContent=t?"Entregado":"Pendiente",c.className=`text-sm font-medium ${t?"text-green-600":"text-red-600"}`),p&&v&&(p.className=`w-10 h-5 ${t?"bg-green-600":"bg-red-500"} rounded-full relative transition-colors`,v.className=`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${t?"translate-x-5":"translate-x-0"}`);const x=l.querySelector(".fa-clock, .fa-check-circle")?.parentElement;if(x){const u=x.nextElementSibling;x.innerHTML=`<i class="fa ${t?"fa-check-circle text-green-500":"fa-clock"} w-4 text-center"></i>${t?"Entregado a las:":"Entrega:"}`,u&&(u.textContent=y(t&&d.deliveredAt?d.deliveredAt:d.deliveryTime))}};m.addEventListener("change",()=>{const t=b.findById(r);t&&q(t,m,T,()=>n())})}function C(r){const n=r.replace(/\D/g,"").startsWith("0")?`+593${r.replace(/\D/g,"").substring(1)}`:r.replace(/\s/g,""),e=`<div class="relative">
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
  </div>`,{close:a,element:s}=i.modal(e,{closeOnBackdropClick:!1});s.querySelector("#closeCall").addEventListener("click",a),s.querySelector("#callPhone").addEventListener("click",()=>{window.open(`tel:${r}`),a()}),s.querySelector("#callWhatsApp").addEventListener("click",()=>{window.open(`https://wa.me/${n.replace(/\s/g,"")}`),a()})}export{q as handleDeliveryToggle,D as openFoodForm,L as openOrderForm,A as openSalesHistoryModal,F as renderClients,I as renderDashboard,O as renderFoods,Q as renderSettings,C as showCallModal,j as showOrderDetails};
