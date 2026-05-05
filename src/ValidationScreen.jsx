import React, { useState, useEffect } from 'react'
import { 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft, 
  Save, 
  XCircle,
  Info,
  MapPin,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react'
import { motion } from 'framer-motion'

const ValidationField = ({ label, value, onChange, type = "text", icon: Icon }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-1.5 px-1">
      {Icon && <Icon size={12} className="text-accent-gold" />}
      {label}
    </label>
    {type === "textarea" ? (
      <textarea 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 text-[14px] text-white/90 min-h-[120px] focus:border-accent-gold/50 focus:bg-white/[0.04] transition-all outline-none"
      />
    ) : (
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white/90 focus:border-accent-gold/50 focus:bg-white/[0.04] transition-all outline-none"
      />
    )}
  </div>
)

const ValidationScreen = ({ data, onSave, onCancel }) => {
  const [formData, setFormData] = useState(data)
  const [confidenceScore, setConfidenceScore] = useState(94)

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    if (score >= 70) return 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    return 'text-rose-400 bg-rose-400/10 border-rose-400/20'
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-[1200px] mx-auto pt-4"
    >
      {/* Header Validation */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onCancel} className="flex items-center gap-2 text-text-secondary hover:text-white transition-all group">
          <div className="p-2 rounded-lg group-hover:bg-white/5">
            <ChevronLeft size={20} />
          </div>
          <span className="font-bold text-sm uppercase tracking-widest">Regresar</span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-2xl border flex items-center gap-3 ${getScoreColor(confidenceScore)}`}>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-tighter leading-none">Confianza IA</span>
              <span className="text-xl font-black">{confidenceScore}%</span>
            </div>
            <CheckCircle2 size={24} />
          </div>
          <button onClick={() => onSave(formData)} className="btn-gold flex items-center gap-2">
            <Save size={18} />
            <span>Aprobar y Guardar</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Metadata */}
        <div className="lg:col-span-8 space-y-8">
          <section className="card !bg-white/[0.01]">
            <h3 className="text-[16px] font-black mb-6 flex items-center gap-2">
              <Info size={18} className="text-accent-gold" />
              Información General
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <ValidationField 
                  label="Nombre del Programa" 
                  value={formData.nombre} 
                  onChange={(v) => setFormData({...formData, nombre: v})}
                  icon={Layers}
                />
              </div>
              <ValidationField 
                label="Código Nexus (Autogenerado)" 
                value={formData.codigo} 
                onChange={(v) => setFormData({...formData, codigo: v})}
                icon={CheckCircle2}
              />
              <ValidationField 
                label="Destino Principal" 
                value={formData.destino} 
                onChange={(v) => setFormData({...formData, destino: v})}
                icon={MapPin}
              />
              <ValidationField 
                label="Días / Noches" 
                value={formData.duracion} 
                onChange={(v) => setFormData({...formData, duracion: v})}
                icon={Calendar}
              />
              <ValidationField 
                label="Vigencia" 
                value={formData.vigencia} 
                onChange={(v) => setFormData({...formData, vigencia: v})}
                icon={Calendar}
              />
            </div>
          </section>

          <section className="card !bg-white/[0.01]">
            <h3 className="text-[16px] font-black mb-6 flex items-center gap-2">
              <Layers size={18} className="text-accent-gold" />
              Inclusiones y Servicios
            </h3>
            <div className="space-y-6">
              <ValidationField 
                label="Programa Incluye" 
                value={formData.incluye} 
                onChange={(v) => setFormData({...formData, incluye: v})}
                type="textarea"
              />
              <ValidationField 
                label="Cortesías CTB" 
                value={formData.cortesias} 
                onChange={(v) => setFormData({...formData, cortesias: v})}
                type="textarea"
              />
              <ValidationField 
                label="Notas Importantes" 
                value={formData.notas} 
                onChange={(v) => setFormData({...formData, notas: v})}
                type="textarea"
              />
            </div>
          </section>
        </div>

        {/* Right Column: Comparison & Action */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card glass !bg-bg-secondary/80 border-accent-gold/20 sticky top-24">
            <h3 className="font-black text-[14px] uppercase tracking-widest mb-6">Vista Previa Código</h3>
            
            <div className="bg-black/40 rounded-2xl p-6 font-mono text-sm border border-white/5 mb-6">
              <p className="text-accent-gold mb-2">// Código Generado</p>
              <p className="text-white font-bold text-lg">{formData.codigo}</p>
            </div>

            <div className="space-y-4">
              <p className="text-[12px] text-text-secondary leading-relaxed italic">
                Nexus ha inferido la característica <span className="text-white font-bold">PTY-CMP</span> basándose en el itinerario de Ciudad y Playa.
              </p>
              <div className="flex items-center gap-2 text-emerald-400 text-[12px] font-bold">
                <CheckCircle2 size={14} />
                <span>Listo para Supabase</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
               <button onClick={onCancel} className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl text-[12px] font-black text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                  <XCircle size={14} />
                  Descartar
               </button>
            </div>
          </div>
          
          <div className="p-6 bg-accent-gold/5 border border-accent-gold/10 rounded-2xl">
             <div className="flex items-start gap-4">
                <AlertCircle className="text-accent-gold" size={20} />
                <p className="text-[11px] text-text-secondary leading-relaxed">
                   Al aprobar, el programa se guardará en Supabase con estado <span className="text-white font-bold">INACTIVO</span>. 
                   Deberás sincronizar los precios desde el Excel Padre para activarlo.
                </p>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ValidationScreen
