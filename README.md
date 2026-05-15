## 우리가 다시쓰는 이야기, Re:Write

### 해당 프로젝트는 현시점을 기준으로 서비스되고 있는 많은 Ai 채팅, 소설 서비스에 대한 이런저런 불만 + 로컬 Ai부심에 기반하여 만들어졌습니다.

알파 테스트 영상

![markdown_and_stream](https://github.com/user-attachments/assets/ffd24647-0417-4d37-83e0-a1d8c75e8066)

구현할것들

1. RAG
2. 멀티플레이(TRPG)
3. 뭐 생각나면 뭐라도 쓰겠지.

서버 상태눈치 보면서 토큰쓰고, 또 기껏 잘 쌓아둔 서사가 망가지고, 간지나는 구출 스토리를 짜뒀더니 다 까먹은 배은망덕한 것들로부터의 해방!
돈쓰고 시간쓰고, 손해볼 시간에 만들기라도 해보자, 라는걸로 시작.

아이디어만 많고 실력이 조악해 코드 잘 짜시는 분들은 눈돌리시는걸 추천합니다.

### 목표는 로컬ai or API사서 자급자족 가능한 셀프 호스팅 + 프롬프트 연습용 GUI만들기가 되겠습니다.

업데이트/미리보기

2026.05.10 hono의 staticServe + 프롬프트로 캐릭터 이미지 출력 기능 추가
<img width="629" height="940" alt="image" src="https://github.com/user-attachments/assets/63f3dcc0-0afa-4b33-917f-2a90b33f0501" />

2026.05.11 모델 alias, hardware권장사양용 리턴 오브젝트 리폼
<img width="633" height="925" alt="Screenshot from 2026-05-11 20-15-34" src="https://github.com/user-attachments/assets/172845bf-4ab6-47db-bd84-147f8743d41c" />


2026.05.15 Logic+ (Reasoning) 켜고 끄기 추가 (문제는 틀렸지만, TASK따르는것과, <|think> 시간동안 딜레이가 있는걸 볼 수 있음)
![](https://github.com/user-attachments/assets/b445f8db-1ffc-4986-b4c5-7b0dc910a13a)

