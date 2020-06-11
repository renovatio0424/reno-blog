---
title: HashMap vs HashTable
author: Reno Kim
date: 2020-02-27
hero: ./images/hero.jpg
excerpt: HashMap 과 HashTable 스터디하면서 정리한 글
---

# HashMap & HashTable [(참고했던 영상)](https://img.youtube.com/vi/KyUTuwz_b7Q/0.jpg)

[![Reference](https://img.youtube.com/vi/KyUTuwz_b7Q/0.jpg)](https://www.youtube.com/watch?v=KyUTuwz_b7Q)

## Hashing Algorithm

**Hash** 란 해쉬 함수를 사용해 입력된 값을 계산해 해쉬값을 만드는 것을 말한다. 

___즉, 해쉬 값을 해쉬 함수를 통해 알게 된 임의의 값을 통해 원래 값을 찾을 수 있다.___  
 
예를 들어서 Mia 라는 값을 맵에서 찾고 싶을 때
기존 Map 에서는 Mia 가 있는 Key 를 알아야만 Mia 를 찾을 수 있다.
하지만 해쉬맵을 사용한다면 Mia 의 해쉬값을 통해 바로 맵에서 Mia 를 찾을 수 있다. 
아래처럼 말이다. 
	
	1. Mia 를 찾고 싶다
    2. Mia 의 해쉬값을 찾는다
    
    	M = 77
    	i = 105
    	a = 97 
    	total = M + i + a = 279 
    	hash = 279 % 11 = 4
    
    3. hash 값으로 원하는 값을 입력 또는 찾는다

## Collisions 이란? 

___하지만 해쉬값이 같지만 값이 다른 경우에는 어떻게 될까?___

 이런 경우를 Collisions 이라 하며 
Collision 이 발생하는 비율을 **Load Factor** (저장된 아이템의 총 갯수 / 배열의 크기 => load factor 가 작을 수록 효율이 좋다)라 한다
당연히 collision 이 없는 경우를 **Best Case**, 
collision 이 많은 경우를 **Worst Case** 라 한다.
	
## Collision 해결법

- Open Addressing
    - Linear probing
	- plus 3 rehash
	- quadratic probing (failed attempt)^2
	- Double hashing 
- Closed Addressing
	
## 해쉬 함수의 요구 사항

- collision 최소화
- 일정하게 분배된 해쉬 값
- 쉬운 계산
- 어떤 collision 이든 해결이 되어야함
	
## Summary

- 많은 양의 데이터를 인덱싱할 때 사용
- 각 키들에 대한 주소는 키에 의해 계산된다
- Collision 은 open or closed addressing 을 통해 해결 할 수 있다. 
- 해싱은 데이터베이스 인덱싱, 컴파일러, 캐싱, 비밀번호 인증 등등 에서 사용된다. 
- 삽입, 삭제, 제거 가 같은 시간 안에 처리된다. (데이터가 많든 적든)