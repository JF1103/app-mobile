import React, {createContext, useState} from 'react';

export const FormContext = createContext();

export const FormProvider = ({children}) => {
  const [formAsync, setformAsync] = useState();
  const [formularioPreguntas, setFormularioPreguntas] = useState();
  const [data, setData] = useState();

  return (
    <FormContext.Provider
      value={{
        data,
        setData,
        formAsync,
        setformAsync,
        formularioPreguntas,
        setFormularioPreguntas,
      }}>
      {children}
    </FormContext.Provider>
  );
};
