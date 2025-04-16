import { useState } from 'react';
import styled from 'styled-components';

import { useAppContext } from '../../context/AppContext';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(33, 53, 71, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  transition: background-color 0.3s ease;
`;

const ModalContent = styled.div`
  background: #ffffff;
  padding: 2.5rem 3rem;
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
  position: relative;
  box-shadow: 0 10px 25px rgba(46, 125, 50, 0.25);
  transition: box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0 15px 35px rgba(46, 125, 50, 0.35);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.75rem;
  cursor: pointer;
  color: #4a4a4a;
  transition: color 0.3s ease;
  &:hover {
    color: #2e7d32;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Input = styled.input`
  padding: 0.85rem 1rem;
  border: 1.5px solid #c8e6c9;
  border-radius: 6px;
  font-size: 1.1rem;
  color: #213547;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 8px rgba(46, 125, 50, 0.4);
  }
  &::placeholder {
    color: #9e9e9e;
  }
`;

const Button = styled.button`
  background-color: #2e7d32;
  color: white;
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 8px rgba(46, 125, 50, 0.3);
  &:hover {
    background-color: #1b5e20;
    box-shadow: 0 6px 14px rgba(27, 94, 32, 0.6);
  }
  &:active {
    background-color: #145214;
  }
`;

const ToggleText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #4a4a4a;
  font-size: 0.95rem;
  span {
    color: #2e7d32;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.3s ease;
    &:hover {
      text-decoration: underline;
      color: #145214;
    }
  }
`;

const Title = styled.h2`
  color: #2e7d32;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 700;
  font-size: 1.8rem;
  letter-spacing: 0.05em;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 0.9rem;
  margin-top: -0.4rem;
  margin-bottom: 0.6rem;
  font-weight: 600;
`;

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!isLogin && !formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const { login, signup } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      try {
        const authData = isLogin
          ? await login(formData.username, formData.password)
          : await signup(formData);

        if (authData.success) {
          onClose();
          window.location.reload(); // Refresh to update auth state
        } else {
          setErrors({ form: authData.error });
        }
      } catch (error) {
        setErrors({ form: 'An error occurred during authentication' });
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>{isLogin ? 'Login' : 'Sign Up'}</Title>

        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}

          {!isLogin && (
            <>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </>
          )}

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}

          {!isLogin && (
            <>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
              )}
            </>
          )}

          <Button type="submit">
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </Form>

        {errors.form && <ErrorMessage>{errors.form}</ErrorMessage>}

        <ToggleText>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </ToggleText>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AuthModal;
