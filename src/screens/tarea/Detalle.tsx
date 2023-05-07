import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityIndicator, Dimensions, PermissionsAndroid, Platform, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { FAB, Portal, Provider, Text, Title, DataTable } from 'react-native-paper';
import Color from '../../utils/styles/Color';
import { getAuth } from '../../store/login';
import { getService, postService, putService } from '../../utils/HttpService';
import { IProducto } from '../../utils/interfaces/IProducto';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuPathEnum } from '../../utils/enums/Login.enum';
import MapView, { Marker } from 'react-native-maps';
import { IMovimiento, TipoTareaEnum } from '../../utils/interfaces/IMovimiento';

import * as ImagePicker from 'react-native-image-picker';
import { Photo } from './Photo';
import { formatDateTime, getStrFecha } from '../../utils/GeneralUtils';
import { EstadoTareaEnum, EstadoTareaKeyEnum } from '../../utils/enums/IGeneral';

const { width, height } = Dimensions.get('window');
type Props = NativeStackScreenProps<any, MenuPathEnum.CLIENTE_DETAIL>;
export default function MovimientoDetalle({ route, navigation }: Props) {
    const [movimiento, setMovimiento] = useState<IMovimiento>(route.params?.tarea)
    const [estado, setEstado] = useState<string>(route.params?.tarea.estado)
    //FAB
    const [state, setState] = useState({ open: false });
    const onStateChange = ({ open }: { open: boolean }) => setState({ open });
    const { open } = state;
    //--FAB
    useEffect(() => {
        console.log("tarea", movimiento.estado)
        console.log("tarea route", route.params?.tarea.estado)

    }, []);

    const navEdit = () => {
        navigation.navigate(MenuPathEnum.TAREA_EDIT, { tarea: movimiento })
    };

    const actualizarTarea = (estado: string) => {
        try {
            const url = estado === EstadoTareaEnum.PROCESO ? "/tarea/atender/" : "/tarea/finalizar/";
            putService(url + movimiento.id, {}).then((result) => {
                if (result.success) {
                    console.log("actualizar tarea", result.data)
                    const tareaRestult = movimiento;
                    tareaRestult.estado = result.data.estado;
                    setEstado(prevEstado=>result.data.estado);
                    setMovimiento(tarea=>tareaRestult);
                    // navigation.navigate(MenuPathEnum.TAREA_DETALLE, { tarea: tareaRestult })
                }
            }).catch(e => {
                console.error(e.code, e.message)
            });
        } catch (error) {
            console.error(error)
        }
    };

    const optionsFab = () => {
        let optionFab = estado == EstadoTareaEnum.FINALIZADO? [
            {
                icon: 'application-edit',
                label: 'Editar',
                onPress: () => navEdit(),
            },
        ]:
        [
            {
                icon: 'application-edit',
                label: 'Editar',
                onPress: () => navEdit(),
            },
            {
                icon: 'file-check',
                label: `${estado == EstadoTareaEnum.ACTIVO ? 'Atender' : 'Finalizar'}`,
                style:{},
                onPress: () => actualizarTarea(estado == EstadoTareaEnum.ACTIVO ? EstadoTareaEnum.PROCESO : EstadoTareaEnum.FINALIZADO),
            },
        ]
        return optionFab;
    };

    return (
        <>
            <ScrollView >
                <View style={styles.container} >
                    <Title style={styles.title}>Información</Title>
                    <DataTable.Row>
                        <DataTable.Cell style={{justifyContent:'center'}}><Text style={styles.textLeft}>Producto</Text></DataTable.Cell>
                        <DataTable.Cell>{movimiento?.producto.nombre}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell style={{justifyContent:'center'}}><Text style={styles.textLeft}>Fecha</Text></DataTable.Cell>
                        <DataTable.Cell>{getStrFecha({date:new Date(movimiento.fecha)})}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell style={{justifyContent:'center'}}><Text style={styles.textLeft}>Marca</Text></DataTable.Cell>
                        <DataTable.Cell>{movimiento.producto.marca}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell style={{justifyContent:'center'}}><Text style={styles.textLeft}>Estado</Text></DataTable.Cell>
                        <DataTable.Cell>{movimiento?.estado}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell style={{justifyContent:'center'}}><Text style={styles.textLeft}>Creado</Text></DataTable.Cell>
                        <DataTable.Cell>{formatDateTime(movimiento?.fechaRegistro)}</DataTable.Cell>
                    </DataTable.Row>
                    {movimiento?.fechaModificacion && movimiento?.fechaModificacion !== "" &&
                        <DataTable.Row>
                            <DataTable.Cell style={{justifyContent:'center'}}><Text style={styles.textLeft}>Modificado</Text></DataTable.Cell>
                            <DataTable.Cell>{formatDateTime(movimiento?.fechaModificacion)}</DataTable.Cell>
                        </DataTable.Row>}
                    {(estado=== EstadoTareaEnum.PROCESO || estado=== EstadoTareaEnum.FINALIZADO)  &&
                        <View>
                            <Photo tarea={route.params?.tarea} />
                        </View>}
                </View>
            </ScrollView>
            <Provider>
                <Portal>
                    <FAB.Group
                        visible
                        open={open}
                        icon={open ? 'calendar-today' : 'plus'}
                        fabStyle={{ backgroundColor: Color.secondary }}

                        actions={optionsFab()}
                        onStateChange={onStateChange}
                        onPress={() => {
                        }}
                    />
                </Portal>
            </Provider>
        </>
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
})