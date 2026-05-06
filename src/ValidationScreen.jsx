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
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ValidationField = ({ label, value, onChange, type = 'text', icon: Icon, isTextArea = false }) => (
  <div className="space-y-1.5 group">
    <label className="text-[10px] font-black uppercase tracking-wider text-white/40 group-focus-within:text-accent-gold transition-colors flex items-center gap-1.5">
      {Icon && <Icon size={10} />}
      {label}
    </label>
    {type === 'textarea' ? (
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white/90 focus:outline-none focus:border-accent-gold/50 focus:bg-white/[0.05] transition-all min-h-[100px] resize-y font-medium leading-relaxed"
      />
    ) : (
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 h-12 text-[13px] text-white/90 focus:outline-none focus:border-accent-gold/50 focus:bg-white/[0.05] transition-all font-medium"
      />
    )}
  </div>
);

const ValidationScreen = ({ programData, onSave, onCancel }) => {
  const [formData, setFormData] = useState(programData || {});
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (programData) setFormData(programData);
  }, [programData]);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20">
      {/* HEADER FIJO */}
      <div className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onCancel}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-[18px] font-black tracking-tight">Validar Programa</h2>
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-bold">Auditoría de IA Nexus</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={onCancel}
              className="px-5 h-11 rounded-xl text-[13px] font-bold text-white/60 hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              className="px-6 h-11 rounded-xl bg-accent-gold text-black text-[13px] font-black flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-accent-gold/20"
            >
              <Save size={18} />
              GUARDAR EN INVENTARIO
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-[1000px] mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 gap-8">
          
          {/* SECCIÓN 1: DATOS GENERALES */}
          <section className="card !bg-white/[0.01] border border-white/5 rounded-3xl p-8">
            <h3 className="text-[16px] font-black mb-8 flex items-center gap-2">
              <Info size={18} className="text-accent-gold" />
              Información del Programa
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
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
              
              {/* CAMPOS DE SALIDA CRÍTICOS */}
              <div className="grid grid-cols-2 gap-4">
                <ValidationField 
                  label="Ciudad de Salida" 
                  value={formData.ciudad_salida} 
                  onChange={(v) => setFormData({...formData, ciudad_salida: v})}
                  icon={MapPin}
                />
                <ValidationField 
                  label="Aero Salida (GYE/UIO)" 
                  value={formData.aeropuerto_salida} 
                  onChange={(v) => setFormData({...formData, aeropuerto_salida: v})}
                  icon={MapPin}
                />
              </div>

              <ValidationField 
                label="Aerolínea" 
                value={formData.aerolinea} 
                onChange={(v) => setFormData({...formData, aerolinea: v})}
                icon={Layers}
              />

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
                  icon={Calendar}
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: SERVICIOS */}
          <section className="card !bg-white/[0.01] border border-white/5 rounded-3xl p-8">
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
              <ValidationField 
                label="Feriados y Suplementos" 
                value={formData.feriados} 
                onChange={(v) => setFormData({...formData, feriados: v})}
                type="textarea"
              />
            </div>
          </section>

          {/* SECTION 3: ITINERARIO Y OTROS */}
          <section className="card !bg-white/[0.01] border border-white/5 rounded-3xl p-8">
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

          {/* SECTION 4: PRECIOS (BASE) */}
          <section className="card !bg-white/[0.01] border border-white/5 rounded-3xl p-8">
            <h3 className="text-[16px] font-black mb-6 flex items-center gap-2">
              <DollarSign size={18} className="text-accent-gold" />
              Precios Referenciales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ValidationField 
                label="Precio Sencilla" 
                value={formData.precio_sencillo} 
                onChange={(v) => setFormData({...formData, precio_sencillo: v})}
                type="number"
              />
              <ValidationField 
                label="Precio Doble" 
                value={formData.precio_doble} 
                onChange={(v) => setFormData({...formData, precio_doble: v})}
                type="number"
              />
              <ValidationField 
                label="Precio Triple" 
                value={formData.precio_triple} 
                onChange={(v) => setFormData({...formData, precio_triple: v})}
                type="number"
              />
              <ValidationField 
                label="Moneda" 
                value={formData.moneda} 
                onChange={(v) => setFormData({...formData, moneda: v})}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ValidationScreen;
