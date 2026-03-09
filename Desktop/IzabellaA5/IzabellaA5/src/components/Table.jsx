import React from 'react'
import './components-styles.css'

// columns: [{key, label, render?}]
export default function Table({ columns = [], data = [], actions }) {
  return (
    <div className="table-wrapper">
      <table className="users-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
            {actions && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data && data.length ? (
            data.map((row) => (
              <tr key={row.id}>
                {columns.map((c) => (
                  <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>
                ))}
                {actions && <td className="actions-cell">{actions(row)}</td>}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)}>No hay registros</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
