import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useDispatch } from "react-redux";

export default function NoteDetail() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const note = useSelector((state: RootState) => state.notes.loading);

  return (
    <View>
      <View>
        <Text>{note?.title}</Text>
        <TouchableOpacity>
          <Text>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
