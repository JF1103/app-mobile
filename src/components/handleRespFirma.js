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

  /* const indexTarea = formularioPreguntas.tareas.findIndex(
    tarea => tarea.TareaId === tareaId,
  );
  if (indexTarea === -1) {
    setFormularioPreguntas({
      ...formularioPreguntas,
      tareas: [
        {
          TareaId: tareaId,
          formularios: [
            {
              FormularioId: formularioId,
              preguntas: [
                {
                  id: id,
                  respuesta: {base64: path, tempUri: respuesta.tempUri},
                  tipo: tipo,
                },
              ],
            },
          ],
        },
      ],
    });
  } else {
    const indexFormulario = formularioPreguntas.tareas[
      indexTarea
    ].formularios.findIndex(
      formulario => formulario.FormularioId === formularioId,
    );

    if (indexFormulario === -1) {
      setFormularioPreguntas({
        ...formularioPreguntas,
        tareas: [
          {
            ...formularioPreguntas.tareas[indexTarea],
            formularios: [
              {
                FormularioId: formularioId,
                preguntas: [
                  {
                    id: id,
                    respuesta: {base64: path, tempUri: respuesta.tempUri},
                    tipo: tipo,
                  },
                ],
              },
            ],
          },
        ],
      });
    } else {
      const indexPregunta = formularioPreguntas.tareas[indexTarea].formularios[
        indexFormulario
      ].preguntas.findIndex(pregunta => pregunta.id === id);

      if (indexPregunta === -1) {
        setFormularioPreguntas({
          ...formularioPreguntas,
          tareas: [
            {
              ...formularioPreguntas.tareas[indexTarea],
              formularios: [
                {
                  ...formularioPreguntas.tareas[indexTarea].formularios[
                    indexFormulario
                  ],
                  preguntas: [
                    ...formularioPreguntas.tareas[indexTarea].formularios[
                      indexFormulario
                    ].preguntas,
                    {
                      id: id,
                      respuesta: {base64: path, tempUri: respuesta.tempUri},
                      tipo: tipo,
                    },
                  ],
                },
              ],
            },
          ],
        });
      } else {
        setFormularioPreguntas({
          ...formularioPreguntas,
          tareas: [
            {
              ...formularioPreguntas.tareas[indexTarea],
              formularios: [
                {
                  ...formularioPreguntas.tareas[indexTarea].formularios[
                    indexFormulario
                  ],
                  preguntas: [
                    ...formularioPreguntas.tareas[indexTarea].formularios[
                      indexFormulario
                    ].preguntas.slice(0, indexPregunta),
                    {
                      id: id,
                      respuesta: {base64: path, tempUri: respuesta.tempUri},
                      tipo: tipo,
                    },
                    ...formularioPreguntas.tareas[indexTarea].formularios[
                      indexFormulario
                    ].preguntas.slice(indexPregunta + 1),
                  ],
                },
              ],
            },
          ],
        });
      }
    }
  }
  SetStorage(formularioPreguntas); */
};
