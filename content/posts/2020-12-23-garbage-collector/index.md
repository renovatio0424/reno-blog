# Garbage Collection (Memory)

## JVM 이란?

자바 프로그램의 범주에 들어가는 모든 것들을 실행시키는 기본 **데몬**

```
데몬 
멀티태스킹 운영 체제에서 사용자가 직접적으로 제어하지 않고, 백그라운드에서 돌면서 여러 작업을 하는 프로그램
```

## "Java 프로그램을 실행한다" 의 의미

컴파일 과정을 통하여 생성된 Class 파일을 JVM 으로 로딩하고 ByteCode를 해석(interpret)하는 과정을 거쳐 메모리 등의 리소스를 할당하고 관리하며 정보를 처리하는 일련의 작업

![image](https://t1.daumcdn.net/cfile/tistory/99DD604A5BC7562711)

- **Java Source**: 사용자가 작성한 Java 코드이다
- **Java Compiler**: Java Source 파일을 JVM이 해석할 수 있는 Java Byte Code로 변경한다.
- **Java Byte Code**: Java Compiler에 의해 수행될 결과물이다(확장자 .class 파일)
- **Class Loader**: JVM 내로 .class 파일들을 Load하여 Loading된 클래스들을 Runtime Data Area에 배치된다.
- **Execution Engine**: Loading된 클래스의 Bytecode를 해석(interpret)한다.
- **Runtime Data Area**: JVM이라는 프로세스가 프로그램을 수행하기 위해 OS에서 할당받은 **메모리 공간**이다.

## Runtime Data Area

![https://t1.daumcdn.net/cfile/tistory/99423C425BC7564C1D](https://t1.daumcdn.net/cfile/tistory/99423C425BC7564C1D)

- **Method Area:** 클래스, 변수, Method, static변수, 상수 정보 등이 저장되는 영역 (모든 Thread가 공유)
    - 저장하는 정보들
        1. **Type(Class, Interface) Information** 
            - Type의 전체 이름 (패키지명 + 클래스명)
            - Type의 직계 하위 클래스 전체 이름
            - Type의 클래스 / 인터페이스 여부
            - Type의 modifier (public / abstract / final)
            - 연관된 인터페이스 이름 리스트
        2. **Runtime Constant pool (Type 의 모든 상수 정보)**
            - Type, Field, Method로의 모든 Symbolic Reference 정보를 포함
            - Constant Pool의 Entry는 배열과 같이 인덱스 번호를 통해 접근
            - Object의 접근 등 모든 참조를 위한 핵심 요소
        3. **Field Information (인스턴스 변수)**
            - Field Type
            - Field modifier (public / private / protected / static / final / volatile / transient)
        4. **Method Information (Constructor를 포함한 모든 메소드)**
            - Method Name
            - Method Return Type
            - Method Parameter 수와 Type
            - Method modifier (public / private / protected / static / final / syncronized / native / abstract)Method 구현 부분이 있을 경우 ( abstract 또는 native 가 아닐 경우 )
            - Method의 byteCode
            - Method의 Stack Frame의 Operand Stack 및 Local variable section의 크기
            - Exception Table
        5. **Class Variable (static 키워드로 선언된 변수)**
            - 모든 인스턴스에 공유 되며 인스턴스가 없어도 직접 접근이 가능하다.
            - 이 변수는 인스턴스의 것이 아니라 클래스에 속하게 된다.
            - 클래스를 사용 하기 이전에 이 변수들은 미리 메모리를 할당 받아 있는 상태가 된다.
            - final class 변수는 상수로 치환 되어 Runtime Constant Pool에 값을 복사한다.
- **Heap Area:** new 명령어로 생성된 인스턴스와 객체가 저장되는 구역(Garbage Collection 이슈는 이 영역에서 일어나며, 모든 Thread가 공유)
- **Stack Area:** Method 내에서 사용되는 값들(매개변수, 지역변수, 리턴값 등)이 저장되는 구역으로 메소드가 호출될때 LIFO로 하나씩 생성되고, 메소드 실행이 완료되면 LIFO로 하나씩 지워진다. (각 Thread별로 하나씩 생성)
- **PC Register:** CPU의 Register와 역할이 비슷하다. 현재 수행 중인 JVM 명령의 주소 값이 저장된다. (각 Thread별로 하나씩 생성)
- **Native Method Stack:** 다른 언어(C/C++ 등)의 메소드 호출을 위해 할당되는 구역으로 언어에 맞게 Stack이 형성되는 구역이다

**프로그램 카운터(Program counter, PC)** 는 마이크로프로세서(중앙 처리 장치) 내부에 있는 레지스터 중의 하나로서, 다음에 실행될 명령어의 주소를 가지고 있어 실행할 기계어 코드의 위치를 지정한다. 때문에 "명령어 포인터" 라고도 한다.

## JVM Heap Structure

![image2](https://t1.daumcdn.net/cfile/tistory/99423C425BC7564C1D)

---

# Garbage Collection (Hotspot JVM)

## 정의

> The garbage collector (GC) automatically manages the application's dynamic memory allocation requests.

## **역할**

- 힙(heap) 내의 객체 중에서 가비지(garbage)를 찾아낸다
- 찾아낸 가비지를 처리해서 힙의 메모리를 회수한다

## GC 알고리즘

### GC Root

> GC를 위한 특별한 객체
객체가 살아있음을 보장한다

ex) Class, Thread, Stack Local, JNI Local, JNI Global, Monitor Used, Held by JVM

![https://image.slidesharecdn.com/gcalgorithms-130706151142-phpapp02/95/gc-algorithms-37-638.jpg?cb=1373123601](https://image.slidesharecdn.com/gcalgorithms-130706151142-phpapp02/95/gc-algorithms-37-638.jpg?cb=1373123601)

## **Reachability**

![https://d2.naver.com/content/images/2015/06/helloworld-329631-2.png](https://d2.naver.com/content/images/2015/06/helloworld-329631-2.png)

- 어떤 객체가 유효한 참조가 있을 경우 - 'reachable'
- 어떤 객체가 유효한 참조가 없는 경우 - 'unreachable'
- 유효한 최초 참조 - 'root set'

## **Reference & Reachability**

![https://d2.naver.com/content/images/2015/06/helloworld-329631-5.png](https://d2.naver.com/content/images/2015/06/helloworld-329631-5.png)

- Strong Reachable Object
- Weakly Reachable Object (GC 대상)
- Unreachable Objects (GC 대상)

## **Strengths of Reachability**

| Name               | 참조 방식                            | 메모리 해제 시점                                     |
|--------------------|--------------------------------------|------------------------------------------------------|
| Strongly Reachable | root set → reference object          | 직접 해제 (set null)                                 |
| Soflty Reachable   | soft reference → reference object    | Out of Memory 에만 반환                              |
| Weakly Reachable   | weak reference → reference object    | GC 실행시                                            |
| Phantom Reachable  | phantom reference → reference object | 이미 해제된(finalize 호출 이후) object를 참조한 객체 |
| UnReachable        | reference object                     | GC 실행시                                            |

## GC의 종류
| Name                            | Characteristic                                                    | 적합한 환경                                                          | Young Generation  | Old Generation                   |
|---------------------------------|-------------------------------------------------------------------|-------------------------------------------------------------------|-------------------|--------------------|
| Serial Collector                | 싱글 스레드로 수행                                                | - 싱글 프로세서 시스템 - 소형 데이터셋 (100MB) 멀티 프로세서 환경 | Serial            | Mark-Sweep-Compact |
| Parallel Collector              | 1. Minor Collection 을 병렬로 처리 → GC 오버헤드 줄임             | - 중대형 규모 데이터셋을 다루는 멀티 프로세서 환경                | Parallel Scavenge | Mark-Sweep-Compact |
| Concurrent Mark Sweep Collector | 2. Parallel Compaction → Major Collection 이 병렬 처리해주는 기능 | 1. 일시 정지가 짧아야 하는 프로그램 2. heap 메모리가 클 때        | Parallel          | Mark-Sweep         |

# Reference

[가비지 컬렉션(Garbage Collection)](https://jungwoon.github.io/java,%20gc/2019/07/27/Garbage-Collection/)

[NAVER D2](https://d2.naver.com/helloworld/329631)

[memorymanagement-whitepaper-1-150020.pdf](https://www.oracle.com/technetwork/java/javase/tech/memorymanagement-whitepaper-1-150020.pdf)

[](https://www.oracle.com/java/technologies/javase/javase-core-technologies-apis.html)

[[JVM Internal] JVM 메모리 구조](https://12bme.tistory.com/382)

[JVM의 Runtime Data Area](https://www.holaxprogramming.com/2013/07/16/java-jvm-runtime-data-area/)

[Garbage Collection (Hotspot JVM GC)](https://lazymankook.tistory.com/83)

[JVM GC와 메모리 튜닝 (조대협)](https://5dol.tistory.com/183)

[java.lang.ref #1. Object Reachability란?](https://frontjang.info/entry/javalangref-1-SoftRerefence-WeakReference-PhantomReference)

[Java의 메모리 관리 - Weak, Soft, Phantom reference 예제](https://tourspace.tistory.com/42)

[GC roots](https://www.yourkit.com/docs/java/help/gc_roots.jsp)

[JVM Garbage Collectors Benchmarks Report 19.12](https://ionutbalosin.com/2019/12/jvm-garbage-collectors-benchmarks-report-19-12/)
