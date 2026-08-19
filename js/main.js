(() => {
  const header = document.querySelector(".site-header");
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const year = document.getElementById("year");
  const page = document.body.dataset.page;

  if (year) year.textContent = String(new Date().getFullYear());

  if (page && nav) {
    nav.querySelectorAll("[data-nav]").forEach((link) => {
      if (link.dataset.nav === page) link.classList.add("active");
    });
  }

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 60}ms`;
      io.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  /* Demo modal */
  const demoModal = document.getElementById("demoModal");
  const openDemo = () => {
    if (!demoModal) return;
    demoModal.hidden = false;
    document.body.style.overflow = "hidden";
    const first = demoModal.querySelector("input, textarea, button");
    if (first) first.focus();
  };
  const closeDemo = () => {
    if (!demoModal) return;
    demoModal.hidden = true;
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".js-open-demo").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openDemo();
    });
  });
  document.querySelectorAll(".js-close-demo").forEach((btn) => {
    btn.addEventListener("click", closeDemo);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && demoModal && !demoModal.hidden) closeDemo();
  });

  /* Send form data to career@brainhunter.in via FormSubmit */
  async function submitInquiry(form, noteEl) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const original = submitBtn ? submitBtn.textContent : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    try {
      const res = await fetch("https://formsubmit.co/ajax/career@brainhunter.in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("submit failed");

      form.reset();
      if (noteEl) {
        noteEl.hidden = false;
        noteEl.textContent =
          form.id === "demoForm"
            ? "Thank you. Your demo request has been sent. We’ll get back to you soon."
            : "Thank you. Your message has been sent. We’ll get back to you soon.";
      }
      return true;
    } catch (err) {
      /* Fallback: open mail client if FormSubmit is not yet activated */
      const subject = encodeURIComponent(payload._subject || "Website inquiry");
      const body = encodeURIComponent(
        `Name: ${payload.name || ""}\nEmail: ${payload.email || ""}\nPhone: ${payload.phone || ""}\n\n${payload.message || ""}`
      );
      window.location.href = `mailto:career@brainhunter.in?subject=${subject}&body=${body}`;
      if (noteEl) {
        noteEl.hidden = false;
        noteEl.textContent =
          form.id === "demoForm"
            ? "Opening your email client to send this request…"
            : "Opening your email client to send this message…";
      }
      return false;
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = original;
      }
    }
  }

  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      await submitInquiry(contactForm, formNote);
    });
  }

  const demoForm = document.getElementById("demoForm");
  const demoFormNote = document.getElementById("demoFormNote");
  if (demoForm) {
    demoForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const ok = await submitInquiry(demoForm, demoFormNote);
      if (ok) {
        setTimeout(closeDemo, 1800);
      }
    });
  }

  /* Subtle AI neural network for light hero background */
  const heroVideo = document.querySelector(".hero-video");
  if (heroVideo && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroVideo.removeAttribute("autoplay");
    heroVideo.pause();
  }

  const canvas = document.getElementById("heroAiCanvas");
  if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const ctx = canvas.getContext("2d");
    let nodes = [];
    let raf = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.floor((w * h) / 18000);
      nodes = Array.from({ length: Math.max(28, Math.min(count, 70)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.1 + Math.random() * 1.8,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.28;
            ctx.strokeStyle = `rgba(13, 148, 136, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = "rgba(13, 148, 136, 0.55)";
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(draw);
    });
  }
})();
