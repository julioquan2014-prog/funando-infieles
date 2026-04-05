"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';

export default function RegistroPage() {
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="card-glass fade-in" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '10px' }}>Únete</h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '40px' }}>Crea tu cuenta para acceder al muro.</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <User size={14} /> Nombre Completo
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

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <Mail size={14} /> Correo Electrónico
            </label>
            <input 
              required
              type="email"
              className="glass"
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <Lock size={14} /> Contraseña
            </label>
            <input 
              required
              type="password"
              className="glass"
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {error && <p style={{ color: 'var(--accent-color)', marginBottom: '20px', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            {loading ? 'Creando cuenta...' : <><ArrowRight size={18} /> Registrarse</>}
          </button>
        </form>

        <p style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          ¿Ya tienes cuenta? <Link href="/login" style={{ color: 'var(--accent-color)', fontWeight: '600' }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
