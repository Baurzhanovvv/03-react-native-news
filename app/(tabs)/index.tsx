import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from '@/components/Header'
import axios from 'axios'
import SearchBar from '@/components/SearchBar'
import { NewsDataType } from '@/types'
import BreakingNews from '@/components/BreakingNews'
import Pagination from '@/components/Pagination'
import Categories from '@/components/Categories'
import NewsList from '@/components/NewsList'
import Loading from '@/components/Loading'

type Props = {}

const Page = (props: Props) => {
  const { top: safeTop } = useSafeAreaInsets()
  const [breakingNews, setBreakingNews] = useState<NewsDataType[]>([])
  const [news, setNews] = useState<NewsDataType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getBreakingNews()
    getNews()
  }, [])

  const onCatChanged = (category: string) => {
    setNews([])
    getNews(category)
  }

  const getBreakingNews = async () => {
    try {
      const URL = `https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_API_KEY}&language=en&image=1&removeduplicate=1&size=5`
      const response = await axios.get(URL)

      if (response && response.data) {
        setBreakingNews(response.data.results)
        setIsLoading(false)
      }
    } catch (err: any) {
      console.log('Error message: ', err.message);
    }
  }

  const getNews = async (category: string = '') => {
    try {
      let categoryString = '';
      if (category.length !== 0) {
        categoryString = `&category=${category}`
      }

      const URL = `https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_API_KEY}&image=1&removeduplicate=1&size=10${categoryString}`
      const response = await axios.get(URL)

      if (response && response.data) {
        setNews(response.data.results)
        setIsLoading(false)
      }
    } catch (err: any) {
      console.log('Error message: ', err.message);
    }
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: safeTop }]}>
      <Header />
      <SearchBar withHorizontal={true} />
      {isLoading ? (
        <Loading size={'large'} />
      ) : <BreakingNews newsList={breakingNews} />}
      <Categories onCategoryChanged={onCatChanged} />
      <NewsList newsList={news} />
    </ScrollView>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})