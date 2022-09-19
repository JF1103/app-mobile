import React, {createContext, useState} from 'react';

export const FormContext = createContext();

export const FormProvider = ({children}) => {
  const [formAsync, setformAsync] = useState();
  const [formularioPreguntas, setFormularioPreguntas] = useState();

  return (
    <FormContext.Provider
      value={{
        formAsync,
        setformAsync,
        formularioPreguntas,
        setFormularioPreguntas,
      }}>
      {children}
    </FormContext.Provider>
  );
};
