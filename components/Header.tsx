import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Header = () => {
    return (
        <View style={styles.container}>
            <View style={styles.userInfo}>
                <Image source={{ uri: "https://xsgames.co/randomusers/avatar.php?g=male" }} style={styles.userImage} />
                <View style={{ gap: 3 }}>
                    <Text style={styles.welcomeText}>
                        Welcome!
                    </Text>
                    <Text style={styles.userName}>
                        John Doe
                    </Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => { }}>
                <Ionicons name="notifications-outline" size={24} color={Colors.black} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 30
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    welcomeText: {
        fontSize: 12,
        color: Colors.darkGrey
    },
    userName: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.black
    }
})

export default Header;
