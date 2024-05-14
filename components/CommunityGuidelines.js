import { Modal, View, Text, Button } from "react-native";
import { styles } from "../assets/Themes/styles";

const CommunityGuidelines = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.communityGuidelinesView}>
        <View style={styles.communityGuidelinesModal}>
          <Text style={styles.textBody}>
            1. Treat all users with respect, regardless of their background,
            identity, or beliefs.
            {"\n\n"}
            2. Discrimination, hate speech, or any form of harassment will not
            be tolerated.
            {"\n\n"}
            3. Hosts must provide accurate and truthful information about their
            events, including date, time, and location.
            {"\n\n"}
            4. Hosts should promptly update event information if there are any
            changes or cancellations.
            {"\n\n"}
            5. All communication between users should remain respectful and
            relevant to the event.
            {"\n\n"}
            6. Users should respect the privacy of others and refrain from
            sharing personal information without consent.
            {"\n\n"}
            7. Hosts are responsible for ensuring the safety and well-being of
            attendees during the event.
            {"\n\n"}* Moderators will monitor posts and will investigate and
            take appropriate action when necessary *
          </Text>
          <Button title="Close" onPress={onClose} style={styles.textTitle} />
        </View>
      </View>
    </Modal>
  );
};

export default CommunityGuidelines;
