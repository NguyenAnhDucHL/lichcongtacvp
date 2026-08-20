#!/bin/bash
source .deploy.env
expect << EXP
set timeout -1
spawn ssh -o StrictHostKeyChecking=no $VNPT_USER@$VNPT_HOST "docker ps -a -q --filter ancestor=lichcongtacvp-lichcongtac-backend | xargs -r docker rm -f; docker ps -a -q --filter name=lichcongtacvp-backend | xargs -r docker rm -f; cd /root/lichcongtacvp && docker compose -p lichcongtacvp up -d"
expect {
    "password:" {
        send "$VNPT_PASS\r"
        exp_continue
    }
    eof
}
EXP
