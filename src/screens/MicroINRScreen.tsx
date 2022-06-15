import React, {useEffect, useState} from "react";
import {Button, FlatList, SafeAreaView, StatusBar, StyleSheet, Text, View} from "react-native";

import {BleManager, Device} from 'react-native-ble-plx';

const BLE_SUPPORTED_DEVICES = ['uINR_213644-0032', 'qLabsG0700048', 'ENVY 6000 series', 'LE-Bose QuietComfort 35'];

const makeRandom = () => Math.floor(Math.random() * (1000000000000 + 1));

const Separator = () => (
    <View style={styles.separator} />
);

const VerticalSpace = () => (
    <View style={styles.verticalSpace} />
);

const MicroINRScreen = () => {

    const manager = new BleManager();
    const [logs, setLogs] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [canConnect, setCanConnect] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [device, setDevice] = useState<Device | null >(null);

    useEffect(() => {
        // generateLogs()
    }, [])

    const generateLogs = () => {
        const o = [];
        for(let i=0; i< 100; i++) {
            o.push(`Sensor checking... with id: ${i+1}`)
        }

        // setLogs(o);
    }

    const isSensorTag = () => {
        return true;
    }

    const forgetSensorTag = () => {
        return true;
    }

    const clearLogs = () => {
        setLogs([]);
        reset();
    }


    const reset = () => {
        setDevice(null);
        setCanConnect(false);
        stopScanning()
    }

    /**
     * SCANNING
     */
    const stopScanning = () => {
        setLogs(['Scanning stopped', ...logs]);
        setIsScanning(false);
        manager.stopDeviceScan();
    }

    const startScanning = () => {
        setIsScanning(true);
        setLogs(['Scanning initialized..., please turn on your BLE device', ...logs])


        const subscription = manager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                doScan();
                subscription.remove();
            }
        }, true);
    }

    const doScan = () => {
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                setLogs([`Failed to start device scanning with error: ${error}`, ...logs]);
                return
            }

            // console.log('device', device?.name);

            // Check if it is a device you are looking for based on advertisement data
            // or other criteria.
            if (device && BLE_SUPPORTED_DEVICES.indexOf(`${device.name}`) > -1) {
                setLogs([`Device ${device.name} found! Please press on connect button`, ...logs]);
                setCanConnect(true);
                setDevice(device);

                // Stop scanning as it's not necessary if you are scanning for one device.
                stopScanning();
            }

        });
    }



    /**
     * Start Device Connection
     */

    function startConnecting() {
        if (!device) {
            setLogs([`Could not find a device to conneect with`, ...logs]);
            return;
        }

        setLogs([`Connecting to device: ${device.name}`, ...logs]);

        device.connect()
            .then((device) => {
                return device.discoverAllServicesAndCharacteristics()
            })
            .then((device) => {
                // Do work on device with services and characteristics
                setLogs([`Yohoo, device: ${device.name} is now connected!`, ...logs]);
            })
            .catch((error) => {
                // Handle errors
                setLogs([`Failed connecting to the device with error ${error}`, ...logs]);
                reset();
            });
    }

    function disconnect() {

    }

    /**
     * END Connection
     */



    const renderHeader = () => {
        let scanButton;
        if (isScanning) {
            scanButton =  <Button title={'Stop Scanning'} onPress={stopScanning}/>
        } else {
            scanButton = <Button title={'Scan'} onPress={startScanning} />;
        }

        return (
            <View style={styles.headerContainer}>
                <Text style={styles.textStyle} numberOfLines={1}>
                    microINR status: {connectionStatus}
                </Text>
                <View style={styles.headerButtonsRow}>
                    {scanButton}
                </View>
                <View style={styles.headerButtonsRow}>
                    <Button
                        disabled={!canConnect}
                        onPress={startConnecting}
                        title={'Connect'}
                    />
                    <VerticalSpace />
                    <Button
                        disabled={!canConnect && !isConnected}
                        onPress={disconnect}
                        title={'Disconnect'}
                    />
                </View>
                <View style={styles.headerButtonsRow}>
                    <Button
                        disabled={isSensorTag()}
                        onPress={() => {
                            forgetSensorTag();
                        }}
                        title={'Forget'}
                    />
                </View>
            </View>
        );
    }

    const renderLogs = () => {
        return (
            <View style={styles.logContainer}>
                <FlatList
                    style={styles.logList}
                    data={logs}
                    renderItem={({item}) => (
                        <Text style={styles.logTextStyle}> {item} </Text>
                    )}
                    keyExtractor={() => makeRandom().toString()}
                />
                <Button
                    style={styles.logClearBtn}
                    onPress={() => {
                        clearLogs();
                    }}
                    title={'Reset & Clear logs'}
                />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#3a0e5c" />
            {renderHeader()}
            <Separator />
            {renderLogs()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    verticalSpace: {
        width: 5
    },
    headerContainer: {
        padding: 10
    },
    headerButtonsRow: {
        flexDirection: 'row',
        paddingTop: 5
    },
    logClearBtn: {
        paddingTop: 10
    },
    logContainer: {
        flex: 1,
        padding: 10,
        paddingTop: 0
    },
    logList: {
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: '#883bc4',
        padding: 5,
    },
    textStyle: {
        color: 'white',
        fontSize: 20,
    },
    logTextStyle: {
        color: 'white',
        fontSize: 13,
    },
    buttonStyle: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        backgroundColor: '#8307e3',
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
    },
    disabledButtonStyle: {
        backgroundColor: '#15142d',
        color: '#919191',
    },
    separator: {
        marginVertical: 8,
        borderBottomColor: '#ede1f7',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});

export default  MicroINRScreen;
