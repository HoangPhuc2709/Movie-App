import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Platform,
    Animated,
    Easing,
    StyleSheet,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Bars3CenterLeftIcon,
    MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { ChevronRightIcon } from "react-native-heroicons/solid";
import TrendingMovies from "../components/trendingMovies";
import MovieList from "../components/movieList";
import { StatusBar } from "expo-status-bar";
import {
    fetchTopRatedMovies,
    fetchTrendingMovies,
    fetchUpcomingMovies,
} from "../api/moviedb";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/loading";
import { useTheme } from "../components/context/ThemeContext";

const ios = Platform.OS === "ios";
const HEADER_HEIGHT = ios ? 60 : 70;

export default function HomeScreen() {
    const [trending, setTrending] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { theme, isDarkMode } = useTheme();

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const headerY = useRef(new Animated.Value(-HEADER_HEIGHT)).current;
    const contentY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        loadData();
        startAnimations();
    }, []);

    const loadData = async () => {
        try {
            const [trendingData, upcomingData, topRatedData] =
                await Promise.all([
                    fetchTrendingMovies(),
                    fetchUpcomingMovies(),
                    fetchTopRatedMovies(),
                ]);

            if (trendingData?.results) setTrending(trendingData.results);
            if (upcomingData?.results) setUpcoming(upcomingData.results);
            if (topRatedData?.results) setTopRated(topRatedData.results);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const startAnimations = () => {
        // Header slide down animation
        Animated.timing(headerY, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
        }).start();

        // Content fade in + slide up animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(contentY, {
                toValue: 0,
                duration: 800,
                delay: 200,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleSeeAll = (type) => {
        if (type === "upcoming") {
            navigation.navigate("Upcoming");
        } else if (type === "top_rated") {
            navigation.navigate("TopRated");
        }
    };

    const renderSectionHeader = (title, type) => (
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {title}
            </Text>
            <TouchableOpacity
                style={styles.seeAllButton}
                onPress={() => handleSeeAll(type)}
                activeOpacity={0.6}
            >
                <Text
                    style={[styles.seeAllText, { color: theme.colors.primary }]}
                >
                    See All
                </Text>
                <ChevronRightIcon size={18} color={theme.colors.primary} />
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return <Loading />;
    }

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: theme.colors.background },
            ]}
        >
            <StatusBar style={isDarkMode ? "light" : "dark"} />

            {/* Animated Header */}
            <Animated.View
                style={[
                    styles.header,
                    {
                        backgroundColor: theme.colors.background,
                        transform: [{ translateY: headerY }],
                    },
                ]}
            >
                <SafeAreaView edges={["top"]} style={styles.safeArea}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity
                            onPress={() => navigation.openDrawer()}
                            style={styles.iconButton}
                            activeOpacity={0.7}
                        >
                            <Bars3CenterLeftIcon
                                size={28}
                                strokeWidth={2}
                                color={theme.colors.text}
                            />
                        </TouchableOpacity>

                        <Text
                            style={[styles.logo, { color: theme.colors.text }]}
                        >
                            <Text style={{ color: theme.colors.primary }}>
                                M
                            </Text>
                            FLIX
                        </Text>

                        <TouchableOpacity
                            onPress={() => navigation.navigate("Search")}
                            style={styles.iconButton}
                            activeOpacity={0.7}
                        >
                            <MagnifyingGlassIcon
                                size={28}
                                strokeWidth={2}
                                color={theme.colors.text}
                            />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Animated.View>

            {/* Main Content */}
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: contentY }],
                }}
            >
                {/* Trending Movies */}
                {trending.length > 0 && (
                    <TrendingMovies
                        data={trending}
                        style={styles.trendingSection}
                    />
                )}

                {/* Upcoming Movies */}
                {upcoming.length > 0 && (
                    <View style={styles.section}>
                        {renderSectionHeader("Upcoming Movies", "upcoming")}
                        <MovieList
                            data={upcoming.slice(0, 5)}
                            hideSeeAll={true}
                            cardStyle={styles.movieCard}
                        />
                    </View>
                )}

                {/* Top Rated Movies */}
                {topRated.length > 0 && (
                    <View style={styles.section}>
                        {renderSectionHeader("Top Rated Movies", "top_rated")}
                        <MovieList
                            data={topRated.slice(0, 5)}
                            hideSeeAll={true}
                            cardStyle={styles.movieCard}
                        />
                    </View>
                )}
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        zIndex: 10,
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        height: HEADER_HEIGHT,
    },
    logo: {
        fontSize: 28,
        fontWeight: "bold",
        letterSpacing: 1,
    },
    iconButton: {
        padding: 8,
    },
    scrollContent: {
        paddingTop: HEADER_HEIGHT + 16,
        paddingBottom: 30,
    },
    trendingSection: {
        marginBottom: 30,
    },
    section: {
        marginBottom: 30,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
    },
    seeAllButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    seeAllText: {
        fontSize: 15,
        fontWeight: "600",
        marginRight: 4,
    },
    movieCard: {
        marginRight: 12,
    },
});
