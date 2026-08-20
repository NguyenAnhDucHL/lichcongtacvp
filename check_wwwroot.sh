#!/bin/bash
source .deploy.env
expect << EXP
set timeout -1
spawn ssh -o StrictHostKeyChecking=no $VNPT_USER@$VNPT_HOST "docker exec lichcongtacvp-backend cat /app/wwwroot/index.html"
expect {
    "password:" {
        send "$VNPT_PASS\r"
        exp_continue
    }
    eof
}
EXP
