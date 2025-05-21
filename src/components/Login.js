import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [identifier, setIdentifier] = useState('');
  const [identifierError, setIdentifierError] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Walidacja pola „Email lub nazwa użytkownika”
  const validateIdentifier = (val) => {
    if (!val) return 'Email lub nazwa użytkownika jest wymagana';
    if (val.includes('@')) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(val)) return 'Nieprawidłowy format email';
    }
    return '';
  };

  const handleIdentifierChange = e => {
    const val = e.target.value;
    setIdentifier(val);
    setIdentifierError(validateIdentifier(val));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validateIdentifier(identifier);
    if (err) {
      setIdentifierError(err);
      return;
    }

    try {
      await onLogin(identifier, password);
      toast.success('Logowanie udane!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Logowanie nie powiodło się');
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      <input
        type="text"
        placeholder="Email lub nazwa użytkownika"
        value={identifier}
        onChange={handleIdentifierChange}
        required
        className={`w-full mb-1 px-3 py-2 border rounded focus:outline-none focus:ring ${
          identifierError ? 'border-red-500' : ''
        }`}
      />
      {identifierError && (
        <p className="text-red-500 text-sm mb-3">{identifierError}</p>
      )}

      <input
        type="password"
        placeholder="Hasło"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring"
      />

      <button
        type="submit"
        disabled={!!identifierError}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        Login
      </button>
    </form>
  );
}

export default Login;