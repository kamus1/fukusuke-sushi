import { API_URL } from '../config';

const API_BASE_URL = `${API_URL}/api`;

export const getProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
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
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
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