var React = require('react');
var ReactNative = require('react-native');
import SignatureCapture from 'react-native-signature-capture';
import { ItemSeparator } from './ItemSeparator';
 
var {Component} = React;
 
var {
    AppRegistry,
    StyleSheet,
    Text,
    View, TouchableHighlight
} = ReactNative;
 
 
class Firma extends Component {
    render() {
        return (
            <View style={styles.marco}>
                <SignatureCapture
                    style={styles.signature}
                    ref="sign"
                    onSaveEvent={this._onSaveEvent}
                    onDragEvent={this._onDragEvent}
                    saveImageFileInExtStorage={false}
                    showNativeButtons={false}
                    showTitleLabel={false}
                    viewMode={"portrait"}/>
                    <ItemSeparator/>
 
                <View style={{ flexDirection: "row" }}>
                    <TouchableHighlight style={styles.buttonStyle}
                        onPress={() => { this.saveSign() } } >
                        <Text style={styles.text}>Guardar</Text>
                    </TouchableHighlight>
 
                    <TouchableHighlight style={styles.buttonStyle}
                        onPress={() => { this.resetSign() } } >
                        <Text style={styles.text}>Borrar</Text>
                    </TouchableHighlight>
 
                </View>
 
            </View>
        );
    }
 
    saveSign() {
        this.refs["sign"].saveImage();
    }
 
    resetSign() {
        this.refs["sign"].resetImage();
    }
 
    _onSaveEvent(result) {
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        console.log(result);
    }
    _onDragEvent() {
         // This callback will be called when the user enters signature
        console.log("dragged");
    }
}
 
const styles = StyleSheet.create({
    signature: {
        borderWidth: 1.5,
        height: 150,
        boxShadow: 5,
        borderColor: '#fb8c00',
        marginBottom: 20,
    },
    buttonStyle: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        boxShadow: 5,
        borderColor: '#ffb74d',
        borderWidth: 1,
        height: 30,
        justifyContent: 'center',
        marginHorizontal: 40,
    },
    text: {
        fontSize: 16,
        color: '#ffb74d',
        textAlign: 'center',
    },
});
 
AppRegistry.registerComponent('Firma', () => Firma);

export default Firma;