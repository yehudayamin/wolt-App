import sys
import socket

ip = sys.argv[1]
port = int(sys.argv[2])

socket_1 = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

socket_1.connect((ip, port))

f = socket_1.makefile('r')

while True:
    try:
        line = input()
    except UnicodeDecodeError:
        continue
    try:
        #change the command to be upper case
        parts = line.split(' ', 1)
        upper_line = parts[0].upper() + (' ' + parts[1] if len(parts) > 1 else '')
        socket_1.sendall((upper_line + '\n').encode('ascii', errors='ignore'))
    except Exception:
        continue

    response = ""
    separator = ""
    while True:
        recieve = f.readline()
        if recieve == '\n' or recieve == '':
            separator = recieve
            break
        response += recieve

    print(response, end='')

    if response.strip() == '200 Ok':
        print(separator, end='')
        while True:
            recieve = f.readline()
            if recieve == '\n' or recieve == '':
                break
            print(recieve, end='')