import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

interface User {
  _id: string;
  email: string;
  nombre: string;
  role: 'user' | 'admin' | 'despachador';
  createdAt: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Configurar axios con el token
  const token = localStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/users');
      setUsers(response.data);
      
      // Obtener el usuario actual
      const userResponse = await axios.get('http://localhost:5001/api/users/me');
      setCurrentUser(userResponse.data);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    // Prevenir que el admin modifique su propio rol
    if (currentUser && userId === currentUser._id) {
      setError('No puedes modificar tu propio rol');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      await axios.patch(`http://localhost:5001/api/users/${userId}/role`, { role: newRole });
      setSuccess('Rol actualizado exitosamente');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al actualizar el rol');
      console.error('Error:', err);
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <Container>
      <Title>Gestión de Usuarios</Title>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha de Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    disabled={!!currentUser && user._id === currentUser._id}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                    <option value="despachador">Despachador</option>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #333;
  }

  tr:hover {
    background-color: #f8f9fa;
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export default UserManagement; 