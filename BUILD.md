# ubuntu 22.04에서의 빌드

### 1. 빌드에 필요한 패키지 설치
```sh
sudo apt install build-essential git wget cmake libssl-dev libgmp-dev autoconf libtool curl
```

### 2. 파이썬3 설치
```sh
sudo apt install python3 python-is-python3 python3-pip
python --version && pip --version
```

### 3. 도커 설치
```sh
curl -fsSL https://get.docker.com | sh
sudo apt install uidmap
curl -fsSL https://get.docker.com/rootless | sh
docker --version
```

### 4. 노드 설치
```sh
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version
```

### 5. 코드 클론
```sh
git clone https://github.com/xpladev/ledger-xpla.git
cd ledger-xpla
git checkout tags/v1.0.0
```

### 6. 의존성 빌드
```sh
git submodule update --init --recursive
make deps
```

### 7. 빌드
디렉토리 생성 권한 문제로 sudo를 사용
```sh
sudo make
```

### 8. 청소
```sh
sudo make clean
```

### 9. 테스트
```sh
pip install "conan<2.0"
make cpp_test
```
