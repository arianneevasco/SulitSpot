import { View, Text } from 'react-native';

export default function SulitSpotWelcome() {
  return (
    <View style={{ flex: 1, backgroundColor: 'rgb(235, 232, 232)151, 81, 81)', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 28, color: '#fff', marginBottom: 10 }}>Welcome to Sulit Spot</Text>
      <Text style={{ fontSize: 16, color: '#888', marginBottom: 20 }}>Start by logging in or signing up</Text>
      <Text style={{ fontSize: 16, color: 'rgb(74, 233, 135)', marginBottom: 40 }}>Learn more about Sulit Spot</Text>
      <View style={{ borderWidth: 1, borderColor: '#fff', padding: 10 }}>
        <Text style={{ color: '#fff' }}>$ login to Sulit Spot</Text>
      </View>
    </View>
  );
}
