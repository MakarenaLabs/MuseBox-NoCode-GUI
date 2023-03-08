# NoCode GUI

The NoCode GUI allows you to execute in live the entire ML pipeline without any interaction with the backend software (in particular, you don't need to restart any process on the FPGA board, you just modify or compose your ML pipeline).

You only need to start the MuseBox server with websocket protocol (depending on the task that you want to implement).

A little demonstration:
https://www.youtube.com/watch?v=sd8-6jzzWII


## Getting started

The software runs on a web browser on your PC (Chrome or Firefox). You need NodeJS on your PC (https://nodejs.org/en/) and python (https://www.python.org/downloads/).


Just download the source code and run these commands inside the root directory of the project:

```
npm install
python -m http.server 8000
```

The GUI will be available at address `127.0.0.1:8000` .


The full documentation is available here: https://doc.musebox.it/