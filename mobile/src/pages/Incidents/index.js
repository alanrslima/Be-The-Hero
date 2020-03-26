import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import styles from './styles';
import logoImg from '../../assets/logo.png';
import api from '../../services/api';

export default function Incidents({ navigation }) {

  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  async function loadIncidents() {
    setLoading(true);
    const response = await api.get('incidents', {
      params: { page }
    });
    const data = response.data.incidents.map(incident => {
      return {
        ...incident, formatedValue: Intl.NumberFormat('pt-BR', {
          style: 'currency', currency: 'BRL'
        }).format(incident.value)
      }
    });
    setIncidents([...incidents, ...data]);
    setTotal(response.headers['x-total-count']);
    setLoading(false);
    setPage(page + 1);
  }

  function loadMoreIncidents() {
    if (loading) return;
    if ((total > 0) && (incidents.length == total)) return;
    loadIncidents();
  }

  useEffect(() => {
    loadIncidents();
  }, []);

  function navigateToDetail(incident) {
    navigation.navigate("Detail", { incident });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg} />
        <Text style={styles.headerText}>Total de <Text style={styles.headerTextBold}>{total} casos</Text></Text>
      </View>
      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia.</Text>

      <FlatList
        style={styles.incidentList}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreIncidents}
        onEndReachedThreshold={0.3}
        keyExtractor={incident => String(incident.id)}
        renderItem={({ item: incident }) => (
          <View style={styles.incident}>
            <Text style={styles.incidentProperty}>ONG: </Text>
            <Text style={styles.incidentValue}>{incident.name}</Text>

            <Text style={styles.incidentProperty}>CASO: </Text>
            <Text style={styles.incidentValue}>{incident.title}</Text>

            <Text style={styles.incidentProperty}>VALOR: </Text>
            <Text style={styles.incidentValue}>{incident.formatedValue}</Text>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigateToDetail(incident)}
            >
              <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
              <Feather name="arrow-right" size={16} color="#E02041" />
            </TouchableOpacity>
          </View>
        )}
        data={incidents}
      />
    </View>
  );
}
