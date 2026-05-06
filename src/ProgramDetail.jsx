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
  Info,
  Layers,
  AlertCircle,
  Plane,
  Phone,
  ShieldCheck,
  FileText,
  Users,
  Compass,
  Briefcase
} from 'lucide-react'
import { motion } from 'framer-motion'

const StatusBadge = ({ status }) => {
  const styles = {
    activo: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    borrador: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    inactivo: "bg-rose-500/10 text-rose-400 border-rose-500/20"
  }
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.borrador}`}>
      {status || 'borrador'}
    </span>
  )
}

const DetailSection = ({ icon: Icon, title, children, color = "text-accent-gold" }) => (
  <div className="card glass !bg-white/[0.01] border-white/5 p-8 rounded-[32px]">
    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
      <Icon size={18} className={color} />
      <h4 className="text-[12px] font-black uppercase tracking-widest">{title}</h4>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
)

const ProgramDetail = ({ program, onBack }) => {
  const headerImage = "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?q=80&w=2500&auto=format&fit=crop"

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1400px] mx-auto pb-32">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-10 px-4">
        <button onClick={onBack} className="flex items-center gap-2 text-white/40 hover:text-white transition-all group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-black text-[11px] uppercase tracking-[0.2em]">Regresar al Catálogo</span>
        </button>
        <div className="flex items-center gap-3">
          <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"><Share2 size={18} /></button>
          <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"><Download size={18} /></button>
          <button className="btn-gold px-8">Cotizar ahora</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          
          {/* Header Card */}
          <div className="relative h-[500px] rounded-[48px] overflow-hidden shadow-2xl">
            <img src={headerImage} alt={program.nombre} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
            <div className="absolute bottom-12 left-12 right-12">
              <div className="flex items-center gap-4 mb-6">
                <StatusBadge status={program.status} />
                <span className="text-[11px] font-black text-accent-gold flex items-center gap-1.5 uppercase tracking-widest">
                  <Star size={14} fill="currentColor" /> Nexus Premium
                </span>
              </div>
              <h1 className="text-6xl font-black mb-6 tracking-tighter leading-none">{program.nombre}</h1>
              <div className="flex flex-wrap items-center gap-8 text-white/90">
                <div className="flex items-center gap-2.5"><MapPin size={20} className="text-accent-gold" /><span className="text-sm font-black uppercase tracking-wider">{program.pais_destino} • {program.ciudad_destino}</span></div>
                <div className="flex items-center gap-2.5"><Calendar size={20} className="text-accent-gold" /><span className="text-sm font-black uppercase tracking-wider">{program.duracion_label}</span></div>
                {program.ciudad_salida && <div className="flex items-center gap-2.5"><Plane size={20} className="text-blue-400" /><span className="text-sm font-black uppercase tracking-wider">Sale de {program.ciudad_salida}</span></div>}
              </div>
            </div>
          </div>

          {/* Salidas Específicas (Turkey Style) */}
          {program.salidas_especificas && (
            <DetailSection icon={Calendar} title="Próximas Salidas Garantizadas" color="text-emerald-400">
               <div className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap font-medium">
                  {program.salidas_especificas}
               </div>
            </DetailSection>
          )}

          {/* Pricing Grid */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Sencilla', val: program.precio_sencillo, color: 'text-white/40' },
              { label: 'Doble (Desde)', val: program.precio_doble, color: 'text-accent-gold' },
              { label: 'Triple', val: program.precio_triple, color: 'text-white/40' }
            ].map((p, i) => (
              <div key={i} className={`card !bg-white/[0.02] border-white/5 p-8 text-center rounded-[32px] ${i === 1 ? 'ring-1 ring-accent-gold/20' : ''}`}>
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${p.color}`}>{p.label}</p>
                <p className="text-3xl font-black text-white">${p.val || '0'}</p>
              </div>
            ))}
          </div>

          {/* Main Content Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DetailSection icon={CheckCircle2} title="Programa Incluye" color="text-emerald-400">
               <div className="space-y-3 text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{program.incluye}</div>
            </DetailSection>
            <DetailSection icon={X} title="No Incluye" color="text-rose-400">
               <div className="space-y-3 text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{program.no_incluye}</div>
            </DetailSection>
          </div>

          <DetailSection icon={Clock} title="Itinerario Día a Día">
             <div className="text-sm text-white/70 leading-loose whitespace-pre-wrap">{program.itinerario}</div>
          </DetailSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DetailSection icon={Compass} title="Hotelería y Camas">
               <div className="space-y-4">
                  <div><p className="text-[10px] font-black text-accent-gold uppercase mb-1">Hoteles Previstos</p><p className="text-sm text-white/80">{program.hoteles_previstos}</p></div>
                  {program.notas_habitacion && <div><p className="text-[10px] font-black text-accent-gold uppercase mb-1">Configuración de Habitación</p><p className="text-xs text-white/60 leading-relaxed">{program.notas_habitacion}</p></div>}
                  <div><p className="text-[10px] font-black text-accent-gold uppercase mb-1">Política de Niños</p><p className="text-xs text-white/60 leading-relaxed">{program.politica_ninos}</p></div>
               </div>
            </DetailSection>
            <DetailSection icon={AlertCircle} title="Políticas de Cancelación" color="text-rose-400">
               <div className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap italic">{program.politicas_cancelacion}</div>
            </DetailSection>
          </div>

        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="card glass sticky top-28 p-8 rounded-[40px] border-white/10 space-y-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4">Comisión Agente</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-emerald-400">{program.comision || '$0'}</span>
                {program.bono_counter && <span className="text-xs font-bold text-accent-gold">+{program.bono_counter} Bono</span>}
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-white/5">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0"><Plane size={18} className="text-blue-400" /></div>
                <div><p className="text-[10px] font-black text-white/40 uppercase">Vuelo y Equipaje</p><p className="text-xs text-white/80 font-bold">{program.aerolinea} • {program.politica_equipaje}</p></div>
              </div>
              {program.telefono_emergencia && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0"><Phone size={18} className="text-emerald-400" /></div>
                  <div><p className="text-[10px] font-black text-white/40 uppercase">Asistencia 24/7</p><p className="text-xs text-white/80 font-bold">{program.telefono_emergencia}</p></div>
                </div>
              )}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0"><FileText size={18} className="text-purple-400" /></div>
                <div><p className="text-[10px] font-black text-white/40 uppercase">Requisitos</p><p className="text-xs text-white/60 leading-tight">{program.documentacion_requisitos}</p></div>
              </div>
            </div>

            {program.punto_encuentro && (
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                <p className="text-[10px] font-black text-accent-gold uppercase mb-2 flex items-center gap-2"><MapPin size={12} /> Punto de Encuentro</p>
                <p className="text-[11px] text-white/60 leading-relaxed">{program.punto_encuentro}</p>
              </div>
            )}

            <button className="w-full h-14 rounded-2xl bg-accent-gold text-black font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent-gold/20">
              COTIZAR PROGRAMA
            </button>
          </div>

          <DetailSection icon={Info} title="Notas Adicionales" color="text-white/40">
             <div className="text-xs text-white/50 leading-relaxed whitespace-pre-wrap">{program.notas_importantes}</div>
          </DetailSection>
          
        </div>
      </div>
    </motion.div>
  )
}

export default ProgramDetail
