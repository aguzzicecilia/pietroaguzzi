document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.createElement("div");
  cursor.classList.add("cursor");
  document.body.appendChild(cursor);

  const projectSections = document.querySelectorAll(".project-section");
  let currentProjectIndex = 0;

  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  // Funzione per navigare tra le sezioni con lo scroll
  const scrollToNextSection = (direction) => {
    if (direction === "down" && currentProjectIndex < projectSections.length - 1) {
      currentProjectIndex++;
      projectSections[currentProjectIndex].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (direction === "up" && currentProjectIndex > 0) {
      currentProjectIndex--;
      projectSections[currentProjectIndex].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Aggiungiamo il controllo per lo scroll
  let isScrolling = false;

  document.addEventListener("wheel", (e) => {
    if (isScrolling) return;
    isScrolling = true;

    if (e.deltaY > 0) {
      scrollToNextSection("down");
    } else {
      scrollToNextSection("up");
    }

    setTimeout(() => {
      isScrolling = false;
    }, 800);
  });

  // Gestione del cursore
  document.addEventListener("mousemove", (e) => {
    const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
    const screenWidth = window.innerWidth;

    if (
      hoveredElement &&
      (hoveredElement.classList.contains("info-toggle") || hoveredElement.tagName === "A")
    ) {
      cursor.classList.add("disabled");
      cursor.textContent = "";
      return;
    } else {
      cursor.classList.remove("disabled");
    }

    cursor.style.left = `${e.pageX}px`;
    cursor.style.top = `${e.pageY}px`;

    if (e.pageX > screenWidth / 2) {
      cursor.classList.add("next");
      cursor.classList.remove("prev");
      cursor.textContent = "Next";
    } else {
      cursor.classList.add("prev");
      cursor.classList.remove("next");
      cursor.textContent = "Prev";
    }
  });

  // Funzione di gestione dei click
  document.addEventListener("click", (e) => {
    const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);

    if (
      hoveredElement &&
      (hoveredElement.classList.contains("info-toggle") || hoveredElement.tagName === "A")
    ) {
      return;
    }

    const activeSection = projectSections[currentProjectIndex];
    const carouselItems = activeSection.querySelectorAll(".carousel-item");
    let currentImageIndex = Array.from(carouselItems).findIndex((item) =>
      item.classList.contains("active")
    );

    const screenWidth = window.innerWidth;

    if (e.pageX > screenWidth / 2) {
      if (currentImageIndex < carouselItems.length - 1) {
        carouselItems[currentImageIndex].classList.remove("active");
        currentImageIndex++;
        carouselItems[currentImageIndex].classList.add("active");
      } else if (currentProjectIndex < projectSections.length - 1) {
        currentProjectIndex++;
        projectSections[currentProjectIndex].scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      if (currentImageIndex > 0) {
        carouselItems[currentImageIndex].classList.remove("active");
        currentImageIndex--;
        carouselItems[currentImageIndex].classList.add("active");
      } else if (currentProjectIndex > 0) {
        currentProjectIndex--;
        projectSections[currentProjectIndex].scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });

  // Gestione dello swipe
  document.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  document.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Swipe orizzontale
      if (deltaX > 50) {
        // Swipe verso sinistra
        const activeSection = projectSections[currentProjectIndex];
        const carouselItems = activeSection.querySelectorAll(".carousel-item");
        let currentImageIndex = Array.from(carouselItems).findIndex((item) =>
          item.classList.contains("active")
        );

        if (currentImageIndex < carouselItems.length - 1) {
          carouselItems[currentImageIndex].classList.remove("active");
          currentImageIndex++;
          carouselItems[currentImageIndex].classList.add("active");
        } else if (currentProjectIndex < projectSections.length - 1) {
          currentProjectIndex++;
          projectSections[currentProjectIndex].scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      } else if (deltaX < -50) {
        // Swipe verso destra
        const activeSection = projectSections[currentProjectIndex];
        const carouselItems = activeSection.querySelectorAll(".carousel-item");
        let currentImageIndex = Array.from(carouselItems).findIndex((item) =>
          item.classList.contains("active")
        );

        if (currentImageIndex > 0) {
          carouselItems[currentImageIndex].classList.remove("active");
          currentImageIndex--;
          carouselItems[currentImageIndex].classList.add("active");
        } else if (currentProjectIndex > 0) {
          currentProjectIndex--;
          projectSections[currentProjectIndex].scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    } else {
      // Swipe verticale
      if (deltaY > 50) {
        scrollToNextSection("down");
      } else if (deltaY < -50) {
        scrollToNextSection("up");
      }
    }
  });

  projectSections.forEach((section) => {
    const carouselItems = section.querySelectorAll(".carousel-item");
    const infoToggle = section.querySelector(".info-toggle");
    const projectInfo = section.querySelector(".project-info");
    let isInfoVisible = false;

    carouselItems[0].classList.add("active");

    const toggleInfo = () => {
      if (!isInfoVisible) {
        // Prima modifica opacità
        carouselItems.forEach((item) => {
          item.style.transition = "opacity 0.3s";
          item.style.opacity = "0.1";
        });

        setTimeout(() => {
          // Poi mostra il testo
          projectInfo.style.transition = "opacity 0.3s";
          projectInfo.style.display = "block";
          projectInfo.style.opacity = "1";
          infoToggle.textContent = "info –";
          isInfoVisible = true;
        }, 300);
      } else {
        // Prima nascondi il testo
        projectInfo.style.transition = "opacity 0.3s";
        projectInfo.style.opacity = "0";

        setTimeout(() => {
          projectInfo.style.display = "none";
          infoToggle.textContent = "info+";

          // Poi ripristina l'opacità
          carouselItems.forEach((item) => {
            item.style.transition = "opacity 0.3s";
            item.style.opacity = "1";
          });
          isInfoVisible = false;
        }, 300);
      }
    };

    infoToggle.addEventListener("click", toggleInfo);
  });
});
