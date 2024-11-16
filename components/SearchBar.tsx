import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const SearchBar = () => {
    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <Ionicons name="search-outline" size={20} color={Colors.lightGrey} />
                <TextInput
                    placeholder='Search'
                    placeholderTextColor={Colors.lightGrey}
                    style={styles.searchTxt}
                    autoCapitalize='none'
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginBottom: 20
    },
    searchBar: {
        backgroundColor: '#e4e4e4',
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 10,
        flexDirection: 'row',
        gap: 10
    },
    searchTxt: {
        fontSize: 14,
        flex: 1,
        color: Colors.darkGrey
    }
})

export default SearchBar;
