import axios from 'axios'

export const loadMasterPartData = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/master-part')
    return response.data;
  } catch (error) {
    console.error('Failed to fetch master part data:', error);
    throw error;
  }
};

export const loadMasterPartDataDetail = async (id) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/master-part/${id}`)
    return response.data;
  } catch (error) {
    console.error('Failed to fetch master part data:', error);
    throw error;
  }
};
  
export const createMasterPartData = async (partData) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/master-part', partData)
    return response.data;
  } catch (error) {
    console.error('Failed to save master part data:', error);
    throw error;
  }
};

export const updateMasterPartData = async (id, partData) => {
  try {
    const response = await axios.put(`http://127.0.0.1:8000/master-part/${id}`, partData)
    return response.data;
  } catch (error) {
    console.error('Failed to save master part data:', error);
    throw error;
  }
};

export const deleteMasterPartData = async (id) => {
  try {
    const response = await axios.delete(`http://127.0.0.1:8000/master-part/${id}`)
    return response.data;
  } catch (error) {
    console.error('Failed to fetch master part data:', error);
    throw error;
  }
};

export const importExcelMasterPartData = async (excelFile) => {
  try {
    const formData = new FormData();
    formData.append('file', excelFile);

    const response = await axios.post('http://127.0.0.1:8000/master-part-import-excel', formData, {
      headers: {'Content-Type': 'multipart/form-data'}
    })
    return response.data;
  } catch (error) {
    console.error('Failed to save master part data:', error);
    throw error;
  }
};

export const exportExcelMasterPartData = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/master-part-export-excel', {
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'master-part-data.xlsx');
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(url);

    return response.data;
  } catch (error) {
    console.error('Failed to fetch master part data:', error);
    throw error;
  }
};