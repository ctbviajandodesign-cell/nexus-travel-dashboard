import React, { useState } from 'react'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Eye, 
  ExternalLink,
  RefreshCw,
  Power
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const StatusBadge = ({ status }) => {
  const config = {
    activo: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    borrador: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    inactivo: 'bg-rose-400/10 text-rose-400 border-rose-400/20'
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${config[status] || config.borrador}`}>
      {status}
    </span>
  )
}

const InventoryTable = ({ programs, onEdit, onToggleStatus, onView, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [filterOpen, setFilterOpen] = useState(false)

  const STATUS_OPTIONS = ['todos', 'activo', 'borrador', 'inactivo']

  const filtered = programs.filter(p => {
    const matchSearch = !searchTerm || (() => {
      const term = searchTerm.toLowerCase()
      return (
        p.nombre?.toLowerCase().includes(term) ||
        p.codigo?.toLowerCase().includes(term) ||
        p.destino?.toLowerCase().includes(term)
      )
    })()
    const matchStatus = statusFilter === 'todos' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Table Actions */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex-1 flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] px-4 py-2.5 rounded-2xl max-w-md focus-within:border-accent-gold/30 transition-all">
          <Search size={18} className="text-text-muted" />
          <input 
            type="text" 
            placeholder="Buscar por código o nombre..." 
            className="bg-transparent border-none outline-none text-[14px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-400/5 border border-emerald-400/10 rounded-xl flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">Nexus Padre: Online</span>
          </div>
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen(prev => !prev)}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 ${
                statusFilter !== 'todos'
                  ? 'bg-accent-gold/10 border-accent-gold/30 text-accent-gold'
                  : 'bg-white/[0.03] border-white/[0.05] text-text-secondary hover:text-white'
              }`}
            >
              <Filter size={18} />
              {statusFilter !== 'todos' && (
                <span className="text-[11px] font-black uppercase">{statusFilter}</span>
              )}
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-[#1a1a1f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setStatusFilter(opt); setFilterOpen(false); }}
                    className={`w-full px-4 py-3 text-left text-[12px] font-bold uppercase tracking-widest transition-colors hover:bg-white/5 ${
                      statusFilter === opt ? 'text-accent-gold' : 'text-text-secondary'
                    }`}
                  >
                    {opt === 'todos' ? 'Todos los estados' : opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actual Table */}
      <div className="card !p-0 overflow-hidden border-white/[0.05]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/[0.05]">
              <th className="px-6 py-4 text-[11px] font-black text-text-muted uppercase tracking-widest">Código Nexus</th>
              <th className="px-6 py-4 text-[11px] font-black text-text-muted uppercase tracking-widest">Programa</th>
              <th className="px-6 py-4 text-[11px] font-black text-text-muted uppercase tracking-widest">Destino</th>
              <th className="px-6 py-4 text-[11px] font-black text-text-muted uppercase tracking-widest text-center">Estado</th>
              <th className="px-6 py-4 text-[11px] font-black text-text-muted uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-text-muted text-[13px] font-medium">
                  No se encontraron programas para "{searchTerm}"
                </td>
              </tr>
            ) : filtered.map((prog) => (
              <tr key={prog.id} className="group hover:bg-white/[0.01] transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-[13px] text-accent-gold font-bold">{prog.codigo}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-[14px] font-semibold text-white/90">{prog.nombre}</p>
                    <p className="text-[11px] text-text-muted">{prog.duracion}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[13px] text-text-secondary">{prog.destino}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={prog.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onView(prog)}
                      className="p-2 text-text-muted hover:text-white transition-colors" 
                      title="Ver Detalle"
                    >
                      <Eye size={16} />
                    </button>
                    <button onClick={() => onEdit(prog)} className="p-2 text-text-muted hover:text-accent-gold transition-colors" title="Editar">
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => onToggleStatus(prog.id)}
                      className={`p-2 transition-colors ${prog.status === 'activo' ? 'text-text-muted hover:text-rose-400' : 'text-text-muted hover:text-emerald-400'}`}
                      title={prog.status === 'activo' ? 'Desactivar' : 'Activar'}
                    >
                      <Power size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(prog.id)}
                      className="p-2 text-text-muted hover:text-rose-500 transition-colors" 
                      title="Eliminar Definitivamente"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default InventoryTable
