import {deleteFiles} from './DeleteFiles';
import {SetStorage} from './SetStorage';
import RNFS from 'react-native-fs';

export const resetSign = (
  path,
  saveBtn,
  firmPath,
  setFirmPath,
  formularioPreguntas,
  setFormularioPreguntas,
  idUsuario,
  employee,
  idotd,
  tareaId,
  formularioId,
  preguntaid,
  preguntatiporespuesta,
) => {
  deleteFiles(path);

  saveBtn.current && saveBtn.current.resetImage();

  setFirmPath(null);
  const indexUsuario = formularioPreguntas.formcomplet.findIndex(
    usuario => usuario.idUsuario === idUsuario,
  );

  const indexOt = formularioPreguntas.formcomplet[indexUsuario].ots.findIndex(
    ot => ot.id_ot === employee.id,
  );

  const indexTarea = formularioPreguntas.formcomplet[indexUsuario].ots[
    indexOt
  ].tareas.findIndex(tarea => tarea.TareaId === tareaId);

  const indexFormulario = formularioPreguntas.formcomplet[indexUsuario].ots[
    indexOt
  ].tareas[indexTarea].formularios.findIndex(
    formulario => formulario.FormularioId === formularioId,
  );

  const indexPregunta = formularioPreguntas.formcomplet[indexUsuario].ots[
    indexOt
  ].tareas[indexTarea].formularios[indexFormulario].preguntas.findIndex(
    pregunta => pregunta.preguntaid === preguntaid,
  );

  //saco la pregunta de la lista de preguntas
  const objcopy = formularioPreguntas;
  objcopy.formcomplet[indexUsuario].ots[indexOt].tareas[indexTarea].formularios[
    indexFormulario
  ].preguntas.splice(indexPregunta, 1);

  //agrego la pregunta a la lista de preguntas

  setFormularioPreguntas({...objcopy});
};
