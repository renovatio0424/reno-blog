# Virtual Memory (OS)

Question Type: Common

# 가상 메모리란?

- 가상 메모리는 메모리를 관리하는 방법의 하나로, 각 프로그램에 실제 메모리 주소가 아닌 가상의 메모리 주소를 주는 방식을 말한다

### 배경

- 메모리 부족 현상
- 다중 프로그램 실행 환경

### 특징

- 보조 메모리로 하드 디스크나 SSD 같은 보조 기억 장치를 사용
- 실제 디스크를 마치 메모리처럼 사용하는 것을 가상 메모리라고 하며 프로세스 입장에서는 디스크 공간이 아닌 실제 메모리로 인식

# Paging

> 메모리 주소들을 **고정된** 크기의 페이지들로 분할 관리하는 기법

- Page : A fixed-length contiguous block of virtual memory residing on disk.
- Frame : A fixed-length contiguous block located in RAM; whose sizing is identical to pages.

![https://www.enterprisestorageforum.com/imagesvr_ce/1092/Paging.png](https://www.enterprisestorageforum.com/imagesvr_ce/1092/Paging.png)

# Segmentation

> 메모리 주소들을 **다양한** 크기의 파편들로 분할 관리하는 기법

![https://www.enterprisestorageforum.com/imagesvr_ce/3117/Segmentation.png](https://www.enterprisestorageforum.com/imagesvr_ce/3117/Segmentation.png)

# Swapping

[https://t1.daumcdn.net/cfile/tistory/1260995050E18C8C24](https://t1.daumcdn.net/cfile/tistory/1260995050E18C8C24)

1. Created 
2. Ready 
→ secondary storage 에 저장되어 있는 실행 파일이 메모리에 load
3. Running
→ 메모리에 있는 프로세스 중에 어떤 프로세스를 실행 시킬 것인가? (CPU 스케줄링)
4. Asleep 
→ I/O Request 발생하면 asleep 상태가 됨 (메모리에는 있지만 사용하지 않는 상태)
→ I/O 작업이 완료되면 ready 상태로 돌아감

**Swapping 필요한 프로세스**
1. ready 상태에서 계속 CPU 점유권을 못 가져가는  프로세스
2. asleep 상태에서 ready 상태로 못 넘어가는 프로세스

# Grossary

## 페이지

가상 메모리 시스템에서 메모리를 다룰 때 사용하는 최소 크기 단위

## 스왑 아웃

메인 메모리의 프로세스에서 일정 페이지를 잘라서 가상 메모리로 가져가는 것

## 스왑 인

가상 메모리에 옮겨 두었던 프로세스의 페이지를 다시 메인 메모리로 가져오는 것

# References

[What is virtual memory? - Definition from WhatIs.com](https://searchstorage.techtarget.com/definition/virtual-memory)

[https://www.youtube.com/watch?v=OPdjLaW0flU](https://www.youtube.com/watch?v=OPdjLaW0flU)

[리눅스 커널 : 메모리 관리](https://wiki.kldp.org/Translations/html/The_Linux_Kernel-KLDP/tlk3.html)

[Paging and Segmentation](https://www.enterprisestorageforum.com/storage-hardware/paging-and-segmentation.html)
