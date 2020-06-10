---
title: WebViewClient SslError 관련 경고 대응했던 이야기
author: Reno Kim
date: 2020-02-27
hero: ./images/hero.png
excerpt: WebViewClient.onReceiveSslError() 사용시 주의할점
---

### 사건 발생 

최근에 공지사항 기능을 구현한 적이 있다. 
기능 구현하면서 WebViewClient 객체에 대해서 간단히 공부하고 구현했었는데
얼마 지나지 않아 구글에서 경고 메일이 왔다. 

![google issue screenshot](./images/google%20request%20email.JPG)

내용은 다음과 같다

     앱에서 사용자를위한 보안 취약점이 포함 된 소프트웨어를 사용하고 있습니다. 
    이러한 취약점이있는 앱은 사용자 정보를 노출하거나 사용자의 기기를 손상시킬 수 있으며 
    악성 행동 정책을 위반하는 것으로 간주 될 수 있습니다. 
    
    [SSL Error Handler]
    WebView SSL Error Handler 경고를 해결하는 방법에 대한 자세한 내용은 이 Google 도움말 센터를 참조하십시오

### 문제 파악 
    
그래서 나는 [해당 링크](https://support.google.com/faqs/answer/7071387)로 이동해서 원인을 알아보았다.

링크 내용을 요약하면 다음과 같다 ([참고](http://theeye.pe.kr/archives/2721))

1. **WebViewClient.onReceiveSslError()** : webview load 시 ssl 인증 에러 발생을 처리하는 callback 함수이다
2. **원인** : 해당 콜백 함수에서 handler.proceed() 할 경우 ssl 오류를 발생시키지 않고 다음 동작을 실행함 => 보안 이슈
3. **해결법** : 해당 이슈 발생시 유저에게 에러가 발생했음을 알리고 그래도 실행할지를 물어보는 팝업을 띄움

하지만 해당 프로젝트의 onReceiveSslError() 함수를 확인했는데 구현되어 있지 않았다.

그래서 다른 라이브러리에서 호출하지 않았을까 하는 의심이 들었는데 어떻게 확인해야할지 감이 잡히지 않았다

이때 팀장님 왈

> 
> "APK Analyzer 로 확인해봐"
> 

#### 여기서 APK Analyzer 란? ([Android Developer](https://developer.android.com/studio/build/apk-analyzer))

안드로이드 스튜디오에서 제공하는 기능이며 다음과 같은 기능들을 제공한다. 

1. 파일 및 크기 정보 보기
2. AndroidManifest.xml 보기
3. DEX 파일 보기
4. DEX 파일 트리 보기 필터링하기
5. ProGuard 매핑 로드
6. 바이트 코드 표시, 사용법 찾기 및 Keep 규칙 생성
7. 코드와 리소스 항목 보기
8. APK 파일 비교

여기서 DEX 파일 보기 기능을 사용해서 다른 라이브러리에서 WebViewClient.onReceiveSslError() 가 있는지 확인을 해보았다. 

총 2군데에서 해당 함수가 사용되었음을 발견했는데 

하나는 Admob 라이브러리였고 다른 하나는 중국 광고 SDK 였다

둘 중에 어떤 라이브러리에서 일어난 일인지 고민하다가 google play console 에 보고된 이슈가 없었는지 확인했었다.

다행히도 중국 광고 SDK 에서 webview 의 특정 함수를 호출하는 것을 확인했고 

해당 광고 플랫폼을 다른 광고 플랫폼으로 변경했었다.


### 결론

- 안드로이드 스튜디오의 유용한 기능 (APK Analyzer)를 알게 되어 이와 비슷한 상황이 생겼을 때 유용하게 사용할것 같다.

- ssl 보안 이슈에 대해 공부하게 되는 계기가 되었다. 



