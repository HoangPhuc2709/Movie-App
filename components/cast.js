import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
// context/ThemeContext.js
    Image
} from "react-native";
import React from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { fallbackPersonImage, image185, image342 } from "../api/moviedb";

export default function Cast({ cast, navigation }) {
    return (
        <View className="my-6">
            <Text className="text-white text-lg mx-4 mb-5">Top Cast</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15 }}
            >
                {cast &&
                    cast.map((person, index) => {
                        return (
                            <Animated.View
                                key={index}
                                entering={FadeInDown.delay(index * 100)
                                    .duration(600)
                                    .springify()}
                            >
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate("Person", person)
                                    }
                                    className="mr-4 items-center"
                                    activeOpacity={0.7}
                                >
                                    <View className="overflow-hidden rounded-full h-20 w-20 items-center border border-neutral-500">
                                        <Image
                                            className="rounded-2xl h-24 w-20"
                                            source={{
                                                uri:
                                                    image185(
                                                        person?.profile_path
                                                    ) || fallbackPersonImage,
                                            }}
                                        />
                                    </View>

                                    <Text className="text-white text-xs mt-1">
                                        {person?.character.length > 10
                                            ? person.character.slice(0, 10) +
                                              "..."
                                            : person?.character}
                                    </Text>
                                    <Text className="text-neutral-400 text-xs">
                                        {person?.original_name.length > 10
                                            ? person.original_name.slice(
                                                  0,
                                                  10
                                              ) + "..."
                                            : person?.original_name}
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}
            </ScrollView>
        </View>
    );
}
const styles = {
    castContainer: {
        flexDirection: "row",
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    castImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10,
    },
    castName: {
        color: "#fff",
        fontSize: 16,
    },
};
