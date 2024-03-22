# CcTv
<h2>주제 2번: 분산 클라우드에서 AI 워크로드의 탄소 인지형 이동 및 추적 시스템 개발</h2>
<h2>예상 성과</h2>
소프트웨어: 클라우드 환경에서 AI학습 중 발생하는 탄소배출량 시각화 및 탄소 추적<br>
논문:  KCI<br>
기타 : 공모전 대상 수상<br>
<h2>필요 기술</h2>
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
[8] G. S. Practitioner, [Online]. Available: https://learn.greensoftware.foundation/carbon-awareness/
