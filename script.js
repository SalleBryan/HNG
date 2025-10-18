;(() => {
  // DOM elements
  const elements = {
    time: document.querySelector('[data-testid="test-user-time"]'),
    bio: document.querySelector('[data-testid="test-user-bio"]'),
    bioToggle: document.querySelector('[data-testid="test-bio-toggle"]'),
    avatar: document.querySelector('[data-testid="test-user-avatar"]'),
    fileInput: document.querySelector('[data-testid="test-avatar-pic-input"]'),
  }
  // Live time in millisecs
  function updateTime() {
    if (elements.time) {
      elements.time.textContent = Date.now()
    }
  }
  updateTime()
  setInterval(updateTime, 1000)

  // Bio toggle
  function initBioToggle() {
    if (!elements.bioToggle || !elements.bio) return

    const updateToggle = (isExpanded) => {
      elements.bioToggle.setAttribute("aria-expanded", String(isExpanded))
      elements.bioToggle.textContent = isExpanded ? "Show less" : "Show more"
      elements.bio.classList.toggle("clamped", !isExpanded)
    }

    elements.bioToggle.addEventListener("click", () => {
      const isExpanded = elements.bioToggle.getAttribute("aria-expanded") === "true"
      updateToggle(!isExpanded)
    })

    // Initialize
    updateToggle(false)
  }

  // Avatar picture input
  function initAvatarPic() {
    if (!elements.fileInput || !elements.avatar) return

    elements.fileInput.addEventListener("change", () => {
      const file = elements.fileInput.files?.[0]
      if (file) {
        const objectUrl = URL.createObjectURL(file)
        elements.avatar.src = objectUrl
        elements.avatar.alt = "User avatar (uploaded file)"

        // Clean up old object URL when image loads
        elements.avatar.addEventListener(
          "load",
          () => {
            URL.revokeObjectURL(objectUrl)
          },
          { once: true },
        )
      }
    })
  }

  // Initialize all features
  initBioToggle()
  initAvatarPic()
})()
