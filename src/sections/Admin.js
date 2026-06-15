import React, { useState } from 'react';
import experienceData from '../data/experience.json';
import './Section.css';
import { FiCopy, FiPlus, FiTrash2, FiLock, FiCheck } from 'react-icons/fi';

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [experiences, setExperiences] = useState(experienceData);
  const [copied, setCopied] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '251205') {
      setIsAuthenticated(true);
    } else {
      alert('Password errata!');
    }
  };

  const handleAdd = () => {
    setExperiences([{ company: '', role: '', period: '', location: '', description: '' }, ...experiences]);
  };

  const handleRemove = (index) => {
    if(window.confirm('Sei sicuro di voler rimuovere questa esperienza?')) {
      setExperiences(experiences.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index, field, value) => {
    const newExps = [...experiences];
    newExps[index][field] = value;
    setExperiences(newExps);
  };

  const copyToClipboard = () => {
    const jsonStr = JSON.stringify(experiences, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (!isAuthenticated) {
    return (
      <section className="section admin-login glass-panel" style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
        <FiLock style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1rem' }} />
        <h2>Area Riservata</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Inserisci la password per accedere al generatore di dati.</p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ textAlign: 'center' }}
          />
          <button type="submit" className="btn-primary">Accedi</button>
        </form>
      </section>
    );
  }

  return (
    <section className="section admin-panel glass-panel">
      <h2>Pannello Modifica Esperienze</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Aggiungi o modifica le tue esperienze qui sotto. Quando hai finito, copia il codice JSON in fondo alla pagina e incollalo nel tuo file <code>src/data/experience.json</code>.
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button onClick={handleAdd} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiPlus /> Aggiungi Esperienza
        </button>
        <button onClick={copyToClipboard} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {copied ? <><FiCheck /> Copiato!</> : <><FiCopy /> Copia Codice JSON</>}
        </button>
      </div>

      <div className="admin-grid" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {experiences.map((exp, index) => (
          <div key={index} className="glass-panel" style={{ padding: '2rem', position: 'relative', borderLeft: '4px solid var(--primary)' }}>
            <button 
              onClick={() => handleRemove(index)} 
              title="Elimina Esperienza"
              style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--accent)', background: 'rgba(244, 63, 94, 0.1)', padding: '0.5rem', borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <FiTrash2 />
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Azienda</label>
                <input type="text" placeholder="Nome Azienda" value={exp.company} onChange={e => handleChange(index, 'company', e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Ruolo</label>
                <input type="text" placeholder="Tuo Ruolo" value={exp.role} onChange={e => handleChange(index, 'role', e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Periodo</label>
                <input type="text" placeholder="es. Feb 2025 - Apr 2025" value={exp.period} onChange={e => handleChange(index, 'period', e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Luogo</label>
                <input type="text" placeholder="es. Salerno, Italy" value={exp.location} onChange={e => handleChange(index, 'location', e.target.value)} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Descrizione dell'attività</label>
              <textarea 
                placeholder="Cosa hai fatto in questa azienda?" 
                rows="4" 
                value={exp.description} 
                onChange={e => handleChange(index, 'description', e.target.value)} 
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Codice Generato:</h3>
        <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.5)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', overflowX: 'auto', position: 'relative' }}>
          <pre style={{ color: '#a5b4fc', fontSize: '0.95rem', margin: 0 }}>
            {JSON.stringify(experiences, null, 2)}
          </pre>
        </div>
      </div>
    </section>
  );
}

export default Admin;
