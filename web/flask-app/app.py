# from flask import Flask, request, jsonify
# import subprocess

# app = Flask(__name__)


# @app.route('/execute', methods=['POST'])
# def execute_command():
#     data = request.json
#     command = data.get('command')
    
#     try:
#         if command == 'python Hello.py':
#             # Hello.py 실행이 되야하는데 안되네
#             result = subprocess.check_output(['python', 'Hello.py'], text=True)
#         else:
#             # 기타 처리
#             result = subprocess.check_output(command, shell=True, text=True)
        
#         return jsonify({'output': result})
#     except Exception as e:
#         # 명령 실행 중 발생한 예외 반환
#         return jsonify({'output': str(e)})

# if __name__ == '__main__':
#     app.run(debug=True)










# # 연동 예제

# from flask import Flask, jsonify

# app = Flask(__name__)

# @app.route('/api/message')
# def get_message():
#     return jsonify({'message': 'Hello from Flask!'})

# if __name__ == '__main__':
#     app.run(debug=True)
