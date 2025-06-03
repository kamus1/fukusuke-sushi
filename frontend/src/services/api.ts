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

type Ingredient = {
  _id?: string;
  nombre: string;
  cantidad: number;
  stock_minimo: number;
  [key: string]: any; 
};


export const getIngredients = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ingredients`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al cargar los ingredientes');
    }
    return response.json();
  } catch (error) {
    console.error('Error en getIngredients:', error);
    throw error;
  }
};

export const updateIngredient = async (id: string, ingredientData: Ingredient): Promise<Ingredient> => {
  try {
    // Eliminar campos que no deben enviarse
    const { _id, productos_asociados, createdAt, updatedAt, __v, ...cleanData } = ingredientData;
    
    const response = await fetch(`${API_BASE_URL}/ingredients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(cleanData), // Envía solo los datos necesarios
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar el ingrediente');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en updateIngredient:', error);
    throw error;
  }
};

export const createIngredient = async (ingredientData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ingredients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(ingredientData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el ingrediente');
    }

    return response.json();
  } catch (error) {
    console.error('Error en createIngredient:', error);
    throw error;
  }
};

export const deleteIngredient = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ingredients/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar el ingrediente');
    }

    return response.json();
  } catch (error) {
    console.error('Error en deleteIngredient:', error);
    throw error;
  }
};
