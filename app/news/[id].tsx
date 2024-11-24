import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import { NewsDataType } from '@/types'
import Loading from '@/components/Loading'
import { Colors } from '@/constants/Colors'
import Moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'

type Props = {}

const NewsDetails = (props: Props) => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [news, setNews] = useState<NewsDataType[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getNews()
    }, [])

    const getNews = async () => {
        try {
            const URL = `https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_API_KEY}&id=${id}`
            const response = await axios.get(URL)

            if (response && response.data) {
                setNews(response.data.results)
                setIsLoading(false)
            }
        } catch (err: any) {
            console.log('Error message: ', err.message);
        }
    }

    const [bookmark, setBookmark] = useState<boolean>();

    const saveBookmark = async (newsId: string) => {
        try {
            setBookmark(true);
            const token = await AsyncStorage.getItem("bookmark");
            const res = token ? JSON.parse(token) : [];
    
            if (Array.isArray(res)) {
                if (!res.includes(newsId)) {
                    res.push(newsId);
                    await AsyncStorage.setItem("bookmark", JSON.stringify(res));
                    alert("News Saved!");
                }
            } else {
                await AsyncStorage.setItem("bookmark", JSON.stringify([newsId]));
                alert("News Saved!");
            }
        } catch (err) {
            console.error("Error saving bookmark:", err.message);
        }
    };
    
    

    const removeBookmark = async (newsId: string) => {
        setBookmark(false);
        const bookmark = await AsyncStorage.getItem("bookmark").then((token) => {
            const res = JSON.parse(token);
            return res.filter((id: string) => id !== newsId)
        })
        await AsyncStorage.setItem("bookmark", JSON.stringify(bookmark));
        alert("News unsaved!")
    }

    const renderBookmark = async (newsId: string) => {
        await AsyncStorage.getItem("bookmark").then((token) => {
            const res = JSON.parse(token);
            if (res != null) {
                let data = res.find((value: string) => value === newsId);
                return data == null ? setBookmark(false) : setBookmark(true)
            }
        })
    }

    useEffect(() => {
        if (!isLoading) {
            renderBookmark(news[0].article_id)
        }
    }, [isLoading])

    return (
        <>
            <Stack.Screen options={{
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={22} />
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <TouchableOpacity onPress={() => bookmark
                        ? removeBookmark(news[0].article_id)
                        : saveBookmark(news[0].article_id)}
                    >
                        <Ionicons
                            name={bookmark ? "heart" : "heart-outline"}
                            size={22}
                            color={bookmark ? "red" : Colors.black}
                        />
                    </TouchableOpacity>
                ),
                title: ""
            }}
            />
            {isLoading ? (
                <Loading size={'large'} />
            ) : (
                <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
                    <Text style={styles.title}>{news[0].title}</Text>
                    <View style={styles.newsInfoWrapper}>
                        <Text style={styles.newsInfo}>{Moment(news[0].pubDate).format('MMMM DD, hh:mm a')}</Text>
                        <Text style={styles.newsInfo}>{news[0].source_name}</Text>
                    </View>
                    <Image source={{ uri: news[0].image_url }} style={styles.newsImg} />
                    {news[0].content ? (
                        <Text style={styles.newsContent}>{news[0].content}</Text>
                    ) : (
                        <Text style={styles.newsContent}>{news[0].description}</Text>
                    )}
                </ScrollView>
            )}
        </>
    )
}

export default NewsDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    contentContainer: {
        marginHorizontal: 20,
        paddingBottom: 30,
    },
    newsImg: {
        width: '100%',
        marginBottom: 20,
        height: 300,
        borderRadius: 10
    },
    newsInfoWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    newsInfo: {
        fontSize: 12,
        color: Colors.darkGrey
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.black,
        marginVertical: 10,
        letterSpacing: 0.6
    },
    newsContent: {
        fontSize: 14,
        color: '#555',
        letterSpacing: 0.8,
        lineHeight: 22
    }
})