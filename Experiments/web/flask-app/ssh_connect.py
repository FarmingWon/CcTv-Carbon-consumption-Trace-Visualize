import paramiko
import pandas as pd
import os

class SSH:
    def __init__(self, ssh_num):
        self._ssh_num = ssh_num
        self._ssh, self._ssh_pwd = self.connect_ssh()
    
    def connect_ssh(self):
        print(os.getcwd())
        try:
            csv_path = os.getcwd() + "\ssh_data.csv"

            df = pd.read_csv(csv_path, header=None).values.tolist()[self._ssh_num] # ip, user, password, port 순으로 저장
            ip, user, pwd, port = df[0], df[1], str(df[2]), df[3]
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy)
            ssh.connect(ip, username=user, password=pwd, port=port)
            print("ssh connected")
            return ssh, pwd            
        except Exception as e:
            print(e)
            
    def __del__(self):
        """
        객체 소멸 시 ssh close
        """
        try:
            print("ssh disconnected")
            self._ssh.close()
        except Exception as e:
            print(e)
    
    def exec(self, command):
        try:
            command = f"echo {self._ssh_pwd} | sudo -S {command}"
            stdin, stdout, stderr = self._ssh.exec_command(command)
            lines = stdout.readlines()
            stdin = ''.join(lines)
            return stdin, stdout, stderr
        except:
            return None
    
       
if __name__ == "__main__":
    instance = SSH(0)
    # stdin, stdout, stderr = instance.exec("free | awk '/^Mem:/ {print  $3 / 1024 \",\"  $2 / 1024 }'")
    stdin, stdout, stderr = instance.exec("docker start KR")
    print(stdin, stdout, stderr)
    # print(stdout)
    # print(stderr)
