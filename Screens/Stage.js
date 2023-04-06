import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components/native";
import {
  BannerAd,
  BannerAdSize,
  useRewardedAd,
  TestIds,
} from "react-native-google-mobile-ads";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import quizList from "../Assets/quizList";
const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("window").height;
import AsyncStorage from "@react-native-async-storage/async-storage";
const STORAGE_KEY_RECORD = "@my_record";
const STORAGE_KEY_COIN = "@my_coins";
const bannerAdUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-8647279125417942/1049352977";
const rewardeAdUnitId = __DEV__
  ? TestIds.REWARDED
  : "ca-app-pub-8647279125417942/9820346164";
const hintCost = 20;
const Stage = ({ route, navigation: { goBack } }) => {
  const [myAnswer, setMyAnswer] = useState("");
  const [quizIdx, SetQuizIdx] = useState(route.params.quizIdx);
  const [isCorrectModalVisible, setCorrectModalVisible] = useState(false);
  const [isWrongModalVisible, setWrongModalVisible] = useState(false);
  const [isCoinShopVisible, setCoinShopVisible] = useState(false);
  const [isInitialVisible, setInitialVisible] = useState(false);
  const [isAbstractVisble, setAbstractVisble] = useState(false);

  const [coin, setCoin] = useState(0);
  const coinRef = useRef(0);
  const [isInitial, setIsInitial] = useState(false);
  const [isAbstract, setIsAbstract] = useState(false);
  const [isCoinLack, setCoinLack] = useState(false);
  const record = useRef(Array.from({ length: quizList.length }, () => false));
  const {
    isLoaded: rewardIsLoaded,
    isClosed: rewardIsClosed,
    load: rewardLoad,
    show: rewardShow,
  } = useRewardedAd(rewardeAdUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });
  const checkAnswer = () => {
    if (myAnswer == quizList[quizIdx].text) {
      coinRef.current += 20;
      setCoin((prev) => prev + 20);
      setCorrectModalVisible(true);
      storeRecordData();
      storeCoinData();
    } else {
      setMyAnswer(""),
        setWrongModalVisible(true),
        setTimeout(() => {
          setWrongModalVisible(false);
        }, 500);
    }
  };
  const nextStage = () => {
    setCorrectModalVisible(false);
    setMyAnswer("");

    SetQuizIdx((prev) => prev + 1);
  };
  const storeRecordData = async () => {
    record.current[quizIdx] = true;
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_RECORD,
        JSON.stringify(record.current)
      );
    } catch (e) {
      alert(e);
    }
  };
  const getRecordData = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY_RECORD);
      if (value == null) {
        return;
      } else {
        record.current = JSON.parse(value);
      }
    } catch (e) {
      alert(e);
    }
  };
  const storeCoinData = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_COIN,
        JSON.stringify(coinRef.current)
      );
    } catch (e) {
      alert(e);
    }
  };
  const getCoinData = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY_COIN);
      if (value == null) {
        setCoin(100);
        coinRef.current = 100;
      } else {
        setCoin(JSON.parse(value));
        coinRef.current = JSON.parse(value);
      }
    } catch (e) {
      alert(e);
    }
  };
  useEffect(() => {
    getRecordData();
    getCoinData();
  }, []);
  useEffect(() => {
    rewardLoad();
  }, [rewardLoad]);
  useEffect(() => {
    if (rewardIsClosed) {
      console.log("RewardClose!!");
      setCoin((prev) => prev + 50);
      coinRef.current += 50;
      storeCoinData();
      rewardLoad();
      setCoinShopVisible(false);
    }
  }, [rewardIsClosed]);
  const initialHintUse = () => {
    if (!isInitial) {
      if (coin >= hintCost) {
        setCoin((prev) => prev - hintCost);
        coinRef.current -= hintCost;
        setInitialVisible(true);
        setIsInitial(true);
        storeCoinData();
      } else {
        setCoinLack(true);
      }
    } else {
      setInitialVisible(true);
    }
  };

  const abstractHintUse = () => {
    if (!isAbstract) {
      if (coin >= hintCost) {
        setCoin((prev) => prev - hintCost);
        coinRef.current -= hintCost;
        setAbstractVisble(true);
        setIsAbstract(true);
        storeCoinData();
      } else {
        setCoinLack(true);
      }
    } else {
      setAbstractVisble(true);
    }
  };
  return (
    <WindowContainer>
      <Header>
        <CoinView onPress={() => setCoinShopVisible(true)}>
          <Image
            style={{
              height: "100%",
              width: "100%",
              resizeMode: "contain",
              position: "absolute",
              left: -35,
              zIndex: 2,
            }}
            source={require("../Assets/coin.png")}
          />
          <CoinNumberView>
            <Text style={{ left: 45, fontSize: 18 }}>{coin}</Text>
            <Ionicons
              name="add-circle-sharp"
              size={33}
              color="black"
              style={{ zIndex: 3, position: "absolute", right: 3 }}
            />
          </CoinNumberView>
        </CoinView>
      </Header>
      <QuizView>
        <ImgBox>
          <Image
            style={{
              height: "81%",
              width: "81%",
              resizeMode: "contain",
              alignSelf: "center",
            }}
            source={quizList[quizIdx].imgUrl}
          />
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
        </ImgBox>
      </QuizView>
      <AnswerView>
        <AnswerInput
          placeholder="정답입력"
          onChangeText={(newText) => setMyAnswer(newText)}
          value={myAnswer}
          onSubmitEditing={() => checkAnswer()}
          autoFocus={false}
          style={{ width: 200, height: 40, alignSelf: "center" }}
        />
      </AnswerView>
      <HintView>
        <Text
          style={{ fontSize: 17, marginTop: 10 }}
        >{`글자수: ${quizList[quizIdx].text.length}`}</Text>
        <HintBtn onPress={initialHintUse}>
          <HintBtnText>{`초성힌트`}</HintBtnText>
        </HintBtn>
        <HintBtn onPress={abstractHintUse}>
          <HintBtnText>{`추상힌트`}</HintBtnText>
        </HintBtn>
      </HintView>
      <AdsContatiner>
        <BannerAd
          unitId={bannerAdUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </AdsContatiner>
      <Modal
        isVisible={isCorrectModalVisible}
        backdropOpacity={0.3}
        useNativeDriver={true}
        animationIn={"pulse"}
      >
        <CorrectModal>
          <TouchableOpacity
            style={{
              backgroundColor: "powderblue",
              width: 50,
              height: 50,
              position: "absolute",
              bottom: 25,
              left: 20,
              borderRadius: 25,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 2,
            }}
            onPress={goBack}
          >
            <Ionicons name="ios-home" size={24} color="black" />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              top: 25,
              position: "absolute",
            }}
          >{`정답입니다!`}</Text>
          <View
            style={{
              width: 30,
              height: 30,
              top: 70,
              position: "absolute",
              flexDirection: "row",
            }}
          >
            <Image
              style={{
                height: 30,
                width: 30,
                right: 10,
                resizeMode: "contain",
                position: "absolute",
              }}
              source={require("../Assets/coin.png")}
            />
            <Text
              style={{
                left: 25,
                alignSelf: "center",
                fontWeight: "bold",
                fontSize: 15,
                position: "absolute",
              }}
            >{`x20`}</Text>
          </View>
          <Text style={{ fontSize: 15 }}>{quizList[quizIdx].comment}</Text>

          <NextBtn
            style={{ bottom: 25, position: "absolute" }}
            onPress={quizIdx == quizList.length - 1 ? null : nextStage}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {quizIdx == quizList.length - 1 ? "준비중" : "다음"}
            </Text>
          </NextBtn>
        </CorrectModal>
      </Modal>
      <Modal
        isVisible={isWrongModalVisible}
        backdropOpacity={0.3}
        useNativeDriver={true}
        animationIn={"pulse"}
      >
        <WrongModal>
          <Text
            style={{ fontSize: 30, fontWeight: "bold", color: "red" }}
          >{`땡!`}</Text>
        </WrongModal>
      </Modal>

      <Modal
        isVisible={isInitialVisible}
        backdropOpacity={0.3}
        useNativeDriver={true}
        animationIn={"pulse"}
        onBackdropPress={() => {
          setInitialVisible(false);
        }}
      >
        <InitialHintModal>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>
            {quizList[quizIdx].initial}
          </Text>
        </InitialHintModal>
      </Modal>

      <Modal
        isVisible={isAbstractVisble}
        backdropOpacity={0.3}
        useNativeDriver={true}
        animationIn={"pulse"}
        onBackdropPress={() => {
          setAbstractVisble(false);
        }}
      >
        <AbstractHintModal>
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>
            {quizList[quizIdx].abstract}
          </Text>
        </AbstractHintModal>
      </Modal>
      <Modal
        isVisible={isCoinShopVisible}
        backdropOpacity={0.3}
        useNativeDriver={true}
        animationIn={"pulse"}
        onBackdropPress={() => {
          setCoinShopVisible(false);
        }}
      >
        <CoinShopView>
          <View
            style={{
              width: 310,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: "black",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                fontSize: 25,
                color: "white",
                zIndex: 2,
                marginVertical: 10,
              }}
            >
              {"상점"}
            </Text>
          </View>
          <ShopContentsRowView>
            <Image
              style={{
                height: 50,
                width: 50,
                resizeMode: "contain",
                position: "absolute",
              }}
              source={require("../Assets/coin.png")}
            />
            <Text
              style={{ left: 60, fontSize: 18, position: "absolute" }}
            >{`50 코인`}</Text>
            <ShopContentsBtn
              onPress={() => (rewardIsLoaded ? rewardShow() : null)}
              style={{
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                right: 0,
              }}
            >
              {rewardIsLoaded ? (
                <Text
                  style={{ color: "white", fontWeight: "bold" }}
                >{`광고보기`}</Text>
              ) : (
                <Text
                  style={{ color: "white", fontWeight: "bold" }}
                >{`광고준비중`}</Text>
              )}
            </ShopContentsBtn>
          </ShopContentsRowView>

          <ShopContentsRowView>
            <Image
              style={{
                height: 50,
                width: 50,
                resizeMode: "contain",
                position: "absolute",
              }}
              source={require("../Assets/coin.png")}
            />
            <Text style={{ left: 60, fontSize: 18 }}>{`500 코인`}</Text>
            <ShopContentsBtn
              style={{
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                right: 0,
              }}
            >
              <Text
                style={{ color: "white", fontWeight: "bold" }}
              >{`준비중`}</Text>
            </ShopContentsBtn>
          </ShopContentsRowView>

          <ShopContentsRowView>
            <Image
              style={{
                height: 68,
                width: 68,
                resizeMode: "contain",
                position: "absolute",
                left: -8,
              }}
              source={require("../Assets/noAds.png")}
            />
            <Text style={{ left: 60, fontSize: 18 }}>{`배너광고제거`}</Text>
            <ShopContentsBtn
              style={{
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                right: 0,
              }}
            >
              <Text
                style={{ color: "white", fontWeight: "bold" }}
              >{`준비중`}</Text>
            </ShopContentsBtn>
          </ShopContentsRowView>
        </CoinShopView>
      </Modal>
      <Modal
        isVisible={isCoinLack}
        backdropOpacity={0.3}
        useNativeDriver={true}
        animationIn={"pulse"}
        onBackdropPress={() => {
          setCoinLack(false);
        }}
      >
        <CoinLackAlert>
          <Text style={{ fontSize: 17 }}>{`코인이 부족합니다.`}</Text>
          <Text style={{ fontSize: 17 }}>{` 코인을 충전해주세요~`}</Text>
        </CoinLackAlert>
      </Modal>
    </WindowContainer>
  );
};
export default Stage;

const WindowContainer = styled.View`
  height: ${WindowHeight}px;
  background-color: white;
`;

const Header = styled.View`
  flex: 0.1;
  background-color: #845b4a;
  justify-content: center;
`;
const QuizView = styled.View`
  flex: 0.4;
  align-items: center;
`;
const ImgBox = styled.View`
  margin-top: 15px;
  width: 300px;
  height: 300px;
  background-color: green;
  justify-content: center;
`;
const AnswerView = styled.View`
  flex: 0.08;
  background: white;
  justify-content: center;
`;
const AnswerInput = styled.TextInput`
  background-color: white;
  border-radius: 10px;
  padding: 10px 10px;
  font-size: 16px;
  elevation: 10;
  border-width: 2px;
`;
const HintView = styled.View`
  flex: 0.35;
  background-color: white;
  align-items: center;
`;

const HintBtn = styled.TouchableOpacity`
  width: 160px;
  height: 60px;
  border-radius: 20px;
  background: white;
  border-width: 2px;
  align-items: center;
  justify-content: center;
  margin-vertical: 15px;
  elevation: 10;
`;

const HintBtnText = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;
const AdsContatiner = styled.View`
  flex: 0.07;
  background-color: #845b4a;
  align-items: center;
  justify-content: center;
`;

const CorrectModal = styled.View`
  background-color: white;
  width: 300px;
  height: 250px;
  align-self: center;
  align-items: center;
  border-radius: 20px;
  justify-content: center;
  padding-horizontal: 15px;
`;

const WrongModal = styled.View`
  background-color: white;
  width: 150px;
  height: 150px;
  align-self: center;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
`;

const NextBtn = styled.TouchableOpacity`
  width: 100px;
  height: 50px;
  border-radius: 35px;
  background-color: lightgreen;
  justify-content: center;
  align-items: center;
  elevation: 10;
  border-width: 2px;
`;

const InitialHintModal = styled.View`
  background-color: white;
  width: 200px;
  height: 170px;
  align-self: center;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
`;

const AbstractHintModal = styled.View`
  background-color: white;
  width: 200px;
  height: 170px;
  align-self: center;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
`;

const CoinView = styled.TouchableOpacity`
  //background-color: white;
  width: 100px;
  height: 50px;
  right: 40px;
  position: absolute;
  justify-content: center;
`;

const CoinNumberView = styled.View`
  background-color: white;
  width: 130px;
  height: 45px;
  border-radius: 20px;
  align-items:center
  flex-direction: row;
`;

const CoinShopView = styled.View`
  background-color: white;
  width: 310px;
  height: 300px;
  border-radius: 20px;
  align-items: center;
  align-self: center;
`;

const ShopContentsRowView = styled.View`
  width: 280px;
  height: 70px;
  flex-direction: row;
  align-items: center;
`;

const ShopContentsBtn = styled.TouchableOpacity`
  width: 100px;
  height: 40px;
  background-color: black;
  border-radius: 10px;
`;

const CoinLackAlert = styled.View`
  background-color: white;
  width: 200px;
  height: 150px;
  align-self: center;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
`;
