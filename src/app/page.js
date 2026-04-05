"use client";
import React, { useState, useEffect } from 'react';
import FunaForm from '@/components/FunaForm';
import FunaDetail from '@/components/FunaDetail';
import { useRouter } from 'next/navigation';
import { Search, Eye, MapPin, Tag, PlusCircle, ArrowRight, TrendingUp, LogOut, ShieldAlert, Trash2, Users } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [funas, setFunas] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFuna, setSelectedFuna] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visitCount, setVisitCount] = useState(0);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFunas = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/funas');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFunas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchVisits = async () => {
    try {
      const res = await fetch('/api/visits');
      const data = await res.json();
      if (res.ok) setVisitCount(data.totalVisits);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este reporte de forma permanente?")) return;
    try {
      const res = await fetch(`/api/funas/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Error al eliminar");
      fetchFunas();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchFunas();
    fetchVisits();
  }, []);

  const filteredFunas = funas.filter(funa => 
    funa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funa.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (funa.etiquetas && funa.etiquetas.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="section-container fade-in">
      <FunaForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSuccess={fetchFunas}
      />

      <FunaDetail 
        funa={selectedFuna}
        isOpen={!!selectedFuna}
        onClose={() => setSelectedFuna(null)}
      />

      {/* Navbar / Top Bar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800', color: 'var(--accent-color)', fontSize: '1.2rem' }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            width: '32px', 
            height: '20px', 
            borderRadius: '4px', 
            overflow: 'hidden', 
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
          }}>
            <div style={{ flex: 1, backgroundColor: '#0073cf' }}></div>
            <div style={{ flex: 1, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6px', color: '#0073cf', gap: '1px' }}>
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <div style={{ flex: 1, backgroundColor: '#0073cf' }}></div>
          </div>
          <ShieldAlert size={24} /> FUNANDO INFIELES
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {isAdmin && (
            <span style={{ fontSize: '0.8rem', padding: '4px 12px', background: 'var(--accent-color)', borderRadius: '99px', fontWeight: 'bold' }}>ADMIN</span>
          )}
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid var(--glass-border)', 
              color: 'white', 
              padding: '8px 16px', 
              borderRadius: '99px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem'
            }}
          >
            Cerrar Sesión <LogOut size={14} />
          </button>
        </div>
      </nav>

      {/* Header / Hero */}
      <header style={{ padding: '80px 0 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '99px', background: 'rgba(230, 57, 70, 0.1)', color: 'var(--accent-color)', marginBottom: '24px', fontSize: '0.9rem', fontWeight: '600' }}>
          <TrendingUp size={16} /> Tendencia: Reportes anónimos seguros 
          <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
          <Users size={16} /> {visitCount} Investigadores
        </div>
        <h1 className="text-gradient" style={{ fontSize: 'env(preset-font-size, 4.5rem)', marginBottom: '15px', lineHeight: '1.1' }}>
          {isAdmin ? `Panel de Control, ${user?.nombre}` : 'Exponiendo la Traición'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '45px', maxWidth: '600px', margin: '0 auto 45px' }}>
          {isAdmin ? "Gestiona los reportes anónimos de la comunidad con total control." : "Al estar registrado, ahora tienes acceso exclusivo al muro de reportes anónimos."}
        </p>
        
        <div className="glass" style={{ 
          display: 'flex', 
          maxWidth: '650px', 
          margin: '0 auto', 
          borderRadius: '99px',
          padding: '10px 24px',
          alignItems: 'center',
          border: '1px solid var(--accent-glow)',
          boxShadow: '0 0 30px -10px var(--accent-glow)'
        }}>
          <Search size={22} style={{ marginRight: '14px', color: 'var(--accent-color)' }} />
          <input 
            type="text" 
            placeholder="Escribe un nombre o ciudad para investigar..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              width: '100%',
              padding: '14px 0',
              outline: 'none',
              fontSize: '1.1rem'
            }}
          />
        </div>
      </header>

      {/* Main Grid */}
      <section style={{ padding: '40px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            Reportes Recientes 
            {loading && <span style={{ fontSize: '0.94rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>(Cargando...)</span>}
          </h2>
          <button 
            className="btn-primary" 
            onClick={() => setIsFormOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <PlusCircle size={20} /> Nueva Funa
          </button>
        </div>

        {error && (
          <div className="card-glass" style={{ padding: '20px', color: 'var(--accent-color)', textAlign: 'center', marginBottom: '30px' }}>
            {error}
          </div>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
          gap: '30px' 
        }}>
          {filteredFunas.map(funa => (
            <div key={funa.id} className="card-glass" style={{ padding: '30px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ color: 'var(--accent-color)', fontWeight: '800', fontSize: '1.1rem' }}>#{funa.id}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {isAdmin && (
                    <button 
                      onClick={() => handleDelete(funa.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-color)'}
                      onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Eye size={14} /> {funa.vistas}
                  </div>
                </div>
              </div>
              
              <h3 style={{ fontSize: '1.7rem', marginBottom: '6px' }}>{funa.nombre}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px' }}>
                <MapPin size={14} /> {funa.ciudad}
              </div>
              
              {funa.mediaUrl && (
                <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)', background: '#000', maxHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {funa.mediaUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                    <video src={funa.mediaUrl} style={{ width: '100%', height: 'auto', display: 'block' }} />
                  ) : (
                    <img src={funa.mediaUrl} alt="Evidencia" style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }} />
                  )}
                </div>
              )}
              
              <p style={{ marginBottom: '24px', lineHeight: '1.7', color: '#e0e0e0', fontSize: '1.05rem', flex: 1, display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                "{funa.descripcion}"
              </p>
              
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {funa.etiquetas && funa.etiquetas.split(',').map(tag => (
                  <span key={tag} style={{ 
                    fontSize: '0.75rem', 
                    padding: '5px 12px', 
                    borderRadius: '99px', 
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    border: '1px solid var(--glass-border)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {tag.trim()}
                  </span>
                ))}
              </div>
              
              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {new Date(funa.createdAt).toLocaleDateString()}
                </span>
                <button 
                  onClick={() => setSelectedFuna(funa)}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--accent-color)', 
                    cursor: 'pointer',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  Detalles <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {!loading && filteredFunas.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px 0', opacity: 0.5 }}>
            <p style={{ fontSize: '1.2rem' }}>No se encontraron evidencias para tu búsqueda.</p>
          </div>
        )}
      </section>

      {/* Footer simple con Copyright @FalconyHN */}
      <footer style={{ textAlign: 'center', padding: '80px 0', borderTop: '1px solid var(--glass-border)', marginTop: '40px' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>© 2026 Funando Infieles. Todos los derechos reservados @FalconyHN</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.85rem', color: 'var(--accent-color)' }}>
          <a href="#">Privacidad</a>
          <a href="#">Términos</a>
          <a href="#">Contacto</a>
        </div>
      </footer>
    </div>
  );
}
