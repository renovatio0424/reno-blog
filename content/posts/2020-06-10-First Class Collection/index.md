---
title: The First Class Collection (일급 콜렉션)
author: Reno Kim
date: 2020-06-17
hero: ./images/hero.jpeg
excerpt: 일급 컬렉션에 대해 공부한 내용을 정리하였습니다 
---

최근에 기능 개발하면서 실수했던 이야기에 대해서 공유해보려고 한다 ㅠㅠ

## 공부하게 된 배경

기능 개발을 하면서 데이터 클래스에 콜렉션을 자체를 데이터 형태로 갖도록 구현한 적이 있다.

이렇게 

~~~ kotlin
class Person(val name:String) {
    private val cars:List<Car> = listOf();

    //bla bla
}

public class Car {
    private val name:String;
    private val price:Int;
}
~~~

처음에는 별 문제가 없어 보였다
하지만 여기에 비즈니스 로직을 하나씩 추가하다 보니 문제가 생겼다 ....


## 문제점

~~~kotlin
class Person(val name:String) {
    private val cars:List<Car> = listOf();

    fun getCarsSum() {
        //bla bla
    }

    fun getCarsCount():Int {
        //bla bla
    }

    // etc
}
~~~ 

위처럼 계속 컬렉션에 대한 함수들이 사용하는 클래스들에 생겨나기 시작했다...

이렇게 하니 문제점이

1. 해당 컬렉션을 가지고 있는 곳에 중복되는 관리 함수들이 생긴다
2. 관리하는 곳이 여기저기 흩어져 있어 관리하기 어렵다 

이었다.

그래서 회사 선배의 조언으로 해당 컬렉션을 가지고 있는 하나의 클래스로 만들어 구현하였는데 
이게 알고 보니 **First Class Collection** 였다.

## Fist Class Collection 이란?

Collection 을 Wrapping 하면서, Wrapping 한 Collection 외 다른 멤버 변수가 없는 클래스 

~~~ kotlin
// example
class Cars {
    private val cars:List<Car>

    fun getCarsSum() {
        //bla bla
    }
    
    fun getCarsCount():Int {
        //bla bla
    }
}
~~~

## 장점
1. 비즈니스 로직에 맞는 자료구조를 만들 수 있으며 
2. 하나의 클래스에서 컬렉션을 관리하기 때문에 관리가 편하다 

## 예제 코드

~~~kotlin
//Before

class ClipBefore {
    private val adjustmentList: List<Adjustment> = Adjustment.newAdjustment()

    // adjustment 에 대한 비즈니스 로직이 Clip 에 추가 되어야 했다...
    // clipBefore 말고도 다른 곳에서 adjustmentList 를 사용해야 한다면 ?? ==> Hell
    fun applyAdjustmentToEngine() {
        val brightness = getEngineValue(AdjustmentType.BRIGHTNESS)
        val contrast = getEngineValue(AdjustmentType.CONTRAST)
        val saturation = getEngineValue(AdjustmentType.SATURATION)

        println("apply adjustment brightness: $brightness")
        println("apply adjustment contrast: $contrast")
        println("apply adjustment saturation: $saturation")
    }

    private fun getFactor(type: AdjustmentType): Float
            = adjustmentList.find { it.type == type }?.factor ?: 0f

    private fun getEngineValue(type: AdjustmentType): Float
            = getFactor(type) * 255f
}

//Before Refactoring
class Adjustment(
    //factor range : 0f ~ 1.0f
    var factor: Float,
    val type: AdjustmentType
) {

    companion object {
        fun newAdjustment(): List<Adjustment> = AdjustmentType.values().map { Adjustment(0.5f, it) }
    }
}

enum class AdjustmentType {
    BRIGHTNESS,
    CONTRAST,
    SATURATION
}
~~~

~~~kotlin
// After

class ClipAfter {
    private val adjustments: Adjustments = Adjustments()

    //비즈니스에 종속적인 로직
    fun applyAdjustmentToEngine() {
        val brightness = adjustments.getEngineValue(AdjustmentType.BRIGHTNESS)
        val contrast = adjustments.getEngineValue(AdjustmentType.CONTRAST)
        val saturation = adjustments.getEngineValue(AdjustmentType.SATURATION)

        //apply Adjustments to Engine
        println("apply adjustment brightness: $brightness")
        println("apply adjustment contrast: $contrast")
        println("apply adjustment saturation: $saturation")
    }
}

//After Refactoring (First Class Collection)
class Adjustments {
    private val adjustmentList: List<Adjustment> = Adjustment.newAdjustment()

    private fun getFactor(type: AdjustmentType): Float
            = adjustmentList.find { it.type == type }?.factor ?: 0f

    fun getEngineValue(type: AdjustmentType): Float
            = getFactor(type) * 255f
}

~~~

## 결론
이 글을 읽으시는 독자분들도 데이터 모델이 컬렉션인 경우에 한 번쯤 고려해보면 좋을 것 같다 ㅎㅎ (분명 클린한 코드에 도움이 될 것이다)

## 참고 
- 코드리뷰 모음 서비스를 소개합니다 ([우하한 형제들 기술 블로그](https://woowabros.github.io/techcourse/2020/06/05/techcourse-javable.html))
- 일급 컬렉션의 소개와 써야할 이유 ([기억보단 기록을](https://jojoldu.tistory.com/412))
