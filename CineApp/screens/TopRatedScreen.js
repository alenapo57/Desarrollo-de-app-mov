import React, { useEffect, useState } from 'react';
import {
  View, FlatList, StyleSheet, ActivityIndicator,
  SafeAreaView, TextInput, Text,
} from 'react-native';
import { ENDPOINTS } from '../config/api';
import MovieCard from '../components/MovieCard';

export default function TopRatedScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(ENDPOINTS.topRated)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results);
        setFiltered(data.results);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const filtradas = movies.filter((m) =>
      m.title.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filtradas);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
        <Text style={styles.loadingText}>Cargando películas...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar película..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={() => navigation.navigate('Detail', { movieId: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D0D0D' },
  loadingText: { color: '#888', marginTop: 10, fontSize: 14 },
  searchInput: {
    backgroundColor: '#1A1A1A',
    color: '#FFF',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
});
