import React from 'react'
import './components-styles.css'

export default function Button({ children, onClick, variant = 'pink', type = 'button', className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={["btn", `btn-${variant}`, className].join(' ').trim()}
    >
      {children}
    </button>
  )
}
