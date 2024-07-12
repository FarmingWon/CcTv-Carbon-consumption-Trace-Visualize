from flask import Flask, request, jsonify
import subprocess
from flask_cors import CORS
from ssh_connect import SSH
import sys
import json
import os
import pandas as pd
import asyncio
from eletricmaps import electric
sys.path.append("./")
from DB_Module import FireBase

app = Flask(__name__)
CORS(app)

ssh_us, ssh_uk, ssh_kr = None, None, None
fb_us, fb_uk, fb_kr = None, None, None
df = pd.read_csv(f"{os.getcwd()}/web/flask-app/serverInfo.csv", header=None).values.tolist() # CPU, GPU, Memory
us_com_info, uk_com_info, kr_com_info = df[0], df[1], df[2]
us_ci, uk_ci, kr_ci = 0.0, 0.0, 0.0
fb = FireBase("VGGNet", "server")

known_cpu_exec = "top -bn1 | grep \"Cpu(s)\" | sed \"s/.*, *\([0-9.]*\)%* id.*/\\1/\" | awk '{print 100 - $1}'"
known_gpu_exec = "nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits"
known_memory_exec = "free | awk '/^Mem:/ {print  $3 / 1024 \",\"  $2 / 1024 }'"
total_epoch = 400

with open(f"{os.getcwd()}/electricmaps_api.txt", 'r') as f:
    token =  f.readline()
electrics = electric(token=token)

def reset_migration_file():
    global fb
    fb.upload_migration(False, False, False, None, None)

def test_migration_file():
    global fb
    fb.upload_migration(False, False, True, "IT-CSO", "Italy")

def parser_save(command, region):
    global fb, total_epoch
    try:
        li = command.split("python3")
        li = [l.strip() for l in li]
        parsers = li[1].split(" ")[1:]
        parser = dict()
        for i in range(0, len(parsers), 2):
            parser[parsers[i][2:]] = parsers[i+1]
        if region == "US-NE-ISNE":
            parser['ssh_server'] = '0'
            fb.upload_migration(False, False, True, "US-NE-ISNE", "New England ISO")
        elif region == "IT-CSO":
            parser['ssh_server'] = '1'
            fb.upload_migration(False, False, True, "IT-CSO", "Italy")
        elif region == "KR":
            parser['ssh_server'] = '2'
            fb.upload_migration(False, False, True, "KR", "South Korea")
        total_epoch = parser['epoch']
        fb.upload_parser(parser)
        
        # splits = [item.strip() for item in command.split("python3")]
        # splits = [item.strip() for item in splits[0].split("--name")][1]
        # splits = splits.split(" ")[0]
        return_command = f"docker start {region}"
        print(f"docker start {region}")
        return return_command
    except:
        return command

@app.route('/users')
def users():
    # users 데이터를 Json 형식으로 반환
    return jsonify({"users": [
        {"id": 1, "name": "wonseok"},
        {"id": 2, "name": "Hae-yoon"}
    ]})

@app.route('/execute', methods=['POST'])
def execute_command():
    data = request.json
    command = data.get('command')
    try:
        # if len(command)>0 :
        return jsonify({"output" : True})
    except subprocess.CalledProcessError as e:
        return jsonify({'output': e.output.strip()})
    except Exception as e:
        return jsonify({'output': str(e)})
    
    
#한번만 실행하면 됨
@app.route('/train', methods=['GET'])
def start_train():
    return jsonify({"train" : True})

        
@app.route('/sshUS', methods=['POST'])
def execute_command1():
    global ssh_us
    if ssh_us == None:
        ssh_us = SSH(0)
    data = request.json
    command = data.get('command')
    print(command)
    exec_command = parser_save(command, "US-NE-ISNE")
    try:
        stdin, stdout, stderr = ssh_us.exec(exec_command)
        print(stdin)
        print(stdout)
        print(stderr)
        return jsonify({"output" : stdin})
    except subprocess.CalledProcessError as e:
        return jsonify({'output': e.output.strip()})
    except Exception as e:
        return jsonify({'output': str(e)})

@app.route('/sshUK', methods=['POST'])
def execute_command2():
    global ssh_uk
    if ssh_uk == None:
        ssh_uk = SSH(1)
    data = request.json
    command = data.get('command')
    exec_command = parser_save(command, "IT-CSO")
    try:
        stdin, stdout, stderr = ssh_us.exec(exec_command)
        return jsonify({"output" : stdin})
    except subprocess.CalledProcessError as e:
        return jsonify({'output': e.output.strip()})
    except Exception as e:
        return jsonify({'output': str(e)})
    

@app.route('/sshKR', methods=['POST'])
def execute_command3():
    global ssh_kr
    if ssh_kr == None:
        ssh_kr = SSH(2)
    data = request.json
    command = data.get('command')
    exec_command = parser_save(command, "KR")
    try:
        stdin, stdout, stderr = ssh_us.exec(exec_command)
        return jsonify({"output" : stdin})
    except subprocess.CalledProcessError as e:
        return jsonify({'output': e.output.strip()})
    except Exception as e:
        return jsonify({'output': str(e)})
    

@app.route('/get_resourceUS', methods=['GET'])
def get_resource():
    global ssh_us
    global us_com_info 
    global electrics
    global us_ci
    if ssh_us == None:
        ssh_us = SSH(0)   
    try:
        cpu, _, _ = ssh_us.exec(known_cpu_exec)
        gpu, _, _ = ssh_us.exec(known_gpu_exec)
        memory, _, _ = ssh_us.exec(known_memory_exec)
        used_memory, total_memory = memory.strip().split(',')
        us_ci = asyncio.run(electrics.get_carbon_intensity("US-NE-ISNE"))
        return jsonify({
            'cpu' : float(cpu),
            'gpu' : float(gpu),
            'used_memory' : float(used_memory),
            'cpu_info' : us_com_info[0],
            'gpu_info' : us_com_info[1],
            'memory_info' : total_memory,
            'CI' : us_ci
            #CI Add 
        })
    except Exception as e:
        print(e)
        return jsonify({
            'cpu' : float(0.0),
            'gpu' : float(0.0),
            'used_memory' : float(0.0),
            'cpu_info' : us_com_info[0],
            'gpu_info' : us_com_info[1],
            'memory_info' : us_com_info[2],
            'CI' : 0.0
        })

@app.route('/get_resourceUK', methods=['GET'])
def get_resource2():
    global ssh_uk
    global uk_com_info 
    global electrics
    global uk_ci
    if ssh_uk == None:
        ssh_uk = SSH(1)   
    try:
        cpu, _, _ = ssh_uk.exec(known_cpu_exec)
        gpu, _, _ = ssh_uk.exec(known_gpu_exec)
        memory, _, _ = ssh_uk.exec(known_memory_exec)
        used_memory, total_memory = memory.strip().split(',')
        uk_ci = asyncio.run(electrics.get_carbon_intensity("IT-CSO"))
        return jsonify({
            'cpu' : float(cpu),
            'gpu' : float(gpu),
            'used_memory' : float(used_memory),
            'cpu_info' : uk_com_info[0],
            'gpu_info' : uk_com_info[1],
            'memory_info' : total_memory,
            'CI' : uk_ci
            #CI Add 
        })
    except Exception as e:
        print(e)
        return jsonify({
            'cpu' : float(0.0),
            'gpu' : float(0.0),
            'used_memory' : float(0.0),
            'cpu_info' : uk_com_info[0],
            'gpu_info' : uk_com_info[1],
            'memory_info' : uk_com_info[2],
            'CI' : 0.0
        })


@app.route('/get_resourceKR', methods=['GET'])
def get_resource3():
    global ssh_kr
    global kr_com_info 
    global electrics
    global kr_ci
    if ssh_kr == None:
        ssh_kr = SSH(2)   
    try:
        cpu, _, _ = ssh_kr.exec(known_cpu_exec)
        gpu, _, _ = ssh_kr.exec(known_gpu_exec)
        memory, _, _ = ssh_kr.exec(known_memory_exec)
        used_memory, total_memory = memory.strip().split(',')
        kr_ci = asyncio.run(electrics.get_carbon_intensity("KR"))
        return jsonify({
            'cpu' : float(cpu),
            'gpu' : float(gpu),
            'used_memory' : float(used_memory),
            'cpu_info' : kr_com_info[0],
            'gpu_info' : kr_com_info[1],
            'memory_info' : total_memory,
            'CI' : kr_ci
        })
    except Exception as e:
        print(e)
        return jsonify({
            'cpu' : float(0.0),
            'gpu' : float(0.0),
            'used_memory' : float(0.0),
            'cpu_info' : kr_com_info[0],
            'gpu_info' : kr_com_info[1],
            'memory_info' : kr_com_info[2],
            'CI' : 0.0
        })
        
@app.route('/cur-carbon-intensity', methods=['GET'])
def get_resource123():
    global us_ci, uk_ci, kr_ci
    return jsonify({
        "US-CAL-BANC" : us_ci,
        "IE" : uk_ci,
        "KR" : kr_ci
    })

@app.route('/carbon-intensity', methods=['GET'])
def get_resource4():
    global electrics 
    # us_ci = asyncio.run(electrics.get_carbon_intensity_history("US-CAL-BANC"))
    # uk_ci = asyncio.run(electrics.get_carbon_intensity_history("IE"))
    # kr_ci = asyncio.run(electrics.get_carbon_intensity_history("KR"))
    us_ci = asyncio.run(electrics.get_carbon_intensity_history("US-NE-ISNE", -14))
    uk_ci = asyncio.run(electrics.get_carbon_intensity_history("IT-CSO", -7))
    kr_ci = asyncio.run(electrics.get_carbon_intensity_history("KR", 0))
    return jsonify({
        "US-CAL-BANC" : us_ci,
        "IE" : uk_ci,
        "KR" : kr_ci
    })
    """
    {
        "US" : [['시간(str)',탄소집약도(float))],...],
        "UK" : uk_ci,
        "KR" : kr_ci
    }
    """

@staticmethod
def migration_start(region, fb, ssh_instance, server_num, region_full,):
    fb.upload_migration(True, True, False, region, region_full)
    parser = fb.get_parser()
    parser['resumption'] = '1'
    parser['ssh_server'] = server_num
    fb.upload_parser(parser)
    command = f"docker start {region}"
    ssh_instance.exec(command)
    # 여기서 migration 파일 upload 
    fb.upload_migration(False, False, True, region, region_full)

@app.route('/is_train', methods=['GET'])
def get_resource5():
    global uk_ci, kr_ci, us_ci, fb
    global ssh_us, ssh_uk, ssh_kr
    # DB Storage에서 Data 받아오기 
    contents = fb.get_data()
    is_migration = contents['migration']
    migration_progress = contents['migration_progress']
    is_learning = contents['is_learning']
    region = contents['region']
    region_full = contents['region_full']
    
    """ 
    migration 후 fb에 false로 업데이트,  
    """
    dest = None
    if is_migration and not migration_progress: # 마이그레이션이 진행중인지 체크하며 중복이 아닌지 쳌쳌 
        li = [["IT-CSO", uk_ci], ["US-NE-ISNE", us_ci], ["KR", kr_ci]] 
        li.sort(key = lambda x:x[1])
        if li[0][0] == 'US-NE-ISNE': # migration , server 0 
            dest = "US-NE-ISNE"
            migration_start(li[0][0], fb, ssh_us, 0, 'New England ISO')
        elif li[0][0] == 'IT-CSO':  # server 1
            dest = "IT-CSO"
            migration_start(li[0][0], fb, ssh_uk, 1, 'Italy')
        elif li[0][0] == 'KR':# server 2 
            dest = "KR"
            migration_start(li[0][0], fb, ssh_kr, 2, 'South Korea')
    
    # DB 업데이트 
    """
    CI 낮은 곳 찾은 후,
    DB 업데이트(진행 중이라고)
    해당 SSH 실행 
    """    
        
    return jsonify({
        "migration" : is_migration, # False ==> 학습 x, True 학습 o 
        "migration_progress" : migration_progress, # true : 마이그레이션 중, false : migration 해야 됨
        "is_learning" : is_learning,
        "region" : region,
        "region_full" : region_full,
        "dest_region" : dest
        # 학습여부, 현재 학습 위치, 마이그레이션 여부, 도착지
    })


#이거 초당 반복으로 실행 하면 될듯
@app.route('/get_resource', methods=['GET'])
def get_resourceyo():
    global fb, total_epoch
    try:
        json_data = fb.get_resource()
        return jsonify({'cpu' : json_data['cpu'],
                    'memory' : json_data['memory'],
                    'total_memory' : json_data['total_memory'],
                    'gpu' : json_data['gpu'],
                    'total_gpu' : json_data['total_gpu'],
                    'epoch' : json_data['epoch'],
                    'total_epoch' : total_epoch,
                    'clock' : json_data['clock'],
                    'max_clock' : json_data['max_clock'],
                    'learning_time' : json_data['learning_time'],
                    'carbon_emission' : json_data['carbon_emission'],
                    'CI' : json_data['CI']})
        
    except Exception as e:
        print(e)
        return jsonify({'cpu' : 0,
                        'memory' : 0,
                        'total_memory' : 0,
                        'gpu' : 0,
                        'total_gpu' : 0,
                        'epoch' : 0,
                        'clock' : 0,
                        'max_clock' : 0,
                        'learning_time' : 0,
                        'carbon_emission' : 0,
                        'CI' : 0}) 
        
@app.route('/train-stop', methods=['GET'])
def dd():
    try:
        global uk_ci, kr_ci, us_ci, fb
        global ssh_us, ssh_uk, ssh_kr
        contents = fb.get_data()
        region = contents['region']
        command = f"docker stop {region}"
        print(command)
        if region == 'US-NE-ISNE': # migration , server 0 
            ssh_us.exec(command)        
        elif region == 'IT-CSO':  # server 1
            ssh_uk.exec(command)
        elif region == 'KR':# server 2 
            ssh_kr.exec(command)
        reset_migration_file()
        return jsonify({'res' : True}) 
    except:
        return jsonify({'res' : False}) 

if __name__ == '__main__':
    # command = "docker run -it --gpus all python3 VGGNet/train.py --epoch 100 --lr 0.001 --batch 8 --vgg_model VGG16 --cuda 0 --step_size 30 --gamma 0.1 --resumption 0 --ssh_server 0 --threshold 1000"
    # parser_save(command, "NONE")
    reset_migration_file()
    # test_migration_file()
    # parser_save("docker run -it --gpus all --name US-CAL-BANC  python3 VGGNet/train.py --epoch 100 --lr 0.001 --batch 8 --vgg_model VGG16 --cuda 0 --step_size 30 --gamma 0.1 --resumption 0 --ssh_server 0 --threshold 1000", "KR")
    app.run(debug=True, port=5000)
    # print(get_resource5())


# 0711 추가 코드. csv파싱
@app.route('/api/csvdata', methods=['GET'])
def get_csv_data():
    try:
        csv_path = os.path.join(os.getcwd(), 'serverInfo.csv')
        df = pd.read_csv(csv_path, header=None)
        csv_data = df.to_dict(orient='records')
        return jsonify({'csvData': csv_data})
    except Exception as e:
        return jsonify({'error': str(e)})
