import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet,
  ActivityIndicator, SafeAreaView,
} from 'react-native';
import { ENDPOINTS, BACKDROP_BASE_URL, IMAGE_BASE_URL } from '../config/api';

export default function DetailScreen({ route }) {
  const { movieId } = route.params;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(ENDPOINTS.movieDetail(movieId))
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [movieId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No se pudo cargar la película.</Text>
      </View>
    );
  }

  const genres = movie.genres?.map((g) => g.name).join(', ') || 'N/A';
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : 'N/A';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Backdrop */}
        <Image
          source={{ uri: `${BACKDROP_BASE_URL}${movie.backdrop_path}` }}
          style={styles.backdrop}
        />

        {/* Poster + título */}
        <View style={styles.header}>
          <Image
            source={{ uri: `${IMAGE_BASE_URL}${movie.poster_path}` }}
            style={styles.poster}
          />
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{movie.title}</Text>
            {movie.original_title !== movie.title && (
              <Text style={styles.originalTitle}>{movie.original_title}</Text>
            )}
            <Text style={styles.score}>⭐ {movie.vote_average?.toFixed(1)} / 10</Text>
            <Text style={styles.votes}>({movie.vote_count?.toLocaleString()} votos)</Text>
          </View>
        </View>

        {/* Datos */}
        <View style={styles.body}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>{movie.release_date?.substring(0, 4)}</Text></View>
            <View style={styles.badge}><Text style={styles.badgeText}>{runtime}</Text></View>
            <View style={[styles.badge, styles.badgeRed]}>
              <Text style={styles.badgeText}>
                {movie.adult ? '+18' : 'ATP'}
              </Text>
            </View>
          </View>

          <Text style={styles.label}>Géneros</Text>
          <Text style={styles.value}>{genres}</Text>

          <Text style={styles.label}>Sinopsis</Text>
          <Text style={styles.overview}>
            {movie.overview || 'Sin sinopsis disponible en español.'}
          </Text>

          <Text style={styles.label}>Producción</Text>
          <Text style={styles.value}>
            {movie.production_companies?.map((c) => c.name).join(', ') || 'N/A'}
          </Text>

          <Text style={styles.label}>Idioma original</Text>
          <Text style={styles.value}>{movie.original_language?.toUpperCase()}</Text>

          <Text style={styles.label}>Presupuesto</Text>
          <Text style={styles.value}>
            {movie.budget ? `$${movie.budget.toLocaleString()}` : 'No disponible'}
          </Text>

          <Text style={styles.label}>Recaudación</Text>
          <Text style={styles.value}>
            {movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'No disponible'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D0D0D' },
  errorText: { color: '#AAA', fontSize: 16 },
  backdrop: { width: '100%', height: 200, resizeMode: 'cover' },
  header: {
    flexDirection: 'row',
    padding: 16,
    gap: 14,
    marginTop: -40,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E50914',
  },
  titleBlock: { flex: 1, justifyContent: 'flex-end', paddingBottom: 4 },
  title: { color: '#FFF', fontSize: 18, fontWeight: 'bold', lineHeight: 24 },
  originalTitle: { color: '#888', fontSize: 13, marginTop: 2, fontStyle: 'italic' },
  score: { color: '#FFD700', fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  votes: { color: '#666', fontSize: 12 },
  body: { paddingHorizontal: 16, paddingBottom: 32 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  badge: {
    backgroundColor: '#1A1A1A',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  badgeRed: { borderColor: '#E50914' },
  badgeText: { color: '#CCC', fontSize: 13 },
  label: {
    color: '#E50914',
    fontWeight: 'bold',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 18,
    marginBottom: 4,
  },
  value: { color: '#CCC', fontSize: 14 },
  overview: { color: '#CCC', fontSize: 14, lineHeight: 22 },
});
