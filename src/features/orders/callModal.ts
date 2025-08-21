import { UI } from '../../ui/ui';

/** Muestra un modal para contactar al cliente por teléfono o WhatsApp. */
export function showCallModal(phone: string) {
  const whatsappPhone = phone.replace(/\D/g, '').startsWith('0')
    ? `+593${phone.replace(/\D/g, '').substring(1)}`
    : phone.replace(/\s/g, '');

  const html = `<div class="relative">
    <button id="closeCall" class="absolute right-1 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-55 z-10"><i class=\"fa fa-times text-lg\"></i></button>
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
  </div>`;

  const { close, element } = UI.modal(html, { closeOnBackdropClick: false });
  element.querySelector('#closeCall')!.addEventListener('click', close);
  element.querySelector('#callPhone')!.addEventListener('click', () => {
    window.open(`tel:${phone}`);
    close();
  });
  element.querySelector('#callWhatsApp')!.addEventListener('click', () => {
    window.open(`https://wa.me/${whatsappPhone.replace(/\s/g, '')}`);
    close();
  });
}


