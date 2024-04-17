import time
import subprocess
import pandas as pd
import numpy as np
import os
from scipy.optimize import minimize
import psutil
import threading

class GPUs:
    def __init__(self, gpu_id):
        self.gpu_id = gpu_id
        # Current 사용량 알기
        self.default_gpu_usage = None
        self.default_gpu_usage = self.get_gpu_usage()
        self.interval = 5 # 5초
        self.used_gpu = []
        self.return_info = []
        self.is_learning = True
        
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
        
    def learning_start(self, model="VGGNet", epoch=1, lr=1e-3, batch=8, vgg_model='VGG16', cuda='0', step_size=30, gamma=0.1, resumption=0):
        print(model, "Learning Start")
        command = [
            'python', f'{model}/train.py',
            '--epoch', str(epoch),
            '--lr', str(lr),
            '--batch', str(batch),
            '--vgg_model', str(vgg_model),
            '--cuda', str(cuda),
            '--step_size', str(step_size),
            '--gamma', str(gamma),
            '--resumption', str(resumption)
        ]
        self.get_gpu_usage()
        subprocess.run(command)
        self.is_learning = False
        total_used_gpu_electic = sum(self.used_gpu)
        print(f"총 전력 : {total_used_gpu_electic}W 사용")
    
    def get_info_cpu_memory_gpu(self):
        while self.is_learning:
            cpus= self.monitor_cpu()
            memorys, total_memorys = self.monitor_memory()
            gpus = self.get_gpu_usage() 
            used_gpu = gpus / 3600.0 
            print(cpus, memorys, gpus) # 200W
            self.return_info.append(cpus)
            self.return_info.append([memorys, total_memorys])
            self.return_info.append(gpus)
            self.used_gpu.append(used_gpu)
            time.sleep(1)
        print("FIN")
    
    # def return_flast_value(self):
    #     while self.is_learning:
    #         if len(self.return_info) > 0:
    #             cpus = self.return_info[0]
                
    #             self.return_info = []
                
    # CPU 사용량 모니터링
    def monitor_cpu(self):
        cpu_percent = psutil.cpu_percent(percpu=True)
        return max(cpu_percent)

    # 메모리 사용량 모니터링
    def monitor_memory(self):
        memory = psutil.virtual_memory()
        used_memory = memory.used / (1024 * 1024) # 메모리 사용량을 MB 단위로 변환
        available_memory = memory.available / (1024 * 1024) # 사용가능한  메모리 양을 MB 단위로 변환
        total_memory = used_memory + available_memory
        return used_memory, total_memory


if __name__ == "__main__":
    gpus = GPUs("0")
    thread = threading.Thread(target=gpus.get_info_cpu_memory_gpu)
    thread.start()
    # print(gpus.get_gpu_usage())
    gpus.learning_start()