#!/bin/bash
source /Users/macbookpro/Documents/lichcongtacvp/.deploy.env
export SSHPASS=$VNPT_PASS
sshpass -e ssh -o StrictHostKeyChecking=no $VNPT_USER@$VNPT_HOST "cd /root/lichcongtacvp && docker rm -f a07283fa01e90a4b299f042b59f42e4f03aa27835875aebff0b38b4da91dff53 && docker compose -p lichcongtacvp up -d --build"
