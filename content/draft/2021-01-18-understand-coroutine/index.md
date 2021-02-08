---
title: Understand Kotlin Coroutine on Android (Google I/O' 19)
author: Reno Kim
date: 2021-01-18
hero: ./images/hero.jpg
excerpt: Understand Kotlin Coroutine on Android (Google I/O' 19) 의 비디오를 보고 정리한 글입니다.
---
# 왜 코루틴을 써야 할까요?

## 우리가 쓰고 싶은 코드

```kotlin
val user = fetchUserData()
textView.text = user.name
```

## 실제로 우리가 쓰고 있는 코드

```kotlin
// callbacks
val subscription = fetchUserData { User ->
    textView.text = user.name
}

//boilerplate code
override fun onStop() {
    subscription.cancel()
}
```

## 문제점

1. 콜백으로 인한 가독성 저하
2. Boilerplate Code → `Subscription.cancel()` 

## 해결 방법

1. RxJava

    ```kotlin
    //The RxWay
    fun fectchUser() : Observable<User> = ...

    fetchUser() 
        .as(autoDisposable(AndroidLifecycleScopeProvider.from(this)))
        .subscribe { user -> 
            textView.text = user.name
        }
    ```

2. LiveData

    ```kotlin
    //The LiveData Way
    fun fectchUser() : LiveData<User> = ...

    fetchUser().observe(viewLifecycleOwner) {
        textView.text = user.name
    }
    ```

3. Coroutine

## 3가지 솔루션들을 비교해보면

| 이름      | 특징                               | 단점                                         |
|-----------|------------------------------------|----------------------------------------------|
| LiveData  | Observable Data Holder             | Main Thread 만 제어 가능함 (스케쥴링이 안됨) |
| RxJava    | Observable + Schedulers + Observer | 제대로 사용하기가 어렵다                     |
| Coroutine | Suspendable Computations           | 아직 성숙하지 않다                           |

## 우리가 원하는 솔루션

1. 간결함
2. 확장에 용이함
3. 견고함 (built-in test)

## 결론

RxJava 와 Coroutine 2가지 솔루션이 있지만 이 세션에서는 Coroutine 에 대해서 이야기할 것이다

# 코루틴은 어떤 문제를 해결해 주는가?

→ 코루틴은 콜백을 대체함으로써 비동기 코드를 간결하게 해준다

## Example
