import React, { useEffect, useState, useRef } from "react";
import { View, Image, FlatList, Text, Animated, Pressable } from "react-native";
import styled from "styled-components/native";
import quizList from "../Assets/quizList";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

import AsyncStorage from "@react-native-async-storage/async-storage";
const STORAGE_KEY_RECORD = "@my_record";
const bannerAdUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-8647279125417942/1049352977";

const StageSelect = ({ navigation: { navigate, addListener } }) => {
  const scaleArr = useRef(
    Array.from({ length: quizList.length }, (v, i) => new Animated.Value(1))
  ).current;
  const [record, setRecord] = useState(
    Array.from({ length: quizList.length }, () => false)
  );
  const getRecordData = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY_RECORD);
      if (value == null) {
        return;
      } else {
        setRecord(JSON.parse(value));
      }
    } catch (e) {
      alert(e);
    }
  };
  useEffect(() => {
    addListener("focus", () => {
      getRecordData();
    });
  }, []);
  return (
    <WindowContainer>
      <Header>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            flexDirection: "row",
            padding: 8,
          }}
        >
          <HeaderText style={{ color: "blue" }}>{`넌센스`}</HeaderText>
          <HeaderText style={{ color: "green" }}>{`AI`}</HeaderText>
          <HeaderText style={{ color: "red" }}>{`그림퀴즈`}</HeaderText>
        </View>
      </Header>
      <SelectView
        data={quizList}
        numColumns={3}
        keyExtractor={(item, index) => index}
        columnWrapperStyle={{
          justifyContent: "space-around",
        }}
        contentContainerStyle={{ paddingVertical: 30, paddingHorizontal: 10 }}
        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
        renderItem={({ item, index }) => {
          return (
            <View>
              <ImgBox
                onPressIn={() => {
                  scaleArr[index].setValue(0.9);
                }}
                onPressOut={() => {
                  scaleArr[index].setValue(1);
                }}
                onPress={() => {
                  navigate("Stage", { quizIdx: index });
                }}
                style={{
                  transform: [{ scale: scaleArr[index] }],
                }}
              >
                <Image
                  style={{
                    height: "100%",
                    width: "100%",
                    resizeMode: "contain",
                    position: "absolute",
                    zIndex: -1,
                  }}
                  source={require("../Assets/photoFrame.png")}
                />
                {record[index] ? (
                  <Image
                    style={{
                      height: "70%",
                      width: "70%",
                      resizeMode: "contain",
                      alignSelf: "center",
                    }}
                    source={item.imgUrl}
                  />
                ) : (
                  <ImgCover style={{ position: "absolute" }}>
                    <Text
                      style={{
                        fontSize: 50,
                        color: "white",
                        alignSelf: "center",
                      }}
                    >
                      {"?"}
                    </Text>
                  </ImgCover>
                )}
              </ImgBox>
              <Text style={{ alignSelf: "center", fontSize: 12 }}>{`${
                index + 1
              }번 작품명`}</Text>
              <Text style={{ alignSelf: "center", fontWeight: "bold" }}>
                {record[index] ? item.text : "???"}
              </Text>
            </View>
          );
        }}
      />
      <AdsContatiner>
        <BannerAd
          unitId={bannerAdUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </AdsContatiner>
    </WindowContainer>
  );
};
export default StageSelect;

const WindowContainer = styled.View`
  flex: 1;
  background-color: blue;
`;

const Header = styled.View`
  flex: 0.1;
  background-color: #845b4a;
  align-items: center;
  justify-content: center;
`;

const HeaderText = styled.Text`
  font-size: 25px;
  font-weight: bold;
`;
const SelectView = styled.FlatList`
  flex: 0.83;
  background-color: #faf2ea;
`;
const ImgBox = styled(Animated.createAnimatedComponent(Pressable))`
  width: 100px;
  height: 100px;
  justify-content: center;
`;
const ImgCover = styled.View`
  width: 70px;
  height: 70px;
  background-color: black;
  justify-content: center;
  align-self: center;
`;
const AdsContatiner = styled.View`
  flex: 0.07;
  background-color: #845b4a;
  align-items: center;
  justify-content: center;
`;
