from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

@app.route('/execute', methods=['POST'])
def execute_command():
    data = request.json
    command = data.get('command')
    
    try:
        if command == 'use hello':
            # subprocess를 사용하여 파이썬 스크립트 실행
            result = subprocess.check_output(['python', 'Hello.py'], stderr=subprocess.STDOUT, text=True)
        else:
            # subprocess를 사용하여 일반 명령 실행
            result = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT, text=True)
        
        return jsonify({'output': result.strip()})
    
    except subprocess.CalledProcessError as e:
        # 명령 실행 중 에러 발생 시
        return jsonify({'output': e.output.strip()})
    except Exception as e:
        # 그 외의 예외 처리
        return jsonify({'output': str(e)})

if __name__ == '__main__':
    app.run(debug=True)

# 명령어 필요합니뎅. # mac
# source venv/bin/activate 
