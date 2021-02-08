---
title: suspend 를 붙이면 생기는 일 (feat. Coroutine - under the hood)
author: Reno Kim
date: 2020-02-09
hero: ./images/hero.jpg
excerpt: 코루틴의 작동 원리에 대해 공부하면서 정리한 글입니다.
---
# suspend 를 붙이면 생기는 일 (feat. Coroutine - under the hood)

# Reference

[The suspend modifier - under the hood](https://manuelvivo.dev/suspend-modifier)

# 시작하기 앞서

- 이 글은 "coroutine 이 실제로 동작하는 원리"에 대해 공부하면서 학습한 내용을 쉽게 이해할 수 있도록 쓴 글입니다.
- 이해를 돕기 위해 예제 코드가 실제 코드와 다를 수 있습니다.

# `suspend` 를 붙이면 어떻게 될까?

Coroutine 소개 글이나 영상을 보다 보면 항상 하는 얘기 중 하나가

"**Callback** 을 없애 **Imperative code** 를 만들어 준다" 이다.

예시로 아래 코드가

```kotlin
// Simplified code that only considers the happy path
fun loginUser(userId: String, password: String, userResult: Callback<User>) {
  // Async callbacks
  userRemoteDataSource.logUserIn { user ->
    // Successful network request
    userLocalDataSource.logUserIn(user) { userDb ->
      // Result saved in DB
      userResult.success(userDb)
    }
  }
}
```

이 코드로 바뀌는 마법을 볼 수 있다.

```kotlin
suspend fun loginUser(userId: String, password: String): User {
  val user = userRemoteDataSource.logUserIn(userId, password)
  val userDb = userLocalDataSource.logUserIn(user)
  return userDb
}
```

그렇다면 Callback 을 사용하지 않는 것일까? 

실제로 내부적으로는 Callback 을 사용하고 있다. 

이를 위해서 `State Machine` 사용한다. (나중에 자세히 다루겠다)

## `Continuation`

State Machine은 `Continuation` 을 통해 콜백과 콜백에 사용되는 정보들을 공유하는데 

아래와 같이 정의되어 있다.

```kotlin
interface Continuation<in T> {
  public val context: CoroutineContext
  public fun resumeWith(value: Result<T>)
}
```

- `context` : `Continuation` 에서 사용될 `CoroutineContext` 를 의미하고
- `resumeWith` : `Result` 와 함께 Coroutine 을 재실행하는데, `Result` 값에는 Exception 또는 처리된 값이다.

이 Continuation 을 사용해 컴파일러는 다음과 같은 코드를 만들어 낸다

```kotlin
fun loginUser(userId: String, password: String, completion: Continuation<Any?>) {
  val user = userRemoteDataSource.logUserIn(userId, password)
  val userDb = userLocalDataSource.logUserIn(user)
  completion.resume(userDb)
}
```

컴파일러가 만들어낸 코드는

1. `suspend` 지시어가 사라졌다.
2. 함수 파라미터에 `completion: Continuation<Any?>` 가 추가 되었다.
3. return 값이 사라졌다
4. code block 마지막에 `completion.resume(userDb)` 가 생겼다. 

아까 얘기 했던 대로 `completion` 을 통해 결과 값을 전달하게 된다 

하지만 눈치 빠른 누군가는 왜 `completion` 의 타입이 `Continuation<Any?>` 인지 궁금할 것이다.

이 내용은 나중에 설명하도록 하겠다.

## State Machine

`loginUser` 가 하나의 스레드에서 동작한다면 여기서 끝날 것이다. 

하지만 실제로는 한개 이상의 스레드에서 비동기 처리 작업이 일어나는데 Coroutine은 이를 어떻게 처리할까?

어떻게 각 작업이 끝나고 다음 작업이 시작해야하는 상태를 관리할까?

그것을 관리하는 것이 State Machine이다.

컴파일러는 각각의 작업에 Label 을 붙여 처리해야할 작업을 나누고 

Label 통해 다음 해야할 작업을 지시한다. 

```kotlin
fun loginUser(userId: String, password: String, completion: Continuation<Any?>) {
  when(label) {
    0 -> { // Label 0 -> first execution
        userRemoteDataSource.logUserIn(userId, password)
    }
    1 -> { // Label 1 -> resumes from userRemoteDataSource
        userLocalDataSource.logUserIn(user)
    }
    2 -> { // Label 2 -> resumes from userLocalDataSource
        completion.resume(userDb)
    }
    else -> throw IllegalStateException(/* ... */)
  }
}
```

그리고 State Machine 을 생성하는데 다음과 같다.

```kotlin
fun loginUser(userId: String?, password: String?, completion: Continuation<Any?>) {
  
  class LoginUserStateMachine(
    // completion 파라미터는 loginUser 함수의 콜백이다.
    completion: Continuation<Any?>
  ): CoroutineImpl(completion) {
  
    // suspend 함수의 로컬 변수
    var user: User? = null
    var userDb: UserDb? = null
  
    // 모든 코루틴 구현체의 공통 객체들 
    var result: Any? = null
    var label: Int = 0
  
    // 이 함수는 loginUser 를 다시 state machine을 트리거합니다. (label은 이미 다음 상태입니다) 
    // 그리고 result는 이전 상태의 계산 결과입니다.
    override fun invokeSuspend(result: Any?) {
      this.result = result
      loginUser(null, null, this)
    }
  }
  /* ... */
}
```

`invokeSuspend` 가 오직 `Continuation` 객체의 정보만 가지고 호출이 되기 때문에, 나머지 parameters (`user:User?`,  `userDb:UserDb?`)들은 nullable이 됩니다. 

그렇기 때문에 컴파일러는 state가 어떻게 변경이 되는지에 대한 정보들만 추가해주면 됩니다. 

그렇기 위해서는 이 함수가 최초 실행인지 아니면 이전 상태로부터 resume 된 함수인지 알아야 합니다.  

최초에는 `LoginUserStateMachine` 이 인스턴스 되어 있지 않기 때문에 다음처럼 인스턴스화 할 수 있습니다. 

```kotlin
fun loginUser(userId: String?, password: String?, completion: Continuation<Any?>) {
  /* ... */
  val continuation = completion as? LoginUserStateMachine ?: LoginUserStateMachine(completion)
  /* ... */
}
```

컴파일러가 생성한 상태 이동 코드와 그들간의 정보 공유하는 코드를 보면 다음과 같습니다. 

```kotlin
fun loginUser(userId: String?, password: String?, completion: Continuation<Any?>) {
    /* ... */

    val continuation = completion as? LoginUserStateMachine ?: LoginUserStateMachine(completion)

    when(continuation.label) {
        0 -> {
            // 실패 여부를 체크합니다.
            throwOnFailure(continuation.result)
            // 다음에 continuation 이 호출이 되면 state = 1 으로 이동해야 합니다.
            continuation.label = 1
	          // continuation 객체가 logUserIn에 전달되고 완료되면 
            // state machine의 실행을 재개합니다
            userRemoteDataSource.logUserIn(userId!!, password!!, continuation)
        }
        1 -> {
            // 실패 여부를 체크합니다. 
            throwOnFailure(continuation.result)
            // 이전 상태의 결과를 가져옵니다. 
            continuation.user = continuation.result as User
            // 다음에 continuation이 호출되면, state = 2 로 이동해야 합니다. 
            continuation.label = 2
            // contination 객체가 logUserIn에 전달되고 완료되면 
            // state machine의 실행을 재개합니다. 
            userLocalDataSource.logUserIn(continuation.user, continuation)
        }
        2 -> {
            // 실패 여부를 체크합니다. 
            throwOnFailure(continuation.result)
            // 이전 상태의 결과를 가져옵니다. 
            continuation.userDb = continuation.result as UserDb
            // 이 함수를 호출한 함수를 재실행합니다. 
            continuation.cont.resume(continuation.userDb)
        }
        else -> throw IllegalStateException(/* ... */)
    }
}
```

이러한 프로세스가 Recursive하게 일어난다고 보시면 됩니다. 

# 결론

1. `suspend` 지시어를 붙이게 되면 컴파일러가 Callback 을 생성한다
2. Callback시 필요한 정보와 상태 관리는 **State Machine** 에 의해 관리된다.