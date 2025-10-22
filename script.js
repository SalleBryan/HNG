// script.js - Shared JavaScript for all pages

;(() => {
  // Cache DOM elements
  const elements = {
    time: document.querySelector('[data-testid="test-user-time"]'),
    bio: document.querySelector('[data-testid="test-user-bio"]'),
    bioToggle: document.querySelector('[data-testid="test-bio-toggle"]'),
    avatar: document.querySelector('[data-testid="test-user-avatar"]'),
    urlInput: document.querySelector('[data-testid="test-avatar-url-input"]'),
    fileInput: document.querySelector('[data-testid="test-avatar-file-input"]'),
    contactForm: document.getElementById("contact-form"),
    contactName: document.querySelector('[data-testid="test-contact-name"]'),
    contactEmail: document.querySelector('[data-testid="test-contact-email"]'),
    contactSubject: document.querySelector('[data-testid="test-contact-subject"]'),
    contactMessage: document.querySelector('[data-testid="test-contact-message"]'),
    successMessage: document.querySelector('[data-testid="test-contact-success"]'),
  }

  // Time display (for profile page)
  function updateTime() {
    if (elements.time) {
      elements.time.textContent = Date.now()
    }
  }

  if (elements.time) {
    updateTime()
    setInterval(updateTime, 1000)
  }

  // Bio toggle (for profile page)
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

  // Avatar URL input (for profile page)
  function initAvatarUrl() {
    if (!elements.urlInput || !elements.avatar) return

    elements.urlInput.addEventListener("change", () => {
      const url = elements.urlInput.value.trim()
      if (url) {
        elements.avatar.src = url
        elements.avatar.alt = "User avatar (from URL)"
      }
    })
  }

  // Avatar file upload (for profile page)
  function initAvatarFile() {
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

  // Contact form validation (for contact page)
  function initContactForm() {
    if (!elements.contactForm) return

    const fields = [
      {
        input: elements.contactName,
        error: document.querySelector('[data-testid="test-contact-error-name"]'),
        validate: (value) => {
          if (!value.trim()) return "Full name is required."
          return ""
        },
      },
      {
        input: elements.contactEmail,
        error: document.querySelector('[data-testid="test-contact-error-email"]'),
        validate: (value) => {
          if (!value.trim()) return "Email address is required."
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailPattern.test(value)) return "Please enter a valid email address."
          return ""
        },
      },
      {
        input: elements.contactSubject,
        error: document.querySelector('[data-testid="test-contact-error-subject"]'),
        validate: (value) => {
          if (!value.trim()) return "Subject is required."
          return ""
        },
      },
      {
        input: elements.contactMessage,
        error: document.querySelector('[data-testid="test-contact-error-message"]'),
        validate: (value) => {
          if (!value.trim()) return "Message is required."
          if (value.trim().length < 10) return "Message must be at least 10 characters."
          return ""
        },
      },
    ]

    // Validate single field
    function validateField(field) {
      const errorMessage = field.validate(field.input.value)
      field.error.textContent = errorMessage
      field.input.setAttribute("aria-invalid", errorMessage ? "true" : "false")
      return !errorMessage
    }

    // Add real-time validation on blur
    fields.forEach((field) => {
      field.input.addEventListener("blur", () => validateField(field))
      field.input.addEventListener("input", () => {
        // Clear error on input if field was previously invalid
        if (field.input.getAttribute("aria-invalid") === "true") {
          validateField(field)
        }
      })
    })

    // Form submission
    elements.contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Validate all fields
      const results = fields.map((field) => validateField(field))
      const allValid = results.every((valid) => valid)

      if (!allValid) {
        // Focus first invalid field
        const firstInvalidField = fields.find((field) => field.input.getAttribute("aria-invalid") === "true")
        if (firstInvalidField) {
          firstInvalidField.input.focus()
        }
        return
      }

      // Success: hide form and show success message
      elements.contactForm.hidden = true
      if (elements.successMessage) {
        elements.successMessage.hidden = false
      }
    })
  }

  // Initialize all features
  initBioToggle()
  initAvatarUrl()
  initAvatarFile()
  initContactForm()
})()
