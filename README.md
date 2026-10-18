# Docker Desktop 개발 환경

Windows Docker Desktop의 **Linux containers / WSL 2 엔진**에서 실행합니다. PHP 8.4 + nginx, MariaDB 11.4, Spring Boot 3.5 + JDK 17, React + Vite, Python 3.12 + FastAPI를 제공합니다. 호스트에 각 언어 런타임을 설치할 필요가 없습니다.

## 시작

Docker Desktop을 실행하고 이 폴더의 PowerShell에서 실행하세요.

```powershell
Copy-Item .env.example .env
# .env의 DB 비밀번호를 변경하세요. 기존 .env가 있으면 복사하지 마세요.
docker compose config --quiet
docker compose up -d --build
docker compose ps
docker compose logs -f
```

최초 실행에는 이미지와 Maven/npm 의존성을 다운로드합니다. 컨테이너가 실행 중이어도 의존성 설치와 앱 시작이 끝날 때까지 기다려야 합니다.

| 환경 | 접속 주소 | 소스 |
| --- | --- | --- |
| nginx / PHP | http://localhost:8080 | `apps/php` |
| Spring Boot / JDK 17 | http://localhost:8081/api/hello | `apps/spring` |
| React | http://localhost:5173 | `apps/react` |
| Python API / 문서 | http://localhost:8000/docs | `apps/python` |
| MariaDB | `127.0.0.1:3306` | DB명/계정은 `.env` |

PHP 첫 화면과 Spring API는 실제 DB 연결을 확인합니다. React의 API 호출 버튼은 Vite 프록시를 통해 Spring에 연결합니다. Python은 독립 API 예제입니다. 컨테이너에서 DB 호스트는 `mariadb:3306`, Windows에서는 `127.0.0.1:3306`입니다. 공개 포트는 로컬 PC에서만 접근 가능합니다. DB 포트는 `.env`의 `DB_PORT`로 변경합니다. 다른 포트 충돌 시 `compose.yaml`의 `127.0.0.1:호스트포트:컨테이너포트` 중 호스트포트를 수정하세요.

## 데이터 보관

기본 `DATA_ROOT=C:/Projects/DATA/devops`를 `.env`에서 변경할 수 있습니다. Windows 경로는 `/`로 작성하세요. Docker가 bind mount 폴더를 생성하며 Docker Desktop에 해당 경로의 쓰기 권한이 필요합니다.

| DATA_ROOT 하위 폴더 | 용도 |
| --- | --- |
| `mariadb` | DB 데이터 전체 |
| `php`, `spring`, `python` | 각 컨테이너의 `/data`에 저장한 파일 |
| `maven`, `npm` | 의존성 다운로드 캐시 |
| `react/node_modules` | React 의존성 |

소스는 이 저장소에 보관합니다. 앱에서 영구 보관할 파일은 `/data`에 저장하세요. 다른 컨테이너 내부 경로에만 저장한 파일은 재생성 시 없어질 수 있습니다. 위 호스트 데이터는 Docker 재시작, `down`, 컨테이너 재생성 후에도 유지됩니다. `DATA_ROOT` 변경 시 기존 데이터는 자동 이동하지 않습니다.

MariaDB 계정/비밀번호 환경 변수는 데이터 폴더가 비어 있는 최초 초기화 시 적용됩니다. 기존 DB 비밀번호는 SQL로 변경해야 합니다. DB 폴더를 삭제하면 데이터가 없어지므로 업그레이드 전에는 DB 논리 백업과 복원 절차를 준비하세요.

## 개발 및 관리

```powershell
docker compose stop                    # 중지
docker compose start                   # 기존 컨테이너 시작
docker compose down                    # 컨테이너/네트워크 제거, 호스트 데이터 유지
docker compose up -d --build            # 생성/설정 변경 적용
docker compose logs -f spring
docker compose restart spring          # Java 소스 변경 후 재컴파일/실행
docker compose exec react npm run build
docker compose exec mariadb mariadb -u app -p app
```

PHP 수정은 다음 요청부터 반영됩니다. React와 Python은 소스 변경을 자동 감지합니다. Python 의존성을 변경하면 `docker compose up -d --build python`을 실행하세요. React 의존성 변경 후에는 `docker compose restart react`를 실행하면 `npm install`이 다시 수행됩니다. 최초 설치로 생성되는 `apps/react/package-lock.json`은 커밋하여 공유하세요.

필요한 서비스만 실행할 수도 있습니다.

```powershell
docker compose up -d --build nginx      # nginx + PHP + DB
docker compose up -d spring react       # Spring + React + DB
docker compose up -d --build python     # Python
```

`unless-stopped` 정책으로 Docker Desktop 재시작 후 자동 시작합니다. 직접 중지한 서비스는 `docker compose up -d`로 다시 실행하세요. Windows bind mount의 DB/의존성 디렉터리는 WSL 내부 디스크보다 느릴 수 있습니다.

로컬 개발용 구성입니다. 이미지 태그와 일부 의존성은 패치 업데이트를 허용하므로 운영 배포 시 버전 고정 및 서버 설정을 별도로 준비하세요.

## 공식 문서

- [Docker Compose 서비스 및 bind mount](https://docs.docker.com/reference/compose-file/services/)
- [MariaDB 공식 이미지 및 초기화 변수](https://hub.docker.com/_/mariadb/)
- [Spring Boot 3.5 / Java 17 요구사항](https://docs.spring.io/spring-boot/3.5/system-requirements.html)
