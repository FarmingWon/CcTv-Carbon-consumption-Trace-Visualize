# from flask import Flask, request, jsonify
# import subprocess
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app, resources={r"/execute": {"origins": "http://localhost:3000"}})

# @app.route('/execute', methods=['POST'])
# def execute_command():
#     data = request.json
#     command = data.get('command')
    
#     try:
#         if command == 'use hello':
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


# # 명령어 필요합니뎅. # mac
# # source venv/bin/activate 