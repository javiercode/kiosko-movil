import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, TouchableHighlight, View } from 'react-native';
import { SafeAreaView, ScrollView } from 'react-native';
import { DataTable, Text, Searchbar, Avatar, Card, IconButton, Title, Paragraph, Menu, Button, Divider } from 'react-native-paper';
import Color from '../../utils/styles/Color';
import { getAuth } from '../../store/login';
import { getService, postService } from '../../utils/HttpService';
import { IMovimiento, TipoTareaEnum } from '../../utils/interfaces/IMovimiento';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuPathEnum } from '../../utils/enums/Login.enum';
import { formatDateTime } from '../../utils/GeneralUtils';
import { EstadoTareaEnum } from '../../utils/enums/IGeneral';


type Props = NativeStackScreenProps<any, MenuPathEnum.TAREA>;
export default function ListProceso({ route, navigation }: Props) {
    
    useEffect(() => {
        console.log("route", route.params);
    }, []);

    const navDetalle = (tarea: IMovimiento) => {
        navigation.navigate(MenuPathEnum.TAREA_DETALLE, { tarea: tarea })
    };

    return (
        <></>
    )
}