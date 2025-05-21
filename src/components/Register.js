import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  // Walidacja hasła przed wysłaniem
  const validatePassword = (pw) => {
    if (pw.length < 8) return 'Hasło musi mieć co najmniej 8 znaków';
    if (!/[A-Z]/.test(pw)) return 'Hasło musi zawierać wielką literę';
    if (!/[a-z]/.test(pw)) return 'Hasło musi zawierać małą literę';
    if (!/\d/.test(pw))    return 'Hasło musi zawierać cyfrę';
    if (!/[\W_]/.test(pw)) return 'Hasło musi zawierać znak specjalny';
    return '';
  };

  const handlePasswordChange = (e) => {
    const pw = e.target.value;
    setPassword(pw);
    setPasswordError(validatePassword(pw));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Blokuj wysłanie jeśli hasło nie przejdzie walidacji
    const err = validatePassword(password);
    if (err) {
      setPasswordError(err);
      return;
    }

    try {
      await onRegister(username, email, password);
      toast.success('Rejestracja przebiegła pomyślnie!');
      setUsername('');
      setEmail('');
      setPassword('');
      setPasswordError('');
      navigate('/login');
    } catch (err) {
      toast.error(err?.message || 'Rejestracja nie powiodła się');
      console.error('Registration failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
        className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        required
        className={`w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring ${
          passwordError ? 'border-red-500' : ''
        }`}
      />
      {passwordError && (
        <p className="text-red-500 text-sm mb-3">{passwordError}</p>
      )}
      <button
        type="submit"
        disabled={!!passwordError}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
      >
        Register
      </button>
    </form>
  );
}

export default Register;