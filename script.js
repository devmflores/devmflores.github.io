/**
 * ARCHIVO: script.js
 * FUNCIÓN: Lógica de interactividad, animaciones y validación de formulario.
 * CLIENTE: Sergio Daniel Flores - Abogacía de Familia
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. INICIALIZACIÓN DE AOS (Animate On Scroll)
  // Controla la entrada suave de títulos y textos configurados en el HTML.
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000, // Duración de la animación (1 segundo)
      easing: "ease-in-out", // Transición suave
      once: true, // La animación solo ocurre la primera vez que se ve
      mirror: false,
      anchorPlacement: "top-bottom",
    });
  }

  // 2. SCROLL SUAVE (Smooth Scroll)
  // Mejora la navegación interna para que el usuario no sienta un salto brusco.
  const menuLinks = document.querySelectorAll(".nav-link, .btn-primary");

  menuLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      // Verificamos que sea un enlace interno
      if (targetId && targetId.startsWith("#")) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          // Calculamos la posición considerando la altura del Navbar (sticky)
          const offset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          // Si el menú móvil está abierto, lo cerramos al hacer clic
          const navbarCollapse = document.querySelector(".navbar-collapse");
          if (navbarCollapse && navbarCollapse.classList.contains("show")) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
          }
        }
      }
    });
  });

  // 3. GESTIÓN DEL FORMULARIO DE CONTACTO
  // Implementa feedback visual inmediato y previene envíos vacíos.
  // 3.1. Lógica de Envío a WhatsApp
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Captura de datos del formulario
      const nombre = this.querySelector('input[type="text"]').value;
      const metodoContacto = this.querySelectorAll("select")[0].value;
      const telCliente = document.getElementById("telefonoCliente").value;
      const tema = this.querySelectorAll("select")[1].value;
      const mensaje = this.querySelector("textarea").value;
      const telefonoDestino = "5493517664230";

      // Construcción del mensaje para WhatsApp
      // El uso de %0A representa un salto de línea en la URL
      const textoWhatsApp =
        `Hola, mi nombre es *${nombre}* %0A` +
        `Mi teléfono de contacto: *${telCliente}* %0A` +
        `Me contacto por el tema: *${tema}* %0A` +
        `Preferencia de contacto: ${metodoContacto} %0A` +
        `Consulta: ${mensaje}`;

      // Crear la URL de WhatsApp
      const urlWhatsApp = `https://wa.me/${telefonoDestino}?text=${textoWhatsApp}`;

      // Feedback visual antes de redireccionar
      const submitBtn = this.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerText = "ABRIENDO WHATSAPP...";

      setTimeout(() => {
        // Abrir en una nueva pestaña
        window.open(urlWhatsApp, "_blank");

        // Restaurar botón y formulario
        submitBtn.disabled = false;
        submitBtn.innerText = "SOLICITAR ASESORAMIENTO PROFESIONAL";
        contactForm.reset();
      }, 1000);
    });
  }

  //   const contactForm = document.getElementById("contactForm");

  //   if (contactForm) {
  //     contactForm.addEventListener("submit", function (e) {
  //       e.preventDefault();

  //       const submitBtn = this.querySelector('button[type="submit"]');
  //       const originalText = submitBtn.innerHTML;

  //       // Feedback Visual: Estado de carga
  //       submitBtn.disabled = true;
  //       submitBtn.innerHTML = `
  //                 <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  //                 PROCESANDO...
  //             `;

  //       // Simulación de envío (Aquí se integraría con el backend o servicio de mail)
  //       setTimeout(() => {
  //         // Mensaje de éxito humanizado según tu perfil
  //         alert(
  //           "Consulta recibida. Sergio Daniel Flores se comunicará con vos a la brevedad para brindarte el asesoramiento claro y objetivo que necesitás.",
  //         );

  //         // Restaurar formulario
  //         contactForm.reset();
  //         submitBtn.disabled = false;
  //         submitBtn.innerHTML = originalText;

  //         // Reiniciar animaciones de AOS para el feedback visual si fuera necesario
  //         AOS.refresh();
  //       }, 2000);
  //     });
  //   }

  // 4. EFECTOS DINÁMICOS EN NAVBAR (OPCIONAL)
  // Añade una sombra al navbar cuando el usuario hace scroll para dar profundidad.
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
      navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
      navbar.style.backgroundColor = "rgba(13, 13, 13, 0.98)";
    } else {
      navbar.style.boxShadow = "none";
      navbar.style.backgroundColor = "rgba(13, 13, 13, 0.95)";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // 1. Inicialización de AOS (Animaciones)
  AOS.init({ duration: 1000, once: true });

  // 2. Lógica de Envío a WhatsApp
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Captura de datos del formulario
      const nombre = this.querySelector('input[type="text"]').value;
      const metodoContacto = this.querySelectorAll("select")[0].value;
      const tema = this.querySelectorAll("select")[1].value;
      const mensaje = this.querySelector("textarea").value;
      const telefonoDestino = "5493517664230";

      // Construcción del mensaje para WhatsApp
      // El uso de %0A representa un salto de línea en la URL
      const textoWhatsApp =
        `Hola, mi nombre es *${nombre}* %0A` +
        `Me contacto por el tema: *${tema}* %0A` +
        `Preferencia de contacto: ${metodoContacto} %0A` +
        `Consulta: ${mensaje}`;

      // Crear la URL de WhatsApp
      const urlWhatsApp = `https://wa.me/${telefonoDestino}?text=${textoWhatsApp}`;

      // Feedback visual antes de redireccionar
      const submitBtn = this.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerText = "ABRIENDO WHATSAPP...";

      setTimeout(() => {
        // Abrir en una nueva pestaña
        window.open(urlWhatsApp, "_blank");

        // Restaurar botón y formulario
        submitBtn.disabled = false;
        submitBtn.innerText = "SOLICITAR ASESORAMIENTO PROFESIONAL";
        contactForm.reset();
      }, 1000);
    });
  }
});
