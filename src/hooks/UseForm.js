import {useState} from 'react';

export const useForm = () => {
  const [state, setState] = useState('');
  const [stateSend, setStateSend] = useState('');

  const onChange = (value, field) => {
    setState({
      ...state,
      [field]: value,
    });

    setStateSend({
      ...stateSend,
      [field]: value,
    });
  };
  const setFormValue = form => {
    setState({
      ...state,
      ...form,
    });
  };

  return {
    ...state,
    form: state,
    onChange,
    setFormValue,
    stateSend,
    setStateSend,
  };
};
