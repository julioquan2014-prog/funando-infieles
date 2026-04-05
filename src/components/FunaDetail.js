"use client";
import React from 'react';
import { X, Calendar, MapPin, Eye, Tag, Share2 } from 'lucide-react';

export default function FunaDetail({ funa, isOpen, onClose }) {
  if (!isOpen || !funa) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(10px)'
    }}>
      <div className="card-glass fade-in" style={{
        width: '100%',
        maxWidth: '800px',
        padding: '0',
        position: 'relative',
        margin: '20px',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '24px'
      }}>
        {/* Close Button */}
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '20px', right: '20px',
          background: 'rgba(0,0,0,0.5)', 
          border: '1px solid var(--glass-border)', 
          color: 'white', 
          cursor: 'pointer',
          borderRadius: '50%',
          width: '44px', height: '44px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          zIndex: 10
        }}>
          <X size={24} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.2fr) 1fr', gap: '0' }}>
          {/* Media Section */}
          <div style={{ background: '#000', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {funa.mediaUrl ? (
              funa.mediaUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                <video src={funa.mediaUrl} controls style={{ width: '100%', maxHeight: '400px' }} />
              ) : (
                <img src={funa.mediaUrl} alt="Evidencia" style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain' }} />
              )
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
                No se adjuntó evidencia multimedia.
              </div>
            )}
          </div>

          {/* Info Section */}
          <div style={{ padding: '40px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '10px' }}>
              #{funa.id} <span style={{ color: 'var(--glass-border)' }}>|</span> 
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Eye size={14} /> {funa.vistas} vistas
              </span>
            </div>

            <h2 style={{ fontSize: '2.2rem', marginBottom: '8px' }} className="text-gradient">{funa.nombre}</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              <MapPin size={16} /> {funa.ciudad}
            </div>

            <div style={{ marginBottom: '30px', flex: 1 }}>
              <h4 style={{ color: 'var(--accent-color)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Relato de los hechos</h4>
              <p style={{ lineHeight: '1.8', color: '#eee', fontSize: '1.1rem' }}>
                {funa.descripcion}
              </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {funa.etiquetas && funa.etiquetas.split(',').map(tag => (
                  <span key={tag} style={{ 
                    fontSize: '0.75rem', 
                    padding: '6px 14px', 
                    borderRadius: '99px', 
                    background: 'rgba(230, 57, 70, 0.1)',
                    color: 'var(--accent-color)',
                    border: '1px solid rgba(230, 57, 70, 0.2)'
                  }}>
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <Calendar size={16} /> {new Date(funa.createdAt).toLocaleDateString()}
              </div>
              <button style={{ 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--glass-border)', 
                color: 'white', 
                padding: '10px 20px', 
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Share2 size={16} /> Compartir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
