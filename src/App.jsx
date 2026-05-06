import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './lib/supabase'
import { extractProgramData } from './lib/ai'
import * as mammoth from 'mammoth/mammoth.browser'
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  Database, 
  Settings, 
  BarChart3,
  LayoutDashboard,
  Search,
  Plus,
  User,
  ShieldCheck,
  Eye,
  TrendingUp,
  Globe,
  Zap,
  Bell,
  Lock,
  Palette,
  Server
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ValidationScreen from './ValidationScreen'
import InventoryTable from './InventoryTable'
import ProgramDetail from './ProgramDetail'

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
      active 
      ? 'bg-accent-gold/10 text-accent-gold' 
      : 'text-text-secondary hover:text-white hover:bg-white/[0.03]'
    }`}
  >
    <Icon size={18} strokeWidth={active ? 2.5 : 2} />
    <span className={`text-[14px] ${active ? 'font-semibold' : 'font-medium'}`}>{label}</span>
  </button>
)

const FileStatus = ({ file, status, progress, onValidate }) => {
  const statusConfig = {
    extracting: { icon: Clock, color: 'text-amber-400', label: 'Procesando con Claude 3.5...' },
    validating: { icon: AlertCircle, color: 'text-accent-gold', label: 'Revisión Pendiente' },
    completed: { icon: CheckCircle2, color: 'text-emerald-400', label: 'Sincronizado' }
  }
  
  const { icon: Icon, color, label } = statusConfig[status]
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl mb-2 hover:bg-white/[0.04] transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white/[0.03] rounded-xl flex items-center justify-center text-text-muted">
          <FileText size={20} />
        </div>
        <div>
          <h4 className="text-[14px] font-semibold text-white/90">{file.name}</h4>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Icon size={12} className={color} />
            <span className={`text-[11px] font-bold uppercase tracking-wider ${color}`}>{label}</span>
          </div>
        </div>
      </div>
      
      {status === 'extracting' && (
        <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-accent-gold"
          />
        </div>
      )}
      
      {(status === 'validating' || status === 'completed') && (
        <button 
          onClick={() => status === 'validating' && onValidate(file)}
          className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
            status === 'validating' 
            ? 'bg-accent-gold text-bg-primary hover:bg-accent-gold-bright' 
            : 'bg-white/5 text-text-secondary hover:bg-white/10'
          }`}
        >
          {status === 'validating' ? 'Validar' : 'Ver'}
        </button>
      )}
    </motion.div>
  )
}

const EMPTY_PROGRAM = {
  codigo: '',
  nombre: '',
  duracion_label: '',
  duracion_dias: 0,
  duracion_noches: 0,
  destino_principal: '',
  pais_destino: '',
  ciudad_destino: '',
  vigencia_label: '',
  incluye: '',
  no_incluye: '',
  cortesias_ctb: '',
  notas_importantes: '',
  itinerario: '',
  hoteles_previstos: '',
  politica_ninos: '',
  precio_doble: 0,
  moneda: 'USD',
  status: 'borrador'
}

function App() {
  const [isDragging, setIsDragging] = useState(false)
  const [role, setRole] = useState('operador')
  const [view, setView] = useState('dashboard')
  const [validatingFile, setValidatingFile] = useState(null)
  const [selectedProgram, setSelectedProgram] = useState(null)
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState(null)

  const [files, setFiles] = useState([])
  const [inventoryPrograms, setInventoryPrograms] = useState([])
  const [activeTab, setActiveTab] = useState('dashboard')

  // ── Cargar programas desde Supabase al iniciar ──
  useEffect(() => {
    loadPrograms()
  }, [])

  const loadPrograms = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('programas')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Error cargando programas:', error)
      setDbError(error.message)
    } else {
      // Map and preserve all fields
      setInventoryPrograms(data.map(p => ({
        ...p,
        // Aliases for backward compatibility in some UI parts
        destino: p.destino_principal || p.ciudad_destino || '',
        duracion: p.duracion_label || '',
        notas: p.notas_importantes || '',
        vigencia: p.vigencia_label || '',
        cortesias: p.cortesias_ctb || '',
      })))
    }
    setLoading(false)
  }

  // ── Toggle estado activo/inactivo en Supabase ──
  const toggleProgramStatus = async (id) => {
    const prog = inventoryPrograms.find(p => p.id === id)
    if (!prog) return
    const nextStatus = prog.status === 'activo' ? 'inactivo' : 'activo'
    // Optimistic UI update
    setInventoryPrograms(prev => prev.map(p => p.id === id ? { ...p, status: nextStatus } : p))
    const { error } = await supabase
      .from('programas')
      .update({ status: nextStatus })
      .eq('id', id)
    if (error) {
      console.error('Error actualizando estado:', error)
      // Revert on error
      setInventoryPrograms(prev => prev.map(p => p.id === id ? { ...p, status: prog.status } : p))
    }
  }

  // ── Eliminar programa en Supabase ──
  const handleDelete = async (id) => {
    setInventoryPrograms(prev => prev.filter(p => p.id !== id))
    const { error } = await supabase.from('programas').delete().eq('id', id)
    if (error) {
      console.error('Error eliminando programa:', error)
      loadPrograms() // reload on error
    }
  }

  const handleNuevoPrograma = () => {
    setValidatingFile({ id: `new-${Date.now()}`, extractedData: { ...EMPTY_PROGRAM } })
    setView('validation')
  }

  const handleExaminarArchivos = () => {
    fileInputRef.current?.click()
  }

  const handleFiles = async (acceptedFiles) => {
    acceptedFiles.forEach(async (file) => {
      const newFile = { 
        id: Date.now() + Math.random(), 
        name: file.name, 
        status: 'extracting', 
        progress: 10 
      }
      setFiles(prev => [newFile, ...prev])

      try {
        const arrayBuffer = await file.arrayBuffer()
        // Convertimos a HTML para mantener la estructura de tablas y listas
        const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
        const htmlContent = result.value
        
        console.log("Contenido extraído del Word (HTML):", htmlContent.substring(0, 500) + "...")
        
        setFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, progress: 40 } : f))

        // 2. Procesar con IA (GPT-4o-mini)
        const extracted = await extractProgramData(htmlContent)
        
        const fileWithData = { 
          ...newFile, 
          status: 'validating', 
          progress: 100, 
          extractedData: { ...EMPTY_PROGRAM, ...extracted } 
        }

        setFiles(prev => prev.map(f => f.id === newFile.id ? fileWithData : f))
        
        // 3. Abrir automáticamente para validar
        setValidatingFile(fileWithData)
        setView('validation')

      } catch (error) {
        console.error("Error procesando archivo:", error)
        alert("Error al procesar archivo: " + error.message)
        setFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, status: 'error' } : f))
      }
    })
  }

  const handleFileInputChange = (e) => {
    handleFiles(Array.from(e.target.files))
    e.target.value = ''
  }

  const onDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(Array.from(e.dataTransfer.files))
  }

  return (
    <div className="flex h-screen bg-bg-primary text-white font-sans">
      {/* Sidebar - Apple Style Ultra Clean */}
      <aside className="w-[260px] border-r border-white/[0.05] flex flex-col p-6 bg-white/[0.01]">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-9 h-9 bg-accent-gold rounded-xl flex items-center justify-center shadow-lg shadow-accent-gold/20">
            <span className="text-bg-primary font-black italic text-lg">N</span>
          </div>
          <div>
            <h2 className="text-[16px] font-black tracking-tighter leading-none">NEXUS</h2>
            <p className="text-[10px] text-accent-gold font-bold tracking-[0.2em] uppercase">Travel System</p>
          </div>
        </div>
        
        <nav className="space-y-1.5 flex-1">
          <p className="px-4 text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-3">Menú Principal</p>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setView('dashboard'); }} />
          <SidebarItem icon={Database} label="Inventario" active={activeTab === 'inventory'} onClick={() => { setActiveTab('inventory'); setView('inventory'); }} />
          <SidebarItem icon={BarChart3} label="Analíticas" active={activeTab === 'stats'} onClick={() => { setActiveTab('stats'); setView('stats'); }} />
          <SidebarItem icon={Settings} label="Configuración" active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setView('settings'); }} />
        </nav>
        
        {/* Role Switcher (Mockup) */}
        <div className="mt-auto p-4 bg-white/[0.03] rounded-2xl border border-white/[0.05]">
          <p className="text-[10px] font-bold text-text-muted uppercase mb-3 text-center">Modo de Vista</p>
          <div className="flex p-1 bg-black/40 rounded-xl">
            <button 
              onClick={() => setRole('operador')}
              className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all ${role === 'operador' ? 'bg-accent-gold text-bg-primary font-bold' : 'text-text-muted'}`}
            >
              <ShieldCheck size={14} />
            </button>
            <button 
              onClick={() => setRole('agencia')}
              className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all ${role === 'agencia' ? 'bg-accent-gold text-bg-primary font-bold' : 'text-text-muted'}`}
            >
              <Eye size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col bg-gradient-to-br from-bg-primary to-bg-secondary/30">
        {/* Header - Transparent & Minimal */}
        <header className="h-20 flex items-center justify-between px-10 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.05] px-4 py-2.5 rounded-2xl w-[400px] focus-within:border-accent-gold/30 transition-all">
            <Search size={18} className="text-text-muted" />
            <input type="text" placeholder="Buscar programas, destinos o códigos..." className="bg-transparent border-none outline-none text-[14px] placeholder:text-text-muted" />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[13px] font-bold">Juan Marca</span>
              <span className="text-[10px] text-accent-gold font-bold uppercase tracking-widest">Superadmin</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-accent-gold flex items-center justify-center text-bg-primary font-black shadow-lg shadow-accent-gold/10">
              JM
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            {view === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-[1100px] mx-auto pt-8"
              >
                <div className="flex items-end justify-between mb-12">
                  <div>
                    <h1 className="text-[36px] font-black tracking-tight leading-tight">Pipeline de IA</h1>
                    <p className="text-text-secondary text-[16px] font-medium mt-1">
                      {role === 'operador' ? 'Gestiona la extracción y validación de programas turísticos.' : 'Explora el catálogo de programas activos de CTB.'}
                    </p>
                  </div>
                  
                  {role === 'operador' && (
                    <button onClick={handleNuevoPrograma} className="btn-gold flex items-center gap-2">
                      <Plus size={20} />
                      <span>Nuevo Programa</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* Pipeline Main Section */}
                  <div className="lg:col-span-8 space-y-8">
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".docx,.doc,.pdf"
                      className="hidden"
                      onChange={handleFileInputChange}
                    />
                    {role === 'operador' ? (
                      <div 
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={onDrop}
                        className={`relative rounded-[32px] p-16 transition-all duration-300 border-2 border-dashed flex flex-col items-center justify-center text-center ${
                          isDragging 
                          ? 'border-accent-gold bg-accent-gold/5 scale-[1.01]' 
                          : 'border-white/[0.08] bg-white/[0.01] hover:border-white/[0.15] hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500 ${
                          isDragging ? 'bg-accent-gold text-bg-primary rotate-12' : 'bg-white/[0.03] text-accent-gold'
                        }`}>
                          <Upload size={40} strokeWidth={1.5} />
                        </div>
                        
                        <h3 className="text-2xl font-black mb-3">Sube tus programas</h3>
                        <p className="text-text-secondary max-w-[320px] mx-auto text-[15px] leading-relaxed mb-10">
                          Arrastra tus archivos Word o PDF aquí. Claude extraerá itinerarios, servicios y generará el código Nexus automáticamente.
                        </p>
                        
                        <button
                          onClick={handleExaminarArchivos}
                          className="px-8 py-3 bg-white text-bg-primary font-black rounded-2xl hover:bg-white/90 transition-all text-[14px]"
                        >
                          Examinar Archivos
                        </button>
                        
                        {isDragging && (
                          <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-accent-gold/5 rounded-[32px] flex items-center justify-center pointer-events-none backdrop-blur-[2px]"
                          >
                            <div className="px-6 py-3 bg-accent-gold text-bg-primary font-black rounded-full text-sm tracking-widest uppercase animate-pulse">
                              Soltar para procesar
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="card glass !p-0 overflow-hidden group">
                            <div className="h-48 bg-white/5 relative">
                               <div className="absolute top-4 left-4 px-3 py-1 bg-accent-gold text-bg-primary text-[10px] font-black uppercase tracking-widest rounded-lg">
                                 Activo
                               </div>
                            </div>
                            <div className="p-6">
                               <h4 className="font-bold text-lg mb-1">Programa Destino {i}</h4>
                               <p className="text-text-muted text-sm mb-4">4 Días / 3 Noches</p>
                               <div className="flex items-center justify-between">
                                  <span className="text-xl font-black text-accent-gold">$429</span>
                                  <button className="text-[12px] font-bold text-white/60 hover:text-white underline transition-all">Ver Detalle</button>
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="card glass bg-white/[0.01]">
                        <p className="text-[11px] font-black text-text-muted uppercase tracking-widest mb-2">Procesados Hoy</p>
                        <p className="text-3xl font-black">12</p>
                      </div>
                      <div className="card glass bg-white/[0.01]">
                        <p className="text-[11px] font-black text-text-muted uppercase tracking-widest mb-2">Tiempo Claude</p>
                        <p className="text-3xl font-black">32s</p>
                      </div>
                      <div className="card glass bg-white/[0.01]">
                        <p className="text-[11px] font-black text-text-muted uppercase tracking-widest mb-2">Sync Sheets</p>
                        <div className="flex items-center gap-2 mt-2">
                           <div className="w-2 h-2 rounded-full bg-emerald-500" />
                           <span className="text-sm font-bold text-emerald-500 uppercase tracking-widest">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="card glass bg-white/[0.01] sticky top-24">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="font-black text-[14px] uppercase tracking-[0.1em] flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                          Canal Nexus Padre
                        </h3>
                        <span className="text-[10px] font-black px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-full uppercase">
                          En línea
                        </span>
                      </div>

                      <div className="space-y-4">
                         <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                            <p className="text-[11px] text-text-secondary leading-relaxed">
                               Sincronización automática de tarifas activada. Los cambios en el Excel central se reflejan instantáneamente en el inventario.
                            </p>
                         </div>
                         
                         <div className="flex items-center justify-between px-2">
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Última Sync</span>
                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Hace 2 minutos</span>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {view === 'validation' && validatingFile && (
              <ValidationScreen 
                data={validatingFile.extractedData} 
                onSave={async (newData) => {
                  if (!newData.codigo) {
                    alert('El código Nexus es obligatorio')
                    return
                  }
                  // Mark pipeline file as completed
                  setFiles(prev => prev.map(f =>
                    f.id === validatingFile.id ? { ...f, status: 'completed', extractedData: newData } : f
                  ))
                  // Build Supabase record
                  const record = {
                    codigo:              newData.codigo,
                    nombre:              newData.nombre,
                    duracion_label:      newData.duracion_label,
                    duracion_dias:       parseInt(newData.duracion_dias) || 0,
                    duracion_noches:     parseInt(newData.duracion_noches) || 0,
                    tipo_operacion:      newData.tipo_operacion,
                    destino_principal:   newData.destino_principal,
                    pais_destino:        newData.pais_destino,
                    ciudad_destino:      newData.ciudad_destino,
                    vigencia_label:      newData.vigencia_label,
                    incluye:             newData.incluye,
                    no_incluye:          newData.no_incluye,
                    cortesias_ctb:       newData.cortesias_ctb,
                    notas_importantes:   newData.notas_importantes,
                    itinerario:          newData.itinerario,
                    hoteles_previstos:   newData.hoteles_previstos,
                    politica_ninos:      newData.politica_ninos,
                    precio_doble:        parseFloat(newData.precio_doble) || 0,
                    precio_sencillo:     parseFloat(newData.precio_sencillo) || 0,
                    precio_triple:       parseFloat(newData.precio_triple) || 0,
                    moneda:              newData.moneda || 'USD',
                    status:              newData.status || 'borrador',
                  }
                  // Check if editing an existing program
                  const isEdit = inventoryPrograms.find(p => p.id === validatingFile.id)
                  if (isEdit) {
                    const { error } = await supabase
                      .from('programas')
                      .update(record)
                      .eq('id', validatingFile.id)
                    if (error) { console.error('Error actualizando:', error); return }
                  } else {
                    const { error } = await supabase
                      .from('programas')
                      .insert([record])
                    if (error) { console.error('Error guardando:', error); return }
                  }
                  await loadPrograms()
                  setView(activeTab === 'inventory' ? 'inventory' : 'dashboard')
                }}
                onCancel={() => setView(activeTab === 'inventory' ? 'inventory' : 'dashboard')}
              />
            )}

            {view === 'inventory' && (
              <motion.div 
                key="inventory"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-[1100px] mx-auto pt-8"
              >
                <div className="mb-10 flex items-end justify-between">
                  <div>
                    <h1 className="text-[36px] font-black tracking-tight leading-tight">Inventario de Programas</h1>
                    <p className="text-text-secondary text-[16px] font-medium mt-1">Gestión centralizada de productos turísticos aprobados.</p>
                  </div>
                  <button 
                    onClick={handleNuevoPrograma}
                    className="btn-gold flex items-center gap-2"
                  >
                    <Plus size={18} />
                    <span>Nuevo Programa</span>
                  </button>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center py-24">
                    <div className="text-center">
                      <div className="w-10 h-10 border-2 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-text-muted text-sm font-medium">Cargando programas...</p>
                    </div>
                  </div>
                ) : dbError ? (
                  <div className="p-6 bg-rose-400/10 border border-rose-400/20 rounded-2xl text-rose-400 text-sm">
                    Error de conexión con Supabase: {dbError}
                  </div>
                ) : (
                  <InventoryTable 
                    programs={inventoryPrograms} 
                    onToggleStatus={toggleProgramStatus}
                    onDelete={handleDelete}
                    onEdit={(prog) => {
                      setValidatingFile({ id: prog.id, extractedData: prog })
                      setView('validation')
                    }}
                    onView={(prog) => {
                      setSelectedProgram(prog)
                      setView('detail')
                    }}
                  />
                )}
              </motion.div>
            )}

            {view === 'detail' && selectedProgram && (
              <ProgramDetail 
                program={selectedProgram} 
                onBack={() => setView(activeTab === 'inventory' ? 'inventory' : 'dashboard')} 
              />
            )}

            {view === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-[1100px] mx-auto pt-8"
              >
                <div className="mb-12">
                  <h1 className="text-[36px] font-black tracking-tight leading-tight">Analíticas</h1>
                  <p className="text-text-secondary text-[16px] font-medium mt-1">Métricas de rendimiento del inventario y pipeline.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  {[
                    { label: 'Programas Activos', value: inventoryPrograms.filter(p => p.status === 'activo').length, icon: Globe, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                    { label: 'En Borrador', value: inventoryPrograms.filter(p => p.status === 'borrador').length, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                    { label: 'Inactivos', value: inventoryPrograms.filter(p => p.status === 'inactivo').length, icon: TrendingUp, color: 'text-rose-400', bg: 'bg-rose-400/10' }
                  ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="card glass !bg-white/[0.01]">
                      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon size={20} className={color} />
                      </div>
                      <p className="text-[11px] font-black text-text-muted uppercase tracking-widest mb-2">{label}</p>
                      <p className="text-4xl font-black">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="card glass !bg-white/[0.01]">
                  <h3 className="font-black text-[14px] uppercase tracking-widest mb-6">Programas por Estado</h3>
                  <div className="space-y-4">
                    {inventoryPrograms.map(p => (
                      <div key={p.id} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                        <div>
                          <p className="text-[14px] font-semibold">{p.nombre}</p>
                          <p className="text-[11px] text-text-muted">{p.destino}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          p.status === 'activo' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                          p.status === 'borrador' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
                          'bg-rose-400/10 text-rose-400 border-rose-400/20'
                        }`}>{p.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {view === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-[900px] mx-auto pt-8"
              >
                <div className="mb-12">
                  <h1 className="text-[36px] font-black tracking-tight leading-tight">Configuración</h1>
                  <p className="text-text-secondary text-[16px] font-medium mt-1">Ajustes del sistema Nexus Travel.</p>
                </div>

                <div className="space-y-6">
                  {[
                    { icon: Bell, title: 'Notificaciones', desc: 'Alertas de sincronización y validaciones pendientes.', badge: 'Activas' },
                    { icon: Lock, title: 'Seguridad y Accesos', desc: 'Gestión de roles y permisos del equipo Nexus.', badge: 'Admin' },
                    { icon: Server, title: 'Nexus Padre', desc: 'Conexión con el Excel central de tarifas y disponibilidad.', badge: 'Online' },
                    { icon: Palette, title: 'Apariencia', desc: 'Tema visual y preferencias de la interfaz.', badge: 'Dark' },
                  ].map(({ icon: Icon, title, desc, badge }) => (
                    <div key={title} className="card glass !bg-white/[0.01] flex items-center justify-between group cursor-pointer hover:!bg-white/[0.03] transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-accent-gold/10 rounded-2xl flex items-center justify-center">
                          <Icon size={20} className="text-accent-gold" />
                        </div>
                        <div>
                          <p className="font-bold text-[15px]">{title}</p>
                          <p className="text-[12px] text-text-muted">{desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-text-secondary bg-white/5 px-3 py-1 rounded-full border border-white/10">{badge}</span>
                        <ChevronRight size={18} className="text-text-muted group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default App
