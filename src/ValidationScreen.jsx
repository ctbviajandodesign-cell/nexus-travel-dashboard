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
  ShieldCheck,
  Phone,
  FileText,
  Users,
  Compass
} from 'lucide-react';

const ValidationField = ({ label, value, onChange, type = 'text', icon: Icon }) => (
  <div className="space-y-1.5 group">
    <label className="text-[10px] font-black uppercase tracking-wider text-white/30 group-focus-within:text-accent-gold transition-colors flex items-center gap-1.5">
      {Icon && <Icon size={12} className="text-accent-gold/40" />}
      {label}
    </label>
    {type === 'textarea' ? (
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-4 text-[13px] text-white/90 focus:outline-none focus:border-accent-gold/50 focus:bg-white/[0.04] transition-all min-h-[120px] resize-y font-medium leading-relaxed"
      />
    ) : (
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 h-11 text-[13px] text-white/90 focus:outline-none focus:border-accent-gold/50 focus:bg-white/[0.04] transition-all font-medium"
      />
    )}
  </div>
);

const SectionHeader = ({ icon: Icon, title, color = "text-accent-gold" }) => (
  <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
    <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center`}>
      <Icon size={18} className={color} />
    </div>
    <h3 className="text-[15px] font-black tracking-tight uppercase">{title}</h3>
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
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-[1500px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={onCancel} className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-white/40">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-[18px] font-black tracking-tight">Validación Maestra</h2>
              <p className="text-[10px] text-accent-gold uppercase tracking-[0.2em] font-black">Control de Calidad Nexus</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onCancel} className="px-6 h-11 rounded-xl text-[12px] font-black text-white/40 hover:text-white">DESCARTAR</button>
            <button onClick={handleSave} className="px-8 h-11 rounded-xl bg-accent-gold text-black text-[12px] font-black flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-accent-gold/20">
              <Save size={16} /> CONFIRMAR Y GUARDAR
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-[1500px] mx-auto px-8 mt-10">
        <div className="grid grid-cols-12 gap-8">
          
          {/* COLUMNA 1: GENERAL & VUELOS */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <section className="card bg-white/[0.01] border-white/5 p-8 rounded-3xl">
              <SectionHeader icon={Info} title="Datos Generales" />
              <div className="space-y-5">
                <ValidationField label="Nombre del Programa" value={formData.nombre} onChange={(v) => setFormData({...formData, nombre: v})} icon={Layers} />
                <div className="grid grid-cols-2 gap-4">
                  <ValidationField label="Código" value={formData.codigo} onChange={(v) => setFormData({...formData, codigo: v})} icon={CheckCircle2} />
                  <ValidationField label="País Principal" value={formData.pais_destino} onChange={(v) => setFormData({...formData, pais_destino: v})} icon={MapPin} />
                </div>
                <ValidationField label="Ciudad Principal" value={formData.ciudad_destino} onChange={(v) => setFormData({...formData, ciudad_destino: v})} icon={MapPin} />
                <div className="grid grid-cols-2 gap-4">
                  <ValidationField label="Días" value={formData.duracion_dias} onChange={(v) => setFormData({...formData, duracion_dias: v})} icon={Calendar} />
                  <ValidationField label="Noches" value={formData.duracion_noches} onChange={(v) => setFormData({...formData, duracion_noches: v})} icon={Clock} />
                </div>
                <ValidationField label="Vigencia General" value={formData.vigencia_label} onChange={(v) => setFormData({...formData, vigencia_label: v})} icon={Calendar} />
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <ValidationField label="Países en la Ruta" value={formData.paises_visitados} onChange={(v) => setFormData({...formData, paises_visitados: v})} icon={MapPin} />
                  <ValidationField label="Ciudades en la Ruta" value={formData.ciudades_visitadas} onChange={(v) => setFormData({...formData, ciudades_visitadas: v})} icon={MapPin} />
                </div>
                <ValidationField label="Fechas Específicas / Salidas" value={formData.salidas_especificas} onChange={(v) => setFormData({...formData, salidas_especificas: v})} icon={Calendar} type="textarea" />
              </div>
            </section>

            <section className="card bg-white/[0.01] border-white/5 p-8 rounded-3xl">
              <SectionHeader icon={Plane} title="Logística Aérea" color="text-blue-400" />
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <ValidationField label="Ciudad Salida" value={formData.ciudad_salida} onChange={(v) => setFormData({...formData, ciudad_salida: v})} icon={MapPin} />
                  <ValidationField label="IATA" value={formData.aeropuerto_salida} onChange={(v) => setFormData({...formData, aeropuerto_salida: v})} icon={Plane} />
                </div>
                <ValidationField label="Aerolínea" value={formData.aerolinea} onChange={(v) => setFormData({...formData, aerolinea: v})} icon={Layers} />
                <ValidationField label="Equipaje / Farebasis" value={formData.politica_equipaje} onChange={(v) => setFormData({...formData, politica_equipaje: v})} icon={Briefcase} />
                <ValidationField label="Info Traslados (Llegada)" value={formData.informacion_traslados} onChange={(v) => setFormData({...formData, informacion_traslados: v})} icon={Clock} type="textarea" />
                <ValidationField label="Puntos de Encuentro" value={formData.punto_encuentro} onChange={(v) => setFormData({...formData, punto_encuentro: v})} icon={MapPin} type="textarea" />
              </div>
            </section>
          </div>

          {/* COLUMNA 2: REQUISITOS & SERVICIOS */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <section className="card bg-white/[0.01] border-white/5 p-8 rounded-3xl">
              <SectionHeader icon={ShieldCheck} title="Requisitos y Finanzas" color="text-emerald-400" />
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                   <ValidationField label="Comisión" value={formData.comision} onChange={(v) => setFormData({...formData, comision: v})} icon={DollarSign} />
                   <ValidationField label="Bono Counter" value={formData.bono_counter} onChange={(v) => setFormData({...formData, bono_counter: v})} icon={DollarSign} />
                </div>
                <ValidationField label="Mínimo Pax" value={formData.minimo_pax} onChange={(v) => setFormData({...formData, minimo_pax: v})} icon={Users} />
                <ValidationField label="Documentación (Visas/Vacunas)" value={formData.documentacion_requisitos} onChange={(v) => setFormData({...formData, documentacion_requisitos: v})} icon={FileText} type="textarea" />
                <ValidationField label="Seguro de Viaje" value={formData.seguro_viaje} onChange={(v) => setFormData({...formData, seguro_viaje: v})} icon={ShieldCheck} />
                <ValidationField label="Teléfono Emergencia" value={formData.telefono_emergencia} onChange={(v) => setFormData({...formData, telefono_emergencia: v})} icon={Phone} />
              </div>
            </section>

            <section className="card bg-white/[0.01] border-white/5 p-8 rounded-3xl">
              <SectionHeader icon={Compass} title="Servicios y Hoteles" color="text-purple-400" />
              <div className="space-y-5">
                <ValidationField label="Incluye" value={formData.incluye} onChange={(v) => setFormData({...formData, incluye: v})} type="textarea" />
                <ValidationField label="No Incluye" value={formData.no_incluye} onChange={(v) => setFormData({...formData, no_incluye: v})} type="textarea" />
                <ValidationField label="Hoteles Previstos" value={formData.hoteles_previstos} onChange={(v) => setFormData({...formData, hoteles_previstos: v})} type="textarea" />
                <ValidationField label="Notas Habitación (Camas/Triples)" value={formData.notas_habitacion} onChange={(v) => setFormData({...formData, notas_habitacion: v})} type="textarea" />
              </div>
            </section>
          </div>

          {/* COLUMNA 3: ITINERARIO & POLÍTICAS */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <section className="card bg-white/[0.01] border-white/5 p-8 rounded-3xl">
              <SectionHeader icon={Clock} title="Itinerario" />
              <ValidationField label="Itinerario Completo" value={formData.itinerario} onChange={(v) => setFormData({...formData, itinerario: v})} type="textarea" />
            </section>

            <section className="card bg-white/[0.01] border-white/5 p-8 rounded-3xl">
              <SectionHeader icon={AlertCircle} title="Políticas y Notas" color="text-rose-400" />
              <div className="space-y-5">
                <ValidationField label="Políticas de Cancelación" value={formData.politicas_cancelacion} onChange={(v) => setFormData({...formData, politicas_cancelacion: v})} type="textarea" />
                <ValidationField label="Notas Importantes" value={formData.notas_importantes} onChange={(v) => setFormData({...formData, notas_importantes: v})} type="textarea" />
                  <ValidationField 
                    label="Actividades y Tours Opcionales" 
                    value={formData.excursiones_opcionales} 
                    onChange={(v) => setFormData({...formData, excursiones_opcionales: v})}
                    type="textarea"
                  />
                <ValidationField label="Feriados / Suplementos" value={formData.feriados} onChange={(v) => setFormData({...formData, feriados: v})} type="textarea" />
                <ValidationField label="Condiciones Especiales" value={formData.condiciones_especiales} onChange={(v) => setFormData({...formData, condiciones_especiales: v})} type="textarea" />
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ValidationScreen;
