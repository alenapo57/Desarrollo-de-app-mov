import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Linking, TouchableOpacity } from 'react-native';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Logo / Ícono */}
        <Text style={styles.emoji}>🎬</Text>
        <Text style={styles.appName}>CineApp</Text>
        <Text style={styles.version}>Versión 1.0.0</Text>

        <View style={styles.divider} />

        {/* Descripción */}
        <Text style={styles.description}>
          App desarrollada como Trabajo Práctico de React Native.{'\n'}
          Consume la API de The Movie Database (TMDB) para mostrar
          películas populares y mejor puntuadas.
        </Text>

        <View style={styles.divider} />

        {/* Info TMDB */}
        <View style={styles.infoBlock}>
          <Text style={styles.label}>📡 API utilizada</Text>
          <Text style={styles.value}>The Movie Database (TMDB) v3</Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.label}>⚙️ Tecnologías</Text>
          <Text style={styles.value}>React Native · Expo · React Navigation</Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.label}>🧑‍💻 Desarrollado para</Text>
          <Text style={styles.value}>Materia: Desarrollo de Apps Móviles</Text>
        </View>

        <View style={styles.divider} />

        {/* Link a TMDB */}
        <TouchableOpacity onPress={() => Linking.openURL('https://www.themoviedb.org')}>
          <Text style={styles.link}>🌐 www.themoviedb.org</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Este producto usa la API de TMDB pero no está respaldado ni certificado por TMDB.
        </Text>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  content: { flex: 1, alignItems: 'center', padding: 24 },
  emoji: { fontSize: 64, marginTop: 20 },
  appName: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginTop: 12 },
  version: { color: '#666', fontSize: 14, marginTop: 4 },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#222',
    marginVertical: 24,
  },
  description: {
    color: '#AAA',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  infoBlock: { width: '100%', marginBottom: 16 },
  label: { color: '#E50914', fontWeight: 'bold', fontSize: 13, marginBottom: 4 },
  value: { color: '#CCC', fontSize: 14 },
  link: {
    color: '#01B4E4',
    fontSize: 15,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 16,
  },
  disclaimer: {
    color: '#555',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 16,
  },
});
