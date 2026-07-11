import './style.css'

const glass = document.querySelector('#glass')
const stage = document.querySelector('#stage')
const dimensions = document.querySelector('#dimensions')
const sliceRange = document.querySelector('#sliceRange')
const shineRange = document.querySelector('#shineRange')
const sliceValue = document.querySelector('#sliceValue')
const shineValue = document.querySelector('#shineValue')

const defaults = { width: 680, height: 460, slice: 148, shine: 72 }
const minimum = { width: 280, height: 240 }
let size = { width: defaults.width, height: defaults.height }
let frame = 0

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

function availableSize() {
  const bounds = stage.getBoundingClientRect()
  return {
    width: Math.max(minimum.width, bounds.width - 32),
    height: Math.max(minimum.height, bounds.height - 32),
  }
}

function renderSize() {
  const available = availableSize()
  size.width = clamp(size.width, minimum.width, available.width)
  size.height = clamp(size.height, minimum.height, available.height)
  glass.style.setProperty('--glass-width', `${Math.round(size.width)}px`)
  glass.style.setProperty('--glass-height', `${Math.round(size.height)}px`)
  dimensions.value = `${Math.round(size.width)} × ${Math.round(size.height)}`
}

function startResize(event) {
  event.preventDefault()
  const handle = event.currentTarget
  const axis = handle.dataset.axis
  const origin = { x: event.clientX, y: event.clientY, ...size }
  handle.setPointerCapture(event.pointerId)
  glass.classList.add('is-resizing')

  const move = (moveEvent) => {
    const available = availableSize()
    if (axis.includes('x')) size.width = clamp(origin.width + moveEvent.clientX - origin.x, minimum.width, available.width)
    if (axis.includes('y')) size.height = clamp(origin.height + moveEvent.clientY - origin.y, minimum.height, available.height)
    renderSize()
  }

  const end = () => {
    glass.classList.remove('is-resizing')
    handle.removeEventListener('pointermove', move)
    handle.removeEventListener('pointerup', end)
    handle.removeEventListener('pointercancel', end)
  }

  handle.addEventListener('pointermove', move)
  handle.addEventListener('pointerup', end)
  handle.addEventListener('pointercancel', end)
}

document.querySelectorAll('.resize-handle').forEach((handle) => {
  handle.addEventListener('pointerdown', startResize)
  handle.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? 24 : 8
    const axis = handle.dataset.axis
    if (axis.includes('x') && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      size.width += event.key === 'ArrowRight' ? step : -step
      renderSize()
      event.preventDefault()
    }
    if (axis.includes('y') && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
      size.height += event.key === 'ArrowDown' ? step : -step
      renderSize()
      event.preventDefault()
    }
  })
})

glass.addEventListener('pointermove', (event) => {
  if (glass.classList.contains('is-resizing')) return
  const bounds = glass.getBoundingClientRect()
  const x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1)
  const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1)
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    glass.style.setProperty('--light-x', `${x * 100}%`)
    glass.style.setProperty('--light-y', `${y * 100}%`)
    glass.style.setProperty('--tilt-x', `${(0.5 - y) * 1.2}deg`)
    glass.style.setProperty('--tilt-y', `${(x - 0.5) * 1.2}deg`)
  })
})

document.querySelectorAll('[data-layer]').forEach((control) => {
  control.addEventListener('change', () => {
    glass.classList.toggle(`hide-${control.dataset.layer}`, !control.checked)
  })
})

sliceRange.addEventListener('input', () => {
  glass.style.setProperty('--slice', `${sliceRange.value}px`)
  sliceValue.value = `${sliceRange.value} px`
})

shineRange.addEventListener('input', () => {
  glass.style.setProperty('--shine', shineRange.value / 100)
  shineValue.value = `${shineRange.value}%`
})

document.querySelector('#reset').addEventListener('click', () => {
  size = { width: defaults.width, height: defaults.height }
  sliceRange.value = defaults.slice
  shineRange.value = defaults.shine
  sliceRange.dispatchEvent(new Event('input'))
  shineRange.dispatchEvent(new Event('input'))
  document.querySelectorAll('[data-layer]').forEach((control) => {
    control.checked = control.dataset.layer !== 'scratches'
    control.dispatchEvent(new Event('change'))
  })
  renderSize()
})

window.addEventListener('resize', renderSize)
renderSize()
