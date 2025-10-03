# 네이버 블로그 키워드 도구

네이버 검색광고 API + 오픈API를 활용한 키워드 분석 도구

## 배포 방법

### 1. Vercel 배포

1. [Vercel](https://vercel.com) 회원가입/로그인
2. 깃허브 계정 연결
3. 이 저장소 선택
4. Environment Variables에 아래 값 추가:
   - `NAVER_AD_ACCESS`
   - `NAVER_AD_SECRET`
   - `NAVER_AD_CUSTOMER`
   - `NAVER_OPEN_CLIENT_ID`
   - `NAVER_OPEN_CLIENT_SECRET`
5. Deploy 클릭

### 2. 배포 후 설정

index.html 파일에서 `API_BASE` 값을 Vercel 배포 주소로 변경:
```javascript
const API_BASE = "https://your-project-name.vercel.app";
```

## 로컬 실행

```bash
npm install
npm start
```
