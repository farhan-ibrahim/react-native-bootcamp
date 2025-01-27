import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Button, Colors, Paragraph } from "react-native-paper";
import { gql, useMutation } from "@apollo/client";
import {
  Linking,
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

export const Upvote = ({ idHero, heroCounter, twitterUsername }) => {
  const [counter, setCounter] = useState<number>(heroCounter);
  const [hasUpvoted, setHasUpvoted] = useState<boolean>(false);
  const [addTodo] = useMutation(MUTATION_COUNTER);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleUpvote = () => {
    setCounter(counter + 1);
    addTodo({ variables: { counter: counter + 1, id: idHero } });
    setHasUpvoted(true);
    toggleModal();
  };

  const style = hasUpvoted
    ? {
        borderColor: Colors.orange900,
        backgroundColor: "white",
        borderWidth: 2,
      }
    : { backgroundColor: "white" };

  const styleIcon = hasUpvoted
    ? { color: Colors.orange900 }
    : { color: "black" };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => toggleModal()}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalShareView}>
            <Paragraph>Thanks for voting !</Paragraph>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `https://twitter.com/intent/tweet?text=I just upvoted @${twitterUsername} as a React Native Hero`
                )
              }
              style={{ backgroundColor: "black", borderRadius: 10 }}
            >
              <Button color="white">Share on Twitter</Button>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleModal()}>
              <AntDesign name="closecircleo" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Button
        onPress={handleUpvote}
        mode="contained"
        disabled={hasUpvoted}
        style={style}
      >
        <AntDesign name="caretup" size={16} color={styleIcon.color} />
        <Paragraph>{heroCounter}</Paragraph>
      </Button>
    </>
  );
};

const MUTATION_COUNTER = gql`
  mutation update_counter($id: Int!) {
    update_heroes(where: { id: { _eq: $id } }, _inc: { counter: 1 }) {
      affected_rows
      returning {
        id
        counter
      }
    }
  }
`;

export const styles = StyleSheet.create({
  modalShareView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    width: "70%",
    height: "20%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "space-around",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
});
