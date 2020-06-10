---
title: Kotlin 의 constructor 와 init 중에 누가 먼저 호출될까?
author: Reno Kim
date: 2020-06-10
hero: ./images/hero.png
excerpt: 코틀린의 생성자들은 어떤 순서로 호출이 되는지 찾아
---

오늘 문득 업무를 하다가 갑자기 궁금해진 것...

Kotlin 은 constructor 와 init 두 가지를 통해 객체를 생성할 수 있는데

> "만약 동시에 두가지 모두 사용할 경우에 
>
> 어떤 함수가 먼저 호출이 될까??"

갑자기 궁금해져서 테스트를 해보았다

아래는 테스트를 하면서 작성한 코드이다  

~~~kotlin
class Person(private val name: String) { //primary constructor
    private var age: Int = 0
    set(value) {
        println("property called")
        field = value
    }
    private lateinit var address: String
    private lateinit var company: String

    constructor (name: String, age: Int, address: String) : this(name) { //secondary constructor
        println("constructor 1 called")
        this.age = age
        this.address = address
    }

    constructor (name: String, age: Int, address: String, company: String) : this(name) { //secondary constructor
        println("constructor 2 called")
        this.age = age
        this.address = address
        this.company = company
    }

    init {
        println("init called")
        if (!::address.isInitialized)
            this.address = "unknown address"
        if (!::company.isInitialized)
            this.company = "unknown company"

    }
}
~~~

여기서 객체를 생성하게 되면 결과는 다음과 같다

~~~
val reno = Person("Reno", 31, "Seoul", "KM")

/**
 * result
 * 
 * init called
 * constructor 2 called
 * age called
 * */
~~~

즉, 다음의 순서로 호출이 된다 !

1. init method 
2. constructor
3. property

