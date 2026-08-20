#!/bin/bash
source .deploy.env
expect << EXP
set timeout -1
spawn ssh -o StrictHostKeyChecking=no $VNPT_USER@$VNPT_HOST "docker system prune -a -f && journalctl --vacuum-time=1d && df -h"
expect {
    "password:" {
        send "$VNPT_PASS\r"
        exp_continue
    }
    eof
}
EXP
