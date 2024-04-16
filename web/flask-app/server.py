# from flask import Flask, request, jsonify
# import subprocess


# app = Flask(__name__)

# @app.route('/users')
# def users():
#     # users 데이터를 Json 형식으로 반환
#     return jsonify({"members": [{"id": 1, "name": "yerin"},
#                                 {"id": 2, "name": "dalkong"}]})

# @app.route('/execute', methods=['POST'])
# def execute_command():
#     # POST 요청으로부터 command를 받아서 처리하는 부분
#     data = request.get_json()
#     command = data.get('command', '')

#     # 여기서는 간단히 command를 그대로 반환
#     return jsonify({"output": f"Command executed: {command}"})


# # @app.route('/execute', methods=['POST'])
# # def execute_command():
# #     data = request.json
# #     command = data.get('command')
    
# #     try:
# #         if command == 'python Hello.py':
# #             # Hello.py 실행이 되야하는데 안되네
# #             result = subprocess.check_output(['python', 'Hello.py'], text=True)
# #         else:
# #             # 기타 처리
# #             result = subprocess.check_output(command, shell=True, text=True)
        
# #         return jsonify({'output': result})
# #     except Exception as e:
# #         # 명령 실행 중 발생한 예외 반환
# #         return jsonify({'output': str(e)})

# if __name__ == '__main__':
#     app.run(debug=True)

# if __name__ == "__main__":
#     app.run(debug=True, port=5000)


# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import subprocess

# app = Flask(__name__)
# CORS(app)

# @app.route('/execute', methods=['POST'])
# def execute_command():
#     data = request.json
#     command = data.get('command')
    
#     try:
#         if command == 'python Hello.py':
#             result = subprocess.check_output(['python', 'Hello.py'], stderr=subprocess.STDOUT, text=True)
#         else:
#             result = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT, text=True)
        
#         return jsonify({'output': result.strip()})
#     except subprocess.CalledProcessError as e:
#         return jsonify({'output': e.output.strip()})
#     except Exception as e:
#         return jsonify({'output': str(e)})

# if __name__ == '__main__':
#     app.run(debug=True)
