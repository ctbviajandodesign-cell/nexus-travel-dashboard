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
  const [confidenceScore, setConfidenceScore] = useState(98)

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
        <div className="lg:col-span-8 space-y-8 pb-32">
          
          {/* SECTION 1: DATOS BÁSICOS */}
          <section className="card !bg-white/[0.01]">
            <h3 className="text-[16px] font-black mb-6 flex items-center gap-2">
              <Info size={18} className="text-accent-gold" />
              Información del Programa
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
                label="Código Nexus" 
                value={formData.codigo} 
                onChange={(v) => setFormData({...formData, codigo: v})}
                icon={CheckCircle2}
              />
              <ValidationField 
                label="Tipo de Operación" 
                value={formData.tipo_operacion} 
                onChange={(v) => setFormData({...formData, tipo_operacion: v})}
                icon={Layers}
              />
              <ValidationField 
                label="Vigencia" 
                value={formData.vigencia_label} 
                onChange={(v) => setFormData({...formData, vigencia_label: v})}
                icon={Calendar}
              />
              <ValidationField 
                label="País Destino" 
                value={formData.pais_destino} 
                onChange={(v) => setFormData({...formData, pais_destino: v})}
                icon={MapPin}
              />
              <ValidationField 
                label="Ciudad Destino" 
                value={formData.ciudad_destino} 
                onChange={(v) => setFormData({...formData, ciudad_destino: v})}
                icon={MapPin}
              />
              <ValidationField 
                label="Ciudad de Salida" 
                value={formData.ciudad_salida} 
                onChange={(v) => setFormData({...formData, ciudad_salida: v})}
                icon={MapPin}
              />
              <ValidationField 
                label="Aeropuerto Salida (GYE/UIO)" 
                value={formData.aeropuerto_salida} 
                onChange={(v) => setFormData({...formData, aeropuerto_salida: v})}
                icon={MapPin}
              />
              <ValidationField 
                label="Aerolínea" 
                value={formData.aerolinea} 
                onChange={(v) => setFormData({...formData, aerolinea: v})}
                icon={Layers}
              />
                 <ValidationField 
                  label="Días" 
                  value={formData.duracion_dias} 
                  onChange={(v) => setFormData({...formData, duracion_dias: v})}
                />
                <ValidationField 
                  label="Noches" 
                  value={formData.duracion_noches} 
                  onChange={(v) => setFormData({...formData, duracion_noches: v})}
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: SERVICIOS */}
          <section className="card !bg-white/[0.01]">
            <h3 className="text-[16px] font-black mb-6 flex items-center gap-2">
              <Layers size={18} className="text-accent-gold" />
              Servicios y Condiciones
            </h3>
            <div className="space-y-6">
              <ValidationField 
                label="Incluye" 
                value={formData.incluye} 
                onChange={(v) => setFormData({...formData, incluye: v})}
                type="textarea"
              />
              <ValidationField 
                label="No Incluye" 
                value={formData.no_incluye} 
                onChange={(v) => setFormData({...formData, no_incluye: v})}
                type="textarea"
              />
              <ValidationField 
                label="Cortesías CTB" 
                value={formData.cortesias_ctb} 
                onChange={(v) => setFormData({...formData, cortesias_ctb: v})}
                type="textarea"
              />
              <ValidationField 
                label="Notas Importantes" 
                value={formData.notas_importantes} 
                onChange={(v) => setFormData({...formData, notas_importantes: v})}
                type="textarea"
              />
            </div>
          </section>

          {/* SECTION 3: ITINERARIO Y OTROS */}
          <section className="card !bg-white/[0.01]">
            <h3 className="text-[16px] font-black mb-6 flex items-center gap-2">
              <MapPin size={18} className="text-accent-gold" />
              Itinerario Detallado y Hoteles
            </h3>
            <div className="space-y-6">
              <ValidationField 
                label="Itinerario Día a Día" 
                value={formData.itinerario} 
                onChange={(v) => setFormData({...formData, itinerario: v})}
                type="textarea"
              />
              <ValidationField 
                label="Hoteles Previstos" 
                value={formData.hoteles_previstos} 
                onChange={(v) => setFormData({...formData, hoteles_previstos: v})}
              />
              <ValidationField 
                label="Política de Niños" 
                value={formData.politica_ninos} 
                onChange={(v) => setFormData({...formData, politica_ninos: v})}
                type="textarea"
              />
            </div>
          </section>
        </div>

        {/* Right Column: Comparison & Action */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card glass !bg-bg-secondary/80 border-accent-gold/20 sticky top-24">
            <h3 className="font-black text-[14px] uppercase tracking-widest mb-6">Resumen Ejecutivo</h3>
            
            <div className="bg-black/40 rounded-2xl p-6 font-mono text-sm border border-white/5 mb-6">
              <p className="text-accent-gold mb-2">// Código Identificador</p>
              <p className="text-white font-bold text-lg">{formData.codigo || 'SIN CÓDIGO'}</p>
            </div>

            <div className="space-y-4 mb-8">
               <ValidationField 
                  label="Precio Sencilla" 
                  value={formData.precio_sencillo} 
                  onChange={(v) => setFormData({...formData, precio_sencillo: v})}
               />
               <ValidationField 
                  label="Precio Doble" 
                  value={formData.precio_doble} 
                  onChange={(v) => setFormData({...formData, precio_doble: v})}
               />
               <ValidationField 
                  label="Precio Triple" 
                  value={formData.precio_triple} 
                  onChange={(v) => setFormData({...formData, precio_triple: v})}
               />
               <div className="flex justify-between text-sm pt-4 border-t border-white/5">
                  <span className="text-text-muted font-bold uppercase tracking-wider text-[10px]">Moneda</span>
                  <span className="text-white font-black">{formData.moneda || 'USD'}</span>
               </div>
            </div>

            <div className="space-y-3">
               <button onClick={() => onSave(formData)} className="w-full btn-gold flex items-center justify-center gap-2 py-4">
                  <CheckCircle2 size={18} />
                  <span>Guardar en Inventario</span>
               </button>
               <button onClick={onCancel} className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl text-[12px] font-black text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                  <XCircle size={14} />
                  Descartar
               </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ValidationScreen
