from __init__ import *
# sys.path.append("VGGNet")
from VGGNet.train import VGGTrain
from DB_Module import FireBase
from parser import parse_args

class GPUs:
    def __init__(self):
        self.used_gpu = []
        self.return_info = []
        self.is_learning = True
        self.args = parse_args()
        self.gpu_id = self.args.cuda
        self.model=self.args.model
        self.fb = FireBase(self.model)
        self.model_object = None
        # Current 사용량 알기
        self.default_gpu_usage = None
        self.default_gpu_usage = self.get_gpu_usage()
        
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
        
    def learning_start(self):
        print(self.model, "Learning Start")
        # command = [
        #     'python', f'{self.model}/train.py',
        #     '--epoch', str(epoch),
        #     '--lr', str(lr),
        #     '--batch', str(batch),
        #     '--vgg_model', str(vgg_model),
        #     '--cuda', str(cuda),
        #     '--step_size', str(step_size),
        #     '--gamma', str(gamma),
        #     '--resumption', str(resumption)
        # ]
        if self.model == "VGGNet":
            self.model_object = VGGTrain()
        
        self.get_gpu_usage()
        thread = threading.Thread(target=self.get_resource)
        thread.start()
        
        ### 여기에 다른 곳으로 마이그레이션 하는거 넣으면 될듯
        self.model_object.vgg_train(self.args)
        
        # subprocess.run(command)
        self.is_learning = False
        total_used_gpu_electic = sum(self.used_gpu)
        print(f"총 전력 : {total_used_gpu_electic}W 사용")
        print(f"총 시간 : {self.model_object.used_time}s 소모")
    
    def get_resource(self):
        while self.is_learning:
            gpus = self.get_gpu_usage() 
            used_gpu = gpus / 3600.0 
            self.used_gpu.append(used_gpu)
            time.sleep(1)
        print("FIN")
        
    def get_all_resource(self):
        cpus= self.monitor_cpu()
        memorys, total_memorys = self.monitor_memory()
        gpus = self.get_gpu_usage()
        try:
            epoch = self.model_object.epoch
        except:
            epoch = 0
        return cpus, memorys, total_memorys, gpus, epoch
    
    # def return_flast_value(self):
    #     while self.is_learning:
    #         if len(self.return_info) > 0:
    #             cpus = self.return_info[0]
                
    #             self.return_info = []
                
    # CPU 사용량 모니터링
    def monitor_cpu(self):
        cpu_percent = psutil.cpu_percent()
        return cpu_percent

    # 메모리 사용량 모니터링
    def monitor_memory(self):
        memory = psutil.virtual_memory()
        used_memory = memory.used / (1024 * 1024) # 메모리 사용량을 MB 단위로 변환
        available_memory = memory.available / (1024 * 1024) # 사용가능한  메모리 양을 MB 단위로 변환
        total_memory = used_memory + available_memory
        return used_memory, total_memory


if __name__ == "__main__":
    gpus = GPUs()
    # print(gpus.get_gpu_usage())
    gpus.learning_start()