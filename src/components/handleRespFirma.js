import {deleteFiles} from './DeleteFiles';
import {SetStorage} from './SetStorage';
import RNFS from 'react-native-fs';
import {handleResp} from '../helpers/handleRespt';
import {useLocation} from '../hooks/useLocation';

export const handleRespFirma = async (
  formularioPreguntas,
  setFormularioPreguntas,
  path,
  firmPath,
  setFirmPath,
  tareaId,
  idotd,
  formularioId,
  refformularioconector,
  id,
  respuesta,
  tipo,
  employee,
  idUsuario,
  cords,
) => {
  // const base64 = await RNFS.readFile(respuesta.tempUri, 'base64');

  deleteFiles(path)
    .then(() => {
      RNFS.writeFile(path, respuesta.dat, 'base64')
        .then(success => {
          console.log('FILE WRITTEN!');
          console.log('escribi en ', path);
          setFirmPath('file:' + path);
        })
        .catch(err => {
          console.log(err.message);
        });
    })
    .catch(err => {
      console.log(err.message);
    });

  handleResp(
    tareaId,
    idotd,
    formularioId,
    refformularioconector,
    id,
    {base64: path, tempUri: respuesta.tempUri, fileType: respuesta.fileType},
    tipo,
    formularioPreguntas,
    setFormularioPreguntas,
    employee,
    idUsuario,
    cords,
  );
};
