import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityIndicator, Alert, RefreshControl, StyleSheet, TouchableHighlight, View, SafeAreaView, ScrollView,Linking } from 'react-native';
import { DataTable, Text, Searchbar, Avatar, Card, IconButton, Title, Paragraph, Menu, Button, Divider, Chip } from 'react-native-paper';
import Color from '../../utils/styles/Color';
import { getAuth } from '../../store/login';
import { getService, postService } from '../../utils/HttpService';
import { IMovimiento, TipoTareaEnum } from '../../utils/interfaces/IMovimiento';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuPathEnum } from '../../utils/enums/Login.enum';
import { formatDateTime } from '../../utils/GeneralUtils';
import { EstadoTareaEnum } from '../../utils/enums/IGeneral';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import { BarCodeScanner } from 'expo-barcode-scanner';
// import QRCodeScanner from 'react-native-qrcode-scanner';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { IProducto } from '../../utils/interfaces/IProducto';
// import { RNCamera } from 'react-native-camera';
// import { QrReader } from 'react-qr-reader';

interface IMovimientoForm {
    codigoProducto: string,
}

type Props = NativeStackScreenProps<any, MenuPathEnum.TAREA>;
export default function ListProceso({ route, navigation }: Props) {
    // const [readyCam, setReadyCam] = useState(BarCodeReadEvent);
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [scanned, setScanned] = useState(false);
    const [data, setData] = useState('Sin resultado');
    const [producto, setProducto] = useState<IProducto|null>(null);
    const [mensaje, setMensaje] = useState<string>("");

    useEffect(() => {
    }, []);

    const onSuccess = ({data}:{data:string}) => {
        console.log(data);
        setData(data);
        getService(`/producto/${data}`)
        .then(res => {
            setProducto(res.data);
            console.log(res.data)
        });
      };

      const saveMovimiento = (codigo:string) => {
        try {
            const createDto: IMovimientoForm = {
                codigoProducto: codigo
            };

            if (codigo !== "" ) {
                postService("/movimiento/create", createDto).then((result) => {
                    console.log("result.message", result.message)
                    setMensaje( result.message);
                    if(result.success){
                        setProducto(null)
                    }
                });
            } else {
                setMensaje("Escanee un producto valido, porfavor");
            }   
        } catch (error) {
            console.error(error)
        }
    };

    return (
        <ScrollView >
            <Card key={"head-card"}>
                <Card.Title key={"head-card-title"}
                    title={"Escanea el producto"}
                    titleStyle={{ textAlign: 'center' }}
                    
                    // right={(props) => <IconButton size={30} icon="refresh" color={Color.white} key={"head-card-title-icon"}
                    //     style={{ backgroundColor: Color.secondary }} onPress={onRefresh} />}
                />
            </Card>
            <ScrollView >
                <View>
                    <QRCodeScanner 
                        // onRead={({data})=> {console.log(data); setData(data)}} 
                        onRead={onSuccess} 
                        flashMode={RNCamera.Constants.FlashMode.off}
                        containerStyle={{width:'100%',height:300}}
                        reactivate={true}
                        // cameraStyle={{width:'100%',height:100}}
                    />
                </View>
            </ScrollView>
            
            <View><Divider /></View>

            <View>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title textStyle={{fontWeight:'bold',fontSize:18}}>PRODUCTO</DataTable.Title>
                        <DataTable.Title textStyle={{fontWeight:'bold',fontSize:18}} numeric>PRECIO</DataTable.Title>
                        <DataTable.Title> </DataTable.Title>
                    </DataTable.Header>
                    {producto!=null &&
                    <DataTable.Row>
                        <DataTable.Cell>{producto.nombre}</DataTable.Cell>
                        <DataTable.Cell numeric>{`Bs. ${producto.monto}`}</DataTable.Cell>
                        <DataTable.Cell numeric>
                            <IconButton
                                icon="plus-box-outline"
                                size={20}
                                onPress={()=>saveMovimiento(producto.codigo)}
                            />
                        </DataTable.Cell>
                    </DataTable.Row>
                    }

                    {/* <DataTable.Pagination
                        page={page}
                        numberOfPages={3}
                        onPageChange={(page) => setPage(page)}
                        label="1-2 of 6"
                        optionsPerPage={optionsPerPage}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        showFastPagination
                        optionsLabel={'Rows per page'}
                    /> */}
                </DataTable>
            </View>
            <View>
                    <Chip icon="alert-circle" onPress={()=>setMensaje("")} style={{ display: mensaje !== "" ? "flex" : "none", backgroundColor: Color.secondaryVariant }} textStyle={{ color: Color.white }} >{mensaje }</Chip>
            </View>
            
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    title: {
        padding: 10,
        margin: 5,
        // alignItems: 'stretch',
    },
    textLeft: {
        margin: 10,
        color: Color.black,
        fontWeight:'bold'
    },
    textRight: {
        margin: 10,
        color: Color.black
    },
    button: {
        backgroundColor: '#fff',
        textShadowColor: 'blue',
        borderWidth: 0.5,
        borderColor: '#000',
        height: 40,
        borderRadius: 5,
        margin: 10,
    },
    labelStyle: {
        color: "black",
        fontSize: 18
    },
    container: {
        backgroundColor: Color.white,
        color:Color.black,
        paddingBottom:10
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    marker: {
        marginLeft: 46,
        marginTop: 33,
        fontWeight: 'bold',
    },

    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
      },
      textBold: {
        fontWeight: '500',
        color: '#000'
      },
      buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
      },
      buttonTouchable: {
        padding: 16
      }
})