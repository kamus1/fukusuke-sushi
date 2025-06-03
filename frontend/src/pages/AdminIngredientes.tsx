import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getIngredients, 
  updateIngredient, 
  createIngredient, 
  deleteIngredient 
} from '../services/api';

interface Ingredient {
  _id: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  stock_minimo: number;
  disponible: boolean;
}

const emptyIngredient: Ingredient = {
  _id: '',
  nombre: '',
  cantidad: 0,
  unidad: 'gramos',
  stock_minimo: 0,
  disponible: true
};

const AdminIngredientes = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedIngredient, setEditedIngredient] = useState<Ingredient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newIngredient, setNewIngredient] = useState<Ingredient>(emptyIngredient);
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    } else {
      loadIngredients();
    }
  }, [user, navigate]);

  const loadIngredients = async () => {
    try {
      setError(null);
      const data = await getIngredients();
      setIngredients(data);
    } catch (err) {
      setError('Error al cargar los ingredientes');
      console.error(err);
    }
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingId(ingredient._id);
    setEditedIngredient({ ...ingredient });
    setError(null);
    setSuccessMessage(null);
    setShowCreateForm(false);
  };

  const handleSave = async () => {
    console.log('Datos a enviar:', {
    id: editingId,
    data: editedIngredient
    });
    if (!editingId || !editedIngredient) {
      setError('No hay ingrediente seleccionado para editar');
      return;
    }

    try {
      // Convertir valores numéricos
      const ingredientToUpdate = {
        ...editedIngredient,
        cantidad: Number(editedIngredient.cantidad),
        stock_minimo: Number(editedIngredient.stock_minimo),
        disponible: Boolean(editedIngredient.disponible)
      };

      const updatedIngredient = await updateIngredient(editingId, ingredientToUpdate);
      
      if (!updatedIngredient) {
        throw new Error('No se recibió respuesta del servidor');
      }

      setIngredients(ingredients.map(i => 
        i._id === editingId ? (updatedIngredient as Ingredient) : i
      ));
      setSuccessMessage('Ingrediente actualizado correctamente');
      setTimeout(() => setSuccessMessage(null), 3000);

      setEditingId(null);
      setEditedIngredient(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el ingrediente';
      setError(errorMessage);
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este ingrediente?')) {
      try {
        await deleteIngredient(id);
        setIngredients(ingredients.filter(i => i._id !== id));
        setSuccessMessage('Ingrediente eliminado correctamente');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        setError('Error al eliminar el ingrediente');
        console.error(err);
      }
    }
  };

  const handleCreate = async () => {
  try {
    const ingredientToCreate = {
      ...newIngredient,
      cantidad: Number(newIngredient.cantidad),
      stock_minimo: Number(newIngredient.stock_minimo),
      disponible: Boolean(newIngredient.disponible)
    };

    const createdIngredient = await createIngredient(ingredientToCreate);
    setIngredients([...ingredients, createdIngredient]);
    setShowCreateForm(false);
    setNewIngredient(emptyIngredient);
    setSuccessMessage('Ingrediente creado correctamente');
    setTimeout(() => setSuccessMessage(null), 3000);
  } catch (err) {
    setError('Error al crear el ingrediente');
    console.error(err);
  }
};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, 
    isNew: boolean = false
  ) => {
    const { name, value, type } = e.target;
    let val: string | number | boolean;

    if (type === 'checkbox') {
      val = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      val = Number(value);
    } else {
      val = value;
    }

    if (isNew) {
      setNewIngredient({
        ...newIngredient,
        [name]: val
      });
    } else if (editedIngredient) {
      setEditedIngredient({
        ...editedIngredient,
        [name]: val
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedIngredient(null);
    setShowCreateForm(false);
  };

  return (
    <Container>
      <AdminHeader>
        <h1>Administración de Ingredientes</h1>
        <AdminNav>
          <NavLink to="/admin">Productos</NavLink>
          <NavLink to="/admin/ingredientes" className="active">Ingredientes</NavLink>
        </AdminNav>
      </AdminHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

      {showCreateForm && (
        <FormContainer>
          <h2>Crear Nuevo Ingrediente</h2>
          <FormGrid>
            <FormField>
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={newIngredient.nombre}
                onChange={(e) => handleChange(e, true)}
              />
            </FormField>
            <FormField>
              <label>Cantidad:</label>
              <input
                type="number"
                name="cantidad"
                value={newIngredient.cantidad}
                onChange={(e) => handleChange(e, true)}
                min="0"
                step="0.1"
              />
            </FormField>
            <FormField>
              <label>Unidad:</label>
              <select
                name="unidad"
                value={newIngredient.unidad}
                onChange={(e) => handleChange(e, true)}
              >
                <option value="kilos">Kilos</option>
                <option value="litros">Litros</option>
                <option value="unidades">Unidades</option>
                <option value="hojas">Hojas</option>
              </select>
            </FormField>
            <FormField>
              <label>Stock Mínimo:</label>
              <input
                type="number"
                name="stock_minimo"
                value={newIngredient.stock_minimo}
                onChange={(e) => handleChange(e, true)}
                min="0"
              />
            </FormField>
            <FormField>
              <label>
                <input
                  type="checkbox"
                  name="disponible"
                  checked={newIngredient.disponible}
                  onChange={(e) => handleChange(e, true)}
                />
                Disponible
              </label>
            </FormField>
          </FormGrid>
          <ButtonGroup>
            <SaveButton onClick={handleCreate}>Crear Ingrediente</SaveButton>
            <CancelButton onClick={handleCancel}>Cancelar</CancelButton>
          </ButtonGroup>
        </FormContainer>
      )}

      <TableActions>
        <CreateButton onClick={() => setShowCreateForm(true)}>
          + Nuevo Ingrediente
        </CreateButton>
      </TableActions>

      <TableWrapper>
        <IngredientsTable>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Unidad</th>
              <th>Stock Mínimo</th>
              <th>Disponible</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map(ingredient => (
              <tr key={ingredient._id}>
                <td>
                  {editingId === ingredient._id ? (
                    <input
                      type="text"
                      name="nombre"
                      value={editedIngredient?.nombre || ''}
                      onChange={handleChange}
                    />
                  ) : (
                    ingredient.nombre
                  )}
                </td>
                <td>
                  {editingId === ingredient._id ? (
                    <input
                      type="number"
                      name="cantidad"
                      value={editedIngredient?.cantidad || 0}
                      onChange={handleChange}
                      min="0"
                      step="0.1"
                    />
                  ) : (
                    `${ingredient.cantidad} ${ingredient.unidad}`
                  )}
                </td>
                <td>
                  {editingId === ingredient._id ? (
                    <select
                      name="unidad"
                      value={editedIngredient?.unidad || 'kilos'}
                      onChange={handleChange}
                    >
                      <option value="kilos">Kilos</option>
                      <option value="litros">Litros</option>
                      <option value="unidades">Unidades</option>
                      <option value="hojas">Hojas</option>
                    </select>
                  ) : (
                    ingredient.unidad
                  )}
                </td>
                <td>
                  {editingId === ingredient._id ? (
                    <input
                      type="number"
                      name="stock_minimo"
                      value={editedIngredient?.stock_minimo || 0}
                      onChange={handleChange}
                      min="0"
                    />
                  ) : (
                    ingredient.stock_minimo
                  )}
                </td>
                <td>
                  {editingId === ingredient._id ? (
                    <label>
                      <input
                        type="checkbox"
                        name="disponible"
                        checked={editedIngredient?.disponible || false}
                        onChange={handleChange}
                      />
                      {editedIngredient?.disponible ? 'Sí' : 'No'}
                    </label>
                  ) : (
                    <span style={{ 
                      color: ingredient.disponible ? 'green' : 'red',
                      fontWeight: 'bold'
                    }}>
                      {ingredient.disponible ? 'Sí' : 'No'}
                    </span>
                  )}
                </td>
                <td>
                  {editingId === ingredient._id ? (
                    
                    <ButtonGroup>
                      <SaveButton onClick={handleSave}>Guardar</SaveButton>
                      <CancelButton onClick={handleCancel}>Cancelar</CancelButton>
                    </ButtonGroup>
                  ) : (
                    <ButtonGroup>
                      <EditButton onClick={() => handleEdit(ingredient)}>
                        ✏️ Editar
                      </EditButton>
                      <DeleteButton onClick={() => handleDelete(ingredient._id)}>
                        🗑️ Eliminar
                      </DeleteButton>
                    </ButtonGroup>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </IngredientsTable>
      </TableWrapper>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;
const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const NavLink = styled(Link)`
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const Button = styled.button`
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
`;

const AdminHeader = styled.div`
  margin-bottom: 2rem;
`;

const AdminNav = styled.nav`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;

  a {
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: #333;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      background: #e9ecef;
    }

    &.active {
      background: #e00000;
      color: white;
    }
  }
`;

const CreateButton = styled(Button)`
  background: #28a745;
  padding: 0.75rem 1.5rem;
  font-weight: 500;

  &:hover {
    background: #218838;
    transform: translateY(-2px);
  }
`;

const EditButton = styled(Button)`
  background: #FFC107;
  padding: 0.5rem;

  &:hover {
    background: #FFA000;
    transform: translateY(-2px);
  }
`;

const DeleteButton = styled(Button)`
  background: #e00000;
  padding: 0.5rem;

  &:hover {
    background: #ff3333;
    transform: translateY(-2px);
  }
`;

const SaveButton = styled(Button)`
  background: #28a745;

  &:hover {
    background: #218838;
  }
`;

const CancelButton = styled(Button)`
  background: #6c757d;

  &:hover {
    background: #5a6268;
  }
`;

const TableActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const TableWrapper = styled.div`
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  background: white;
  overflow-x: auto;
`;

const IngredientsTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #e00000;
    color: white;
    position: sticky;
    top: 0;
  }

  tr:hover {
    background: #f8f9fa;
  }

  input, select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 100%;
  }

  input[type="checkbox"] {
    width: auto;
  }
`;


const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
`;

const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
`;

const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h2 {
    margin-bottom: 1.5rem;
    color: #333;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  .full-width {
    grid-column: 1 / -1;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 500;
    color: #333;
  }

  input, select, textarea {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 100%;
  }

  textarea {
    min-height: 80px;
    resize: vertical;
  }
`;




export default AdminIngredientes;