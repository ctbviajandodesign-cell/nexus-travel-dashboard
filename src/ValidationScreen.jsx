import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Save, 
  MapPin, 
  Calendar, 
  Layers, 
  DollarSign, 
  Clock,
  ArrowLeft,
  ChevronRight,
  Info,
  Plane,
  Briefcase,
  ShieldCheck
} from 'lucide-react';

const ValidationField = ({ label, value, onChange, type = 'text', icon: Icon, isTextArea = false }) => (
  <div className="space-y-1.5 group">
    <label className="text-[10px] font-black uppercase tracking-wider text-white/40 group-focus-within:text-accent-gold transition-colors flex items-center gap-1.5">
      {Icon && <Icon size={12} className="text-accent-gold/50" />}
      {label}
    </label>
    {type === 'textarea' ? (
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-4 text-[13px] text-white/90 focus:outline-none focus:border-accent-gold/50 focus:bg-white/[0.04] transition-all min-h-[150px] resize-y font-medium leading-relaxed"
        placeholder={`Ingrese ${label.toLowerCase()}...`}
      />
    ) : (
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 h-12 text-[13px] text-white/90 focus:outline-none focus:border-accent-gold/50 focus:bg-white/[0.04] transition-all font-medium"
        placeholder={`Ingrese ${label.toLowerCase()}...`}
      />
    )}
  </div>
);

const ValidationScreen = ({ programData, onSave, onCancel }) => {
  const [formData, setFormData] = useState(programData || {});

  useEffect(() => {
    if (programData) setFormData(programData);
  }, [programData]);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32">
      {/* HEADER PREMIUM */}
      <div className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={onCancel}
              className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-white/40 hover:text-white border border-transparent hover:border-white/10"
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <h2 className="text-[22px] font-black tracking-tight text-white/90">Validar Extracción</h2>
              <p className="text-[11px] text-accent-gold uppercase tracking-[0.2em] font-black">Nexus AI Engine v2.5</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={onCancel}
              className="px-6 h-12 rounded-xl text-[13px] font-black text-white/40 hover:text-white transition-all"
            >
              DESCARTAR
            </button>
            <button 
              onClick={handleSave}
              className="px-8 h-12 rounded-xl bg-accent-gold text-black text-[13px] font-black flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]"
            >
              <Save size={18} />
              CONFIRMAR Y GUARDAR EN CATÁLOGO
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-8 mt-12">
        <div className="grid grid-cols-12 gap-10">
          
          {/* COLUMNA IZQUIERDA: DATOS MAESTROS */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <section className="card bg-white/[0.02] border-white/5 p-8 rounded-[32px] space-y-8">
              <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                <div className="w-10 h-10 rounded-xl bg-accent-gold/10 flex items-center justify-center">
                  <Info size={20} className="text-accent-gold" />
                </div>
                <h3 className="text-lg font-black tracking-tight">Información Base</h3>
              </div>

              <div className="space-y-6">
                <ValidationField 
                  label="Nombre del Programa" 
                  value={formData.nombre} 
                  onChange={(v) => setFormData({...formData, nombre: v})}
                  icon={Layers}
                />
                <div className="grid grid-cols-2 gap-4">
                  <ValidationField 
                    label="Código Nexus" 
                    value={formData.codigo} 
                    onChange={(v) => setFormData({...formData, codigo: v})}
                    icon={CheckCircle2}
                  />
                  <ValidationField 
                    label="Operación" 
                    value={formData.tipo_operacion} 
                    onChange={(v) => setFormData({...formData, tipo_operacion: v})}
                    icon={Briefcase}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ValidationField 
                    label="Días" 
                    value={formData.duracion_dias} 
                    onChange={(v) => setFormData({...formData, duracion_dias: v})}
                    icon={Calendar}
                  />
                  <ValidationField 
                    label="Noches" 
                    value={formData.duracion_noches} 
                    onChange={(v) => setFormData({...formData, duracion_noches: v})}
                    icon={Clock}
                  />
                </div>
                <ValidationField 
                  label="Vigencia / Temporadas" 
                  value={formData.vigencia_label} 
                  onChange={(v) => setFormData({...formData, vigencia_label: v})}
                  icon={Calendar}
                />
              </div>
            </section>

            <section className="card bg-white/[0.02] border-white/5 p-8 rounded-[32px] space-y-8">
              <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Plane size={20} className="text-blue-400" />
                </div>
                <h3 className="text-lg font-black tracking-tight">Logística Aérea</h3>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <ValidationField 
                    label="Ciudad Salida" 
                    value={formData.ciudad_salida} 
                    onChange={(v) => setFormData({...formData, ciudad_salida: v})}
                    icon={MapPin}
                  />
                  <ValidationField 
                    label="Aero (IATA)" 
                    value={formData.aeropuerto_salida} 
                    onChange={(v) => setFormData({...formData, aeropuerto_salida: v})}
                    icon={Plane}
                  />
                </div>
                <ValidationField 
                  label="Aerolínea" 
                  value={formData.aerolinea} 
                  onChange={(v) => setFormData({...formData, aerolinea: v})}
                  icon={Layers}
                />
                <ValidationField 
                  label="Política Equipaje / Farebasis" 
                  value={formData.politica_equipaje} 
                  onChange={(v) => setFormData({...formData, politica_equipaje: v})}
                  icon={Briefcase}
                />
              </div>
            </section>

            <section className="card bg-white/[0.02] border-white/5 p-8 rounded-[32px] space-y-8">
              <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <DollarSign size={20} className="text-emerald-400" />
                </div>
                <h3 className="text-lg font-black tracking-tight">Finanzas Referenciales</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ValidationField label="Sencilla" value={formData.precio_sencillo} onChange={(v) => setFormData({...formData, precio_sencillo: v})} type="number" />
                <ValidationField label="Doble" value={formData.precio_doble} onChange={(v) => setFormData({...formData, precio_doble: v})} type="number" />
                <ValidationField label="Triple" value={formData.precio_triple} onChange={(v) => setFormData({...formData, precio_triple: v})} type="number" />
                <ValidationField label="Comisión" value={formData.comision} onChange={(v) => setFormData({...formData, comision: v})} icon={DollarSign} />
              </div>
            </section>
          </div>

          {/* COLUMNA DERECHA: TEXTOS LARGOS */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            
            <section className="card bg-white/[0.02] border-white/5 p-10 rounded-[32px] space-y-8">
              <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                <div className="w-10 h-10 rounded-xl bg-accent-gold/10 flex items-center justify-center">
                  <Clock size={20} className="text-accent-gold" />
                </div>
                <h3 className="text-lg font-black tracking-tight">Itinerario y Hoteles</h3>
              </div>
              
              <div className="space-y-8">
                <ValidationField 
                  label="Itinerario Detallado (Día a Día)" 
                  value={formData.itinerario} 
                  onChange={(v) => setFormData({...formData, itinerario: v})}
                  type="textarea"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ValidationField 
                    label="Hoteles Previstos" 
                    value={formData.hoteles_previstos} 
                    onChange={(v) => setFormData({...formData, hoteles_previstos: v})}
                    type="textarea"
                  />
                  <ValidationField 
                    label="Política de Niños" 
                    value={formData.politica_ninos} 
                    onChange={(v) => setFormData({...formData, politica_ninos: v})}
                    type="textarea"
                  />
                </div>
              </div>
            </section>

            <section className="card bg-white/[0.02] border-white/5 p-10 rounded-[32px] space-y-8">
              <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                <div className="w-10 h-10 rounded-xl bg-accent-gold/10 flex items-center justify-center">
                  <ShieldCheck size={20} className="text-accent-gold" />
                </div>
                <h3 className="text-lg font-black tracking-tight">Servicios, Notas y Feriados</h3>
              </div>
              
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ValidationField 
                    label="El Programa Incluye" 
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
                </div>
                <ValidationField 
                  label="Notas Importantes" 
                  value={formData.notas_importantes} 
                  onChange={(v) => setFormData({...formData, notas_importantes: v})}
                  type="textarea"
                />
                <ValidationField 
                  label="Feriados Especiales / Suplementos" 
                  value={formData.feriados} 
                  onChange={(v) => setFormData({...formData, feriados: v})}
                  type="textarea"
                />
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ValidationScreen;
