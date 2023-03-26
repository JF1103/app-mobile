import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {FormContext} from '../context/FormContext';
import {MaterialesCmp} from './MaterialesCmp';
import {
  SearchableFlatList,
  SearchableSectionList,
} from 'react-native-searchable-list';
import {SafeAreaView} from 'react-native-safe-area-context';
import {isNull} from 'lodash';

export const MaterialesArray = ({
  pregunta,
  disabled,
  tarea,
  idotd,
  formulario,
  employee,
  idUsuario,
  arrayReq,
  setArrayReq,
}) => {
  const {formAsync, setformAsync, formularioPreguntas, setFormularioPreguntas} =
    useContext(FormContext);
  const MaterialAsync = formAsync?.formcomplet
    ?.filter(item => item.idUsuario === idUsuario)[0]
    ?.ots.filter(item => item.id_ot === employee.id)[0]
    ?.tareas.filter(item => item.TareaId === tarea.id)[0]
    ?.formularios.filter(item => item.FormularioId === formulario.id)[0]
    ?.preguntas.filter(item => item.id === pregunta.id)[0]?.respuesta;

  const arrayMaterialeSearch = pregunta?.respuestas.map((item, index) => {
    return {id: item.id, material: item.respuesta};
  });

  const datosArray = MaterialAsync?.map(item => {
    return {
      id: item.id,
      material: pregunta?.respuestas.filter(item2 => item2.id === item.id)[0]
        .respuesta,
      value: item.value,
    };
  });
  /*   console.log('datosArray', datosArray); */

  /*  console.log('MaterialAsync', MaterialAsync); */
  const [arrayMaterials, setArrayMaterials] = useState(
    datosArray ? datosArray : [],
  );

  const [datos, setDatos] = useState({
    /* data: arrayMaterialeSearch, */
    data: [
      {id: 1, material: 'material 1'},
      {id: 2, material: 'material 2'},
      {id: 3, material: 'material 3'},
      {id: 4, material: 'material 4'},
      {id: 5, material: 'material 5'},
      {id: 6, material: 'material 6'},
      {id: 7, material: 'material 7'},
      {id: 8, material: 'material 8'},
      {id: 9, material: 'material 9'},
      {id: 10, material: 'material 10'},
    ],
    searchTerm: '',
    searchAttribute: 'material',
    ignoreCase: true,
  });

  const {data, searchTerm, searchAttribute, ignoreCase} = datos;

  /*  console.log('MaterialAsync', MaterialAsync); */
  const [cantMaterialArray, setCantMaterialArray] = useState(
    MaterialAsync ? MaterialAsync : [],
  );
  /* console.log('cantMaterialArray afueraa', cantMaterialArray); */
  /*   console.log(searchTerm);
  console.log('data', data); */

  const sumoMateriales = (arrayMaterials, item) => {
    /* console.log('item', item); */
    //verifico que arraymaterials sea distinto de nulo
    if (!arrayMaterials) {
      /* console.log('es nulo'); */
      //si es nulo lo inicializo con el item
      setArrayMaterials([item]);
    } else {
      //si no es nulo verifico que el item no este en el array
      if (!arrayMaterials.find(itemArray => itemArray.id === item.id)) {
        //si no esta lo agrego
        setArrayMaterials([...arrayMaterials, item]);
        /*   console.log('no es nulo'); */
      }
    }
  };

  /* console.log('arrayMaterials', arrayMaterials); */
  const renderItem = (item, arrayMaterials) => {
    return (
      <View key={item.id} style={styles.listItem}>
        <TouchableOpacity onPress={() => sumoMateriales(arrayMaterials, item)}>
          <Text style={{color: 'black'}}>{item.material}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  /* console.log('arrayMaterials', arrayMaterials); */
  return (
    <View>
      <SafeAreaView style={{flex: 1}}>
        <TextInput
          style={styles.textSearch}
          placeholder="materiales utilizados"
          placeholderTextColor="#bcbcbc"
          onChangeText={searchTerm => setDatos({...datos, searchTerm})}
        />
        {searchTerm.length > 0 && (
          <ScrollView style={styles.scrollcontainer}>
            <SearchableFlatList
              style={{}}
              data={data}
              searchTerm={searchTerm}
              searchAttribute={searchAttribute}
              ignoreCase={ignoreCase}
              renderItem={({item}) => renderItem(item, arrayMaterials)}
              keyExtractor={item => item.name}
            />
          </ScrollView>
        )}
      </SafeAreaView>
      <View>
        {arrayMaterials &&
          arrayMaterials.length !== 0 &&
          arrayMaterials?.map((item, index) => {
            return (
              <MaterialesCmp
                key={index}
                idMaterial={item.id}
                pregunta={pregunta}
                disabled={disabled}
                tarea={tarea}
                idotd={idotd}
                formulario={formulario}
                employee={employee}
                idUsuario={idUsuario}
                arrayReq={arrayReq}
                setArrayReq={setArrayReq}
                respuesta={item}
                cantMaterialArray={cantMaterialArray}
                setCantMaterialArray={setCantMaterialArray}
              />
            );
          })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollcontainer: {
    flex: 1,

    maxHeight: 250,
  },
  pageContainer: {
    padding: 10,
    flex: 1,
  },
  searchInputs: {
    flexDirection: 'row',
  },
  search: {
    flex: 8,
    marginBottom: 20,
    borderColor: '#D44744',
    borderBottomWidth: 3,
    padding: 10,
  },
  switch: {
    flex: 2,
  },
  listItem: {
    padding: 10,
    borderColor: '#f4cfce',
    borderWidth: 1,
    borderRadius: 10,
    margin: 2,
  },
  info: {
    padding: 10,
    marginTop: 20,
    borderColor: '#f4cfce',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#f4cfce',
  },
  row1: {
    flexDirection: 'row',
  },
  prop: {
    flex: 1,
    padding: 10,
  },
  val: {
    alignSelf: 'center',
    flex: 1,
  },
  containerText: {
    backgroundColor: 'white',
    color: 'red',
    borderRadius: 10,
    margin: 10,
  },
  textSearch: {
    color: 'black',
    fontSize: 15,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
  },
});
