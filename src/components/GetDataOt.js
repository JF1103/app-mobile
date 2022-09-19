import React from 'react';

export const GetDataOt = (IdUsuario, setData, setLoading) => {
  const formData = new FormData();
  formData.append('idusuario', IdUsuario);
  fetch(
    'http://forms.minnoc.com.ar/api/ordenestrabajocabecera/getallusuario.php',
    {
      method: 'POST',
      body: formData,
    },
  )
    .then(response => response.json())
    .then(json => {
      setData(json);
      setLoading(false);
    })
    .catch(error => console.error(error))
    .finally(() => setLoading(false));
};
