import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, complete todos los campos.');
      return;
    }
    setError('');

    // TODO: integrar con backend / auth context.
    // Si todo OK -> redirigir al Home:
    navigate('/home');
  };

  return (
    <section className="auth">
      <h2>Iniciar Sesión</h2>
      {error && <p className="error" role="alert">{error}</p>}

      <form onSubmit={onSubmit} className="form">
        <label className="form__row">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
        </label>

        <label className="form__row">
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
        </label>

        <button className="btn" type="submit">Entrar</button>
      </form>
    </section>
  );
};

export default Login;
