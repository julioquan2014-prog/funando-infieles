"use client";
import React, { useState, useRef } from 'react';
import { X, Send, User, MapPin, AlignLeft, Tag, Camera, FileVideo } from 'lucide-react';

export default function FunaForm({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: '',
    ciudad: '',
    descripcion: '',
    etiquetas: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('nombre', formData.nombre);
      data.append('ciudad', formData.ciudad);
      data.append('descripcion', formData.descripcion);
      data.append('etiquetas', formData.etiquetas);
      if (file) {
        data.append('evidencia', file);
      }

      const response = await fetch('/api/funas', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'No se pudo crear el reporte.');
      }

      setFormData({ nombre: '', ciudad: '', descripcion: '', etiquetas: '' });
      setFile(null);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(8px)'
    }}>
      <div className="card-glass fade-in" style={{
        width: '100%',
        maxWidth: '550px',
        padding: '35px',
        position: 'relative',
        margin: '20px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '20px', right: '20px',
          background: 'rgba(255,255,255,0.05)', 
          border: '1px solid var(--glass-border)', 
          color: 'white', 
          cursor: 'pointer',
          borderRadius: '50%',
          width: '40px', height: '40px',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <X size={20} />
        </button>

        <h2 style={{ marginBottom: '24px', fontSize: '1.8rem' }} className="text-gradient">
          Nueva Funa
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <User size={14} /> Nombre
              </label>
              <input 
                required
                type="text"
                className="glass"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <MapPin size={14} /> Ciudad
              </label>
              <input 
                required
                type="text"
                className="glass"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                value={formData.ciudad}
                onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <AlignLeft size={14} /> Descripción de la traición
            </label>
            <textarea 
              required
              rows={3}
              className="glass"
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--glass-border)', color: 'white', outline: 'none', resize: 'none' }}
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            ></textarea>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <Camera size={14} /> Evidencia (Foto o Video)
            </label>
            <div 
              onClick={() => fileInputRef.current.click()}
              className="glass"
              style={{ 
                width: '100%', 
                padding: '24px', 
                borderRadius: '12px', 
                border: '2px dashed var(--glass-border)', 
                color: 'var(--text-muted)', 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
              {file ? (
                <div style={{ color: 'white', fontWeight: '600' }}>
                  {file.type.startsWith('video') ? <FileVideo size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> : <Camera size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />}
                  {file.name}
                </div>
              ) : (
                'Haz clic para seleccionar o arrastra aquí'
              )}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <Tag size={14} /> Etiquetas (opcional)
            </label>
            <input 
              type="text"
              className="glass"
              placeholder="Mentiroso, Tinder, Ex..."
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
              value={formData.etiquetas}
              onChange={(e) => setFormData({...formData, etiquetas: e.target.value})}
            />
          </div>

          {error && <p style={{ color: 'var(--accent-color)', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</p>}

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px' }}
          >
            {loading ? 'Subiendo evidencia...' : <><Send size={18} /> Publicar Funa</>}
          </button>
        </form>
      </div>
    </div>
  );
}
