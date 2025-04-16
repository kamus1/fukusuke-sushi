const API_URL = 'http://localhost:5001/api';

export const getProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al cargar los productos');
    }
    return response.json();
  } catch (error) {
    console.error('Error en getProducts:', error);
    throw error;
  }
};

export const updateProduct = async (id: number, productData: any) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar el producto');
    }

    const updatedProduct = await response.json();
    console.log('Producto actualizado:', updatedProduct);
    return updatedProduct;
  } catch (error) {
    console.error('Error en updateProduct:', error);
    throw error;
  }
};

export const createProduct = async (productData: any) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el producto');
    }

    return response.json();
  } catch (error) {
    console.error('Error en createProduct:', error);
    throw error;
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar el producto');
    }

    return response.json();
  } catch (error) {
    console.error('Error en deleteProduct:', error);
    throw error;
  }
}; 

export const loginAdmin = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al iniciar sesión');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);  // Guardar token localmente
    return data;
  } catch (error) {
    console.error('Error en loginAdmin:', error);
    throw error;
  }
};