# 넌센스 AI 그림퀴즈

AI가 그린 그림을 보고 넌센스 퀴즈를 맞히는 React Native 기반의 모바일 애플리케이션입니다.

## 주요 기능

- **AI 그림 퀴즈**: AI가 생성한 독특하고 재미있는 그림을 보고 정답을 맞혀보세요.
- **스테이지 선택**: 다양한 퀴즈 스테이지를 선택하여 플레이할 수 있습니다.
- **힌트 시스템**: 정답을 맞히기 어려울 때 초성 힌트와 추상 힌트를 사용하여 도움을 받을 수 있습니다.
- **코인 시스템**: 퀴즈를 맞히면 코인을 얻을 수 있으며, 힌트를 사용하는 데 코인을 소모합니다.
- **광고 시청 보상**: 보상형 광고를 시청하고 코인을 얻을 수 있습니다.
- **진행 상황 저장**: 사용자의 퀴즈 클리어 기록과 코인 정보는 기기에 안전하게 저장됩니다.

## 기술 스택

- **Framework**: React Native (Expo)
- **Language**: JavaScript
- **State Management**: React Hooks (useState, useEffect, useRef)
- **Navigation**: React Navigation
- **Styling**: Styled Components
- **Data Storage**: AsyncStorage
- **Advertisement**: Google Mobile Ads (AdMob)

## 화면 구성

- **StageSelectScreen**: 전체 퀴즈 목록을 보여주는 화면입니다. 푼 문제는 해당 이미지가, 풀지 않은 문제는 '?'로 표시됩니다.
- **StageScreen**: 개별 퀴즈를 푸는 화면입니다. AI가 그린 이미지를 보고 정답을 입력하며, 힌트를 사용하거나 코인 상점을 이용할 수 있습니다.

## 실행 방법

```bash
# 의존성 설치
npm install

# iOS 실행
npm run ios

# Android 실행
npm run android
```

## 개인정보처리방침

자세한 개인정보처리방침은 `넌센스AI그림퀴즈.html` 파일을 참고해주세요.
