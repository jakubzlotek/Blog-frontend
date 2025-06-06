import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
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

  // Username validation
  const validateUsername = (name) => {
    if (!name.trim()) return 'Nazwa użytkownika jest wymagana';
    if (name.length < 3) return 'Nazwa użytkownika musi mieć co najmniej 3 znaki';
    return '';
  };

  // Email validation
  const validateEmail = (mail) => {
    // Simple email regex
    if (!mail.trim()) return 'Email jest wymagany';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) return 'Nieprawidłowy adres email';
    return '';
  };

  const handlePasswordChange = (e) => {
    const pw = e.target.value;
    setPassword(pw);
    setPasswordError(validatePassword(pw));
  };

  const handleUsernameChange = (e) => {
    const name = e.target.value;
    setUsername(name);
    setUsernameError(validateUsername(name));
  };

  const handleEmailChange = (e) => {
    const mail = e.target.value;
    setEmail(mail);
    setEmailError(validateEmail(mail));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usernameErr = validateUsername(username);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setUsernameError(usernameErr);
    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (usernameErr || emailErr || passwordErr) {
      return;
    }

    try {
      await onRegister(username, email, password);
      toast.success('Rejestracja przebiegła pomyślnie!');
      setUsername('');
      setEmail('');
      setPassword('');
      setUsernameError('');
      setEmailError('');
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
        onChange={handleUsernameChange}
        required
        className={`w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring ${
          usernameError ? 'border-red-500' : ''
        }`}
      />
      {usernameError && (
        <p className="text-red-500 text-sm mb-3">{usernameError}</p>
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
        required
        className={`w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring ${
          emailError ? 'border-red-500' : ''
        }`}
      />
      {emailError && (
        <p className="text-red-500 text-sm mb-3">{emailError}</p>
      )}
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
        disabled={!!(usernameError || emailError || passwordError)}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
      >
        Register
      </button>
    </form>
  );
}

export default Register;