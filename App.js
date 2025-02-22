import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { PickerItem } from "./src/picker";
import { api } from "./src/services/api";

export default function App() {
  const [moedaSelecionada, setMoedaSelecionada] = useState(null);
  const [moedas, setMoedas] = useState([]);
  const [moedaValor, setMoedaValor] = useState('');
  const [valorConvertido, setValorConvertido] = useState(null);

  useEffect(() => {
    async function carregarMoedas() {
      try {
        const response = await api.get('all');
        let arrayMoedas = Object.keys(response.data).map((key) => ({
          key: key,
          label: key,
          value: key,
        }));
        setMoedas(arrayMoedas);
        setMoedaSelecionada(arrayMoedas[0].key);
      } catch (error) {
        console.error("Erro ao carregar moedas", error);
      }
    }
    carregarMoedas();
  }, []);

  async function converterValor() {
    if (!moedaValor || isNaN(parseFloat(moedaValor))) {
      alert("Digite um valor válido");
      return;
    }
    try {
      const response = await api.get(`all/${moedaSelecionada}`);
      const taxaCambio = response.data[moedaSelecionada].ask;
      const resultado = parseFloat(moedaValor) * parseFloat(taxaCambio);
      setValorConvertido(resultado.toFixed(2));
    } catch (error) {
      console.error("Erro ao converter moeda", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selecione sua moeda</Text>
      <PickerItem 
        moedas={moedas} 
        moedaselecionada={moedaSelecionada} 
        onChange={(moeda) => setMoedaSelecionada(moeda)}
      />
      
      <Text style={styles.label}>Digite um valor</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 2.00"
        keyboardType="numeric"
        value={moedaValor}
        onChangeText={setMoedaValor}
      />

      <TouchableOpacity style={styles.button} onPress={converterValor}>
        <Text style={styles.buttonText}>Converter Valor</Text>
      </TouchableOpacity>

      {valorConvertido && (
        <Text style={styles.resultado}>Valor Convertido: {valorConvertido}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  resultado: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
