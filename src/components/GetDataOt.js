import React from 'react';

export const GetDataOt = async (IdUsuario, setData, setLoading) => {
  try {
    const formData = new FormData();
    formData.append('idusuario', IdUsuario);
    const response = await fetch(
      'http://forms.minnoc.com.ar/api/ordenestrabajocabecera/getallusuario.php',
      {
        method: 'POST',
        body: formData,
      },
    );

    const data = await response.json();

    setData(data);
    setLoading(false);
  } catch (error) {
    console.log(error);
  }
};
