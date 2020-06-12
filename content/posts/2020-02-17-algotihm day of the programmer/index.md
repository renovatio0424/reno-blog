---
title: (Algorithm) Day of Programmer
author: Reno Kim
date: 2020-02-17
hero: ./images/hero.jpeg
excerpt: Day of the Programmer 를 찾는 알고리즘 만들기!
---

## Day of the Programmer 

### Problem [HackerRank](https://www.hackerrank.com/challenges/day-of-the-programmer/problem)
1. Marie 는 타임 머신을 개발했고, 1700년도 부터 2700년도 사이의 한 해중에 Day of the Programmer (그 해의 256번째 날) 러시아를 시간 여행을 함으로써 테스트하고 싶었다. 
2. 1700~1917 은 율리우스력을 사용했고 1919 부터는 그레고리력을 사용했다.
3. 1918년에는 율리우스력에서 그레고리력으로 바뀌었는데, 1월 31일 다음날은 2월 14일 이었다.
4. 두 가지 달력 모두 윤달에는 29일이다. 나머지는 28일이고 (2월만)
5. 율리우스력에서 윤달은 4년마다 있고 그레고리력은 400와 4로 나누어지고 100으로 나누어지지 않는 달이다.
6. 연도 y가 주어졌을 때 그 해의 Day of the Programmer를 찾아라
단, string foramt = "dd.mm.yyyy" 다

## Julian calendar [(율리우스력)](https://ko.wikipedia.org/wiki/%EC%9C%A8%EB%A6%AC%EC%9A%B0%EC%8A%A4%EB%A0%A5)
- 4년 마다 2월 29일 추가함

## Gregorian calender [(그레고리력)](https://ko.wikipedia.org/wiki/%EA%B7%B8%EB%A0%88%EA%B3%A0%EB%A6%AC%EB%A0%A5)

율리우스력은 실질적인 장점에도 불구하고 천문학적 햇수와 날의 계산에서 **작은 편차**가 있었다. 
즉, 율리우스력의 한 해의 길이는 정확히 365일 6시간이며, 이는 천문학적으로 계산한 1년의 길이보다 약 11분 14초가 길다.
이 편차가 제1차 니케아 공의회로부터 1,250여 년 동안 누적된 16세기 후반에 이르러서는 춘분일이 325년 당시보다 열흘이 빨라진 3월 11일 즈음이 되어 달력에 큰 오차가 생겼다.
트리엔트 공의회(1545~1563)에서 교황에게 역법 개정에 대한 권한이 부여되고 이 오차를 줄이기 위하여 1582년 10월 4일 교황 그레고리오 13세가 율리우스력을 개정하였고, 
개정한 달력은 그의 이름을 따서 그레고리력으로 부르게 되었다.

- 1582년 10월 4일(목) 다음날을 1582년 10월 15일(금)로 한다.(위에서 설명한 열흘의 편차를 제거함)
- 4의 배수인 해를 윤년으로 한다. 그러나 100으로 나눌 수 있지만 400으로 나뉘어 떨어지지 않는 해는 예외로 평년으로 한다.

## Solution

~~~java
import java.io.*;
import java.math.*;
import java.security.*;
import java.text.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.function.*;
import java.util.regex.*;
import java.util.stream.*;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;

public class Solution {

    // Complete the dayOfProgrammer function below.
    static String dayOfProgrammer(int year) {
        String result = null;
        //율리우스력?
        if(year <= 1917) {
            // 윤달?
            if(year % 4 == 0) {
                // 9월 12
                result = "12.09.";
            } else {
                // 9월 13
                result = "13.09.";
            }
        //그레고리력?    
        } else if (year >= 1919) {
            //윤달?
            if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) {
                // 9월 12
                result = "12.09.";
            } else {
                // 9월 13
                result = "13.09.";
            }
        //1918?
        } else {
            // 9월 26
            result = "26.09.";
        }

        return result + year;
    }

    public static void main(String[] args) throws IOException {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(System.getenv("OUTPUT_PATH")));

        int year = Integer.parseInt(bufferedReader.readLine().trim());

        String result = dayOfProgrammer(year);

        bufferedWriter.write(result);
        bufferedWriter.newLine();

        bufferedReader.close();
        bufferedWriter.close();
    }
}
~~~