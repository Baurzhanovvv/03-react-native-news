import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Link, Stack } from 'expo-router';
import Loading from '@/components/Loading';
import { NewsItem } from '@/components/NewsList';
import { useIsFocused } from '@react-navigation/native';

type Props = {}

const Page = (props: Props) => {
  const [bookmarkNews, setBookmarkNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchBookmark()
  }, [useIsFocused])

  const fetchBookmark = async () => {
    try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('bookmark');
        const res = token ? JSON.parse(token) : [];
        
        if (res.length > 0) {
            const query_string = res.join(',');
            const response = await axios.get(`https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_API_KEY}&id=${query_string}`);
            setBookmarkNews(response.data.results || []);
        } else {
            setBookmarkNews([]);
        }
    } catch (error) {
        console.error('Error fetching bookmarks:', error.message);
    } finally {
        setIsLoading(false);
    }
};


  return (
    <>
      <Stack.Screen options={{
        headerShown: true,
      }} />
      <View style={styles.container}>
        {isLoading ? (
          <Loading size="large" />
        ) : (
          <FlatList
            data={bookmarkNews}
            keyExtractor={(_, index) => `list_item${index}`}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <Link href={`/news/${item.article_id}`} asChild key={index}>
                  <TouchableOpacity>
                    <NewsItem item={item} index={index} />
                  </TouchableOpacity>
                </Link>
              )
            }}
          />
        )}
      </View>
    </>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20
  },
})