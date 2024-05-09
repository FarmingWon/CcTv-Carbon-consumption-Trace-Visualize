from __init__ import *
# sys.path.append("VGGNet")
# from VGGNet.train import VGGTrain
from DB_Module import FireBase
from electricmaps import electric

class GPUs:
    def __init__(self, gpu_id, model, resumption, ssh_server, threshold):
        self.used_gpu = [0]
        self.return_info = []
        self.carbon_emissions = [0]
        #DB 
        self._fb = FireBase(model)
        
        self.gpu_id = gpu_id
        self.model = model
        self._threshold = threshold
        self.epoch = 0
        self.is_learning = True
        self.path = os.getcwd()
        
        self._carbons = None
        self._elec = electric(self._get_elec_token())
        df = pd.read_csv(self.path+"/ssh_data.csv", header=None).values.tolist()[int(ssh_server)]
        self._region = df[-2]
        self._region_full = df[-1]
        self._carbons = asyncio.run(self._elec.get_carbon_intensity(self._region, self._region_full))
        self._cal_carbon = self._carbons / (60.0 * 12.0) # 5초마다

        
        self.resource_file_path = f"{self.path}/{self.model}/file/resource.json"
        self.learning_time = time.time()
        if resumption == 0:
            self.learned_time = 0
        else:
            try:
                self.download_checkpoint()
                self.download_resource()
                with open(self.resource_file_path, 'r') as f:
                    json_data = json.load(f)
                self.learned_time = json_data['learning_time']
                self.carbon_emissions.append(json_data['carbon_emission'])
                self.used_gpu.append(json_data['total_gpu'])
                print(self.carbon_emissions, self.used_gpu)
            except Exception as e:
                print(e)
                self.learned_time = 0        
        
        # Current 사용량 알기
        self.default_gpu_usage = None
        self.default_gpu_usage = self.get_gpu_usage()
        # asyncio.run(self.gpus_measurement())
        thread = threading.Thread(target=self.gpus_measurement)
        thread.start()
        
        
    # GPU 전력 사용량 측정 함수
    def get_gpu_usage(self):
        # sudo nvidia-smi command
        command = f"nvidia-smi --id {self.gpu_id} --query-gpu=power.draw --format=csv,noheader,nounits"
        # command = f"nvidia-smi"
        result = subprocess.check_output(command, shell=True, universal_newlines=True)
        # result parsing
        power_draw = float(result.strip())  # Convert to kW
        if self.default_gpu_usage != None:
            power_draw -= self.default_gpu_usage
        if power_draw > 0:
            return power_draw
        else:
            return 0.0
        
    def get_gpu_freq_info(self):
        try:
            # Getting GPU info by sudo nvidia-smi query
            command = f"nvidia-smi --id {self.gpu_id} --query-gpu=clocks.current.memory,clocks.current.graphics --format=csv,noheader,nounits"
            result = subprocess.check_output(command, shell=True, universal_newlines=True)

            # 결과 파싱
            lines = result.strip().split('\n')
            memory_clock, core_clock = map(int, lines[0].strip().split(','))

            return core_clock, 2475
    
        except Exception as e:
            print("Error:", e)
            return None

    # CPU 사용량 모니터링
    def monitor_cpu(self):
        cpu_percent = psutil.cpu_percent(percpu=True)
        return (min(cpu_percent) + max(cpu_percent)) / 2

    # 메모리 사용량 모니터링
    def monitor_memory(self):
        memory = psutil.virtual_memory()
        used_memory = memory.used / (1024*1024*1024) # 메모리 사용량을 GB 단위로 변환
        available_memory = memory.available / (1024*1024*1024) # 사용가능한  메모리 양을 GB 단위로 변환
        total_memory = used_memory + available_memory
        return used_memory, total_memory

    def _get_elec_token(self):
        elec_path = self.path + "/electricmaps_api.txt"
        with open(elec_path, 'r') as f:
            token = f.readline()
        return token
    
    # def learning_start(self):
    #     print(self.model, "Learning Start")
    #     # command = [
    #     #     'python', f'{self.model}/train.py',
    #     #     '--epoch', str(epoch),
    #     #     '--lr', str(lr),
    #     #     '--batch', str(batch),
    #     #     '--vgg_model', str(vgg_model),
    #     #     '--cuda', str(cuda),
    #     #     '--step_size', str(step_size),
    #     #     '--gamma', str(gamma),
    #     #     '--resumption', str(resumption)
    #     # ]
    #     if self.model == "VGGNet":
    #         self.model_object = VGGTrain()
        
    #     self.get_gpu_usage()
    #     thread = threading.Thread(target=self.get_resource)
    #     thread.start()
        
    #     ### 여기에 다른 곳으로 마이그레이션 하는거 넣으면 될듯
    #     self.model_object.vgg_train()
        
    #     # subprocess.run(command)
    #     self.is_learning = False
    #     total_used_gpu_electic = sum(self.used_gpu)
    #     print(f"총 전력 : {total_used_gpu_electic}W 사용")
    #     print(f"총 시간 : {self.model_object.used_time}s 소모")
    
    def gpus_measurement(self):
        while self.is_learning:
            if self._carbons != None:
                self.upload_resource()
            time.sleep(5)
        print("FIN")
        
    def upload_resource(self): # Firebase에 현재 Resource Upload
        cpus= self.monitor_cpu()
        memorys, total_memorys = self.monitor_memory()
        gpus = round(self.get_gpu_usage(), 2)
        clock, max_clock = self.get_gpu_freq_info()
        epoch = self.epoch
        learning_time = time.time() - self.learning_time
        use_gpu = float(gpus / (60.0 * 12.0)) if gpus != 0.0 else 0.0 # 5초마다
        self.used_gpu.append(use_gpu)
        emission = self.calculate_carbons_emission(use_gpu)
        self.carbon_emissions.append(emission)
        self._fb.upload_current_resource(round(cpus, 2), round(memorys, 2), round(total_memorys, 2), gpus, sum(self.used_gpu), epoch, clock, max_clock, learning_time+self.learned_time, sum(self.carbon_emissions), self._carbons)
        # return round(cpus, 2), round(memorys, 2), round(total_memorys, 2), round(gpus, 2), epoch, clock, max_clock
    
    def download_checkpoint(self):
        self._fb.download_from_firebase()
    
    def download_resource(self):
        self._fb.download_current_resource()
    
    def upload_checkpoint(self):
        self._fb.upload_to_firebase()
    
    def calculate_carbons_emission(self, used_gpus):
        if self._carbons != None:
            # Carbons Emissions = Carbons Intensity * Electricity / 5s 기준 계싼 
            carbon_emission = self._cal_carbon * used_gpus
            return carbon_emission
        else:
            return 0.0
            
    def epoch_update(self, epoch):
        self.epoch = epoch 
    
    def learning_update(self, is_learning):
        self.is_learning = is_learning
    
    def update_carbon(self):
        self._carbons = asyncio.run(self._elec.get_carbon_intensity(self._region, self._region_full)) # 5s 간격
        self._cal_carbon = self._cal_carbon / (60.0 * 12.0)
        
    def can_learning(self):
        self.update_carbon()
        if self._carbons >= self._threshold:
            return False
        else:
            return True


if __name__ == "__main__":
    gpus = GPUs(gpu_id="0", model="VGGNet", resumption=1, ssh_server=1, threshold=250)
    # gpus.upload_resource()
    # gpus.download_resource()
    # print(gpus.get_all_resource())
    # thread = threading.Thread(target=gpus.monitor_cpu)
    # thread.start()
    # print(gpus.get_gpu_usage())
    # gpus.learning_start()