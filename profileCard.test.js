
/**
 * @jest-environment jsdom
 */
const fs = require('fs')
const path = require('path')
const { getByTestId, queryByTestId, fireEvent, waitFor } = require('@testing-library/dom')
require('@testing-library/jest-dom/extend-expect')

const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf8')

// Load the script after the DOM is set up
function loadScriptFresh() {
  const scriptPath = path.resolve(__dirname, '..', 'script.js')
  delete require.cache[require.resolve(scriptPath)]
  require(scriptPath)
}

beforeEach(() => {
  document.documentElement.innerHTML = html
})

afterEach(() => {
  // clean up any mocked URL helpers
  if (global.URL.createObjectURL && global.URL.createObjectURL._isMockFunction) {
    global.URL.createObjectURL.mockRestore()
  }
  if (global.URL.revokeObjectURL && global.URL.revokeObjectURL._isMockFunction) {
    global.URL.revokeObjectURL.mockRestore()
  }
})

test('time element exists, has aria-live and shows a numeric timestamp', () => {
  loadScriptFresh()
  const timeEl = getByTestId(document.body, 'test-user-time')
  expect(timeEl).toBeInTheDocument()
  expect(timeEl).toHaveAttribute('aria-live', 'polite')
  // Should be a string of digits after initialization
  expect(timeEl.textContent).toMatch(/^\d+$/)
})

test('bio toggle expands and collapses the bio and updates aria-expanded', async () => {
  loadScriptFresh()
  const bio = getByTestId(document.body, 'test-user-bio')
  const toggle = getByTestId(document.body, 'test-bio-toggle')
  // initial state: aria-expanded === "false" and bio has the clamped class
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(bio.classList.contains('clamped')).toBeTruthy()

  // click to expand
  fireEvent.click(toggle)
  // aria-expanded should be "true" and clamp removed
  expect(toggle).toHaveAttribute('aria-expanded', 'true')
  expect(bio.classList.contains('clamped')).toBeFalsy()

  // click again to collapse
  fireEvent.click(toggle)
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(bio.classList.contains('clamped')).toBeTruthy()
})

test('avatar file input updates image src using createObjectURL and revokes on load', async () => {
  // mock createObjectURL/revokeObjectURL
  const fakeBlobUrl = 'blob:fake-avatar-url'
  const createSpy = jest.spyOn(URL, 'createObjectURL').mockImplementation(() => fakeBlobUrl)
  const revokeSpy = jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

  loadScriptFresh()

  const fileInput = getByTestId(document.body, 'test-avatar-pic-input')
  const avatarImg = getByTestId(document.body, 'test-user-avatar')
  expect(fileInput).toBeInTheDocument()
  expect(avatarImg).toBeInTheDocument()

  // create a fake File
  const file = new File(['dummy'], 'avatar.png', { type: 'image/png' })
  // JSDOM doesn't allow direct assignment to input.files, so define it
  Object.defineProperty(fileInput, 'files', {
    value: [file],
    writable: false,
  })

  // dispatch change event
  fireEvent.change(fileInput)

  // after change, avatar src should be set to the blob url
  expect(avatarImg.src).toBe(fakeBlobUrl)

  // simulate the image load event that triggers revokeObjectURL in the app
  fireEvent.load(avatarImg)
  await waitFor(() => {
    expect(revokeSpy).toHaveBeenCalledWith(fakeBlobUrl)
  })

  // cleanup mocks
  createSpy.mockRestore()
  revokeSpy.mockRestore()
})
