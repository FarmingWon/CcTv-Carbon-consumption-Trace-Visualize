from flask import Flask, request, jsonify
import subprocess
from flask_cors import CORS
import sys
sys.path.append("./")
from gpu_utils import GPUs 

app = Flask(__name__)
CORS(app)

gpu = GPUs()

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
        if command == 'use hello':
            result = subprocess.check_output(['python', 'Hello.py'], stderr=subprocess.STDOUT, text=True)
        else:
            result = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT, text=True)
        
        return jsonify({'output': result.strip()})
    
    except subprocess.CalledProcessError as e:
        return jsonify({'output': e.output.strip()})
    except Exception as e:
        return jsonify({'output': str(e)})
      
#한번만 실행하면 됨
@app.route('/train', methods=['GET'])
def start_train():
    gpu.learning_start()
    return jsonify({"train" : True})

#이거 초당 반복으로 실행 하면 될듯
@app.route('/get_resource', methods=['GET'])
def get_resource():
    try:
        used_cpu, used_memory, total_memory, used_gpu, epoch = gpu.get_all_resource()
        return jsonify({'cpu' : used_cpu,
                        'memory' : used_memory,
                        'total_memory' : total_memory,
                        'gpu' : used_gpu,
                        'epoch' : epoch})
    except Exception as e:
        print(e)
        return jsonify({'cpu' : 0,
                        'memory' : 0,
                        'total_memory' : 0,
                        'gpu' : 0,
                        'epoch' : 0})      

if __name__ == '__main__':
    app.run(debug=True, port=5000)

# # 명령어 필요합니뎅. # mac
# # source venv/bin/activate 
# # .\myenv\Scripts\activate