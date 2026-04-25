import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { confirmPostAccuracy } from '../services/postService';

type EditPostRouteParams = { postId: string };
const EditPostScreen = () => {
  const route = useRoute<RouteProp<Record<string, EditPostRouteParams>, string>>();
  const navigation = useNavigation();
  const postId = (route.params as EditPostRouteParams)?.postId;
  const [submitting, setSubmitting] = useState(false);

  const handleConfirmAccuracy = async () => {
    setSubmitting(true);
    try {
      await confirmPostAccuracy(postId);
      Alert.alert('Success', 'Post marked as accurate.');
      navigation.goBack();
    } catch (e) {
      const message = (e instanceof Error && e.message) ? e.message : 'Failed to confirm accuracy.';
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* ...existing edit form UI here... */}
      <Button
        title="Still accurate"
        onPress={handleConfirmAccuracy}
        disabled={submitting}
      />
    </View>
  );
};

export default EditPostScreen;
