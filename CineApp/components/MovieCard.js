import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { IMAGE_BASE_URL } from '../config/api';

export default function MovieCard({ movie, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{ uri: `${IMAGE_BASE_URL}${movie.poster_path}` }}
        style={styles.poster}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
        <Text style={styles.overview} numberOfLines={3}>{movie.overview}</Text>
        <View style={styles.footer}>
          <Text style={styles.score}>⭐ {movie.vote_average.toFixed(1)}</Text>
          <Text style={styles.date}>{movie.release_date?.substring(0, 4)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 4,
  },
  poster: { width: 90, height: 135 },
  info: { flex: 1, padding: 12, justifyContent: 'space-between' },
  title: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  overview: { color: '#AAA', fontSize: 12, lineHeight: 18, marginTop: 6 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  score: { color: '#FFD700', fontWeight: 'bold', fontSize: 13 },
  date: { color: '#666', fontSize: 13 },
});
