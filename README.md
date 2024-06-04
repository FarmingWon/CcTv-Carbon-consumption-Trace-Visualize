# CcTv:Carbon-consumption-Trace-Visualize
## 프로젝트 소개 
<!-- 그림 추가예정 -->
<p align="center">
  <img src="https://github.com/FarmingWon/CcTv-Carbon-consumption-Trace-Visualize/assets/98411696/8d6a62f5-895d-4e5f-9c93-e4a7025b9f91"><br>
  <strong>Fig 1. CcTV DashBoard</strong>
</p>

> **CcTv(Carbon-consumption-Trace-Visualize)는 멀티 클라우드 환경의 웹 기반 Carbon Management System입니다.**
- 파이썬 기반의 딥러닝 관련 라이브러리 간 Dependency 충돌을 해결 후 도커를 통해 배포합니다. 
- React 기반으로 구현된 대시보드를 통해 딥러닝 학습이 진행되는 클라우드 프로비저닝에 대한  
  시각화 및 탄소 배출량 확인이 가능합니다.
- 딥러닝 학습의 특성에 고려하여 보유중인 클라우드 중 탄소 집약도가 낮은곳으로 이동하며 학습합니다.
## 개요 
<!--개요 그림(동작 프레임워크 그림 그려서 넣기) -->

> **본 프로젝트는 하나의 컴퓨팅 환경에서 여러 클라우드를 동시에 관리하며, 탄소 배출량을 고려한 딥러닝 학습을 위하여 개발하였습니다.**

> **클라우드 환경에서 딥러닝 학습의 초기 환경 세팅을 위해 NVIDIA의 `nvidia/cuda:12.1.0-cudnn8-runtime-ubuntu22.04`를 도커 베이스로 확장하여 딥러닝에 대한 Dockerfile을 구성하였습니다.** <br>

## Requirements
**실험을 재현하기 위해서는 다음 환경이 필요합니다.**
- node.js version: 20.12.2
- Python version 3.11.x
- Flask
- aioelectricitymaps
- paramiko
- firebase_admin

**또한 클라우드 환경에서의 테스트를 진행하기 위하여 다음 형식의 `ssh_data.csv`파일이 필요합니다.** <br><br>
***ssh접속 예시***
```bash
$ ssh -p {Port} {사용자 이름}@{SSH 서버의 IP 주소}
```
[`ssh_data.csv` 예시]<br>
|SSH 서버의 IP 주소|사용자 이름|Password|Port|국가코드|국가명|
|-----------------|----------|--------|----|------|---|
|x.x.x.x|cctv|1234|10002|KR|Korea|


## Usage
본 레포지토리를 통해 실험을 진행하기 위해서는 클라우드 환경에서 도커가 사전에 설치되어 있어야 합니다.   
- **다음 단계에 따라 프로젝트를 실행할 수 있습니다:** <br>
### 1. 프로젝트 Clone 및 환경 설정
**먼저, 우리의 레포지토리를 Clone하고 필요한 패키지를 설치합니다.**
```bash
$ git clone https://github.com/YourUsername/CcTv.git
$ cd CcTv
$ pip install -r requirements.txt
$ cd web/react-app
$ npm install
```
---
### 2. Flask 및 npm 서버 구동
**Flask와 npm 서버를 각각 구동시킵니다.**
```bash
$ cd web/flask-app
$ python app.py
$ cd web/react-app
$ npm start
```
---
### 3. 도커 컨테이너에서 딥러닝 학습 시작
<p align="center">
  <img src="https://github.com/FarmingWon/CcTv-Carbon-consumption-Trace-Visualize/assets/98411696/aa0e3fde-00fe-437f-ba9d-a94139694bd5"><br>
  <strong>Fig 2. Terminal on Dashboard</strong>
</p>

**원하는 클라우드의 터미널에서 딥러닝 학습을 시작합니다.**   
> **예를 들어, VGGNet 모델을 학습시키려면 다음 명령어를 사용합니다:**
```bash
$ docker run -it --gpus all python3 VGGNet/train.py --epoch 100 --lr 0.001 --batch 8 --vgg_model VGG16 --cuda 0 --step_size 30 --gamma 0.1 --resumption 0 --ssh_server 0 --threshold 250 
```
여기서 각 옵션의 의미는 다음과 같습니다.
- ```--epoch``` : 학습할 에폭의 수
- ``--lr`` : 학습률
- ``--batch`` : 배치 크기
- ``--vgg_modl`` : 사용할 VGGNet 모델
- ``--cuda`` : 사용할 GPU 번호
- ``--step_size`` : 학습률을 감소시키는 스텝 크기
- ``--gamma`` : 학습률 감소 계수
- ``--resumption`` : 마이그레이션 여부
- ``--ssh_server`` : SSH 서버 번호
- ``--threshold`` : 탄소 배출량 임계값
각 옵션은 딥러닝 모델에 적용하여 변경할 수 있습니다.
---
### 4. 대시보드를 통해 진행 상황 모니터링
<p align="center">
  <img src="https://github.com/FarmingWon/CcTv-Carbon-consumption-Trace-Visualize/assets/98411696/e235d217-f217-47cb-9b44-72057d95d5d7"><br>
  <strong>Fig 3. Carbon Intensity Chart</strong>
</p>

<p align="center">
  <img src="https://github.com/FarmingWon/CcTv-Carbon-consumption-Trace-Visualize/assets/98411696/0d3f9dc9-9197-46df-b876-17a8429f3b98"><br>
  <strong>Fig 4. Cloud Resource Info.</strong>
</p>


> **딥러닝 학습이 시작되면, 대시보드에서 클라우드 프로비저닝과 학습의 진행 현황을 확인할 수 있습니다.  
대시보드는 실시간으로 데이터 시각화 및 탄소 배출량을 모니터링 할 수 있도록 설계되었습니다.**
---
### 5. 결과 확인 및 추가 분석
> **학습이 완료되면, 대시보드를 통해 최종 결과와 탄소 배출량에 대한 자세한 분석을 확인할 수 있습니다.  
결과 데이터를 추출하여 추가 분석을 진행하거나 보고서를 작성할 수 있습니다.**
<br>

- **따라서 CcTv 프로젝트를 통해 클라우드 환경에서의 딥러닝 학습을 효과적으로 관리하고 탄소 배출량을 추적할 수 있습니다.**
---
## Contributors
The content is by [Wonseok Son][FarmingWon]. 

For a full list of a all contributors, check the [contributor's page][contributors].
<!-- <h2>필요 기술</h2>
- 대시보드 구현을 위한 Front-end Framework 및 Library 심화 지식(e.g. React, Django, etc..)<br>
- 협업 툴(GitHub Actions)<br> 
- Linux 스크립트 작성 기술<br> 
- 클라우드 서비스 및 인프라 기술(AWS, Google Cloud Platform, Azure)의 배포 및 관리<br> 
- NoSQL(Firebase, MongoDB)<br> 
- Python을 사용한 데이터 분석 및 Machine Learning 기술(Pandas, NumPy, scikit-learn, TensorFlow, PyTorch)
<h2>개발 배경 및 필요성</h2>
최근 대기 중 열을 가두는 온실가스의 양이 다시 한번 새로운 기록을 세웠으며, 그 증가 추세는 끝이 보이지 않는다[1]. 현재 온실가스 농도 수준으로 인하여 파리 협정 목표를 훨씬 초과하는 기온 상승이 예상된다[2]. 이로 인해 극심한 더위와 강우, 얼음이 녹고 해수면이 상승하는 등 극단적인 날씨가 동반 될 것으로 예상되어 탄소배출량 절감이 필수적으로 요구된다. 최근 유행하고 있는 딥러닝 학습 또한 탄소배출량이 방대하며, 그 양은 무려 세계 온실가스의 1%나 기여한다[3]-[5]. 최근 연구들은 클라우드 환경에서 딥러닝 학습 중 발생되는 탄소보다 학습의 비용 감소(지연시간 감소 등)에 중심이 된 연구 중점으로 진행이 됐다[6]-[8]. 이러한 연구를 기반으로 클라우드 환경에서 딥러닝 학습 중 방출되는 탄소의 양 절감에 기여할 것이며, 탄소 중립에 기여할 것이다.
<h2>개발 요구 사항</h2>
- 클라우드의 하드웨어 자원에 대한 정보 수집<br>
- AI 학습에서 사용되는 하드웨어 전력 소비량에 대하여 NoSQL에 저장 모듈 개발<br>
- AI 학습의 세부정보 모니터링 및 Front-end Framework를 이용한 시각화(탄소 배출량, 학습의 진행 정도 등)<br>
- 딥 러닝 학습 진행에 따른 전력 소비량, 탄소 배출량 정보 수집<br>
- 상용 클라우드를 활용한 AI 학습단계 관리 시스템 개발<br>
<h2>관련 문헌 조사</h2>
[1] Greenhouse Gas concentrations hit record high. Again, WMO, 15 November 2023<br> [2] Udara Willhelm Abeydeera, Lebunu Hewage, Jayantha Wadu Mesthrige, and Tharushi Imalka Samarasinghalage. "Global research on carbon emissions: A scientometric review." Sustainability 11.14 (2019): 3972.<br>
[3] Anthony, Lasse F. Wolff, Benjamin Kanding, and Raghavendra Selvan. "Carbontracker: Tracking and predicting the carbon footprint of training deep learning models." arXiv preprint arXiv:2007.03051 (2020).<br>
[4] J. Roundy, “Assess the environmental impact of data centers,” [Onꠓline]. Available: https://www.techtarget.com/searchdatacenter/feature/Assess-the-environmental-impact-of-data-centers<br>
[5] IPCC. Global Warming of 1.5°C. An IPCC Special Report on the impacts of global warming of 1.5°C above pre-industrial levels and related global greenhouse gas emission pathways, in the context of strengthening the global response to the threat of climate change,. Technical report, 2018.<br>
[6] K. Martineau, “Shrinking deep learning’s carꠓbon footprint,” [Online]. Available: https://news.mit.edu/2020/shrinking-deep-learning-carbon-footprint-0807<br>
[7] G. Cloud, [Online]. Available: https://cloud.google.com/compute/docs/regions-zones?hl=ko<br>
[8] G. S. Practitioner, [Online]. Available: https://learn.greensoftware.foundation/carbon-awareness/ -->
---
## License

MIT License

Copyright (c) 2023 Jan-Philipp Benecke

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[FarmingWon]: https://github.com/FarmingWon
[contributors]: https://github.com/FarmingWon/CcTv-Carbon-consumption-Trace-Visualize/graphs/contributors
