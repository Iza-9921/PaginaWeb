import React from 'react'
import './components-styles.css'

export default function Input({ label, name, value, onChange, type = 'text', placeholder = '', error = '' }) {
  return (
    <div className="input-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input id={name} name={name} value={value} onChange={onChange} type={type} placeholder={placeholder} />
      {error && <small className="input-error">{error}</small>}
    </div>
  )
}
