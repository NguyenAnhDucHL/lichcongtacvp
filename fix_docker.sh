#!/bin/bash
source .deploy.env
expect << EXP
set timeout -1
spawn ssh -o StrictHostKeyChecking=no $VNPT_USER@$VNPT_HOST "docker rm -f 8b40c9a3893f3a43ab70869a3c2cdc345681471e8a418aec0d16196ccc980c96 lichcongtacvp-backend lichcongtac-backend || true; cd /root/lichcongtacvp && docker compose -p lichcongtacvp up -d --build"
expect {
    "password:" {
        send "$VNPT_PASS\r"
        exp_continue
    }
    eof
}
EXP
