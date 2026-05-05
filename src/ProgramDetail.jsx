import React from 'react'
import { 
  ChevronLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Star, 
  Share2, 
  Download,
  Info
} from 'lucide-react'
import { motion } from 'framer-motion'

const ProgramDetail = ({ program, onBack }) => {
  // Mock image for the premium look
  const headerImage = "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?q=80&w=2500&auto=format&fit=crop"

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1200px] mx-auto pb-20"
    >
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-text-secondary hover:text-white transition-all group">
          <div className="p-2 rounded-lg group-hover:bg-white/5">
            <ChevronLeft size={20} />
          </div>
          <span className="font-bold text-sm uppercase tracking-widest">Regresar al catálogo</span>
        </button>
        
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
            <Share2 size={18} />
          </button>
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
            <Download size={18} />
          </button>
          <button className="btn-gold">Cotizar ahora</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Visual & Itinerary */}
        <div className="lg:col-span-8 space-y-12">
          {/* Main Card */}
          <div className="relative h-[450px] rounded-[40px] overflow-hidden group">
            <img 
              src={headerImage} 
              alt={program.nombre} 
              className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/20 to-transparent" />
            
            <div className="absolute bottom-10 left-10 right-10">
              <div className="flex items-center gap-3 mb-4">
                <StatusBadge status={program.status} />
                <span className="text-[12px] font-bold text-accent-gold flex items-center gap-1">
                  <Star size={14} fill="currentColor" />
                  Premium Choice
                </span>
              </div>
              <h1 className="text-5xl font-black mb-4 tracking-tighter leading-none">{program.nombre}</h1>
              <div className="flex items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-accent-gold" />
                  <span className="text-sm font-bold">{program.destino}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-accent-gold" />
                  <span className="text-sm font-bold">{program.duracion}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Itinerary Section */}
          <section className="space-y-8 px-4">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <Clock className="text-accent-gold" />
              Detalle del Programa
            </h3>
            
            <div className="space-y-6">
              <div className="card glass !bg-white/[0.01]">
                <h4 className="text-[12px] font-black uppercase tracking-widest text-accent-gold mb-4">Incluye</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {program.incluye?.split('\n').map((item, i) => (
                     <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-white/70 leading-relaxed">{item}</span>
                     </div>
                   ))}
                </div>
              </div>

              <div className="card glass !bg-accent-gold/[0.03] border-accent-gold/10">
                <h4 className="text-[12px] font-black uppercase tracking-widest text-accent-gold mb-4">Cortesías CTB</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {program.cortesias?.split('\n').map((item, i) => (
                     <div key={i} className="flex items-start gap-3">
                        <Star size={16} className="text-accent-gold shrink-0 mt-0.5" />
                        <span className="text-sm text-white/70 leading-relaxed">{item}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Pricing & Quick Info */}
        <div className="lg:col-span-4 space-y-8">
           <div className="card glass sticky top-24 border-white/10 p-8">
              <div className="mb-8">
                <p className="text-[12px] font-black text-text-muted uppercase tracking-widest mb-1">Código de Referencia</p>
                <p className="font-mono text-lg font-bold text-white">{program.codigo}</p>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex items-center justify-between py-4 border-b border-white/5">
                   <span className="text-text-secondary text-sm">Vigencia</span>
                   <span className="font-bold text-white text-sm">{program.vigencia || 'Ver notas'}</span>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-white/5">
                   <span className="text-text-secondary text-sm">Operación</span>
                   <span className="font-bold text-white text-sm">Nexus Real-Time</span>
                </div>
                <div className="flex items-center justify-between py-4">
                   <span className="text-text-secondary text-sm">Categoría</span>
                   <span className="font-bold text-white text-sm">Wholesale Premium</span>
                </div>
              </div>

              <div className="p-6 bg-white/[0.03] rounded-[24px] mb-8">
                 <div className="flex items-center gap-3 mb-2 text-text-muted">
                    <Info size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Información Crítica</span>
                 </div>
                 <p className="text-[11px] text-text-secondary leading-relaxed">
                   {program.notas || 'No hay notas adicionales para este programa.'}
                 </p>
              </div>

              <button className="w-full py-4 bg-accent-gold text-bg-primary font-black rounded-[20px] hover:bg-accent-gold-bright transition-all mb-4">
                 Generar Reserva
              </button>
              <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-black rounded-[20px] hover:bg-white/10 transition-all">
                 Solicitar Modificación
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  )
}

const StatusBadge = ({ status }) => {
  const config = {
    activo: 'bg-emerald-400 text-bg-primary',
    borrador: 'bg-amber-400 text-bg-primary',
    inactivo: 'bg-rose-400 text-bg-primary'
  }
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] ${config[status] || config.borrador}`}>
      {status}
    </span>
  )
}

export default ProgramDetail
